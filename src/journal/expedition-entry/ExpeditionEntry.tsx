/**
  File: ExpeditionEntry.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Render a module's journal summary, recorded entries, and navigation actions.

  Usage:
  - Rendered as a journal page by JournalModal.

  Notes:
  - Entry copy comes from module locales; image and viewer mappings come from the registry.
 */
import { useTranslation } from 'react-i18next'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { ModelViewerContent } from '@/module-tools/media-viewer/provider/types'
import { useExpeditionProgress } from '@/save-data/useExpeditionProgress'
import type { LearningModule } from '@/modules/types'
import { ExpeditionEntryActions } from './ExpeditionEntryActions'
import { ExpeditionEntryHeader } from './ExpeditionEntryHeader'
import { JournalEntryGroups } from './entries/JournalEntryGroups'
import type { JournalEntry } from './entries/types'

type ExpeditionEntryProps = {
  module: LearningModule
  onNavigate: () => void
}

export function ExpeditionEntry({ module, onNavigate }: ExpeditionEntryProps) {
  const { t: tModule, i18n } = useTranslation(module.translationNamespace)
  const { openImage, openMessage, openModel } = useMediaViewer()
  const { getExpeditionProgress, isCheckpointComplete } =
    useExpeditionProgress()
  const progress = getExpeditionProgress(module)
  const entries = tModule('journal.entries', { returnObjects: true })

  const openEntryMedia = (
    entry: JournalEntry,
    imageSrc: string,
    imageAlt: string,
    origin: Element,
  ) => {
    const viewer = module.journalEntryViewers?.[entry.id]
    const translate = (key: string) =>
      i18n.t(key, { ns: module.translationNamespace, defaultValue: key })

    if (viewer?.type === 'message') {
      openMessage(
        {
          title: translate(viewer.title),
          subtitle: viewer.subtitle ? translate(viewer.subtitle) : undefined,
          message: translate(viewer.message),
          images: viewer.images?.map((image) => ({
            src: image.src,
            alt: translate(image.alt),
          })),
        },
        { origin },
      )
      return
    }

    if (viewer?.type === 'model') {
      const model: ModelViewerContent = viewer
      openModel(
        {
          ...model,
          title: translate(viewer.title),
          description: viewer.description
            ? translate(viewer.description)
            : undefined,
        },
        { origin },
      )
      return
    }

    openImage(
      viewer
        ? {
            title: translate(viewer.title),
            description: translate(viewer.description),
            alt: translate(viewer.alt),
            src: imageSrc,
          }
        : {
            title: entry.title,
            description: entry.summary,
            alt: imageAlt,
            src: imageSrc,
          },
      { origin },
    )
  }

  return (
    <article className="space-y-5">
      <ExpeditionEntryHeader module={module} progress={progress} />
      <p className="text-muted">{tModule('journal.summary')}</p>
      <JournalEntryGroups
        module={module}
        entries={entries}
        isCheckpointComplete={isCheckpointComplete}
        onOpenEntryMedia={openEntryMedia}
      />
      <ExpeditionEntryActions
        moduleId={module.id}
        progress={progress}
        onNavigate={onNavigate}
      />
    </article>
  )
}
