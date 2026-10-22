/* NooXRii portfolio — shared helpers: i18n, data loading, safe rendering */
(function () {
  'use strict';
  const NOOX = (window.NOOX = {});
  const LS_LANG = 'noox_lang';
  const LS_DRAFT = 'noox_draft_v1';

  /* ───────────── Translations ───────────── */
  const I18N = {
    tr: {
      'nav.projects': 'Projeler',
      'nav.dashboard': 'Dashboard',
      'hero.hi': 'Merhaba, ben',
      'roles': ['Chrome eklentileri geliştiririm.', 'Masaüstü uygulamaları yaparım.', 'Yayıncı toplulukları için araçlar üretirim.', 'Fikirleri tek tıkla çalışan ürünlere çeviririm.'],
      'stat.projects': 'Proje',
      'stat.tech': 'Teknoloji',
      'stat.live': 'Yayında',
      'search.ph': 'Proje ara…',
      'filter.all': 'Tümü',
      'type.extension': 'Chrome Eklentisi',
      'type.desktop': 'Masaüstü Uygulaması',
      'type.web': 'Web',
      'type.other': 'Diğer',
      'status.active': 'Aktif geliştirme',
      'status.live': 'Yayında',
      'status.wip': 'Yapım aşamasında',
      'status.archived': 'Arşivde',
      'card.details': 'Detayları gör',
      'btn.download': 'İndir',
      'btn.soon': 'İndir · yakında',
      'btn.soon.title': 'İndirme bağlantısı henüz eklenmedi',
      'btn.github': 'GitHub',
      'btn.store': 'Mağaza',
      'btn.demo': 'Demo',
      'modal.features': 'Özellikler',
      'modal.tech': 'Teknolojiler',
      'modal.close': 'Kapat',
      'empty.title': 'Bu aramaya uyan proje yok',
      'empty.sub': 'Filtreyi ya da aramayı değiştirmeyi dene.',
      'footer.made': 'tarafından tasarlandı ve geliştirildi.',
      'footer.top': 'Yukarı çık',
      'preview.banner': 'Önizleme modu: yayınlanmamış taslağı görüyorsun.',
      'preview.exit': 'Çık',
      'error.load': 'Proje verisi yüklenemedi. Siteyi bir sunucu üzerinden (ör. Vercel ya da "npx serve") açtığından emin ol.',

      'd.title': 'Dashboard',
      'd.preview': 'Önizle',
      'd.publish': 'Yayınla',
      'd.export': 'Dışa aktar',
      'd.import': 'İçe aktar',
      'd.reset': 'Taslağı sıfırla',
      'd.add': 'Yeni proje',
      'd.edit': 'Düzenle',
      'd.delete': 'Sil',
      'd.up': 'Yukarı taşı',
      'd.down': 'Aşağı taşı',
      'd.save': 'Kaydet',
      'd.cancel': 'Vazgeç',
      'd.state.clean': 'Yayındakiyle aynı',
      'd.state.dirty': 'Yayınlanmamış değişiklikler var',
      'd.state.unknown': 'Yayın durumu okunamadı',
      'd.settings': 'Site ayarları',
      'd.showDownload': 'İndir butonlarını göster',
      'd.showDownload.desc': 'Kapalıyken sitedeki hiçbir üründe indir butonu görünmez. Varsayılan: kapalı. Linkleri eklediğinde buradan tek seferde açabilirsin.',
      'd.profile': 'Profil bağlantıları (isteğe bağlı)',
      'd.projects': 'Projeler',
      'd.noProjects': 'Henüz proje yok. “Yeni proje” ile ilkini ekle.',
      'd.dlLink.yes': 'indirme linki var',
      'd.dlLink.no': 'indirme linki yok',
      'd.confirm.delete': 'Bu proje silinsin mi? Bu işlem taslakta geri alınamaz.',
      'd.confirm.import': 'Mevcut taslağın içe aktarılan dosyayla değiştirilecek. Devam edilsin mi?',
      'd.confirm.reset': 'Taslaktaki tüm yerel değişiklikler silinip yayındaki sürüme dönülecek. Devam edilsin mi?',
      'd.toast.saved': 'Taslak kaydedildi',
      'd.toast.deleted': 'Proje silindi',
      'd.toast.imported': 'İçe aktarıldı',
      'd.toast.badfile': 'Geçersiz dosya',
      'd.toast.reset': 'Taslak sıfırlandı',
      'd.toast.exported': 'projects.json indirildi',
      'd.toast.titleReq': 'Proje adı zorunlu',
      'd.toast.published': 'Yayınlandı! Vercel birkaç dakika içinde yeniden dağıtacak.',
      'd.toast.loadfail': 'Yayındaki veri okunamadı; taslakla devam ediliyor.',
      'd.pub.title': 'Siteye yayınla',
      'd.pub.desc': 'Taslak, GitHub deposundaki data/projects.json dosyasına yazılır; Vercel otomatik yeniden dağıtır. Dashboard şifresini gir.',
      'd.pub.pass': 'Dashboard şifresi',
      'd.pub.go': 'Yayınla',
      'd.pub.err.pass': 'Şifre yanlış',
      'd.pub.err.na': 'Yayınlama servisi ayarlı değil. “Dışa aktar” ile projects.json indirip depodaki data/ klasörüne koyabilirsin (README’ye bak).',
      'd.pub.err.gen': 'Yayınlanamadı',
      'd.pub.busy': 'Yayınlanıyor…',
      'd.form.new': 'Yeni proje',
      'd.form.edit': 'Projeyi düzenle',
      'f.icon': 'Simge (emoji)',
      'f.title': 'Proje adı',
      'f.type': 'Tür',
      'f.status': 'Durum',
      'f.version': 'Sürüm',
      'f.a1': 'Renk 1',
      'f.a2': 'Renk 2',
      'f.tags': 'Etiketler (virgülle ayır)',
      'f.tagline': 'Alt başlık',
      'f.summary': 'Kısa özet (hover)',
      'f.features': 'Özellikler (her satıra bir tane)',
      'f.note': 'Not (isteğe bağlı)',
      'f.links': 'Bağlantılar',
      'f.github': 'GitHub',
      'f.download': 'İndirme linki (GitHub release vb.)',
      'f.store': 'Mağaza (Chrome Web Store vb.)',
      'f.demo': 'Demo / video',
      'f.tr': 'Türkçe',
      'f.en': 'English',
      'f.iconUpload': 'Görsel yükle',
      'f.iconClear': 'Görseli kaldır (emojiye dön)',
      'f.iconHelp': 'PNG, JPG, WebP, SVG veya ICO. Kare, şeffaf arka planlı görseller en iyi görünür. Görsel yüklüyse emoji yerine o kullanılır.',
      'd.toast.iconBad': 'Görsel okunamadı. PNG, JPG, WebP, SVG veya ICO (en fazla 5 MB) dene.',
      'f.email': 'E-posta'
    },
    en: {
      'nav.projects': 'Projects',
      'nav.dashboard': 'Dashboard',
      'hero.hi': "Hi, I'm",
      'roles': ['I build Chrome extensions.', 'I make desktop apps.', 'I craft tools for streamer communities.', 'I turn ideas into one-click products.'],
      'stat.projects': 'Projects',
      'stat.tech': 'Technologies',
      'stat.live': 'Live',
      'search.ph': 'Search projects…',
      'filter.all': 'All',
      'type.extension': 'Chrome Extension',
      'type.desktop': 'Desktop App',
      'type.web': 'Web',
      'type.other': 'Other',
      'status.active': 'Active development',
      'status.live': 'Live',
      'status.wip': 'Work in progress',
      'status.archived': 'Archived',
      'card.details': 'View details',
      'btn.download': 'Download',
      'btn.soon': 'Download · soon',
      'btn.soon.title': 'The download link has not been added yet',
      'btn.github': 'GitHub',
      'btn.store': 'Store',
      'btn.demo': 'Demo',
      'modal.features': 'Features',
      'modal.tech': 'Tech',
      'modal.close': 'Close',
      'empty.title': 'No projects match this search',
      'empty.sub': 'Try changing the filter or the search.',
      'footer.made': 'designed and built by',
      'footer.top': 'Back to top',
      'preview.banner': 'Preview mode: you are seeing the unpublished draft.',
      'preview.exit': 'Exit',
      'error.load': 'Could not load project data. Make sure the site is served over HTTP (e.g. Vercel or "npx serve").',

      'd.title': 'Dashboard',
      'd.preview': 'Preview',
      'd.publish': 'Publish',
      'd.export': 'Export',
      'd.import': 'Import',
      'd.reset': 'Reset draft',
      'd.add': 'New project',
      'd.edit': 'Edit',
      'd.delete': 'Delete',
      'd.up': 'Move up',
      'd.down': 'Move down',
      'd.save': 'Save',
      'd.cancel': 'Cancel',
      'd.state.clean': 'Same as published',
      'd.state.dirty': 'Unpublished changes',
      'd.state.unknown': 'Could not read published state',
      'd.settings': 'Site settings',
      'd.showDownload': 'Show download buttons',
      'd.showDownload.desc': 'When off, no product on the site shows a download button. Default: off. Turn it on here once your links are in.',
      'd.profile': 'Profile links (optional)',
      'd.projects': 'Projects',
      'd.noProjects': 'No projects yet. Add your first with “New project”.',
      'd.dlLink.yes': 'download link set',
      'd.dlLink.no': 'no download link',
      'd.confirm.delete': 'Delete this project? This cannot be undone in the draft.',
      'd.confirm.import': 'Your current draft will be replaced by the imported file. Continue?',
      'd.confirm.reset': 'All local draft changes will be discarded and replaced by the published version. Continue?',
      'd.toast.saved': 'Draft saved',
      'd.toast.deleted': 'Project deleted',
      'd.toast.imported': 'Imported',
      'd.toast.badfile': 'Invalid file',
      'd.toast.reset': 'Draft reset',
      'd.toast.exported': 'projects.json downloaded',
      'd.toast.titleReq': 'Project name is required',
      'd.toast.published': 'Published! Vercel will redeploy in a few minutes.',
      'd.toast.loadfail': 'Could not read the published data; continuing with the draft.',
      'd.pub.title': 'Publish to site',
      'd.pub.desc': 'The draft is written to data/projects.json in your GitHub repo and Vercel redeploys automatically. Enter the dashboard password.',
      'd.pub.pass': 'Dashboard password',
      'd.pub.go': 'Publish',
      'd.pub.err.pass': 'Wrong password',
      'd.pub.err.na': 'Publishing service is not configured. Use “Export” and put projects.json into the repo’s data/ folder (see README).',
      'd.pub.err.gen': 'Could not publish',
      'd.pub.busy': 'Publishing…',
      'd.form.new': 'New project',
      'd.form.edit': 'Edit project',
      'f.icon': 'Icon (emoji)',
      'f.title': 'Project name',
      'f.type': 'Type',
      'f.status': 'Status',
      'f.version': 'Version',
      'f.a1': 'Color 1',
      'f.a2': 'Color 2',
      'f.tags': 'Tags (comma separated)',
      'f.tagline': 'Tagline',
      'f.summary': 'Short summary (hover)',
      'f.features': 'Features (one per line)',
      'f.note': 'Note (optional)',
      'f.links': 'Links',
      'f.github': 'GitHub',
      'f.download': 'Download link (GitHub release etc.)',
      'f.store': 'Store (Chrome Web Store etc.)',
      'f.demo': 'Demo / video',
      'f.tr': 'Türkçe',
      'f.en': 'English',
      'f.iconUpload': 'Upload image',
      'f.iconClear': 'Remove image (use emoji)',
      'f.iconHelp': 'PNG, JPG, WebP, SVG or ICO. Square images with a transparent background look best. When an image is set it replaces the emoji.',
      'd.toast.iconBad': 'Could not read the image. Try PNG, JPG, WebP, SVG or ICO (max 5 MB).',
      'f.email': 'Email'
    }
  };
  NOOX.I18N = I18N;
  NOOX.lang = 'en';
  NOOX.t = (k) => {
    const v = I18N[NOOX.lang] && I18N[NOOX.lang][k];
    return v !== undefined ? v : I18N.en[k] !== undefined ? I18N.en[k] : k;
  };

  /* ───────────── Safe rendering helpers ───────────── */
  NOOX.esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  NOOX.safeUrl = (u) => {
    if (!u) return '';
    try {
      const x = new URL(String(u).trim());
      return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : '';
    } catch (e) {
      return '';
    }
  };
  NOOX.safeColor = (c, fb) => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : fb);
  NOOX.pick = (v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) return v[NOOX.lang] || v.en || v.tr || '';
    return v || '';
  };
  NOOX.pickList = (v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) return v[NOOX.lang] && v[NOOX.lang].length ? v[NOOX.lang] : v.en || v.tr || [];
    return Array.isArray(v) ? v : [];
  };
  NOOX.slug = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'project';

  /* ───────────── Language ───────────── */
  NOOX.applyI18n = (root) => {
    (root || document).querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = NOOX.t(el.dataset.i18n)));
    (root || document).querySelectorAll('[data-i18n-ph]').forEach((el) => (el.placeholder = NOOX.t(el.dataset.i18nPh)));
    (root || document).querySelectorAll('[data-i18n-title]').forEach((el) => (el.title = NOOX.t(el.dataset.i18nTitle)));
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === NOOX.lang)));
  };
  NOOX.setLang = (l, persist) => {
    if (l !== 'tr' && l !== 'en') return;
    const changed = l !== NOOX.lang;
    NOOX.lang = l;
    document.documentElement.lang = l;
    if (persist) {
      try { localStorage.setItem(LS_LANG, l); } catch (e) {}
    }
    NOOX.applyI18n();
    if (changed) window.dispatchEvent(new CustomEvent('noox:lang'));
  };
  function guessLang() {
    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    const nav = (navigator.language || '').toLowerCase();
    return tz === 'Europe/Istanbul' || nav.startsWith('tr') ? 'tr' : 'en';
  }
  async function geoCountry() {
    const ctl = new AbortController();
    const tm = setTimeout(() => ctl.abort(), 2500);
    try {
      const r = await fetch('/api/geo', { cache: 'no-store', signal: ctl.signal });
      if (!r.ok) return null;
      const j = await r.json();
      return j && typeof j.country === 'string' && j.country ? j.country.toUpperCase() : null;
    } catch (e) {
      return null;
    } finally {
      clearTimeout(tm);
    }
  }
  /* Starts with a quick local guess so nothing flashes, then refines by IP country. */
  NOOX.initLang = () => {
    let saved = null;
    try { saved = localStorage.getItem(LS_LANG); } catch (e) {}
    document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => NOOX.setLang(b.dataset.lang, true)));
    if (saved === 'tr' || saved === 'en') {
      NOOX.setLang(saved, false);
      return Promise.resolve();
    }
    NOOX.setLang(guessLang(), false);
    return geoCountry().then((c) => {
      if (!c) return;
      let again = null;
      try { again = localStorage.getItem(LS_LANG); } catch (e) {}
      if (again) return; // user chose meanwhile
      NOOX.setLang(c === 'TR' ? 'tr' : 'en', false);
    });
  };

  /* ───────────── Data ───────────── */
  const DEFAULT_ACCENT = ['#a78bfa', '#22d3ee'];
  NOOX.normalize = (raw) => {
    const d = raw && typeof raw === 'object' ? raw : {};
    const s = d.settings && typeof d.settings === 'object' ? d.settings : {};
    const social = s.social && typeof s.social === 'object' ? s.social : {};
    const arr = (v) => (Array.isArray(v) ? v.map(String).filter(Boolean) : []);
    const bi = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? { tr: String(v.tr || ''), en: String(v.en || '') } : { tr: String(v || ''), en: String(v || '') });
    const bl = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? { tr: arr(v.tr), en: arr(v.en) } : { tr: arr(v), en: arr(v) });
    const projects = (Array.isArray(d.projects) ? d.projects : []).filter((p) => p && p.id && p.title).map((p) => ({
      id: String(p.id),
      icon: String(p.icon || '✦'),
      iconImage: typeof p.iconImage === 'string' && p.iconImage.length < 250000 && /^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/.test(p.iconImage) ? p.iconImage : '',
      type: ['extension', 'desktop', 'web', 'other'].includes(p.type) ? p.type : 'other',
      status: ['active', 'live', 'wip', 'archived'].includes(p.status) ? p.status : 'active',
      version: String(p.version || ''),
      accent: Array.isArray(p.accent) ? [NOOX.safeColor(p.accent[0], DEFAULT_ACCENT[0]), NOOX.safeColor(p.accent[1], DEFAULT_ACCENT[1])] : DEFAULT_ACCENT.slice(),
      tags: arr(p.tags),
      title: String(p.title),
      tagline: bi(p.tagline),
      summary: bi(p.summary),
      features: bl(p.features),
      note: bi(p.note),
      links: {
        github: String((p.links && p.links.github) || ''),
        download: String((p.links && p.links.download) || ''),
        store: String((p.links && p.links.store) || ''),
        demo: String((p.links && p.links.demo) || '')
      }
    }));
    return {
      settings: { showDownload: s.showDownload === true, social: { github: String(social.github || ''), email: String(social.email || '') } },
      projects
    };
  };
  NOOX.fetchPublished = async () => {
    const r = await fetch('/data/projects.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return NOOX.normalize(await r.json());
  };
  NOOX.getDraft = () => {
    try {
      const s = localStorage.getItem(LS_DRAFT);
      return s ? NOOX.normalize(JSON.parse(s)) : null;
    } catch (e) {
      return null;
    }
  };
  NOOX.setDraft = (d) => { try { localStorage.setItem(LS_DRAFT, JSON.stringify(d)); } catch (e) {} };
  NOOX.clearDraft = () => { try { localStorage.removeItem(LS_DRAFT); } catch (e) {} };

  /* Inline icons */
  NOOX.ICON = {
    dl: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 20h16"/></svg>',
    gh: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5a11.5 11.5 0 00-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0012 .5z"/></svg>',
    ext: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  /* Icon: uploaded image (validated data URL) wins, otherwise the emoji */
  NOOX.iconHTML = (p) => (p.iconImage ? `<img src="${p.iconImage}" alt="" draggable="false">` : NOOX.esc(p.icon));
  NOOX.iconClass = (p) => (p.iconImage ? ' has-img' : '');
  /* Any image (png, jpg, webp, svg, ico) → 192px transparent PNG data URL. Re-rasterizing also strips any SVG scripts. */
  NOOX.fileToIcon = (file) =>
    new Promise((resolve, reject) => {
      if (!file || file.size > 5 * 1024 * 1024) return reject(new Error('size'));
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const S = 192;
          const c = document.createElement('canvas');
          c.width = c.height = S;
          const w = img.naturalWidth || S, h = img.naturalHeight || S;
          const k = Math.min(S / w, S / h);
          const dw = w * k, dh = h * k;
          c.getContext('2d').drawImage(img, (S - dw) / 2, (S - dh) / 2, dw, dh);
          resolve(c.toDataURL('image/png'));
        } catch (e) {
          reject(e);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
      img.src = url;
    });

  NOOX.typeLabel = (t) => NOOX.t('type.' + t);
  NOOX.statusLabel = (s) => NOOX.t('status.' + s);
  NOOX.draftKey = LS_DRAFT;
})();
