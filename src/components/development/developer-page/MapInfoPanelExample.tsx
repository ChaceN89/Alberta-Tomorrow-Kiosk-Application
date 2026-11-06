/**
  File: MapInfoPanelExample.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Open a sample map info panel without requiring an active map.

  Usage:
  - Rendered by DeveloperPage inside the app's MapInfoPanelProvider.

  Notes:
  - The shared panel provider owns the popout state and rendering.
 */
import { useTranslation } from 'react-i18next'
import { useMapInfoPanel } from '@/module-tools/map-info-panel/hooks/useMapInfoPanel'

export function MapInfoPanelExample() {
  const { t } = useTranslation('development')
  const { openPanel } = useMapInfoPanel()

  return (
    <section aria-labelledby="developer-map-info-title" className="space-y-4">
      <div className="space-y-2">
        <h2 id="developer-map-info-title">{t('mapInfoExample')}</h2>
        <p className="text-muted">{t('mapInfoExampleDescription')}</p>
      </div>
      <div className="panel p-5 md:p-6">
        <button
          type="button"
          className="button"
          onClick={(event) =>
            openPanel(
              {
                title: t('mapInfoSampleTitle'),
                content: <p>{t('mapInfoSampleBody')}</p>,
              },
              { origin: event.currentTarget },
            )
          }
        >
          {t('openMapInfoExample')}
        </button>
      </div>
    </section>
  )
}
