/**
  File: LundbreckFallsPoi.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Present Lundbreck Falls and the supplied waterfall photograph.

  Usage:
  - Rendered in the Frank Slide expedition's map info panel.

  Notes:
  - Opening the POI records exploration; no additional interactions are required.
 */
import { useTranslation } from 'react-i18next'
import { PoiInfoImage } from '@/mapping/POIs/poi-components/PoiInfoImage'
import lundbreckFalls from '../../assets/lundbreck-falls.png'

export function LundbreckFallsPoi() {
  const { t } = useTranslation('frankSlide')

  return (
    <div className="space-y-4">
      <p>{t('poi.lundbreckFalls.description')}</p>
      <PoiInfoImage
        image={{
          src: lundbreckFalls,
          alt: t('poi.lundbreckFalls.imageAlt'),
          title: t('poi.lundbreckFalls.title'),
          description: t('poi.lundbreckFalls.description'),
        }}
      />
    </div>
  )
}
