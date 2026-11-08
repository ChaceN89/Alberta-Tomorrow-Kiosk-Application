/**
  File: AcknowledgementsPage.tsx | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Credit the map, imagery, terrain, and mapping-library sources currently used.

  Usage:
  - Rendered at /credits.

  Notes:
  - Detailed Mapterhorn dataset credits remain linked to the provider's source list.
 */
import { useTranslation } from 'react-i18next'

export function AcknowledgementsPage() {
  const { t } = useTranslation('acknowledgements')

  return (
    <section aria-labelledby="acknowledgements-title" className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <h1 id="acknowledgements-title">{t('title')}</h1>
        <p className="text-lg text-muted">{t('intro')}</p>
        <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">
          {t('attributionNote')}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <section
          aria-labelledby="basemap-credits-title"
          className="space-y-3 rounded-xl border border-line bg-surface p-6"
        >
          <h2 id="basemap-credits-title">{t('sources.basemap.title')}</h2>
          <p className="text-muted">{t('sources.basemap.description')}</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <a
                className="text-link underline underline-offset-2"
                href="https://openfreemap.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('links.openFreeMap')}
              </a>
            </li>
            <li>
              <a
                className="text-link underline underline-offset-2"
                href="https://openmaptiles.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('links.openMapTiles')}
              </a>
            </li>
            <li>
              <a
                className="text-link underline underline-offset-2"
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('links.openStreetMap')}
              </a>
            </li>
          </ul>
        </section>

        <section
          aria-labelledby="imagery-credits-title"
          className="space-y-3 rounded-xl border border-line bg-surface p-6"
        >
          <h2 id="imagery-credits-title">{t('sources.imagery.title')}</h2>
          <p className="text-muted">{t('sources.imagery.description')}</p>
          <a
            className="text-link underline underline-offset-2"
            href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('links.esriWorldImagery')}
          </a>
        </section>

        <section
          aria-labelledby="terrain-credits-title"
          className="space-y-3 rounded-xl border border-line bg-surface p-6"
        >
          <h2 id="terrain-credits-title">{t('sources.terrain.title')}</h2>
          <p className="text-muted">{t('sources.terrain.description')}</p>
          <a
            className="text-link underline underline-offset-2"
            href="https://mapterhorn.com/attribution"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('links.mapterhornAttribution')}
          </a>
        </section>

        <section
          aria-labelledby="mapping-library-credits-title"
          className="space-y-3 rounded-xl border border-line bg-surface p-6"
        >
          <h2 id="mapping-library-credits-title">
            {t('sources.mappingLibrary.title')}
          </h2>
          <p className="text-muted">
            {t('sources.mappingLibrary.description')}
          </p>
          <a
            className="text-link underline underline-offset-2"
            href="https://maplibre.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('links.mapLibre')}
          </a>
        </section>
      </div>
    </section>
  )
}
