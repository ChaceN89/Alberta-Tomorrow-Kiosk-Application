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
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import type { LearningModule } from '@/modules/types'
import { ExpeditionEntryActions } from './ExpeditionEntryActions'
import { ExpeditionEntryHeader } from './ExpeditionEntryHeader'
import { JournalEntryGroups } from './entries/JournalEntryGroups'
import type { JournalEntry } from './entries/types'

type ExpeditionEntryProps = {
  module: LearningModule
  onNavigate: () => void
}

// Connect this module's journal content, saved progress, and media actions.
export function ExpeditionEntry({ module, onNavigate }: ExpeditionEntryProps) {
  // Load journal copy from this module's translation namespace.
  const { t: tModule, i18n } = useTranslation(module.translationNamespace)
  // Use the shared viewer for pinned images, messages, and models.
  const { openImage, openMessage, openModel } = useMediaViewer()
  // Read the progress state used by both the header and entry rows.
  const { getExpeditionProgress, isCheckpointComplete } =
    useExpeditionProgress()

  const progress = getExpeditionProgress(module)
  const entries = tModule('journal.entries', { returnObjects: true })

  // Open the viewer configured for an entry, or use its image as the fallback.
  const openEntryMedia = (
    entry: JournalEntry,
    imageSrc: string,
    imageAlt: string,
    origin: Element,
  ) => {
    const viewer = module.journalEntryViewers?.[entry.id]
    // Viewer text in the registry is stored as keys in the module namespace.
    const translate = (key: string) =>
      i18n.t(key, { ns: module.translationNamespace, defaultValue: key })

    // Messages can include their own translated text and optional images.
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

    // Model definitions already use the shared model viewer content shape.
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

    // Images use custom viewer details when configured, otherwise entry copy.
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
