# LiSTe

A minimalist, single-page list-making app for anything you need to track — groceries, packing lists, to-dos, reading lists, you name it.

Create as many lists as you want, add items with smart quantity parsing, check things off as you go, and export a finished list as a `.txt` file, a PDF, JSON, or straight to your clipboard. No sign-up, no backend, no clutter — just lists.

## Features

- **Smart quantity parsing** — type `2 coffee`, `sugar 2kg`, or `3x apples` and LiSTe figures out the item, quantity, and unit on its own. Adding an item that already exists bumps its quantity instead of creating a duplicate.
- **Quick-start templates** — Groceries, Packing, and To-do templates create a ready-to-go list with common starter items in one tap.
- **Drag-and-drop reordering** — reorder lists on the home screen and items within a list by dragging.
- **Undo on delete** — deleting a list or item shows a toast with an Undo button, so a stray tap isn't permanent.
- **Delete confirmation** — deleting an entire list asks for confirmation first.
- **Custom colors** — pick a color when creating a list, or change it later from the list view.
- **Sort modes** — sort items manually (drag order), alphabetically, or with unchecked items first.
- **Search** — filter your lists by name once you have more than a couple.
- **Multiple export formats** — export any list as `.txt`, PDF, or JSON, or copy it straight to your clipboard.
- **Backup & restore** — export all your lists as a single JSON file and import them back later or on another device.
- **Light & dark themes** — toggle manually, or let it default to your system preference on first load.
- **Local-first** — everything is saved in your browser via `localStorage`. Nothing leaves your device unless you export it.

## Getting started

LiSTe is a single self-contained HTML file — there's no build step and no dependencies to install.

1. Download `LiSTe.html` from this repo.
2. Open it directly in your browser, or host it anywhere that can serve static files (GitHub Pages, Netlify, a simple web server, etc.).
3. Start making lists.

Since everything is saved to `localStorage`, your lists are tied to the specific browser you use LiSTe in. Use the export/import buttons in the header to back up your data or move it to another device or browser.

## Tech

- Vanilla HTML, CSS, and JavaScript — no framework, no build tooling.
- [jsPDF](https://github.com/parallax/jsPDF) (loaded from a CDN) for PDF export.
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts.

## Known limitations

- Data is stored per-browser via `localStorage` — there's no cloud sync. Use the JSON export/import to move lists between devices.
- Offline installability is limited to basic "add to home screen" support (manifest + theme-color meta tags). A fully offline-capable PWA would need a proper service worker served from its own file, which isn't possible from a single self-contained HTML file.

## License

Add a license of your choice here (e.g. MIT) if you plan to make this repo public.
