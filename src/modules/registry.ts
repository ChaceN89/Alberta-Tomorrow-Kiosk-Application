/**
 * File: registry.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Register discoverable activities without eagerly importing them.
 * Dependencies: React lazy, shared module types.
 */
import { lazy } from 'react'
import type { LearningModule } from './types'

export const modules: readonly LearningModule[] = [
  {
    id: 'wildlife-habitats',
    titleKey: 'modules.wildlifeHabitats.title',
    descriptionKey: 'modules.wildlifeHabitats.description',
    category: 'wildlife',
    estimatedMinutes: 5,
    component: lazy(() => import('./wildlife-habitats/WildlifeHabitats')),
  },
]
