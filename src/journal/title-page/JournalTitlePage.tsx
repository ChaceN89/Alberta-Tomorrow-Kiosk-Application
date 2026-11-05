/**
  File: JournalTitlePage.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Explain how the expedition journal works and guide learners to browse modules.

  Usage:
  - Rendered by JournalModal as its title page.

  Notes:
  - Player-facing assets are listed separately from the journal instructions.
 */
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import logo from '@/assets/expedition.svg'
import aircraftPreviewUrl from '@/assets/plane/aircraft-preview.jpg'
import planeModelUrl from '@/assets/plane/GArt-Plane.fbx?url'
import planeTextureUrl from '@/assets/plane/GArt-Plane-texture.png'
import type { ModelViewerContent } from '@/module-tools/media-viewer/provider/types'
import { useMediaViewer } from '@/module-tools/media-viewer/hooks/useMediaViewer'
import { PlayerJournalAssetList } from './player-journal-assets/PlayerJournalAssetList'
import type { PlayerJournalAsset } from './player-journal-assets/ViewablePlayerJournalAsset'

//
type JournalTitlePageProps = {
  hasEntries: boolean
  onNavigate: () => void
}

export function JournalTitlePage({
  hasEntries,
  onNavigate,
}: JournalTitlePageProps) {
  // Translation and media viewer hooks
  const { t } = useTranslation('journal')
  const { openModel } = useMediaViewer()

  // Infoamtion about steps to use the jouranl - just for display purposes could be changed in the future
  const stepsId = useId()
  const assetsId = useId()
  const steps = t('about.steps', { returnObjects: true })

  // Define the 3D model content for the aircraft asset
  const aircraft: ModelViewerContent = {
    format: 'fbx',
    title: t('assets.planeTitle'),
    description: t('assets.planeDescription'),
    src: planeModelUrl,
    textureUrl: planeTextureUrl,
  }

  // Define the list of player-viewable assets for the journal
  const assets: PlayerJournalAsset[] = [
    {
      id: 'aircraft',
      title: t('assets.planeTitle'),
      description: t('assets.planeDescription'),
      previewSrc: aircraftPreviewUrl,
      ariaLabel: t('assets.openPlane'),
      onOpen: (origin) => openModel(aircraft, { origin }),
    },
  ]

  return (
    <article className="space-y-5">
      <div className="flex space-x-3.5">
        <header className="flex items-center gap-4">
          <img src={logo} alt="" className="size-16 shrink-0" />
        </header>
        <p className="text-muted">{t('about.description')}</p>
      </div>

      {/* Steps section for the journal's about information */}
      <section aria-labelledby={stepsId} className="space-y-3">
        <h4 id={stepsId} className="text-base font-semibold">
          {t('about.stepsHeading')}
        </h4>
        <ol className="list-decimal space-y-2 pl-6 text-muted">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Player-viewable assets section */}
      <section aria-labelledby={assetsId} className="space-y-3">
        <h4 id={assetsId} className="text-base font-semibold">
          {t('assets.heading')}
        </h4>
        <p className="text-muted">{t('assets.description')}</p>
        <PlayerJournalAssetList assets={assets} />
      </section>
      <p className="text-sm text-muted">{t('about.saved')}</p>
      {!hasEntries && (
        <div className="space-y-3 rounded-xl border border-dashed border-line p-4">
          <p className="font-semibold">{t('about.empty')}</p>
          <Link className="button" to="/" onClick={onNavigate}>
            {t('about.browse')}
          </Link>
        </div>
      )}
    </article>
  )
}
