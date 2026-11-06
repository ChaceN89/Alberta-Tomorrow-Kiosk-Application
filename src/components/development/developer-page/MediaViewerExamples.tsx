/**
  File: MediaViewerExamples.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Exercise message, image, and 3D model content in the shared media viewer.

  Usage:
  - Rendered by DeveloperPage inside the app's MediaViewerProvider.

  Notes:
  - The image and model use assets already included by the wildlife and geology modules.
 */
import { useTranslation } from 'react-i18next'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import { oilBarrelModelAssets } from '@/modules/testing-geology/data/models'
import foxFamilyImage from '@/modules/testing-foxes-of-alberta/assets/fox-family.png'

export function MediaViewerExamples() {
  const { t } = useTranslation('development')
  const { openImage, openMessage, openModel } = useMediaViewer()

  return (
    <section
      aria-labelledby="developer-media-viewer-title"
      className="space-y-4"
    >
      <div className="space-y-2">
        <h2 id="developer-media-viewer-title">{t('mediaViewerExamples')}</h2>
        <p className="text-muted">{t('mediaViewerExamplesDescription')}</p>
      </div>
      <div className="panel flex flex-wrap gap-3 p-5 md:p-6">
        <button
          type="button"
          className="button"
          onClick={(event) =>
            openMessage(
              {
                title: t('viewerMessageTitle'),
                subtitle: t('viewerMessageSubtitle'),
                message: t('viewerMessageBody'),
              },
              { origin: event.currentTarget },
            )
          }
        >
          {t('openMessageExample')}
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={(event) =>
            openImage(
              {
                title: t('viewerImageTitle'),
                description: t('viewerImageDescription'),
                src: foxFamilyImage,
                alt: t('viewerImageAlt'),
              },
              { origin: event.currentTarget },
            )
          }
        >
          {t('openImageExample')}
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={(event) =>
            openModel(
              {
                ...oilBarrelModelAssets,
                title: t('viewerModelTitle'),
                description: t('viewerModelDescription'),
              },
              { origin: event.currentTarget },
            )
          }
        >
          {t('openModelExample')}
        </button>
      </div>
    </section>
  )
}
