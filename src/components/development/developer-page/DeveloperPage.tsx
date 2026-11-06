/**
  File: DeveloperPage.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Showcase the shared module tools with working examples.

  Usage:
  - Rendered only by the development-only /developer-page route.

  Notes:
  - Individual examples live in separate components beside this page.
 */
import { useTranslation } from 'react-i18next'
import { MapInfoPanelExample } from './MapInfoPanelExample'
import { MediaPlayerExamples } from './MediaPlayerExamples'
import { MediaViewerExamples } from './MediaViewerExamples'

export function DeveloperPage() {
  const { t } = useTranslation('development')

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-semibold text-pine">{t('moduleTools')}</p>
        <h1>{t('developerPageTitle')}</h1>
        <p className="text-lg text-muted">{t('developerPageDescription')}</p>
      </header>
      <MediaPlayerExamples />
      <MediaViewerExamples />
      <MapInfoPanelExample />
    </div>
  )
}
