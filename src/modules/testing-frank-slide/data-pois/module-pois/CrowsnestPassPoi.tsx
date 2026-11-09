/**
  File: CrowsnestPassPoi.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Present Crowsnest Pass and the supplied mountain landscape photograph.

  Usage:
  - Rendered as the final POI in the Frank Slide expedition.

  Notes:
  - Opening the POI records exploration; viewing its image adds no checkpoint.
 */
import { useTranslation } from 'react-i18next'
import { PoiInfoImage } from '@/mapping/POIs/poi-components/PoiInfoImage'
import crowsnestPass from '../../assets/crowsnest-pass.png'

export function CrowsnestPassPoi() {
  const { t } = useTranslation('frankSlide')

  return (
    <div className="space-y-4">
      <p>{t('poi.crowsnestPass.description')}</p>
      <PoiInfoImage
        image={{
          src: crowsnestPass,
          title: t('poi.crowsnestPass.title'),
          description: t('poi.crowsnestPass.description'),
          alt: t('poi.crowsnestPass.imageAlt'),
        }}
      />
    </div>
  )
}
