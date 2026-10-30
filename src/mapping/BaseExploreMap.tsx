/**
  File: BaseExploreMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Show the Alberta map with the default explore heading.

  Usage:
  - Rendered at /explore.

  Notes:
  - Shared map behavior is provided by AlbertaMap.
 */
import { useTranslation } from 'react-i18next'
import { AlbertaMap } from './AlbertaMap'
import { MapActionControls } from './components/MapActionControls'
import { ExploreMapNavBar } from './components/ExploreMapNavBar'
import { MapControls } from './components/MapControls'

export function BaseExploreMap() {
  const { t } = useTranslation('mapping')

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <AlbertaMap ariaLabel={t('mapLabel')}>
        <MapControls />
        <MapActionControls />
      </AlbertaMap>
      <ExploreMapNavBar />
    </main>
  )
}
