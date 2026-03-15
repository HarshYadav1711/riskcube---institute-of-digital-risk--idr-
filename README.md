# RiskCube — Institute of Digital Risk

A single-page responsive website for the Institute of Digital Risk. Built with HTML, CSS, and vanilla JavaScript. No frameworks or build step.

## Project structure

```
├── index.html          # Single page, semantic HTML
├── css/
│   └── styles.css     # Mobile-first layout, CSS variables, dark mode
├── js/
│   ├── theme-init.js   # Applies saved theme before paint (no flash)
│   └── main.js         # Navigation, scroll reveal, pillars, hero cube, theme toggle
├── logos/
│   └── riskcube-icon.svg
├── assets/             # Images, placeholders
└── README.md
```

## Run locally

1. **Open the file directly**  
   Double-click `index.html` or open it from your browser’s File menu.  
   Note: Some features (e.g. fonts, correct paths) work best over HTTP.

2. **Using a local server (recommended)**  
   From the project root:

   **Node (npx):**
   ```bash
   npx serve .
   ```
   Then open the URL shown (e.g. `http://localhost:3000`).

   **Python 3:**
   ```bash
   python -m http.server 8080
   ```
   Then open `http://localhost:8080`.

   **PHP:**
   ```bash
   php -S localhost:8080
   ```
   Then open `http://localhost:8080`.

## Tech stack

- **HTML5** — Semantic structure, ARIA where needed, one main content area
- **CSS** — Variables for theming, flexbox/grid, mobile-first breakpoints (600px, 768px, 1024px)
- **JavaScript** — Vanilla only: smooth scroll, nav state, scroll reveal (IntersectionObserver), pillars tooltips, hero cube, dark mode with `localStorage`

## Features

- **Sections:** Hero, Our pillars (interactive cube), Trusted by, About, What we do, Community, Case study, Contact
- **Responsive:** Mobile-first; stacked layout on small screens, grid/flex on larger; touch-friendly nav
- **Dark mode:** Toggle in header; preference stored in `localStorage`
- **Accessibility:** Skip link, focus states, reduced-motion support, semantic headings
- **Performance:** Preloaded fonts, minimal JS, no external libraries

## Responsiveness

- **Mobile (&lt; 768px):** Single-column layout, hamburger menu, pillars shown as stacked cards, full-width sections
- **Tablet (768px+):** Horizontal nav, multi-column grids where used (e.g. operating model, community logos)
- **Desktop (1024px+):** Max-width content, increased spacing, pillars interactive cube with tooltips

Test by resizing the browser or using DevTools device emulation.

## Code style

- **Indentation:** 2 spaces (HTML, CSS, JS).
- **CSS:** BEM-like naming (`block__element`, `block--modifier`), mobile-first media queries, variables in `:root` and `body.dark-mode`.
- **JS:** IIFE, `'use strict'`, no globals; feature checks before using APIs.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver`, `matchMedia`, and CSS custom properties.

## License

© RiskCube — Institute of Digital Risk. All rights reserved.

## Design Decisions

This project was intentionally built using semantic HTML, modern CSS and vanilla JavaScript to demonstrate strong frontend fundamentals without relying on frameworks.

The interface prioritizes clarity, accessibility and performance while maintaining a clean startup-style landing page aesthetic.