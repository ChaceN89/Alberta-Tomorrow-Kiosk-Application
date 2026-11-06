/**
  File: JournalEntryMediaList.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Render a journal entry's configured tracks and viewer attachments.

  Usage:
  - Rendered by RecordedJournalEntry for completed checkpoints.

  Notes:
  - Viewer copy is stored as translation keys in the module's namespace.
 */
import { useTranslation } from 'react-i18next'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { JournalEntryMedia } from '@/modules/types'
import type { LearningModule } from '@/modules/types'
import type { JournalEntry } from './types'

type JournalEntryMediaListProps = {
  entry: JournalEntry
  module: LearningModule
}

export function JournalEntryMediaList({
  entry,
  module,
}: JournalEntryMediaListProps) {
  const { t: tJournal, i18n } = useTranslation('journal')
  const { openImage, openMessage, openModel } = useMediaViewer()
  const translate = (key: string) =>
    i18n.t(key, { ns: module.translationNamespace, defaultValue: key })
  const getViewerLabel = (
    media: Exclude<JournalEntryMedia, { type: 'track' }>,
  ) => {
    if (media.type === 'message') {
      return tJournal('openMessage', { title: entry.title })
    }

    if (media.type === 'model') {
      return tJournal('openModel', { title: entry.title })
    }

    return tJournal('openImage', { title: entry.title })
  }

  const openViewer = (
    media: Exclude<JournalEntryMedia, { type: 'track' }>,
    origin: Element,
  ) => {
    if (media.type === 'image') {
      openImage(
        media.viewer
          ? {
              title: translate(media.viewer.title),
              description: translate(media.viewer.description),
              alt: translate(media.viewer.alt),
              src: media.src,
            }
          : {
              title: entry.title,
              description: entry.summary,
              alt: entry.imageAlt ?? '',
              src: media.src,
            },
        { origin },
      )
      return
    }

    if (media.type === 'message') {
      openMessage(
        {
          ...media.content,
          title: translate(media.content.title),
          subtitle: media.content.subtitle
            ? translate(media.content.subtitle)
            : undefined,
          message: translate(media.content.message),
          images: media.content.images?.map((image) => ({
            ...image,
            alt: translate(image.alt),
          })),
        },
        { origin },
      )
      return
    }

    openModel(
      {
        ...media.content,
        title: translate(media.content.title),
        description: media.content.description
          ? translate(media.content.description)
          : undefined,
      },
      { origin },
    )
  }

  return (
    <ul className="mt-3 flex flex-wrap items-center gap-3">
      {entry.media.map((media, index) => {
        const label = media.type === 'track' ? '' : getViewerLabel(media)
        const thumbnail =
          media.type === 'image'
            ? (media.thumbnail ?? media.src)
            : media.type === 'track'
              ? undefined
              : media.thumbnail

        return (
          <li key={`${entry.id}-media-${index}`}>
            {media.type === 'track' ? (
              <TrackPlayButton track={media.track} />
            ) : (
              <button
                type="button"
                className="button-secondary max-w-52 overflow-hidden"
                aria-label={label}
                onClick={(event) => openViewer(media, event.currentTarget)}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-40 rounded object-cover"
                  />
                ) : (
                  label
                )}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
