/**
  File: PoiInfoImage.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Open a POI photograph in the shared media viewer without checkpoint effects.

  Usage:
  - Supply translated image content from base or module POI info components.

  Notes:
  - The thumbnail provides the viewer animation origin.
 */
import { useTranslation } from 'react-i18next'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import type { ImageViewerContent } from '@/module-tools/media-viewer/provider/types'

export function PoiInfoImage({ image }: { image: ImageViewerContent }) {
  const { t } = useTranslation('mapping')
  const { openImage } = useMediaViewer()

  return (
    <button
      type="button"
      className="block w-full rounded-lg"
      aria-label={t('view.defaultPoiInfo.openImage', { title: image.title })}
      onClick={(event) => openImage(image, { origin: event.currentTarget })}
    >
      <img src={image.src} alt={image.alt} className="mapping-poi-info-image" />
    </button>
  )
}
