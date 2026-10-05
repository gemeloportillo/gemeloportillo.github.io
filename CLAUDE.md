# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static HTML portfolio website for Miguel Angel Portillo Bobadilla (Arte y Ciencia), a UI/UX web designer. There is no build system, no package manager, and no framework beyond AngularJS 1.x and jQuery (in older sub-pages). Newer pages use Bootstrap 5.3 and vanilla JS.

## Running locally

**A local server is required** — `lang.js` fetches `/assets/lang.json` via an absolute path, so opening HTML files directly (`file://`) breaks the i18n system.

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Site structure

Each section is a self-contained directory with its own `index.html`:

- `index.html` — home page
- `about/` — team/about page
- `portfolio/` — work showcase with sub-sections: `webdesign/`, `movil/`, `marketing/`, `posters/`, `interactivedesign/`, `doodles/`
- `cv/` — résumé
- `certifications/` — certifications page
- `contact/` — contact form (sends via FormSubmit AJAX to the owner's Gmail; `FORM_ENDPOINT` in the page script — success is shown only when the service confirms)
- `art/` — art gallery
- `social/` — social links
- `video/` — video section

## Shared assets (two layers)

### `assets/` — modern shared system

Injected into every page that has the matching container `<div>`:

- `assets/menu.js` — injects the global nav into `<div id="global-nav-container">`. Sets the active link based on `window.location.pathname`.
- `assets/footer.js` — injects the global footer into `<div id="global-footer-container">`.
- `assets/lang.js` — bilingual i18n system (EN/ES). Reads/writes `localStorage.userLang`. Detects browser language on first visit. Fetches translations from `/assets/lang.json` on load.
- `assets/theme.css` — **color design system** (see "Color & theming" below). Must load after Bootstrap and `index_files/styles.css`.
- `assets/theme.js` — light/dark mode. Loaded in `<head>` without `defer` (prevents flash). Sets `<html data-bs-theme>` from `localStorage.userTheme` or `prefers-color-scheme`, and injects the day/night switch next to `#btn-translate`.
- `assets/layers.js` + `assets/layers.css` — "design layers" switcher (Content → Wireframe → Final design), home only. Content layer disables every stylesheet except those whose `<link>`/`<style>` has `data-layer-keep`; wireframe adds `html.layer-wireframe`. Not persisted on purpose. Keep page HTML readable without CSS (single `h1`, visible link text, `visually-hidden` text in icon-only controls).
- `assets/lang.json` — all UI strings in `en` and `es` keyed by slug (e.g. `"menu_home"`, `"cnt_lbl_email"`).

### `index_files/` — legacy shared assets (older sub-pages)

Older sub-pages still reference `../index_files/` for jQuery, AngularJS 1.x, Bootstrap (local copy), and the legacy `app.js` controller. Root-level pages that still use this pattern reference `index_files/` (no `../`).

## i18n conventions

All translatable text uses HTML attributes — **never hardcode display strings in HTML**:

| Attribute | Purpose |
|---|---|
| `data-i18n="key"` | Sets `innerHTML` of the element |
| `data-i18n-placeholder="key"` | Sets `placeholder` attribute on inputs |
| `data-i18n-value="key"` | Sets `value` attribute on button/input elements |

The language toggle button must have `id="btn-translate"`. `lang.js` binds it automatically via event delegation.

## Color & theming

Colors live **only** in `assets/theme.css`, in three layers:
1. **Primitives** (`--blue-600`, `--slate-100`, `--cat-web`…) — raw palette, used only inside theme.css.
2. **Semantic tokens** (`--color-bg`, `--color-bg-subtle`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-on-primary`, `--color-accent`, `--color-border`…) — the only colors pages may use. Dark mode just redefines these under `:root[data-bs-theme="dark"]`.
3. **Bootstrap bridge** — maps semantic tokens to `--bs-*` so cards, forms, `.text-muted`, borders follow the theme.

Rules: never hardcode hex colors in pages; use `var(--color-*)` or the utilities `bg-surface`, `bg-surface-alt`, `text-primary-brand`, `text-accent`, `badge-tag`, `btn-brand`, `btn-outline-brand`. Don't use `bg-white`, `bg-light`, `text-dark`, `btn-dark` or `btn-outline-dark` (not theme-aware). Shared navbar (`.site-navbar`), portfolio subnav and footer (`.site-footer`) are styled in theme.css. Palette: brand blue (from the logo) + complementary amber accent + slate neutrals, all WCAG AA.

## CSS and dependencies

Newer pages (e.g. `index.html`) load from CDN:
- Bootstrap 5.3.3 — `cdn.jsdelivr.net`
- Font Awesome 6.5.2 — `cdnjs.cloudflare.com`
- Google Fonts (Open Sans) — `fonts.googleapis.com`

Older sub-pages (portfolio sub-sections) use vendored copies in their own `css/`, `js/`, `img/`, and `imgs/` directories because they were designed independently.

`index_files/styles.css` and `index_files/settings.css` remain the primary stylesheets for pages using the legacy asset layer.

## Key conventions

- Paths from root-level pages reference `index_files/` and `/assets/`; paths from one level deep use `../index_files/` and `/assets/` (absolute paths work for `assets/`).
- Adding a new translatable string: add the key to both `"en"` and `"es"` objects in `assets/lang.json`, then use the appropriate `data-i18n*` attribute in HTML.
- Google Analytics is present but commented out in `index_files/app.js`.
- `config.xml` is a legacy PhoneGap/Cordova build descriptor (not used for web serving).
- `.DS_Store` files exist in some directories — ignore them.
