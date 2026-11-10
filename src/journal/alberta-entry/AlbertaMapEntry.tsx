/**
  File: AlbertaMapEntry.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Present locked and discovered Alberta places as permanent journal field notes.

  Usage:
  - Rendered by JournalModal independently of expedition pages.

  Notes:
  - Unlocked entries reuse each POI's owned information and media.
 */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { BASE_POI_LIST } from '@/mapping/POIs/BasePOIList'
import { useAlbertaDiscoveries } from '@/save-data/alberta-discoveries/useAlbertaDiscoveries'

export function AlbertaMapEntry({ onNavigate }: { onNavigate: () => void }) {
  const { t, i18n } = useTranslation('journal')
  const { t: mapT } = useTranslation('mapping')
  const { discoveries, isStorageAvailable } = useAlbertaDiscoveries()
  const completed = BASE_POI_LIST.filter((poi) =>
    Object.hasOwn(discoveries, poi.id),
  ).length

  return (
    <article className="space-y-5">
      <header className="space-y-2">
        <h3 className="text-2xl font-semibold">{t('alberta.title')}</h3>
        <p className="text-muted">{t('alberta.description')}</p>
        <p className="font-semibold">
          {t('alberta.progress', { completed, total: BASE_POI_LIST.length })}
        </p>
        <progress
          className="w-full accent-pine"
          value={completed}
          max={BASE_POI_LIST.length}
          aria-label={t('alberta.title')}
        />
        <Link className="button-secondary" to="/explore" onClick={onNavigate}>
          {t('alberta.explore')}
        </Link>
      </header>
      {!isStorageAvailable && (
        <p role="status" className="rounded-xl border border-flag p-3 text-sm">
          {t('storageUnavailable')}
        </p>
      )}
      <ul className="space-y-3">
        {BASE_POI_LIST.map((poi) => {
          const discovery = Object.hasOwn(discoveries, poi.id)
            ? discoveries[poi.id]
            : undefined
          const Content = poi.infoContent
          return (
            <li key={poi.id}>
              {discovery ? (
                <details className="rounded-xl border border-line p-4">
                  <summary className="min-h-12 cursor-pointer font-semibold">
                    {mapT(poi.titleKey)}
                    <span className="mt-1 block text-sm font-normal text-muted">
                      {t('alberta.visitedOn', {
                        date: new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                          dateStyle: 'medium',
                        }).format(new Date(discovery.firstVisitedAt)),
                      })}
                    </span>
                  </summary>
                  <div className="mt-3">
                    <Content />
                  </div>
                </details>
              ) : (
                <div className="rounded-xl border border-dashed border-line p-4">
                  <h4 className="font-semibold">{mapT(poi.titleKey)}</h4>
                  <p className="text-sm text-muted">{t('alberta.locked')}</p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </article>
  )
}
