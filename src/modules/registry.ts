/**
  File: registry.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Nov 6, 2026

  Description:
  - List visible module ids and merge in definitions owned by each module.

  Usage:
  - The registry drives module cards, routes, journal metadata, and progress tools.

  Notes:
  - Keep user-facing module content and configuration in each module folder.
 */
import { foxesOfAlbertaModule } from './testing-foxes-of-alberta/module'
import { residentialSchoolsModule } from './testing-residential-schools/module'
import { geologyModule } from './testing-geology/module'
import { frankSlideModule } from './testing-frank-slide/module'
import type { LearningModule } from './types'

export const modules: readonly LearningModule[] = [
  {
    visible: true,
    id: 'frank-slide-test',
    ...frankSlideModule,
  },
  {
    visible: true,
    id: 'foxes-of-alberta-test',
    ...foxesOfAlbertaModule,
  },
  {
    visible: true,
    id: 'residential-schools-test',
    ...residentialSchoolsModule,
  },
  {
    visible: true,
    id: 'geology-test',
    ...geologyModule,
  },
]

export const visibleModules = modules.filter((module) => module.visible)
