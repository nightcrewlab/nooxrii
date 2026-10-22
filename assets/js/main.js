/* NooXRii portfolio — public site */
(function () {
  'use strict';
  const { t, esc, pick, pickList, safeUrl, safeColor, ICON } = NOOX;
  const $ = (s, r) => (r || document).querySelector(s);
  const cardsEl = $('#cards');
  const chipsEl = $('#chips');
  const qEl = $('#q');
  const emptyEl = $('#empty');
  const modal = $('#modal');
  const params = new URLSearchParams(location.search);
  const preview = params.get('preview') === '1';
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let data = null;
  let filter = 'all';
  let query = '';
  let lastFocus = null;

  /* ───────── Rendering ───────── */
  function dlButton(p) {
    if (!data.settings.showDownload) return ''; // hidden by default
    const u = safeUrl(p.links.download);
    if (u) return `<a class="btn primary" href="${esc(u)}" target="_blank" rel="noopener noreferrer" data-stop>${ICON.dl}<span>${esc(t('btn.download'))}</span></a>`;
    return `<span class="btn primary disabled" aria-disabled="true" title="${esc(t('btn.soon.title'))}">${ICON.dl}<span>${esc(t('btn.soon'))}</span></span>`;
  }
  function linkButtons(p) {
    const out = [];
    const gh = safeUrl(p.links.github);
    const st = safeUrl(p.links.store);
    const dm = safeUrl(p.links.demo);
    if (gh) out.push(`<a class="btn" href="${esc(gh)}" target="_blank" rel="noopener noreferrer" data-stop>${ICON.gh}<span>${esc(t('btn.github'))}</span></a>`);
    if (st) out.push(`<a class="btn" href="${esc(st)}" target="_blank" rel="noopener noreferrer" data-stop>${ICON.ext}<span>${esc(t('btn.store'))}</span></a>`);
    if (dm) out.push(`<a class="btn" href="${esc(dm)}" target="_blank" rel="noopener noreferrer" data-stop>${ICON.play}<span>${esc(t('btn.demo'))}</span></a>`);
    return out.join('');
  }
  function styleVars(p) {
    return `--a1:${safeColor(p.accent[0], '#a78bfa')};--a2:${safeColor(p.accent[1], '#22d3ee')}`;
  }
  function cardHTML(p, i) {
    const tags = p.tags.slice(0, 4).map((x) => `<span class="tag">${esc(x)}</span>`).join('');
    const actions = dlButton(p) + linkButtons(p);
    return `
<article class="card" role="button" tabindex="0" data-id="${esc(p.id)}" style="${styleVars(p)};--d:${Math.min(i, 8) * 0.07}s" aria-label="${esc(p.title)}">
  <div class="c-top">
    <div class="icon${NOOX.iconClass(p)}" aria-hidden="true">${NOOX.iconHTML(p)}</div>
    <span class="status ${esc(p.status)}"><i></i>${esc(t('status.' + p.status))}</span>
  </div>
  <h3>${esc(p.title)}</h3>
  <p class="tagline">${esc(pick(p.tagline))}</p>
  <div class="c-spacer"></div>
  <div class="tags">${tags}</div>
  <div class="c-meta"><span>${esc(t('type.' + p.type))}${p.version ? ' · v' + esc(p.version) : ''}</span><span class="more">${esc(t('card.details'))} →</span></div>
  <div class="peek">
    <p>${esc(pick(p.summary) || pick(p.tagline))}</p>
    ${actions ? `<div class="actions">${actions}</div>` : ''}
  </div>
</article>`;
  }

  function visibleProjects() {
    const q = query.trim().toLowerCase();
    return data.projects.filter((p) => {
      if (filter !== 'all' && p.type !== filter) return false;
      if (!q) return true;
      const hay = [p.title, pick(p.tagline), pick(p.summary), p.tags.join(' ')].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  function renderChips() {
    const counts = {};
    data.projects.forEach((p) => (counts[p.type] = (counts[p.type] || 0) + 1));
    const types = Object.keys(counts);
    if (types.length < 2) {
      chipsEl.innerHTML = '';
      return;
    }
    const mk = (key, label, n) => `<button class="chip" data-f="${esc(key)}" aria-pressed="${filter === key}">${esc(label)}<small>${n}</small></button>`;
    chipsEl.innerHTML = mk('all', t('filter.all'), data.projects.length) + types.map((k) => mk(k, t('type.' + k), counts[k])).join('');
  }

  function renderCards() {
    const list = visibleProjects();
    cardsEl.innerHTML = list.map(cardHTML).join('');
    emptyEl.hidden = list.length > 0;
    requestAnimationFrame(() => {
      const cards = cardsEl.querySelectorAll('.card');
      if (reduceMotion || !('IntersectionObserver' in window)) return cards.forEach((c) => c.classList.add('in'));
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
        { threshold: 0.08 }
      );
      cards.forEach((c) => io.observe(c));
    });
  }

  function renderMarquee() {
    const tags = [...new Set(data.projects.flatMap((p) => p.tags))];
    const m = $('#marquee');
    if (!tags.length) { m.hidden = true; return; }
    m.hidden = false;
    const row = tags.map((x) => `<span>${esc(x)}</span>`).join('');
    m.innerHTML = `<div class="track">${row}${row}${row}${row}</div>`;
  }

  /* Counters */
  function countTo(el, to) {
    if (reduceMotion || to === 0) { el.textContent = to; return; }
    const start = performance.now();
    const dur = 900;
    (function step(now) {
      const k = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(start);
  }
  function renderStats() {
    const techs = new Set(data.projects.flatMap((p) => p.tags.map((x) => x.toLowerCase()))).size;
    const live = data.projects.filter((p) => p.status === 'live').length;
    countTo($('#s-projects'), data.projects.length);
    countTo($('#s-tech'), techs);
    countTo($('#s-live'), live);
  }

  function renderFooter() {
    const s = data.settings.social;
    const gh = safeUrl(s.github);
    const mail = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(s.email || '') ? s.email : '';
    const parts = [];
    if (gh) parts.push(`<a class="btn sm" href="${esc(gh)}" target="_blank" rel="noopener noreferrer">${ICON.gh}<span>GitHub</span></a>`);
    if (mail) parts.push(`<a class="btn sm" href="mailto:${esc(mail)}">✉<span>${esc(mail)}</span></a>`);
    $('#soc').innerHTML = parts.join('');
  }

  function renderAll() {
    if (!data) return;
    renderChips();
    renderCards();
    renderMarquee();
    renderStats();
    renderFooter();
    if (!modal.hidden) openModal(modal.dataset.id, true);
  }

  /* ───────── Typing line ───────── */
  let typeToken = 0;
  async function typeLoop() {
    const token = ++typeToken;
    const el = $('#typed');
    const roles = t('roles');
    if (reduceMotion) { el.textContent = roles[0]; return; }
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let i = 0;
    while (token === typeToken) {
      const txt = roles[i % roles.length];
      for (let k = 1; k <= txt.length && token === typeToken; k++) { el.textContent = txt.slice(0, k); await wait(38); }
      await wait(1700);
      for (let k = txt.length; k >= 0 && token === typeToken; k--) { el.textContent = txt.slice(0, k); await wait(16); }
      await wait(280);
      i++;
    }
  }

  /* ───────── Modal ───────── */
  function openModal(id, silent) {
    const p = data.projects.find((x) => x.id === id);
    if (!p) return;
    if (!silent) lastFocus = document.activeElement;
    const feats = pickList(p.features).map((f, i) => `<li style="--i:${i}">${esc(f)}</li>`).join('');
    const note = pick(p.note);
    const actions = dlButton(p) + linkButtons(p);
    const sheet = $('.sheet', modal);
    sheet.style.cssText = styleVars(p);
    sheet.innerHTML = `
<button class="close" data-close aria-label="${esc(t('modal.close'))}">${ICON.x}</button>
<div class="m-head">
  <div class="icon${NOOX.iconClass(p)}" aria-hidden="true">${NOOX.iconHTML(p)}</div>
  <h2 id="m-title">${esc(p.title)}</h2>
  <p class="tl">${esc(pick(p.tagline))}</p>
  <div class="m-badges">
    <span class="status ${esc(p.status)}"><i></i>${esc(t('status.' + p.status))}</span>
    <span class="status"><i style="background:var(--a1)"></i>${esc(t('type.' + p.type))}</span>
    ${p.version ? `<span class="status"><i style="background:var(--a2)"></i>v${esc(p.version)}</span>` : ''}
  </div>
</div>
<div class="m-body">
  ${pick(p.summary) ? `<p class="m-sum">${esc(pick(p.summary))}</p>` : ''}
  ${feats ? `<h4>${esc(t('modal.features'))}</h4><ul class="feat">${feats}</ul>` : ''}
  ${note ? `<div class="note">${esc(note)}</div>` : ''}
  ${p.tags.length ? `<h4>${esc(t('modal.tech'))}</h4><div class="tags">${p.tags.map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>` : ''}
</div>
${actions ? `<div class="m-foot">${actions}</div>` : ''}`;
    modal.dataset.id = id;
    if (modal.hidden) {
      modal.hidden = false;
      document.body.classList.add('lock');
    }
    if (!silent) {
      history.replaceState(null, '', '#' + encodeURIComponent(id) + (preview ? '' : ''));
      sheet.scrollTop = 0;
      $('.close', modal).focus({ preventScroll: true });
    }
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('lock');
    history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ───────── Events ───────── */
  cardsEl.addEventListener('click', (e) => {
    if (e.target.closest('[data-stop]')) return;
    const c = e.target.closest('.card');
    if (c) openModal(c.dataset.id);
  });
  cardsEl.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('card')) {
      e.preventDefault();
      openModal(e.target.dataset.id);
    }
  });
  modal.addEventListener('click', (e) => {
    if (e.target.matches('.backdrop') || e.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab' && !modal.hidden) {
      const f = [...modal.querySelectorAll('a[href],button')].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  chipsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    filter = b.dataset.f;
    renderChips();
    renderCards();
  });
  qEl.addEventListener('input', () => { query = qEl.value; renderCards(); });
  window.addEventListener('noox:lang', () => { renderAll(); typeLoop(); });
  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (data && data.projects.some((p) => p.id === id)) openModal(id);
    else if (!id) closeModal();
  });

  /* Cursor glow + card tilt (fine pointers only) */
  if (finePointer && !reduceMotion) {
    const glow = $('#glow');
    let raf = 0, gx = 0, gy = 0;
    window.addEventListener('pointermove', (e) => {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add('on');
      if (!raf) raf = requestAnimationFrame(() => { glow.style.transform = `translate3d(${gx}px,${gy}px,0)`; raf = 0; });
    }, { passive: true });
    document.addEventListener('pointerleave', () => glow.classList.remove('on'));
    cardsEl.addEventListener('pointermove', (e) => {
      const c = e.target.closest('.card');
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px');
      c.style.setProperty('--my', y + 'px');
      c.style.setProperty('--ry', ((x / r.width - 0.5) * 7).toFixed(2) + 'deg');
      c.style.setProperty('--rx', ((0.5 - y / r.height) * 7).toFixed(2) + 'deg');
    });
    cardsEl.addEventListener('pointerout', (e) => {
      const c = e.target.closest('.card');
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); }
    });
  }

  /* ───────── Boot ───────── */
  async function boot() {
    NOOX.initLang();
    typeLoop();
    cardsEl.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    try {
      const published = await NOOX.fetchPublished();
      const draft = preview ? NOOX.getDraft() : null;
      data = draft || published;
    } catch (err) {
      const draft = preview ? NOOX.getDraft() : null;
      if (draft) data = draft;
      else {
        cardsEl.innerHTML = `<div class="err" style="grid-column:1/-1">${esc(t('error.load'))}</div>`;
        return;
      }
    }
    if (preview) {
      const b = document.createElement('div');
      b.className = 'banner';
      b.innerHTML = `<span>${esc(t('preview.banner'))}</span><a class="btn sm" href="/">${esc(t('preview.exit'))}</a>`;
      document.body.appendChild(b);
      window.addEventListener('noox:lang', () => { b.firstChild.textContent = t('preview.banner'); b.lastChild.textContent = t('preview.exit'); });
    }
    renderAll();
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && data.projects.some((p) => p.id === id)) openModal(id);
  }
  boot();
})();
