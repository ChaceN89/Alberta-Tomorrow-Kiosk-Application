/**
  File: JournalDescription.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Show the wildlife journal introduction with its fox habitat image.

  Usage:
  - Lazy-rendered at the top of the wildlife expedition journal.

  Notes:
  - The image replaces the startup checkpoint's former journal attachment.
 */
import { useTranslation } from 'react-i18next'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { ModuleJournalDescriptionProps } from '@/modules/types'
import foxHabitatJournalImage from '../assets/cover-song.jpg'

export default function JournalDescription({
  description,
}: ModuleJournalDescriptionProps) {
  const { t } = useTranslation('wildlifeFinder')
  const { openImage } = useMediaViewer()

  return (
    <section className="space-y-3">
      <p className="text-muted">{description}</p>
      <button
        type="button"
        className="button-secondary p-2"
        aria-label={t('journal.openDescriptionImage')}
        onClick={(event) =>
          openImage(
            {
              title: t('journal.descriptionImageTitle'),
              description,
              alt: t('journal.descriptionImageAlt'),
              src: foxHabitatJournalImage,
            },
            { origin: event.currentTarget },
          )
        }
      >
        <img
          src={foxHabitatJournalImage}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-24 w-40 rounded object-cover"
        />
      </button>
    </section>
  )
}
