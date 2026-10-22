# NooXRii — Portfolio

Dark, animated, bilingual (TR / EN) portfolio with a built-in dashboard. No build step: plain HTML, CSS and JavaScript, plus two tiny Vercel serverless functions.

```
index.html            public site
dashboard/index.html  dashboard (/dashboard)
data/projects.json    ← the single source of truth for all projects + settings
assets/               css + js
api/geo.js            country detection → auto language
api/publish.js        dashboard "Publish" button → commits data/projects.json to GitHub
vercel.json  robots.txt
```

## Deploy on Vercel

1. Push this folder to a GitHub repo (the folder's contents should be the repo root).
2. Vercel → **Add New → Project** → import the repo. Framework preset: **Other**. No build command, no output directory.
3. Done. The site is at `/`, the dashboard at `/dashboard`.

## Language

- Opens in **Turkish if the visitor's IP is in Türkiye**, otherwise **English** (`/api/geo` reads Vercel's `x-vercel-ip-country` header).
- If that call fails (offline / local), it falls back to browser language + timezone.
- The TR/EN switch in the top bar overrides it and is remembered.

## Dashboard

Open `/dashboard`. You can add, edit, delete and reorder projects, switch the **download buttons** on/off for the whole site, and set optional GitHub / email links for the footer.

- Changes are saved as a **draft in your browser** (localStorage). Use **Preview** to see the draft on the real site (`/?preview=1`).
- Visitors only see what is in `data/projects.json`. To make a draft live, use one of:
  - **Publish** (recommended): commits the file to GitHub, Vercel redeploys in about a minute. Needs the environment variables below.
  - **Export** → replace `data/projects.json` in the repo yourself → commit.
- **Import** loads a `projects.json` back into the draft.

### Enable the Publish button

Vercel → Project → Settings → Environment Variables:

| Name | Value |
|---|---|
| `DASH_PASSWORD` | a long password you choose (typed in the Publish dialog) |
| `GITHUB_TOKEN` | fine-grained personal access token, only this repo, **Contents: Read and write** |
| `GITHUB_REPO` | `your-username/your-repo` |
| `GITHUB_BRANCH` | *(optional)* default `main` |
| `DATA_PATH` | *(optional)* default `data/projects.json` |

Redeploy once after adding them. The dashboard page itself is not password protected, but it can only change your local draft; nothing goes live without the password.

## Download buttons

- Hidden everywhere by default (`"showDownload": false`).
- For each project, put the GitHub release (or any) URL into **Download link**. Projects without a link show a disabled "Download · soon" button once the buttons are switched on.
- Turn them on at once from **Site settings → Show download buttons**, then Publish.

## Run locally

```
npx serve .
```

Open the printed address. (`/api/*` only works on Vercel, so the language falls back to browser/timezone and Publish shows a "not configured" hint locally. Use Export there.)

## Notes

- Texts and links are escaped / validated before rendering; only `http(s)` links are accepted.
- Keep the "unofficial" notes on the Kick-related projects; they are not affiliated with Kick.
