/* NooXRii portfolio — dashboard (draft lives in localStorage; "Publish" commits it via /api/publish) */
(function () {
  'use strict';
  const { t, esc, pick, safeUrl, safeColor, slug, ICON } = NOOX;
  const $ = (s, r) => (r || document).querySelector(s);
  const rowsEl = $('#rows');
  const drawer = $('#drawer');
  const form = $('#form');
  const pubDlg = $('#pubDlg');

  let state = { settings: { showDownload: false, social: { github: '', email: '' } }, projects: [] };
  let publishedStr = null; // JSON of the currently published data (null = unknown)
  let editingId = null;

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const ser = (o) => JSON.stringify(NOOX.normalize(o));

  /* ───────── Toast ───────── */
  let toastTm = 0;
  function toast(msg, isErr) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.toggle('err', !!isErr);
    el.classList.add('show');
    clearTimeout(toastTm);
    toastTm = setTimeout(() => el.classList.remove('show'), isErr ? 5200 : 2600);
  }

  /* ───────── State ───────── */
  function persist() {
    NOOX.setDraft(state);
    renderState();
  }
  function renderState() {
    const el = $('#state');
    let cls = '', txt = t('d.state.unknown');
    if (publishedStr !== null) {
      const clean = ser(state) === publishedStr;
      cls = clean ? 'clean' : 'dirty';
      txt = t(clean ? 'd.state.clean' : 'd.state.dirty');
    }
    el.className = 'state ' + cls;
    el.lastElementChild.textContent = txt;
  }

  /* ───────── Rendering ───────── */
  function renderSettings() {
    $('#optDownload').checked = state.settings.showDownload === true;
    $('#socGithub').value = state.settings.social.github || '';
    $('#socEmail').value = state.settings.social.email || '';
  }
  function renderRows() {
    if (!state.projects.length) {
      rowsEl.innerHTML = `<div class="no-rows">${esc(t('d.noProjects'))}</div>`;
      return;
    }
    const last = state.projects.length - 1;
    rowsEl.innerHTML = state.projects.map((p, i) => {
      const hasDl = !!safeUrl(p.links.download);
      return `
<div class="row" data-id="${esc(p.id)}" style="--a1:${safeColor(p.accent[0], '#a78bfa')};--a2:${safeColor(p.accent[1], '#22d3ee')};animation-delay:${Math.min(i, 10) * 0.04}s">
  <div class="icon${NOOX.iconClass(p)}" aria-hidden="true">${NOOX.iconHTML(p)}</div>
  <div class="info">
    <h4>${esc(p.title)}</h4>
    <p>${esc(pick(p.tagline))}</p>
    <div class="meta">
      <span class="mini">${esc(t('type.' + p.type))}</span>
      <span class="mini">${esc(t('status.' + p.status))}</span>
      <span class="mini ${hasDl ? 'ok' : 'no'}">${ICON.dl.replace('width="16" height="16"', 'width="11" height="11"')} ${esc(t(hasDl ? 'd.dlLink.yes' : 'd.dlLink.no'))}</span>
    </div>
  </div>
  <div class="ctl">
    <button class="btn sm icon-only" data-act="up" title="${esc(t('d.up'))}" aria-label="${esc(t('d.up'))}" ${i === 0 ? 'disabled style="opacity:.35;pointer-events:none"' : ''}>↑</button>
    <button class="btn sm icon-only" data-act="down" title="${esc(t('d.down'))}" aria-label="${esc(t('d.down'))}" ${i === last ? 'disabled style="opacity:.35;pointer-events:none"' : ''}>↓</button>
    <button class="btn sm" data-act="edit">${esc(t('d.edit'))}</button>
    <button class="btn sm danger" data-act="del">${esc(t('d.delete'))}</button>
  </div>
</div>`;
    }).join('');
  }
  function renderAll() {
    renderSettings();
    renderRows();
    renderState();
    // translate <option> labels
    ['extension', 'desktop', 'web', 'other'].forEach((k) => ($(`select[name=type] option[value=${k}]`).textContent = t('type.' + k)));
    ['active', 'live', 'wip', 'archived'].forEach((k) => ($(`select[name=status] option[value=${k}]`).textContent = t('status.' + k)));
    if (!drawer.hidden) $('#formTitle').textContent = t(editingId ? 'd.form.edit' : 'd.form.new');
  }

  /* ───────── Settings ───────── */
  $('#optDownload').addEventListener('change', (e) => { state.settings.showDownload = e.target.checked; persist(); toast(t('d.toast.saved')); });
  $('#socGithub').addEventListener('change', (e) => { state.settings.social.github = e.target.value.trim(); persist(); });
  $('#socEmail').addEventListener('change', (e) => { state.settings.social.email = e.target.value.trim(); persist(); });

  /* ───────── Rows actions ───────── */
  rowsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const id = b.closest('.row').dataset.id;
    const i = state.projects.findIndex((p) => p.id === id);
    if (i < 0) return;
    const act = b.dataset.act;
    if (act === 'edit') return openForm(id);
    if (act === 'del') {
      if (!confirm(t('d.confirm.delete'))) return;
      state.projects.splice(i, 1);
      persist(); renderRows(); toast(t('d.toast.deleted'));
      return;
    }
    const j = act === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= state.projects.length) return;
    [state.projects[i], state.projects[j]] = [state.projects[j], state.projects[i]];
    persist(); renderRows();
  });
  $('#btnAdd').addEventListener('click', () => openForm(null));

  /* ───────── Form ───────── */
  let formImage = '';
  function updateIconPrev() {
    const prev = $('#iconPrev');
    const fake = { icon: form.elements.icon.value.trim() || '✦', iconImage: formImage };
    prev.className = 'icon icon-prev' + NOOX.iconClass(fake);
    prev.innerHTML = NOOX.iconHTML(fake);
    $('#iconClear').hidden = !formImage;
  }
  form.elements.icon.addEventListener('input', updateIconPrev);
  $('#iconUpload').addEventListener('click', () => $('#iconFile').click());
  $('#iconClear').addEventListener('click', () => { formImage = ''; updateIconPrev(); });
  $('#iconFile').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      formImage = await NOOX.fileToIcon(f);
      updateIconPrev();
    } catch (err) {
      toast(t('d.toast.iconBad'), true);
    }
  });

  const val = (n) => form.elements[n].value;
  const setv = (n, v) => (form.elements[n].value = v == null ? '' : v);
  function openForm(id) {
    editingId = id;
    form.reset();
    form.elements.title.classList.remove('bad');
    const p = id ? state.projects.find((x) => x.id === id) : null;
    $('#formTitle').textContent = t(id ? 'd.form.edit' : 'd.form.new');
    setv('icon', p ? p.icon : '✦');
    formImage = p ? p.iconImage : '';
    updateIconPrev();
    setv('title', p ? p.title : '');
    setv('type', p ? p.type : 'extension');
    setv('status', p ? p.status : 'active');
    setv('version', p ? p.version : '');
    setv('a1', p ? safeColor(p.accent[0], '#a78bfa') : '#a78bfa');
    setv('a2', p ? safeColor(p.accent[1], '#22d3ee') : '#22d3ee');
    setv('tags', p ? p.tags.join(', ') : '');
    ['tagline', 'summary', 'note'].forEach((k) => { setv(k + '_tr', p ? p[k].tr : ''); setv(k + '_en', p ? p[k].en : ''); });
    setv('features_tr', p ? p.features.tr.join('\n') : '');
    setv('features_en', p ? p.features.en.join('\n') : '');
    ['github', 'download', 'store', 'demo'].forEach((k) => setv(k, p ? p.links[k] : ''));
    drawer.hidden = false;
    document.body.classList.add('lock');
    setTimeout(() => form.elements.title.focus({ preventScroll: true }), 60);
  }
  function closeForm() {
    drawer.hidden = true;
    document.body.classList.remove('lock');
  }
  drawer.addEventListener('click', (e) => { if (e.target.closest('[data-dclose]')) closeForm(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) closeForm(); });

  const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = val('title').trim();
    if (!title) {
      form.elements.title.classList.add('bad');
      form.elements.title.focus();
      return toast(t('d.toast.titleReq'), true);
    }
    const links = {};
    ['github', 'download', 'store', 'demo'].forEach((k) => {
      const raw = val(k).trim();
      links[k] = raw && !safeUrl(raw) && safeUrl('https://' + raw) ? 'https://' + raw : raw; // allow "github.com/..." without scheme
    });
    const existing = editingId ? state.projects.find((x) => x.id === editingId) : null;
    let id = existing ? existing.id : slug(title);
    if (!existing) {
      const base = id;
      let n = 2;
      while (state.projects.some((x) => x.id === id)) id = base + '-' + n++;
    }
    const p = {
      id,
      icon: val('icon').trim() || '✦',
      iconImage: formImage,
      type: val('type'),
      status: val('status'),
      version: val('version').trim().replace(/^v/i, ''),
      accent: [val('a1'), val('a2')],
      tags: val('tags').split(',').map((x) => x.trim()).filter(Boolean),
      title,
      tagline: { tr: val('tagline_tr').trim(), en: val('tagline_en').trim() },
      summary: { tr: val('summary_tr').trim(), en: val('summary_en').trim() },
      features: { tr: lines(val('features_tr')), en: lines(val('features_en')) },
      note: { tr: val('note_tr').trim(), en: val('note_en').trim() },
      links
    };
    // if one language is empty, mirror the other so the site never shows blanks
    ['tagline', 'summary', 'note'].forEach((k) => { if (!p[k].tr) p[k].tr = p[k].en; if (!p[k].en) p[k].en = p[k].tr; });
    if (!p.features.tr.length) p.features.tr = p.features.en.slice();
    if (!p.features.en.length) p.features.en = p.features.tr.slice();
    if (existing) state.projects[state.projects.indexOf(existing)] = p;
    else state.projects.push(p);
    persist(); renderRows(); closeForm(); toast(t('d.toast.saved'));
  });
  form.elements.title.addEventListener('input', (e) => e.target.classList.remove('bad'));

  /* ───────── Export / Import / Reset ───────── */
  $('#btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(NOOX.normalize(state), null, 2) + '\n'], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'projects.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(t('d.toast.exported'));
  });
  $('#btnImport').addEventListener('click', () => $('#fileImport').click());
  $('#fileImport').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      const json = JSON.parse(await f.text());
      if (!json || !Array.isArray(json.projects)) throw new Error('shape');
      if (!confirm(t('d.confirm.import'))) return;
      state = NOOX.normalize(json);
      persist(); renderAll(); toast(t('d.toast.imported'));
    } catch (err) {
      toast(t('d.toast.badfile'), true);
    }
  });
  $('#btnReset').addEventListener('click', async () => {
    if (!confirm(t('d.confirm.reset'))) return;
    NOOX.clearDraft();
    try {
      state = await NOOX.fetchPublished();
      publishedStr = ser(state);
    } catch (e) { /* keep current state if the published data cannot be read */ }
    renderAll();
    toast(t('d.toast.reset'));
  });

  /* ───────── Publish ───────── */
  const pubErr = $('#pubErr');
  $('#btnPublish').addEventListener('click', () => {
    pubErr.hidden = true;
    $('#pubPass').value = '';
    pubDlg.showModal();
    setTimeout(() => $('#pubPass').focus(), 50);
  });
  $('#pubCancel').addEventListener('click', () => pubDlg.close());
  $('#pubForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const go = $('#pubGo');
    const label = go.textContent;
    go.disabled = true;
    go.textContent = t('d.pub.busy');
    pubErr.hidden = true;
    try {
      const r = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: $('#pubPass').value, data: NOOX.normalize(state) })
      });
      let j = {};
      try { j = await r.json(); } catch (x) {}
      if (r.ok && j.ok) {
        publishedStr = ser(state);
        renderState();
        pubDlg.close();
        toast(t('d.toast.published'));
      } else {
        let msg = t('d.pub.err.gen');
        if (r.status === 401) msg = t('d.pub.err.pass');
        else if (r.status === 404 || r.status === 501) msg = t('d.pub.err.na');
        else if (j && j.error && typeof j.error === 'string') msg += ': ' + j.error;
        pubErr.textContent = msg;
        pubErr.hidden = false;
      }
    } catch (err) {
      pubErr.textContent = t('d.pub.err.na');
      pubErr.hidden = false;
    } finally {
      go.disabled = false;
      go.textContent = label;
    }
  });

  /* ───────── Boot ───────── */
  window.addEventListener('noox:lang', renderAll);
  (async function boot() {
    NOOX.initLang();
    let published = null;
    try {
      published = await NOOX.fetchPublished();
      publishedStr = ser(published);
    } catch (e) {
      toast(t('d.toast.loadfail'), true);
    }
    const draft = NOOX.getDraft();
    state = clone(draft || published || state);
    renderAll();
  })();
})();
