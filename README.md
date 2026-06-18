# Paakiya Subramanian — Portfolio Site

A personal portfolio website for Paakiya Subramanian, RPA & Automation Developer, built from her LinkedIn profile.

## Structure

```
.
├── index.html        Main page markup
├── css/
│   └── styles.css    All styling
├── js/
│   └── main.js        Interactivity (nav, filters, terminal demo, etc.)
├── assets/
│   └── favicon.svg    Site favicon
└── README.md
```

No build step, no dependencies, no backend — it's plain HTML/CSS/JS and can be opened directly in a browser (`index.html`) or hosted on any static site host.

## Preview locally

Just open `index.html` in a browser, or run a tiny local server from this folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Go to your repository on GitHub → **Settings** → **Pages** (in the left sidebar).
2. Under "Build and deployment", set **Source** to **Deploy from a branch**.
3. Set **Branch** to `main` and folder to `/ (root)`, then click **Save**.
4. Wait a minute or two, then your site will be live at:

   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

   GitHub shows the exact URL at the top of the Pages settings once it's deployed.

5. Any time you want to update the live site, just edit the files, commit, and push — GitHub Pages will automatically redeploy within a minute or so.

## Notes

- The "Run workflow" terminal demo uses a generic, illustrative log — not real client data — since the actual production queues and tracker files are confidential.
- The contact email is shown publicly in the hero and footer. Remove or mask it in `index.html` if you'd rather not expose it directly.
- All animations respect `prefers-reduced-motion`.
