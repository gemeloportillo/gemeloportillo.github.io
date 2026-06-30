# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static HTML portfolio website for Miguel Angel Portillo Bobadilla (Arte y Ciencia), a UI/UX web designer. There is no build system, no package manager, and no framework beyond AngularJS 1.x and jQuery, which are served as pre-bundled local files.

## Running locally

Open any `.html` file directly in a browser, or serve the root with any static file server:

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
- `cv/` — résumé (also `acerca.html` at root, the Spanish version)
- `certifications/` / `certs/` — certifications page
- `contact/` — contact form
- `art/` — art gallery
- `social/` — social links
- `video/` — video section

## Shared assets

All pages share a common asset pool located at `index_files/` (root pages) or `../index_files/` (sub-pages):

- `app.js` — custom jQuery/AngularJS controller with global vars for menus, slideshows, project grids, testimonials, and Google Maps integration
- `styles.css` — primary custom stylesheet (Open Sans font, responsive layout)
- `settings.css` — theme/color overrides
- `bootstrap.css` / `bootstrap.js` — Bootstrap (local copy)
- `jquery-1.js` — jQuery (local copy)
- `angular.js` — AngularJS 1.x (local copy)
- `font-awesome.css` — icon font

Portfolio sub-sections (`portfolio/webdesign/`, `portfolio/movil/`, etc.) each carry their own `css/`, `js/`, `img/`, and `imgs/` directories because they were designed independently.

## Key conventions

- All dependencies are vendored locally — there is no CDN or npm. When adding a new library, copy the file into `index_files/` and reference it with a relative path.
- Paths from root-level pages reference `index_files/`; paths from one level deep use `../index_files/`.
- Google Analytics is present but commented out in `app.js`.
- `config.xml` is a PhoneGap/Cordova build descriptor (legacy, not actively used for web serving).
- `.DS_Store` files exist in some directories — these can be ignored.
