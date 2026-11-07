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
import { MusicNoteIcon } from '@/components/icons/MusicNoteIcon'
import { VideoIcon } from '@/components/icons/VideoIcon'
import { TrackPlayButton } from '@/module-tools/media-player/components/TrackPlayButton'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { JournalEntryMedia } from '@/modules/types'
import type { LearningModule } from '@/modules/types'
import { PaperclipFrame } from '../PaperclipFrame'
import type { JournalEntry } from './types'

type JournalEntryMediaListProps = {
  entry: JournalEntry
  media: readonly JournalEntryMedia[]
  module: LearningModule
  alignment: 'left' | 'right'
  className?: string
}

export function JournalEntryMediaList({
  entry,
  media,
  module,
  alignment,
  className = '',
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
    <ul
      className={`flex max-w-full flex-wrap items-start gap-3 ${
        alignment === 'right' ? 'ml-auto justify-end' : 'justify-start'
      } ${className}`}
    >
      {media.map((item, index) => {
        const label = item.type === 'track' ? '' : getViewerLabel(item)
        const thumbnail =
          item.type === 'image'
            ? (item.thumbnail ?? item.src)
            : item.type === 'track'
              ? undefined
              : item.thumbnail

        return (
          <li key={`${entry.id}-media-${index}`} className="shrink-0">
            {item.type === 'track' ? (
              <div className="relative w-fit pt-4">
                <span
                  aria-hidden="true"
                  className="absolute -top-4 -right-4 text-pine"
                >
                  {item.track.type === 'audio' ? (
                    <MusicNoteIcon className="size-8" />
                  ) : (
                    <VideoIcon className="size-8" />
                  )}
                </span>
                <TrackPlayButton track={item.track} />
              </div>
            ) : (
              <PaperclipFrame>
                <button
                  type="button"
                  className="group block max-w-52 rounded-md p-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  aria-label={label}
                  onClick={(event) => openViewer(item, event.currentTarget)}
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-24 w-40 rounded-md object-cover -rotate-8 transition-transform duration-200 ease-out group-hover:-rotate-3 group-focus-visible:rotate-0 motion-reduce:transition-none"
                    />
                  ) : (
                    <span className="inline-flex min-h-12 items-center rounded-md bg-surface px-3 py-2 text-sm text-pine">
                      {label}
                    </span>
                  )}
                </button>
              </PaperclipFrame>
            )}
          </li>
        )
      })}
    </ul>
  )
}
