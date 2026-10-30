/**
  File: registry.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Register discoverable activities/modules without eagerly importing them.

  Usage:
  - The module registry registers and lazy-loads activity components.

  Notes:
  - None.
 */
import { lazy } from 'react'
import foxHabitatJournalImage from './testing-foxes-of-alberta/assets/cover-song.jpg'
import foxFieldNoteJournalImage from './testing-foxes-of-alberta/assets/field-note.svg'
import geologyLandscapeJournalImage from './testing-geology/assets/natural-landscapes-journal.jpg'
import residentialSchoolBloodImage from './testing-residential-schools/assets/st-marys-landscape.jpg'
import residentialSchoolStAlbertImage from './testing-residential-schools/assets/st-albert-river-valley.jpg'
import residentialSchoolLesserSlaveLakeImage from './testing-residential-schools/assets/lesser-slave-lake.jpg'
import residentialSchoolChildrenImage from './testing-residential-schools/assets/blood-school-children.png'
import residentialSchoolStAlbertPhoto from './testing-residential-schools/assets/st-albert-school-photo.png'
import lesserSlaveLakeAudioCover from './testing-residential-schools/assets/lesser-slave-lake-audio-cover.jpg'
import {
  foxesOfAlbertaCheckpoints,
  foxFamilyImageCheckpoint,
  foxFieldListCheckpoint,
  foxFieldMessageCheckpoint,
} from './testing-foxes-of-alberta/checkpoints'
import { foxFamilyImage } from './testing-foxes-of-alberta/image'
import {
  foxFieldList,
  foxFieldMessage,
} from './testing-foxes-of-alberta/messages'
import { geologyCheckpoints } from './testing-geology/checkpoints'
import { preloadResidentialSchool } from './testing-residential-schools/preload'
import { residentialSchoolCheckpoints } from './testing-residential-schools/checkpoints'
import {
  bloodSchoolPhotoCheckpoint,
  lesserSlaveLakeAudioCheckpoint,
  stAlbertMessageCheckpoint,
  stAlbertVideoCheckpoint,
} from './testing-residential-schools/checkpoints'
import { residentialSchoolMapSettings } from './testing-residential-schools/mapSettings'
import { stAlbertSampleMessage } from './testing-residential-schools/messages'
import { stAlbertYouTubeThumbnail } from './testing-residential-schools/videos'
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
const loadResidentialSchoolJournalEntryAction = () =>
  import('./testing-residential-schools/JournalEntryAction')
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
      [foxFieldMessageCheckpoint]: foxFieldNoteJournalImage,
      [foxFieldListCheckpoint]: foxFieldNoteJournalImage,
      [foxFamilyImageCheckpoint]: foxFamilyImage.src,
    },
    journalEntryViewers: {
      [foxFieldMessageCheckpoint]: { type: 'message', ...foxFieldMessage },
      [foxFieldListCheckpoint]: { type: 'message', ...foxFieldList },
      [foxFamilyImageCheckpoint]: {
        type: 'image',
        title: foxFamilyImage.title,
        description: foxFamilyImage.description,
        alt: foxFamilyImage.alt,
      },
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
    map: residentialSchoolMapSettings,
    component: lazy(loadResidentialSchool),
    journalEntryImages: {
      'st-marys-blood': residentialSchoolBloodImage,
      'st-albert-youville': residentialSchoolStAlbertImage,
      'lesser-slave-lake': residentialSchoolLesserSlaveLakeImage,
      [bloodSchoolPhotoCheckpoint]: residentialSchoolChildrenImage,
      [stAlbertVideoCheckpoint]: stAlbertYouTubeThumbnail,
      [stAlbertMessageCheckpoint]: residentialSchoolStAlbertPhoto,
      [lesserSlaveLakeAudioCheckpoint]: lesserSlaveLakeAudioCover,
    },
    journalEntryViewers: {
      [bloodSchoolPhotoCheckpoint]: {
        type: 'image',
        title: 'activity.media.bloodPhoto.title',
        description: 'activity.media.bloodPhoto.description',
        alt: 'activity.media.bloodPhoto.alt',
      },
      [stAlbertMessageCheckpoint]: {
        type: 'message',
        ...stAlbertSampleMessage,
      },
    },
    journalEntryAction: lazy(loadResidentialSchoolJournalEntryAction),
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
