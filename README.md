# Alberta Tomorrow

A lightweight, bilingual educational app about Alberta. This starter includes a
home page and one short wildlife habitat activity. Future independent modules can
explore land use, geology, oil sands, climate events, and more.

## Setup

Use **Node.js 22.12+ (22.x) or Node.js 24+**, with npm. Node 22 is selected in
`.nvmrc`; use a maintained Node release. These requirements cover Vite 8 and ESLint 10.
TypeScript 6 is used for compatibility with typescript-eslint's supported range.

```sh
nvm use
npm ci
npm run dev
```

Open the local URL printed by Vite. The example is at
`/modules/wildlife-habitats`. No environment variables or external services are needed.
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
  components/   Shared layout, loading, error, and not-found UI
  modules/      Typed registry, shared types, and individual module folders
  locales/      en/translation.json and fr/translation.json
  styles/       Global CSS and centralized theme tokens
  assets/       Bundled local assets
```

React Router owns navigation. The registry supplies home-page metadata and
lazy-loaded activities. `Suspense` announces loading, and the application error
boundary handles rendering or activity-download failures. Unknown routes and
module IDs show a friendly return-home page. State uses React hooks only and is
not saved. English is the initial language; switching to French updates the entire
interface and document language without resetting the current activity. A page
reload resets language and activity state.

### Add a module

1. Create a folder under `src/modules/`, such as `land-use/`.
2. Add a default-exported React activity component. Keep its components, state,
   and logic in that folder. Include a translated return-home link.
3. Add matching `modules.landUse.title` and `modules.landUse.description` keys in
   both translation files, plus any activity-specific text. Add a category under
   `categories` in both files if needed.
4. Add a `LearningModule` entry to `src/modules/registry.ts`: a unique URL-safe
   `id`, translation keys, category, estimated minutes, and
   `lazy(() => import('./land-use/LandUse'))`.
5. Run the checks below. The home card and `/modules/<id>` route are automatic.

### Add or change translations

Keep all visible interface text in `src/locales/en/translation.json` and
`src/locales/fr/translation.json`, with the same key structure. Use
`useTranslation()` and `t('key')`, including for accessible labels and feedback.
English resources define the TypeScript translation-key types. Use i18next
interpolation rather than concatenating translated sentences.

To add another language, add its resource file, register it and its language code
in `src/app/i18n.ts`, and add its translated name and option to the language
selector in `src/components/Layout.tsx`.

### Styling and conventions

Tailwind CSS 4 uses `@tailwindcss/vite` in `vite.config.ts` and
`@import 'tailwindcss'` in `src/styles/global.css`. The CSS `@theme` block
centralizes colours, the system font stack, and spacing. No legacy
`tailwind.config.js`, PostCSS configuration, or `@tailwind` directives are needed.
Prefer utilities and the small shared component classes. Controls have
touch-friendly targets, visible keyboard focus, and reduced-motion support.

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
- Direct loading and refreshing `/modules/wildlife-habitats`.
- Unknown URLs and module IDs, such as `/missing` and `/modules/missing`.
- Keyboard navigation, focus visibility, and the skip-to-content link.
- Loading feedback with a delayed activity request, and error recovery with a
  failed activity request (browser developer tools can simulate these).

## Deployment

Build with `npm ci && npm run build` and serve `dist/` from the site root using a
static host. **Configure an SPA fallback:** requests that do not match static
files must serve `index.html` with a successful response, so direct navigation to
`/modules/wildlife-habitats` works. For example, an nginx location can use
`try_files $uri $uri/ /index.html;`. Keep real asset requests working normally.
Vite's development/preview servers provide the fallback locally; `npm run preview`
is not a production server.

This foundation intentionally has no authentication, backend, persistence,
analytics, 3D engine, Electron, or offline/PWA support.
