/**
  File: ViewerExamples.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Demonstrate message and image content in the shared media viewer.
  - Record each configured journal checkpoint when its content is opened.

  Usage:
  - Rendered in the activity view of entry-FoxesOfAlberta.

  Notes:
  - Content and interface copy are localized in module.wildlifeFinder.json.
 */
import { useTranslation } from 'react-i18next'
import { useMediaViewer } from '@/module-tools/media-viewer/useMediaViewer'
import type { ModuleCheckpointProps } from '@/modules/types'
import {
  foxFamilyImageCheckpoint,
  foxFieldMessageCheckpoint,
} from '@/modules/testing-foxes-of-alberta/checkpoints'
import { foxFamilyImage } from '@/modules/testing-foxes-of-alberta/image'
import { foxFieldMessage } from '@/modules/testing-foxes-of-alberta/messages'

type ViewerExamplesProps = ModuleCheckpointProps

export function ViewerExamples({ completeCheckpoint }: ViewerExamplesProps) {
  const { t } = useTranslation('wildlifeFinder')
  const { openImage, openMessage } = useMediaViewer()

  return (
    <section aria-labelledby="viewer-examples-title" className="space-y-4">
      <div className="space-y-2">
        <h2 id="viewer-examples-title">{t('viewer.heading')}</h2>
        <p className="text-muted">{t('viewer.description')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="panel flex flex-col items-start gap-4 p-5 md:p-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {t(foxFieldMessage.title)}
            </h3>
            <p className="text-muted">{t('viewer.message.preview')}</p>
          </div>
          <button
            type="button"
            className="button mt-auto"
            onClick={() =>
              openMessage(
                {
                  title: t(foxFieldMessage.title),
                  subtitle: t(foxFieldMessage.subtitle),
                  message: t(foxFieldMessage.message),
                },
                () => completeCheckpoint(foxFieldMessageCheckpoint),
              )
            }
          >
            {t('viewer.message.open')}
          </button>
        </article>
        <article className="panel flex flex-col items-start gap-4 p-5 md:p-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{t(foxFamilyImage.title)}</h3>
            <p className="text-muted">{t('viewer.image.preview')}</p>
          </div>
          <button
            type="button"
            className="button mt-auto"
            onClick={() =>
              openImage(
                {
                  title: t(foxFamilyImage.title),
                  description: t(foxFamilyImage.description),
                  alt: t(foxFamilyImage.alt),
                  src: foxFamilyImage.src,
                },
                () => completeCheckpoint(foxFamilyImageCheckpoint),
              )
            }
          >
            {t('viewer.image.open')}
          </button>
        </article>
      </div>
    </section>
  )
}
