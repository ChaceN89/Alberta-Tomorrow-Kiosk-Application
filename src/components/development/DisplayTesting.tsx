/**
 * File: DisplayTesting.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Provide a development-only menu for app and module testing.
 * Dependencies: React Router, react-i18next, module preload context.
 */
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useJournal } from '../../journal/useJournal'
import { useModulePreload } from '../../modules/useModulePreload'
import { ApplicationStatePanel } from './panels/ApplicationStatePanel'
import { IntroTourPanel } from './panels/IntroTourPanel'
import { ModuleStatusPanel } from './panels/ModuleStatusPanel'
import { ResetConfirmPanel } from './panels/ResetConfirmPanel'
import { DarkModeTestingToggle } from './DarkModeTestingToggle'
import { TailwindBreakPoints } from './TailwindBreakPoints'
import { getCurrentBreakpoint } from './breakpoints'
import { resetSite } from './resetSite'

type ActivePanel = 'modules' | 'states' | 'tour' | null
type PendingReset = 'journal' | 'site' | null
type BreakpointMode = 'off' | 'guides' | 'indicator'

export function DisplayTesting() {
  const isDevelopment =
    import.meta.env.DEV && import.meta.env.VITE_ENVIRONMENT === 'development'
  const { t } = useTranslation('development')
  const { t: tGlobal, i18n } = useTranslation('global')
  const { state: preloadState } = useModulePreload()
  const { resetJournal } = useJournal()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [pendingReset, setPendingReset] = useState<PendingReset>(null)
  const [breakpointMode, setBreakpointMode] = useState<BreakpointMode>('off')
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth)
  const currentLanguage = i18n.resolvedLanguage ?? 'en'
  const currentBreakpoint = getCurrentBreakpoint(viewportWidth)

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth)

    window.addEventListener('resize', updateViewportWidth)
    return () => window.removeEventListener('resize', updateViewportWidth)
  }, [])

  // Escape closes the innermost open layer: confirmation or panel, then the menu.
  useEffect(() => {
    if (!menuOpen && !activePanel && !pendingReset) return

    const closeOnEscape = (event: KeyboardEvent) => {
      // Modal dialogs (journal, intro tour) handle their own Escape key.
      if (event.key !== 'Escape' || document.querySelector('dialog[open]')) {
        return
      }

      event.preventDefault()

      if (pendingReset || activePanel) {
        setPendingReset(null)
        setActivePanel(null)
        setMenuOpen(true)
      } else {
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [activePanel, menuOpen, pendingReset])

  if (!isDevelopment) return null

  const toggleTools = () => {
    setMenuOpen((open) => !open)
    setActivePanel(null)
    setPendingReset(null)
  }

  const openPanel = (panel: Exclude<ActivePanel, null>) => {
    setActivePanel(panel)
    setMenuOpen(false)
  }

  const closePanel = () => {
    setActivePanel(null)
    setMenuOpen(true)
  }

  const closeAllTools = () => {
    setActivePanel(null)
    setMenuOpen(false)
  }

  const askToReset = (reset: Exclude<PendingReset, null>) => {
    setMenuOpen(false)
    setActivePanel(null)
    setPendingReset(reset)
  }

  const cancelReset = () => {
    setPendingReset(null)
    setMenuOpen(true)
  }

  const confirmReset = () => {
    if (pendingReset === 'journal') {
      resetJournal()
      toast(t('journalReset'), { id: 'journal-reset' })
    } else if (pendingReset === 'site') {
      resetSite()
    }

    setPendingReset(null)
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-100 flex flex-col items-end gap-2">
        <button
          type="button"
          aria-label={t(
            menuOpen || activePanel || pendingReset
              ? 'closeTools'
              : 'openTools',
          )}
          aria-expanded={menuOpen}
          aria-haspopup="true"
          className="flex size-12 items-center justify-center rounded-full bg-gray-800 text-xl text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          onClick={toggleTools}
        >
          <span aria-hidden="true">
            {menuOpen || activePanel || pendingReset ? '×' : '⚙'}
          </span>
        </button>
        {menuOpen && (
          <nav
            aria-label={t('tools')}
            className="max-h-[calc(100dvh-6rem)] w-72 origin-top-right animate-[development-menu-enter_180ms_ease-out_both] space-y-2 overflow-y-auto rounded-2xl border border-line bg-surface/75 p-3 text-ink shadow-xl backdrop-blur-md motion-reduce:animate-none"
          >
            <p className="px-2 pb-1 text-sm font-semibold text-muted">
              {t('tools')}
            </p>
            <button
              type="button"
              aria-pressed={breakpointMode !== 'off'}
              aria-label={t(`breakpointMode.${breakpointMode}`)}
              className="dev-tool-menu-button"
              onClick={() =>
                setBreakpointMode((mode) =>
                  mode === 'off'
                    ? 'guides'
                    : mode === 'guides'
                      ? 'indicator'
                      : 'off',
                )
              }
            >
              <span aria-hidden="true">⌗</span>
              {t(`breakpointMode.${breakpointMode}`)}
            </button>
            <DarkModeTestingToggle />
            <button
              type="button"
              role="menuitem"
              className="dev-tool-menu-button"
              onClick={() => openPanel('modules')}
            >
              <span aria-hidden="true">◉</span>
              {t('modules')}
            </button>
            <button
              type="button"
              role="menuitem"
              className="dev-tool-menu-button"
              onClick={() => openPanel('states')}
            >
              <span aria-hidden="true">▶</span>
              {t('applicationStates')}
            </button>
            <button
              type="button"
              className="dev-tool-menu-button"
              onClick={() => openPanel('tour')}
            >
              <span aria-hidden="true">?</span>
              {t('introTour')}
            </button>
            <button
              type="button"
              className="dev-tool-menu-button"
              onClick={() => askToReset('journal')}
            >
              <span aria-hidden="true">↺</span>
              {t('resetJournal')}
            </button>
            <button
              type="button"
              className="dev-tool-menu-button"
              onClick={() => askToReset('site')}
            >
              <span aria-hidden="true">⚠</span>
              {t('resetSite')}
            </button>
            <button
              type="button"
              role="menuitem"
              className="dev-tool-menu-button"
              aria-label={t('switchLanguage', {
                language: tGlobal(
                  currentLanguage === 'en' ? 'language.fr' : 'language.en',
                ),
              })}
              onClick={() =>
                void i18n.changeLanguage(currentLanguage === 'en' ? 'fr' : 'en')
              }
            >
              <span aria-hidden="true">文</span>
              {currentLanguage === 'en'
                ? `${tGlobal('language.en')} → ${tGlobal('language.fr')}`
                : `${tGlobal('language.fr')} → ${tGlobal('language.en')}`}
            </button>
          </nav>
        )}
      </div>
      {breakpointMode === 'indicator' && (
        <div className="fixed top-4 right-20 z-100">
          <span
            className="flex size-12 items-center justify-center rounded-full bg-gray-800 font-mono text-sm font-bold text-white shadow-lg"
            aria-label={t('currentBreakpoint', {
              breakpoint: currentBreakpoint,
            })}
            title={t('currentBreakpoint', {
              breakpoint: currentBreakpoint,
            })}
          >
            {currentBreakpoint}
          </span>
        </div>
      )}
      <TailwindBreakPoints
        visible={breakpointMode === 'guides'}
        currentBreakpoint={currentBreakpoint}
      />
      {(activePanel || pendingReset) && (
        <div className="fixed top-20 right-4 z-100 w-[min(28rem,calc(100vw-2rem))] animate-[development-menu-enter_180ms_ease-out_both] motion-reduce:animate-none">
          {activePanel === 'modules' && (
            <ModuleStatusPanel
              preloadState={preloadState}
              onClose={closePanel}
            />
          )}
          {activePanel === 'states' && (
            <ApplicationStatePanel onClose={closePanel} />
          )}
          {activePanel === 'tour' && (
            <IntroTourPanel onClose={closePanel} onRestarted={closeAllTools} />
          )}
          {pendingReset && (
            <ResetConfirmPanel
              title={t(
                pendingReset === 'journal'
                  ? 'confirmResetJournalTitle'
                  : 'confirmResetSiteTitle',
              )}
              description={t(
                pendingReset === 'journal'
                  ? 'confirmResetJournalDescription'
                  : 'confirmResetSiteDescription',
              )}
              onConfirm={confirmReset}
              onCancel={cancelReset}
            />
          )}
        </div>
      )}
    </>
  )
}
