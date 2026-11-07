/**
  File: ExploreMapNavBar.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Provide map navigation, module links, and journal access outside the map.

  Usage:
  - Rendered by the default and module-specific explore map views.

  Notes:
  - Module links are shown only when the map belongs to a module.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ActivityIcon } from '@/components/icons/ActivityIcon'
import { HomeIcon } from '@/components/icons/HomeIcon'
import { JournalIcon } from '@/components/icons/JournalIcon'
import { MapIcon } from '@/components/icons/MapIcon'
import { MapResetIcon } from '@/components/icons/MapResetIcon'
import { OverviewIcon } from '@/components/icons/OverviewIcon'
import { Tooltip } from '@/components/shared/Tooltip'
import { useJournal } from '@/journal/context/useJournal'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import { modules, visibleModules } from '@/modules/registry'
import { getModuleExplorePath, getModuleOverviewPath } from '@/modules/routes'
import { useMapControls } from './MapControlsContext'

type ExploreMapNavigationProps = {
  moduleId?: string
  activityPath?: string
}

export function ExploreMapNavBar({
  moduleId,
  activityPath,
}: ExploreMapNavigationProps) {
  const { t, i18n } = useTranslation('mapping')
  const { t: tJournal } = useTranslation('journal')
  const { openJournal } = useJournal()
  const { isMapReady, isStyleLoading, isTerrainTransitioning, onResetMapView } =
    useMapControls()
  const { progress } = useExpeditionProgress()
  const [isOpen, setIsOpen] = useState(false)
  const navigationId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const navigationRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return

    navigationRef.current?.querySelector<HTMLElement>('a')?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  const closeNavigation = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const navigationLinkClassName =
    'group flex min-h-12 items-center gap-3 rounded-xl px-4 font-semibold text-ink transition duration-150 ease-out hover:-translate-y-0.5 hover:bg-canvas hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine motion-reduce:transform-none motion-reduce:transition-none'
  const currentNavigationItemClassName =
    'flex min-h-12 cursor-default items-center gap-3 rounded-xl bg-canvas px-4 font-semibold text-pine'
  const currentModule = modules.find((module) => module.id === moduleId)
  const currentModuleName = currentModule
    ? i18n.t(currentModule.titleKey, {
        ns: currentModule.translationNamespace,
      })
    : undefined
  const startedMapModules = visibleModules.filter(
    (module) =>
      module.id !== moduleId && module.map && progress[module.id] !== undefined,
  )

  return (
    <>
      <div className="absolute top-4 left-4 z-(--z-content-popover) flex flex-col items-start gap-2">
        <Tooltip
          text={isOpen ? t('navigation.close') : t('navigation.open')}
          placement="right"
        >
          <button
            ref={triggerRef}
            type="button"
            className="flex size-12 items-center justify-center rounded-full border border-line bg-surface text-pine shadow-lg hover:bg-canvas"
            aria-label={isOpen ? t('navigation.close') : t('navigation.open')}
            aria-expanded={isOpen}
            aria-controls={navigationId}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="size-6"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="size-6"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </Tooltip>
        <Tooltip text={tJournal('openLabel')} placement="right">
          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-full border border-line bg-surface text-pine shadow-lg hover:bg-canvas"
            aria-label={tJournal('openLabel')}
            onClick={() => openJournal(moduleId)}
          >
            <JournalIcon className="size-6" />
          </button>
        </Tooltip>
        <Tooltip text={t('navigation.resetView')} placement="right">
          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-full border border-line bg-surface text-pine shadow-lg hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t('navigation.resetView')}
            disabled={!isMapReady || isStyleLoading || isTerrainTransitioning}
            onClick={onResetMapView}
          >
            <MapResetIcon className="size-6" />
          </button>
        </Tooltip>
        {activityPath && (
          <Tooltip text={t('navigation.moduleActivity')} placement="right">
            <Link
              to={activityPath}
              className="flex size-12 items-center justify-center rounded-full border border-line bg-surface text-pine shadow-lg hover:bg-canvas"
              aria-label={t('navigation.moduleActivity')}
            >
              <ActivityIcon className="size-6" />
            </Link>
          </Tooltip>
        )}
      </div>

      <div
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute inset-0 z-(--z-content-popover) ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label={t('navigation.close')}
          className={`absolute inset-0 bg-ink/35 transition-opacity motion-reduce:transition-none ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeNavigation}
        />
        <nav
          ref={navigationRef}
          id={navigationId}
          aria-label={t('navigation.label')}
          className={`absolute inset-y-0 left-0 flex w-[min(21rem,calc(100%-2.5rem))] flex-col border-r border-line bg-surface p-5 shadow-2xl transition-transform motion-reduce:transition-none ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl">{t('title')}</h2>
            <button
              type="button"
              className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl text-muted hover:bg-canvas"
              aria-label={t('navigation.close')}
              onClick={closeNavigation}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={navigationLinkClassName}
                  onClick={() => setIsOpen(false)}
                >
                  <HomeIcon className="size-5 shrink-0 text-pine" />
                  <span>{t('navigation.home')}</span>
                </Link>
              </li>
              <li>
                {moduleId ? (
                  <Link
                    to="/explore"
                    className={navigationLinkClassName}
                    onClick={() => setIsOpen(false)}
                  >
                    <MapIcon className="size-5 shrink-0 text-pine" />
                    <span>{t('navigation.defaultMap')}</span>
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className={currentNavigationItemClassName}
                  >
                    <MapIcon className="size-5 shrink-0" />
                    <span>{t('navigation.defaultMap')}</span>
                  </span>
                )}
              </li>
            </ul>

            {moduleId && currentModule && currentModuleName && (
              <section
                aria-labelledby={`${navigationId}-current-expedition`}
                className="mt-6 border-t border-line pt-5"
              >
                <h3
                  id={`${navigationId}-current-expedition`}
                  className="mb-2 px-4 text-sm font-bold text-pine"
                >
                  {t('navigation.currentExpedition', {
                    moduleName: currentModuleName,
                  })}
                </h3>
                <ul className="space-y-2">
                  {activityPath && (
                    <li>
                      <Link
                        to={activityPath}
                        className={navigationLinkClassName}
                        onClick={() => setIsOpen(false)}
                      >
                        <ActivityIcon className="size-5 shrink-0 text-pine" />
                        <span>{t('navigation.expeditionActivity')}</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to={getModuleOverviewPath(moduleId)}
                      className={navigationLinkClassName}
                      onClick={() => setIsOpen(false)}
                    >
                      <OverviewIcon className="size-5 shrink-0 text-pine" />
                      <span>{t('navigation.expeditionOverview')}</span>
                    </Link>
                  </li>
                </ul>
              </section>
            )}

            {startedMapModules.length > 0 && (
              <section
                aria-labelledby={`${navigationId}-expeditions`}
                className="mt-6 border-t border-line pt-5"
              >
                <h3
                  id={`${navigationId}-expeditions`}
                  className="mb-2 px-4 text-xs font-bold uppercase tracking-wide text-muted"
                >
                  {t('navigation.expeditions')}
                </h3>
                <ul className="space-y-2">
                  {startedMapModules.map((module) => {
                    const ModuleIcon = module.icon
                    const moduleName = i18n.t(module.titleKey, {
                      ns: module.translationNamespace,
                    })

                    return (
                      <li key={module.id}>
                        <Link
                          to={getModuleExplorePath(module.id)}
                          className={navigationLinkClassName}
                          onClick={() => setIsOpen(false)}
                        >
                          <ModuleIcon className="size-6 shrink-0 text-pine" />
                          <span>
                            {t('navigation.expeditionMap', { moduleName })}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
