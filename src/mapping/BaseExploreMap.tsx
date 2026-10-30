/**
  File: BaseExploreMap.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026 - CN - Add the bottom-left map actions.

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
        <section
          aria-labelledby="explore-title"
          className="panel absolute top-20 left-4 z-(--z-content-popover) max-h-[calc(100dvh-6rem)] w-[calc(100%-2rem)] max-w-sm space-y-2 overflow-y-auto bg-surface/95 p-4 shadow-xl backdrop-blur"
        >
          <h1 id="explore-title" className="text-2xl">
            {t('title')}
          </h1>
          <MapControls />
        </section>
        <MapActionControls />
      </AlbertaMap>
      <ExploreMapNavBar />
    </main>
  )
}
