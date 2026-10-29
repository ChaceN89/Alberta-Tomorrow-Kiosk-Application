# Alberta Expeditions

A lightweight, bilingual educational app from Alberta Tomorrow. Each module is an
"expedition" with its own mountain on the home page and entries in a field journal.
The app currently includes test expeditions about Alberta foxes, residential
schools, and geology;
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
`/modules/foxes-of-alberta-test`. The tracked `.env.development` enables development-only
visual testing tools during `npm run dev`; do not put secrets in Vite environment
files because `VITE_` variables are included in client code.
Install the recommended VS Code Prettier and ESLint extensions; the committed
settings enable Prettier formatting on save for all supported file types.

## Commands

| Command                 | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Start the development server              |
| `npm run build`         | Strict TypeScript check and build `dist/` |
| `npm run preview`       | Preview the production build locally      |
| `npm run lint`          | Run ESLint                                |
| `npm run typecheck`     | Check app and tooling TypeScript projects |
| `npm run check:locales` | Check English/French JSON resource parity |
| `npm run format`        | Format supported files with Prettier      |
| `npm run format:check`  | Check formatting without changing files   |

Commit `package-lock.json`; use `npm ci` for reproducible installs.
`npm run build` runs the locale check before TypeScript and Vite builds.

## Structure

```text
src/
  app/          Entry point, translations setup, routing, and pages
  components/   Shared UI and reusable components used across modules
  journal/      Journal progress state, localStorage persistence, and context
  modules/      Typed registry, shared types, and individual module folders
  module-tools/ Reusable module tools (audio-player, quiz-system) shared by modules
  locales/      en/ and fr/ with global, home, journal, development, funfacts, moduleTools, and module.* JSON files
  styles/       Global CSS and centralized theme tokens
  assets/       Bundled local assets
```

React Router owns navigation. The registry supplies home-page metadata and
lazy-loaded activities. Each `/modules/<id>` route shows module details and a
launch action; activities open at `/modules/<id>/expedition`. Reusable components
belong in `src/components/`; module-specific activities, components, and data
belong in their own `src/modules/<module-id>/` folder. Modules can compose
shared components without sharing activity-specific state or configuration.

Reusable module tools live in `src/module-tools/<tool>/`. A module supplies its own
content (text, files, checkpoint ids) and the tool handles display and interaction:

- **Audio player** (`audio-player/`): `AudioPlayerProvider` wraps the routes so one
  audio element keeps playing across pages, and `AudioPlayerPanel` is the corner
  mp3-style player. Modules render `TrackPlayButton` with a track and optional
  `onStart`/`onEnd` callbacks (for example, to call `completeCheckpoint`). The panel
  opens when audio starts, collapses to a tab that animates while playing, and
  includes volume and playback-speed controls. When another track is playing,
  module tracks can be added to the queue or played immediately. Queued tracks can
  be removed, advanced to with Next, or played automatically when the current
  track ends. Closing during playback asks for confirmation before unloading the
  track and clearing the queue. The fast and slow buttons cycle speeds listed in
  `playbackRates.ts`; their tooltips work with hover and keyboard focus. A
  Full-screen media that ends with an empty queue pauses briefly, then exits by
  shrinking and fading downward; compact audio also closes when it ends. A
  queued track continues playing instead.
  The full-screen Up Next panel also supports removing queued items and has a
  compact red close-player button that uses the same fullscreen exit animation.
- **Quiz system** (`quiz-system/`): `Quiz` takes `QuizQuestion[]`, records answers
  through `onQuestionCorrect`, and lets the module render its own finish screen.
  Reuse a question's id as its journal checkpoint id so progress resumes.

Opening a module overview loads its activity code and then runs its optional
module-specific preload hook. Preloads are cancelled when leaving that module.
Only modules that need additional data or media setup need a `preload.ts`;
ordinary JavaScript code-splitting happens for every module through the registry.
The residential-school module currently uses a five-second simulated preload;
replace it with real asset or data loading when those resources exist. The
activity route also has a `Suspense` loading fallback, and the application error
boundary handles rendering or activity-download failures. Unknown page URLs show
a playful 404 with an Alberta fun fact; missing modules or invalid paths beneath
`/modules/` show a module-specific recovery message. English is the initial
language; switching to French updates the entire interface and document language
without resetting the current activity. A page reload resets language and
activity state, but the expedition journal is kept (see below).

### Expedition journal

Each module declares journal **checkpoints**: ids for things a learner
accomplished or learned. Activities receive `completedCheckpoints` and a
`completeCheckpoint(id)` callback, plus the current `moduleId`, through
`ModuleActivityProps` in `src/modules/types.ts`. Nested module components that
only need checkpoint access can use `ModuleCheckpointProps`. Recording a
checkpoint saves it in browser
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
`journal.json`. A journal entry can also include an optional localized `section`
label, such as `Media` or `Quiz`, to group consecutive checkpoints under a
heading. Omit `section` for entries that should remain ungrouped. Keep section
labels and entry ids aligned in both locale files. Storage is local only;
replace `journalStorage.ts` to sync with save data later.

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

Modules share an integration contract, not a prescribed activity design. The
registry supplies the home card, overview, route, and journal metadata; each
module decides how learners explore its subject.

#### Module folder organization

Use the same file names and roles for every module so the entry point, quiz
configuration, media, and loading behavior are easy to find. Start with this
shape and include optional files only when the module needs them:

```text
src/modules/land-use/
  entry-LandUse.tsx      # required; default-exported activity entry point
  checkpoints.ts         # required; stable journal checkpoint ids
  quiz.ts                # optional; question ids, content indexes, correct options
  tracks.ts              # optional; audio track metadata and checkpoint callbacks
  videos.ts              # optional; video metadata and player ids
  preload.ts             # optional; extra cancellable data/media loading
  components/            # optional; module-specific React components
  assets/                # optional; local images, audio, video, and other files
```

In the current modules, the Alberta foxes module uses all of these, including
`preload.ts` to download its audio files before launch; geology uses `quiz.ts`
and `videos.ts`, and residential school uses `preload.ts`. A
module does **not** need tracks or videos unless it has them, and it does not
need an `assets/` folder if it only uses remote content. Keep metadata in
`tracks.ts` and `videos.ts`; put local files in `assets/` and import them from
the metadata files. Module-only React UI goes in `components/`; it does not
need to follow a shared layout beyond the activity props and integration
contract.

The existing files follow that same pattern:

```text
testing-foxes-of-alberta/       entry-FoxesOfAlberta.tsx, checkpoints.ts, quiz.ts,
                                tracks.ts, videos.ts, preload.ts, components/, assets/
testing-geology/                entry-Geology.tsx, checkpoints.ts, quiz.ts, videos.ts
testing-residential-schools/    entry-ResidentialSchool.tsx, checkpoints.ts, preload.ts
```

The registry IDs intentionally mark these as test expeditions:

| Module folder                  | Registry ID                |
| ------------------------------ | -------------------------- |
| `testing-foxes-of-alberta/`    | `foxes-of-alberta-test`    |
| `testing-geology/`             | `geology-test`             |
| `testing-residential-schools/` | `residential-schools-test` |

Registry IDs are also used as route and journal-storage keys. These renamed test
modules start with fresh journal progress; progress stored under their previous
IDs is not migrated.

The default-exported entry file should be named `entry-<ModuleName>.tsx`, for
example `entry-ResidentialSchool.tsx` or `entry-LandUse.tsx`. The registry
imports this file lazily. Additional module components stay in `components/`
and use descriptive names such as `ListenSection.tsx` or `HabitatQuiz.tsx`.

#### Quiz convention

Every quiz module uses the same optional `quiz.ts` data shape. Each definition
has a stable checkpoint `id`, a `contentIndex` into its translated question
array, and a zero-based `correctIndex`. Keep the translated content in both
locale files as an ordered array of objects with `prompt`, `options` (an array
of strings), `correct`, and `tryAgain`. Keep English and French question order
aligned; `npm run check:locales` checks their shape and array lengths. The shared
`buildQuizQuestions` helper combines definitions and localized content and
validates their indexes before the shared `Quiz` displays them.

Use the optional `media` slot on a `QuizQuestion` when a question needs more than
text: it accepts any React content, such as an image, a `TrackPlayButton`, a
video/player component, or a module-specific media UI. The quiz data and
answer-handling format remain consistent while each module chooses which
questions have media and what that media does.

Pass media to `buildQuizQuestions` by question id. For example, an image, audio
track, or video can be attached without changing the shared quiz layout:

```tsx
buildQuizQuestions(quizDefinitions, translatedQuestions, {
  'habitat-image': <img src={habitatImage} alt={t('quiz.imageDescription')} />,
  'animal-call': <TrackPlayButton track={animalCallTrack} />,
  'landscape-video': <TrackPlayButton track={landscapeVideo} />,
})
```

#### Module loading and optional preloading

Every registry entry uses a lazy entry component and a loader for that component.
Opening the module overview starts `loadActivity`, which imports the activity
code before the learner launches it. The module page keeps a `Suspense` fallback
for loading and error recovery. You do not need a `preload.ts` just to get
code-splitting or the overview loading state.

Add `preload.ts` only when the module must prepare additional data or media.
Register its exported callback as the module's optional `preload`. The callback
receives an `AbortSignal` and an `onProgress(percent)` function. It should report
real progress when possible, stop promptly when aborted, and reject on genuine
failures; the shared preload provider handles progress UI, cancellation, retry,
and error notification. The residential-school callback is simulated. The
Alberta foxes test module downloads all three local audio files into in-memory
Blob URLs before enabling launch, so playback can use the already-downloaded
data without fetching the files again. This deliberately demonstrates the
preload flow for future larger assets such as map data; downloading every audio
file up front is usually not desirable in a production module.

Here is the activity entry shape; its content and interaction are intentionally
module-specific:

```tsx
export default function LandUse({
  moduleId,
  completedCheckpoints,
  completeCheckpoint,
}: ModuleActivityProps) {
  const { t } = useTranslation('landUse')
  const checkpointId = 'land-use-discovery'
  const isComplete = completedCheckpoints.includes(checkpointId)

  return (
    <section aria-labelledby="activity-title" className="max-w-3xl space-y-6">
      <p className="font-semibold text-pine">{t('category')}</p>
      <h1 id="activity-title">{t('title')}</h1>
      <p className="text-lg text-muted">{t('activity.introduction')}</p>

      {isComplete ? (
        <p role="status">{t('activity.completed')}</p>
      ) : (
        <button
          type="button"
          className="button"
          onClick={() => completeCheckpoint(checkpointId)}
        >
          {t('activity.complete')}
        </button>
      )}

      <Link to={`/modules/${moduleId}`} className="button-secondary">
        {t('backToOverview')}
      </Link>
    </section>
  )
}
```

The snippet uses `ModuleActivityProps`, `useTranslation`, and `Link` from the
usual React/i18next/router imports. Choose checkpoint ids that are stable after
release: journal progress is stored by module id and checkpoint id in the
browser, so renaming an id can orphan a learner's saved progress.

#### Integration checklist

1. Pick a unique, URL-safe kebab-case module id (for example, `land-use`) and a
   TypeScript/i18next namespace (for example, `landUse`). Create matching
   resources at `src/locales/en/module.landUse.json` and
   `src/locales/fr/module.landUse.json`.
2. Add the namespace to `ModuleTranslationNamespace` in
   `src/modules/types.ts`. Register both JSON imports in `src/app/i18n.ts`, add
   the English resource to `CustomTypeOptions.resources`, add both languages to
   `resources`, and include the namespace in `ns`.
3. Implement `entry-<ModuleName>.tsx` as a default-exported activity using
   `ModuleActivityProps`.
   It receives `moduleId`, `completedCheckpoints`, and `completeCheckpoint`.
   Build links from `moduleId` rather than hardcoding a route; use it for journal
   actions too. Keep this module's own UI, data, and state in its module folder.
4. Define the module's checkpoint ids in its folder and add matching
   `journal.entries` with the same ids in both locale resources. Add
   `journal.summary` and the overview/activity copy, including `title`,
   `description`, `category`, `launch`, and `backToOverview`.
5. Add a `LearningModule` entry to `src/modules/registry.ts` with the id,
   `visible: true`, namespace, estimated minutes, checkpoint list, lazy entry
   component, and activity loader. Add `preload` and `journalEntryAction` only
   if needed.
6. Run `npm run check:locales` and the regular project checks. Home cards,
   module overviews, and expedition routes are generated from the registry.

#### Module visibility

Set `visible: false` on a registry entry to temporarily take a module out of
the app without deleting its code. The derived `visibleModules` list controls
home cards, direct module routes, journal pages and actions, and the development
module-status panel. A hidden module's URLs show the normal module-not-found
recovery UI. Existing journal data is retained in local storage; making the
module visible again restores access to that saved progress.

#### Keep the activity unique

The contract above is deliberately small. A module can be a quiz, archive,
guided listening activity, map, sequence of steps, media experience, or a
combination. Use `Quiz` or the media player from `src/module-tools/` when they
fit; do not make a module behave like a quiz just to match another module.
Keep one-off visuals and interactions inside the module. Promote something to
`src/module-tools/<tool>/` only when it is reusable independently by multiple
modules, with a typed API and its own shared behavior.

Shared panels, buttons, theme tokens, navigation, and journal progress already
have common implementations. Compose those instead of copying their styling or
state logic. The activity's content order, explanatory copy, interaction model,
media, and module-specific components remain free to differ.

### Add or change translations

Keep shared interface text in `global.json`, homepage content in `home.json`,
and fun-fact content in `funfacts.json` inside each language folder under
`src/locales/`. Give every module its own `module.<namespace>.json` file in
both `en/` and `fr/`, and keep matching keys, arrays, and interpolation
placeholders. `npm run check:locales` checks resource file parity, JSON shape,
array lengths, and interpolation placeholders; `npm run build` runs this check
automatically. Use `useTranslation('home')`, `useTranslation('global')`, and
the module's namespace as appropriate. English resources define the TypeScript
translation-key types. Use i18next interpolation rather than concatenating
translated sentences.

To add another language, add its resource file, register it and its language code
in `src/app/i18n.ts`, and add its translated name and option to the language
selector in `src/components/layout/Navbar.tsx`.

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

Development tools (the gear menu: breakpoint guides, dark mode, module status,
state previews, intro tour, and resets) live in `src/components/development/`.
They render only when `VITE_ENVIRONMENT=development`, and the browser tab title
is then prefixed with `Dev | `. The variable is read at **build time**, so
change it in the Netlify environment settings and redeploy (clear the build
cache if needed). Set it to anything else, or remove it, for a public production
site. `.env.development` enables the tools for `npm run dev`. The breakpoint
badge toggles both vertical breakpoint guides and a
centered, translucent legend. The reusable `Dropdown` component powers the
language selector and supports keyboard navigation.

#### Source file headers

Add a short header to each hand-written source file. Keep the description,
usage, and notes brief. While the app foundation is being organized, set the
updated date to the created date. Later, change the single updated date for
meaningful changes; do not maintain a running list of update entries.

```tsx
/**
  File: FileName.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Briefly state the file's purpose.

  Usage:
  - Briefly state where or how it is used.

  Notes:
  - Add a short note when useful; otherwise write None.
 */
```

Use strict TypeScript, same-line opening braces, and Prettier formatting. Do not
put headers in JSON or generated files.

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
- Direct loading and refreshing `/modules/foxes-of-alberta-test` and
  `/modules/foxes-of-alberta-test/expedition`.
- Unknown URLs and module IDs, such as `/missing` and `/modules/missing`.
- Keyboard navigation, focus visibility, and the skip-to-content link.
- Loading feedback with a delayed activity request, and error recovery with a
  failed activity request (browser developer tools can simulate these).

## Deployment

Build with `npm ci && npm run build` and serve `dist/` from the site root using a
static host. **Configure an SPA fallback:** requests that do not match static
files must serve `index.html` with a successful response, so direct navigation to
`/modules/foxes-of-alberta-test/expedition` works. For example, an nginx location can use
`try_files $uri $uri/ /index.html;`. Keep real asset requests working normally.
Vite's development/preview servers provide the fallback locally; `npm run preview`
is not a production server.

This foundation intentionally has no authentication, backend, analytics, 3D
engine, Electron, or offline/PWA support. The only persistence is the
browser-local expedition journal.
