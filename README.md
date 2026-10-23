# Alberta Expeditions

A lightweight, bilingual educational app from Alberta Tomorrow. Each module is an
"expedition" with its own mountain on the home page and entries in a field journal.
The app currently includes wildlife, residential-school, and geology expeditions;
future independent modules can explore land use, energy, climate events, and more.

## Setup

Use **Node.js 22.13+ (22.x) or Node.js 24+**, with npm. Node 22 is selected in
`.nvmrc`; use a maintained Node release. These requirements cover Vite 8 and ESLint 10.
TypeScript 6 is used for compatibility with typescript-eslint's supported range.

```sh
nvm use
npm ci
npm run dev
```

Open the local URL printed by Vite. The example is at
`/modules/wildlife-habitats`. The tracked `.env.development` enables development-only
visual testing tools during `npm run dev`; do not put secrets in Vite environment
files because `VITE_` variables are included in client code.
Install the recommended VS Code Prettier and ESLint extensions; the committed
settings enable Prettier formatting on save for all supported file types.

## Commands

| Command                | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start the development server              |
| `npm run build`        | Strict TypeScript check and build `dist/` |
| `npm run preview`      | Preview the production build locally      |
| `npm run lint`         | Run ESLint                                |
| `npm run typecheck`    | Check app and tooling TypeScript projects |
| `npm run format`       | Format supported files with Prettier      |
| `npm run format:check` | Check formatting without changing files   |

Commit `package-lock.json`; use `npm ci` for reproducible installs.

## Structure

```text
src/
  app/          Entry point, translations setup, routing, and pages
  components/   Shared UI and reusable components used across modules
  journal/      Journal progress state, localStorage persistence, and context
  modules/      Typed registry, shared types, and individual module folders
  locales/      en/ and fr/ with global, home, journal, development, funfacts, and module.* JSON files
  styles/       Global CSS and centralized theme tokens
  assets/       Bundled local assets
```

React Router owns navigation. The registry supplies home-page metadata and
lazy-loaded activities. Each `/modules/<id>` route shows module details and a
launch action; activities open at `/modules/<id>/expedition`. Reusable components
belong in `src/components/`; module-specific activities, components, and data
belong in their own `src/modules/<module-id>/` folder. Modules can compose
shared components, such as a future map or quiz, without sharing activity-specific
state or configuration. Opening a module overview preloads its activity and
shows progress in the navigation bar. Preloads are cancelled when leaving that
module. The residential-school module currently uses a five-second simulated
preload; replace it with real asset or data loading when those resources exist.
`Suspense` announces loading, and the application error
boundary handles rendering or activity-download failures. Unknown page URLs show
a playful 404 with an Alberta fun fact; missing modules or invalid paths beneath
`/modules/` show a module-specific recovery message. English is the initial
language; switching to French updates the entire interface and document language
without resetting the current activity. A page reload resets language and
activity state, but the expedition journal is kept (see below).

### Expedition journal

Each module declares journal **checkpoints**: ids for things a learner
accomplished or learned. Activities receive `completedCheckpoints` and a
`completeCheckpoint(id)` callback as props (`ModuleActivityProps` in
`src/modules/types.ts`). Recording a checkpoint saves it in browser
`localStorage` (key `alberta-expeditions:journal`, via
`src/journal/journalStorage.ts`) and shows a toast. Each expedition also has a
**started** flag (`startedAt`): opening a module's activity starts it, and
recording any checkpoint starts it too, for example from a map or 3D scene via
`useJournal().completeCheckpoint(moduleId, checkpointId)`. Only started
expeditions get a page in the journal. A module's status is derived: no record
is _not started_, started with checkpoints left is _in progress_, and every
checkpoint recorded is _complete_. Home cards and overviews show a mountain that
fills as checkpoints are recorded and gains a flag when the expedition is
complete; **View journal** appears once an expedition is started.

The **Journal** button in the navigation bar and the **View journal** buttons
open the journal modal, which is always 90% of the viewport height. Its first
page is a title page explaining the journal, followed by one page per started
expedition ("Expedition 2 of 3"); the title shows the number of entries. The
arrows and a floating dropdown switch pages. The development menu has **Reset
journal progress** and **Reset whole site** (clears the journal and intro tour
flag, then reloads as a first visit); both ask for a Yes/No confirmation.

Journal text lives in each module's locale file under `journal.summary` and
`journal.entries` (`id`, `title`, `summary`); generic journal labels are in
`journal.json`. Storage is local only; replace `journalStorage.ts` to sync with
save data later.

### First-visit intro tour

First-time visitors get a short tour on the home page: a welcome dialog, a
pointer above the expedition cards, a pointer to the Journal button, and a
closing message. It uses a native modal `<dialog>`, so the page behind it can't
be clicked, and **Skip tour** or Escape ends it. Finishing or skipping saves
`alberta-expeditions:intro-tour-completed` in `localStorage`
(`src/tour/introTourStorage.ts`); the tour only starts automatically when that
flag is missing and the visitor is on the home page. Steps live in
`src/tour/steps.ts`, anchors are `data-tour` attributes, and the text is in
`introTour.json`. The development menu's **Intro tour** panel can reset the flag
(the tour then starts on the next page load) or restart the tour immediately.

### Add a module

1. Create a folder under `src/modules/`, such as `land-use/`.
2. Add a default-exported React activity component. Keep its components, state,
   and logic in that folder. Import reusable UI from `src/components/` and include
   a translated link back to the module overview.
3. Add a matching module resource in both `src/locales/en/<namespace>.json` and
   `src/locales/fr/<namespace>.json`. Include `title`, `description`, `category`,
   and any activity-specific text. Register the namespace in `src/app/i18n.ts`
   and `ModuleTranslationNamespace` in `src/modules/types.ts`.
4. Add a `LearningModule` entry to `src/modules/registry.ts`: a unique URL-safe
   `id`, its `translationNamespace`, estimated minutes, and
   `lazy(() => import('./land-use/LandUse'))`. Also add `checkpoints` (ids kept in
   a small file in the module folder) and matching `journal.summary` and
   `journal.entries` in both locale files. The activity receives
   `completedCheckpoints` and `completeCheckpoint` props.
5. Run the checks below. The home card, module overview, and expedition route are
   automatic.

### Add or change translations

Keep shared interface text in `global.json`, homepage content in `home.json`,
and fun-fact content in `funfacts.json` inside each language folder under
`src/locales/`. Give every module its own JSON namespace file, such as
`wildlifeFinder.json` or `residentialSchool.json`, and keep matching English and
French keys, including `launch` for the overview action. Use
`useTranslation('home')`, `useTranslation('global')`, and the module's
namespace as appropriate. English resources define the TypeScript
translation-key types. Use i18next interpolation rather than concatenating
translated sentences.

To add another language, add its resource file, register it and its language code
in `src/app/i18n.ts`, and add its translated name and option to the language
selector in `src/components/Layout.tsx`.

### Styling and conventions

Tailwind CSS 4 uses `@tailwindcss/vite` in `vite.config.ts` and
`@import 'tailwindcss'` in `src/styles/global.css`. The CSS `@theme` block
centralizes colours, the system font stack, and spacing. No legacy
`tailwind.config.js`, PostCSS configuration, or `@tailwind` directives are needed.
Add theme values and custom breakpoints in that `@theme` block; the custom
`xs:` variant starts at `24rem` (384px), below Tailwind's default `sm:` at
`40rem` (640px). For example, `xs:grid-cols-2` applies from 384px upward.
Prefer utilities and the small shared component classes. Controls have
touch-friendly targets, visible keyboard focus, and reduced-motion support.

Development-only breakpoint and dark-mode controls live in
`src/components/development/`. They render only when Vite is in development mode
and `VITE_ENVIRONMENT=development`; the browser tab title is prefixed with
`Dev | `. The breakpoint badge toggles both vertical breakpoint guides and a
centered, translucent legend. The reusable `Dropdown` component powers the
language selector and supports keyboard navigation.

Use strict TypeScript, same-line opening braces, and Prettier formatting. Add a
short header to hand-written source files with filename, author (Chace Nielson),
created/updated dates, description, and relevant dependencies or notes. Update the
updated date when editing. Do not put headers in JSON or generated files.

## Verification

```sh
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run preview
```

There is no automated test framework yet. Before adding a module, manually check:

- Home cards and navigation at desktop and tablet sizes.
- Both languages on home, in the activity, and on the not-found page.
- Incorrect and correct answers, reset, return home, and browser back/forward.
- Direct loading and refreshing `/modules/wildlife-habitats` and
  `/modules/wildlife-habitats/expedition`.
- Unknown URLs and module IDs, such as `/missing` and `/modules/missing`.
- Keyboard navigation, focus visibility, and the skip-to-content link.
- Loading feedback with a delayed activity request, and error recovery with a
  failed activity request (browser developer tools can simulate these).

## Deployment

Build with `npm ci && npm run build` and serve `dist/` from the site root using a
static host. **Configure an SPA fallback:** requests that do not match static
files must serve `index.html` with a successful response, so direct navigation to
`/modules/wildlife-habitats/expedition` works. For example, an nginx location can use
`try_files $uri $uri/ /index.html;`. Keep real asset requests working normally.
Vite's development/preview servers provide the fallback locally; `npm run preview`
is not a production server.

This foundation intentionally has no authentication, backend, analytics, 3D
engine, Electron, or offline/PWA support. The only persistence is the
browser-local expedition journal.
