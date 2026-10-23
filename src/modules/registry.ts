/**
 * File: registry.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Register discoverable activities/modules without eagerly importing them.
 * Dependencies: React lazy, shared module types.
 */
import { lazy } from 'react'
import { preloadResidentialSchool } from './residential-school/preloadResidentialSchool'
import type { LearningModule } from './types'

const loadFindHabitat = () => import('./wildlife-habitats/FindHabitat')
const loadResidentialSchool = () =>
  import('./residential-school/ResidentialSchool')

export const modules: readonly LearningModule[] = [
  {
    id: 'wildlife-habitats',
    translationNamespace: 'wildlifeFinder',
    estimatedMinutes: 5,
    component: lazy(loadFindHabitat),
    loadActivity: loadFindHabitat,
  },
  {
    id: 'residential-school',
    translationNamespace: 'residentialSchool',
    estimatedMinutes: 3,
    component: lazy(loadResidentialSchool),
    loadActivity: loadResidentialSchool,
    preload: preloadResidentialSchool,
  },
]
