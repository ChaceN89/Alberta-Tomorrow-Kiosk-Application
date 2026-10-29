/**
  File: registry.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Register discoverable activities/modules without eagerly importing them.

  Usage:
  - The module registry registers and lazy-loads activity components.

  Notes:
  - None.
 */
import { lazy } from 'react'
import foxHabitatJournalImage from './testing-foxes-of-alberta/assets/cover-song.jpg'
import geologyLandscapeJournalImage from './testing-geology/assets/natural-landscapes-journal.jpg'
import { foxesOfAlbertaCheckpoints } from './testing-foxes-of-alberta/checkpoints'
import { geologyCheckpoints } from './testing-geology/checkpoints'
import { preloadResidentialSchool } from './testing-residential-schools/preload'
import { residentialSchoolCheckpoints } from './testing-residential-schools/checkpoints'
import type { LearningModule, ModulePreloadContext } from './types'

// importing all the modules into the appliction
const loadFoxesOfAlberta = () =>
  import('./testing-foxes-of-alberta/entry-FoxesOfAlberta')
const preloadFoxesOfAlberta = (context: ModulePreloadContext) =>
  import('./testing-foxes-of-alberta/preload').then(
    ({ preloadFoxesOfAlberta }) => preloadFoxesOfAlberta(context),
  )
const loadFoxesOfAlbertaJournalEntryAction = () =>
  import('./testing-foxes-of-alberta/components/JournalEntryAction')
const loadResidentialSchool = () =>
  import('./testing-residential-schools/entry-ResidentialSchool')
const loadGeology = () => import('./testing-geology/entry-Geology')

export const modules: readonly LearningModule[] = [
  {
    visible: true,
    id: 'foxes-of-alberta-test',
    translationNamespace: 'wildlifeFinder',
    estimatedMinutes: 5,
    checkpoints: foxesOfAlbertaCheckpoints,
    component: lazy(loadFoxesOfAlberta),
    journalEntryImages: {
      'habitats-matter': foxHabitatJournalImage,
    },
    journalEntryAction: lazy(loadFoxesOfAlbertaJournalEntryAction),
    loadActivity: loadFoxesOfAlberta,
    preload: preloadFoxesOfAlberta,
  },
  {
    visible: true,
    id: 'residential-schools-test',
    translationNamespace: 'residentialSchool',
    estimatedMinutes: 3,
    checkpoints: residentialSchoolCheckpoints,
    component: lazy(loadResidentialSchool),
    loadActivity: loadResidentialSchool,
    preload: preloadResidentialSchool,
  },
  {
    visible: true,
    id: 'geology-test',
    translationNamespace: 'geology',
    estimatedMinutes: 4,
    checkpoints: geologyCheckpoints,
    component: lazy(loadGeology),
    journalEntryImages: {
      'geology-video-started': geologyLandscapeJournalImage,
      'geology-quiz-completed': geologyLandscapeJournalImage,
    },
    loadActivity: loadGeology,
  },
]

export const visibleModules = modules.filter((module) => module.visible)
