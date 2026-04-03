# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Educational web apps providing interactive, evidence-based information on nuclear energy in Singapore's context. Zero-dependency vanilla stack — no build tools, no package manager, no tests, no linter.

## Running Locally

No build step. Open HTML files directly in a browser:
```bash
open 09_interactive_app/index.html
open 10_safety_education/index.html
```

## Deployment

GitHub Pages via Actions workflow (`.github/workflows/pages.yml`). Deploys automatically on push to `main`. The workflow copies both app directories into `_site/` and generates a landing page.

Live site: https://joelfirenze.github.io/info-on-nuclear-energy-sg/

## Architecture

Two independent single-page applications sharing no code between them. External CDN dependencies: Chart.js (charting) and Inter (Google Fonts).

### 09_interactive_app — Energy Scenario Explorer

Modular architecture with IIFE pattern and central reactive state:

- **`js/app.js`** — Controller. Holds the global `state` object, tab navigation, and `onStateChange()` which cascades updates to all modules.
- **`js/data.js`** — All constants: SG baseline data, INDUSTRIES array (8 industries), REACTOR_CATEGORIES, REACTORS array (8 reactor types), LANDMARKS, COLOR palette.
- **`js/calculator.js`** — Section 1: energy demand modeling with growth rate/projection sliders and industry cards.
- **`js/reactors.js`** — Section 2: reactor selection with category groups and per-type count steppers. Shows MW capacity per selection and demand coverage vs Section 1 output.
- **`js/land.js`** — Section 3: land footprint comparison with scaled square visualization and landmark comparisons.
- **`js/waste.js`** — Section 4: waste volume visualization (3D cube, decay timeline chart).
- **`js/carbon.js`** — Section 5: CO2 displacement and DAC integration calculations.

Each module exports `{ init, calculate, update }`. State flows one way: user interaction → mutate `state` → `onStateChange()` → all modules recalculate and re-render.

### 10_safety_education — Nuclear Safety Explorer

Entirely self-contained in a single `index.html` (~2,500 lines). Six tab-based topics (radioactivity, defence in depth, safety concepts, historical accidents, advanced reactors, fusion safety). All CSS and JS inline.

## Key Patterns

- **Module IIFE pattern**: `const Module = (() => { ... return { init, calculate, update }; })();`
- **Event delegation**: listeners on containers using `event.target.closest()`
- **DOM rendering**: template literals with `.innerHTML` replacement, no virtual DOM
- **Chart.js management**: instances stored as module-level variables, destroyed/recreated on state change
- **State convention**: single `state` object passed as parameter to all module functions
