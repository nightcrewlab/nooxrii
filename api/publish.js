// Publishes the dashboard draft by committing data/projects.json to the GitHub repo.
// Vercel then redeploys the site automatically.
//
// Required environment variables (Vercel → Settings → Environment Variables):
//   DASH_PASSWORD  – password you type in the dashboard's Publish dialog
//   GITHUB_TOKEN   – fine-grained token with "Contents: Read and write" on the repo
//   GITHUB_REPO    – "owner/repo"
// Optional:
//   GITHUB_BRANCH  – default "main"
//   DATA_PATH      – default "data/projects.json"
const crypto = require('crypto');

function safeEqual(a, b) {
  const A = crypto.createHash('sha256').update(String(a)).digest();
  const B = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(A, B);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const httpUrl = (u) => {
  if (!u) return '';
  try {
    const x = new URL(String(u));
    return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : null;
  } catch (e) {
    return null;
  }
};

function validate(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.projects)) return 'invalid data';
  if (data.projects.length > 100) return 'too many projects';
  const ids = new Set();
  for (const p of data.projects) {
    if (!p || typeof p.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(p.id)) return 'invalid project id';
    if (ids.has(p.id)) return 'duplicate project id';
    ids.add(p.id);
    if (typeof p.title !== 'string' || !p.title.trim()) return 'project title required';
    if (p.iconImage) {
      if (typeof p.iconImage !== 'string' || p.iconImage.length > 250000 || !/^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/.test(p.iconImage)) return 'invalid icon image';
    }
    for (const k of ['github', 'download', 'store', 'demo']) {
      const v = p.links && p.links[k];
      if (v && httpUrl(v) === null) return 'links must be http(s) URLs';
    }
  }
  const social = data.settings && data.settings.social;
  if (social && social.github && httpUrl(social.github) === null) return 'profile link must be an http(s) URL';
  return null;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { DASH_PASSWORD, GITHUB_TOKEN, GITHUB_REPO } = process.env;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const path = process.env.DATA_PATH || 'data/projects.json';
  if (!DASH_PASSWORD || !GITHUB_TOKEN || !GITHUB_REPO) return res.status(501).json({ error: 'not configured' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'bad request' });

  if (!safeEqual(body.password || '', DASH_PASSWORD)) {
    await sleep(700); // slow down guessing
    return res.status(401).json({ error: 'unauthorized' });
  }

  const problem = validate(body.data);
  if (problem) return res.status(400).json({ error: problem });

  const content = JSON.stringify(body.data, null, 2) + '\n';
  if (content.length > 3000000) return res.status(413).json({ error: 'data too large' });

  const api = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'noox-portfolio-dashboard'
  };

  try {
    let sha;
    const cur = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
    if (cur.ok) sha = (await cur.json()).sha;
    else if (cur.status !== 404) return res.status(502).json({ error: `GitHub read failed (${cur.status})` });

    const put = await fetch(api, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update projects via dashboard',
        content: Buffer.from(content, 'utf8').toString('base64'),
        branch,
        ...(sha ? { sha } : {})
      })
    });
    if (!put.ok) {
      let why = '';
      try { why = String((await put.json()).message || '').slice(0, 220); } catch (e) {}
      return res.status(502).json({ error: `GitHub write failed (${put.status})${why ? ': ' + why : ''}` });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'GitHub unreachable' });
  }
};
