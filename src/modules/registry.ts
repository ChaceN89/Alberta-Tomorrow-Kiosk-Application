/**
  File: registry.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Register discoverable activities/modules without eagerly importing them.

  Usage:
  - The module registry registers and lazy-loads activity components.

  Notes:
  - None.
 */
import { lazy } from 'react'
import { geologyCheckpoints } from './geology/quiz'
import { preloadResidentialSchool } from './residential-school/preloadResidentialSchool'
import { residentialSchoolCheckpoints } from './residential-school/checkpoints'
import { wildlifeCheckpoints } from './wildlife-habitats/checkpoints'
import type { LearningModule } from './types'

const loadFindHabitat = () => import('./wildlife-habitats/FindHabitat')
const loadResidentialSchool = () =>
  import('./residential-school/ResidentialSchool')
const loadGeology = () => import('./geology/Geology')

export const modules: readonly LearningModule[] = [
  {
    id: 'wildlife-habitats',
    translationNamespace: 'wildlifeFinder',
    estimatedMinutes: 5,
    checkpoints: wildlifeCheckpoints,
    component: lazy(loadFindHabitat),
    loadActivity: loadFindHabitat,
  },
  {
    id: 'residential-school',
    translationNamespace: 'residentialSchool',
    estimatedMinutes: 3,
    checkpoints: residentialSchoolCheckpoints,
    component: lazy(loadResidentialSchool),
    loadActivity: loadResidentialSchool,
    preload: preloadResidentialSchool,
  },
  {
    id: 'geology',
    translationNamespace: 'geology',
    estimatedMinutes: 4,
    checkpoints: geologyCheckpoints,
    component: lazy(loadGeology),
    loadActivity: loadGeology,
  },
]
