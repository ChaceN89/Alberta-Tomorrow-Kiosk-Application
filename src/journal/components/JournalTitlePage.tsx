/**
  File: JournalTitlePage.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Explain how the expedition journal works and guide learners to browse modules.

  Usage:
  - Rendered on the title page of JournalModal.

  Notes:
  - None.
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

type JournalTitlePageProps = {
  hasEntries: boolean
  onNavigate: () => void
}

export function JournalTitlePage({
  hasEntries,
  onNavigate,
}: JournalTitlePageProps) {
  const { t } = useTranslation('journal')
  const { openModel } = useMediaViewer()
  const stepsId = useId()
  const assetsId = useId()
  const steps = t('about.steps', { returnObjects: true })
  const aircraft: ModelViewerContent = {
    format: 'fbx',
    title: t('assets.planeTitle'),
    description: t('assets.planeDescription'),
    src: planeModelUrl,
    textureUrl: planeTextureUrl,
  }

  return (
    <article className="space-y-5">
      <header className="flex items-center gap-4">
        <img src={logo} alt="" className="size-16 shrink-0" />
      </header>
      <p className="text-muted">{t('about.description')}</p>
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
      <section aria-labelledby={assetsId} className="space-y-3">
        <h4 id={assetsId} className="text-base font-semibold">
          {t('assets.heading')}
        </h4>
        <p className="text-muted">{t('assets.description')}</p>
        <div className="flex w-full max-w-xl items-center gap-4 rounded-xl border border-line bg-surface p-3">
          <div className="shrink-0">
            <button
              type="button"
              className="block rounded-xl focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus"
              aria-label={t('assets.openPlane')}
              onClick={(event) =>
                openModel(aircraft, { origin: event.currentTarget })
              }
            >
              <img
                src={aircraftPreviewUrl}
                alt=""
                className="h-24 w-32 rounded-xl object-cover"
              />
            </button>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-pine">{t('assets.planeTitle')}</p>
            <p className="text-sm text-muted">{t('assets.planeDescription')}</p>
          </div>
        </div>
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
