/**
  File: DefaultExploreMap.tsx | Author: Chace Nielson
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
import { ExploreMapNavigation } from './components/ExploreMapNavigation'

export function DefaultExploreMap() {
  const { t } = useTranslation('mapping')

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <AlbertaMap ariaLabel={t('mapLabel')} />
      <section
        aria-labelledby="explore-title"
        className="panel absolute top-20 left-4 w-[calc(100%-2rem)] max-w-sm space-y-2 bg-surface/95 p-4 shadow-xl backdrop-blur"
      >
        <h1 id="explore-title" className="text-2xl">
          {t('title')}
        </h1>
      </section>
      <ExploreMapNavigation />
    </main>
  )
}
