# Alberta Tomorrow conventions

- Use Vite, React, strict TypeScript, React Router, and React's built-in state.
  Keep this a single npm application; commit the lockfile.
- `src/app/` owns initialization, routing, and pages. `src/components/` contains
  shared UI. Keep each activity's components and logic in its own `src/modules/`
  folder.
- Register activities in `src/modules/registry.ts` using `LearningModule` metadata
  and `React.lazy`. Export each activity component as default. The registry drives
  home cards and `/modules/:moduleId`; don't add a separate route per activity.
- Put all interface copy, including accessible labels, in both
  `src/locales/en/translation.json` and `src/locales/fr/translation.json`. Use
  `useTranslation`; English resources define typed keys. Preserve key parity.
- Tailwind 4 uses the Vite plugin and the CSS-first theme in
  `src/styles/global.css`. Reuse those tokens; do not introduce legacy Tailwind
  or PostCSS configuration.
- Keep controls touch-friendly, semantic, keyboard accessible, and visibly
  focusable. Preserve loading, not-found, and error recovery paths.
- Use same-line opening braces and Prettier. Hand-written source files require
  a short filename, author (Chace Nielson), created date, updated date, description,
  and dependencies/notes header. Do not add headers to JSON or generated files.
- Use Node 22.13+ (22.x) or 24+. Validate with `npm run typecheck`,
  `npm run lint`, `npm run format:check`, and `npm run build`. No automated test
  framework exists yet; manually verify both languages and activity interactions.
- Keep scope small. Do not add authentication, backend services, persistence,
  analytics, external state libraries, 3D, Electron, or PWA support unless requested.
