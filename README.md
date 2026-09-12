# LiSTe

A minimalist list maker — make a list of anything, check things off, export when you're done.

Built with React + Vite. Your lists are saved in the browser's local storage — no server, no account.

---

## Part 1 — Get it running on your Kubuntu machine

### 1. Install Node.js (skip if you already have it)

Open a terminal and check first:

```bash
node -v
npm -v
```

If those print version numbers (Node 18 or newer is fine), skip to step 2. If not, install Node via `nvm` (cleaner than the Ubuntu repo version):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
```

Verify again with `node -v` / `npm -v`.

### 2. Unzip the project and install dependencies

Put this whole `liste` folder somewhere like `~/projects/`, then:

```bash
cd ~/projects/liste
npm install
```

This downloads React, Vite, and the icon library into a `node_modules` folder (this folder is intentionally not uploaded to GitHub — see `.gitignore`).

### 3. Run it locally

```bash
npm run dev
```

Terminal will print a local URL, usually `http://localhost:5173`. Open that in your browser — that's the app, live-reloading as you edit files in `src/`.

Press `Ctrl+C` in the terminal to stop it.

---

## Part 2 — Push it to GitHub

### 1. Create the repo on GitHub

Go to github.com → **New repository** → name it `liste` (or whatever you like) → **do not** initialize it with a README (you already have one) → Create repository.

### 2. Install git if needed

```bash
git --version
```

If missing: `sudo apt update && sudo apt install git`

### 3. Set your identity (one-time, if you haven't already)

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### 4. Initialize and push

From inside `~/projects/liste`:

```bash
git init
git add .
git commit -m "Initial commit: LiSTe"
git branch -M main
git remote add origin https://github.com/<your-username>/liste.git
git push -u origin main
```

GitHub will ask you to authenticate — either a browser popup (if you have the GitHub CLI / credential manager set up) or a personal access token used as your password. If you get stuck here, GitHub's own guide is at
`https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git`.

Refresh the repo page on GitHub — your files should be there (minus `node_modules`, which is correctly ignored).

---

## Part 3 — Host it live (GitHub Pages)

This project already has a `deploy` script wired up using the `gh-pages` package.

### 1. Confirm the repo name matches `vite.config.js`

Open `vite.config.js` — the `base` is set to `/liste/`. If you named your GitHub repo something other than `liste`, change that line to match, e.g. `base: "/my-repo-name/"`.

### 2. Deploy

```bash
npm run deploy
```

This builds the app and pushes the compiled output to a `gh-pages` branch on your repo.

### 3. Turn on Pages

On GitHub: repo → **Settings → Pages** → under "Build and deployment", set **Source** to "Deploy from a branch", branch = `gh-pages`, folder = `/ (root)` → Save.

Within a minute or two your app will be live at:

```
https://<your-username>.github.io/liste/
```

Whenever you make changes, just re-run `npm run deploy` to update the live version.

---

## Project structure

```
liste/
├── index.html          entry HTML file
├── package.json        dependencies + scripts
├── vite.config.js       build config (GitHub Pages base path lives here)
├── src/
│   ├── main.jsx         mounts the React app
│   ├── App.jsx          all the app logic and UI
│   ├── App.css          component styles
│   └── index.css        global styles, theme variables, fonts
```
