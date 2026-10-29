/**
  File: DisplayTesting.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Provide the development menu and set the document title and language.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { NOTIFICATION_TOASTER_ID } from '@/components/toasts/toasterIds'
import { useExpeditionProgress } from '@/save-data/useExpeditionProgress'
import { useModulePreload } from '@/modules/useModulePreload'
import { useIntroTutorial } from '@/tutorials/intro-tutorial/useIntroTutorial'
import { requestMediaPlayerTutorialFinish } from '@/tutorials/media-player-tutorial/mediaPlayerTutorialEvents'
import { markMediaPlayerTutorialCompleted } from '@/save-data/mediaPlayerTutorialStorage'
import { ApplicationStatePanel } from '../panels/ApplicationStatePanel'
import { TutorialsPanel } from '../panels/TutorialsPanel'
import { ModuleStatusPanel } from '../panels/ModuleStatusPanel'
import { ResetConfirmPanel } from '../panels/ResetConfirmPanel'
import { SiteFlagsPanel } from '../panels/SiteFlagsPanel'
import { DarkModeTestingToggle } from './DarkModeTestingToggle'
import { TailwindBreakPoints } from './TailwindBreakPoints'
import { getCurrentBreakpoint, getTailwindBreakpoints } from './breakpoints'
import { resetSite, resetSiteTutorialFlags } from './resetSite'

type ActivePanel = 'modules' | 'states' | 'tutorials' | 'site' | null
type PendingReset = 'journal' | 'site' | null
type BreakpointMode = 'off' | 'guides' | 'indicator'

export function DisplayTesting() {
  const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'development'
  const { t } = useTranslation('development')
  const { t: tGlobal, i18n } = useTranslation('global')
  const { state: preloadState } = useModulePreload()
  const { finish: finishIntroTutorial } = useIntroTutorial()
  const {
    completeAllModules,
    progressAllNextCheckpoints,
    resetExpeditionProgress,
    startAllExpeditions,
  } = useExpeditionProgress()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [pendingReset, setPendingReset] = useState<PendingReset>(null)
  const [breakpointMode, setBreakpointMode] = useState<BreakpointMode>('off')
  const [breakpoints] = useState(() =>
    isDevelopment ? getTailwindBreakpoints() : [],
  )
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth)
  const currentLanguage = i18n.resolvedLanguage ?? 'en'
  const currentBreakpoint = getCurrentBreakpoint(viewportWidth, breakpoints)

  // Runs in every build (this component always mounts); only the prefix is dev-only.
  useEffect(() => {
    document.documentElement.lang = currentLanguage
    document.title = `${isDevelopment ? 'Dev | ' : ''}${tGlobal('app.name')}`
  }, [currentLanguage, isDevelopment, tGlobal])

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth)

    window.addEventListener('resize', updateViewportWidth)
    return () => window.removeEventListener('resize', updateViewportWidth)
  }, [])

  // Escape closes the innermost open layer: confirmation or panel, then the menu.
  useEffect(() => {
    if (!menuOpen && !activePanel && !pendingReset) return

    const closeOnEscape = (event: KeyboardEvent) => {
      // Modal dialogs handle Escape outside the developer tools.
      const isInDeveloperTools =
        event.target instanceof Element &&
        Boolean(event.target.closest('[id$="-dev-tools-root"]'))

      if (
        event.key !== 'Escape' ||
        (document.querySelector('dialog[open]') && !isInDeveloperTools)
      ) {
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
    const toolsAreOpen =
      menuOpen || activePanel !== null || pendingReset !== null
    setMenuOpen(!toolsAreOpen)
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
      resetExpeditionProgress()
      toast(t('journalReset'), {
        toasterId: NOTIFICATION_TOASTER_ID,
      })
    } else if (pendingReset === 'site') {
      resetSite()
    }

    setPendingReset(null)
  }

  const handleResetTutorialFlags = () => {
    resetSiteTutorialFlags()
    toast(t('tutorialFlagsReset'), {
      toasterId: NOTIFICATION_TOASTER_ID,
    })
  }

  const handleCompleteAllModules = () => {
    completeAllModules()
    toast(t('allModulesComplete'), {
      toasterId: NOTIFICATION_TOASTER_ID,
    })
  }

  const handleProgressAllNextCheckpoints = () => {
    const progressed = progressAllNextCheckpoints()
    toast(
      progressed > 0
        ? t('expeditionsAdvanced', { count: progressed })
        : t('allExpeditionsAlreadyComplete'),
      { toasterId: NOTIFICATION_TOASTER_ID },
    )
  }

  const handleCompleteAllTutorials = () => {
    finishIntroTutorial()
    markMediaPlayerTutorialCompleted()
    requestMediaPlayerTutorialFinish()
    toast(t('allTutorialsComplete'), {
      toasterId: NOTIFICATION_TOASTER_ID,
    })
  }

  const handleStartAllExpeditions = () => {
    startAllExpeditions()
    toast(t('allExpeditionsStarted'), {
      toasterId: NOTIFICATION_TOASTER_ID,
    })
  }

  const tools = (
    <>
      <div className="pointer-events-auto fixed top-4 right-4 z-(--z-dev-tools) flex flex-col items-end gap-2">
        <button
          type="button"
          aria-label={t(
            menuOpen || activePanel || pendingReset
              ? 'closeTools'
              : 'openTools',
          )}
          aria-expanded={
            menuOpen || activePanel !== null || pendingReset !== null
          }
          aria-haspopup="true"
          className="flex size-12 items-center justify-center rounded-full bg-gray-800/35 text-xl text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-gray-800/70 hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          onClick={toggleTools}
        >
          <span aria-hidden="true">
            {menuOpen || activePanel || pendingReset ? '×' : '⚙'}
          </span>
        </button>
        {menuOpen && (
          <nav
            aria-label={t('tools')}
            className="max-h-[calc(100dvh-6rem)] w-72 origin-top-right animate-[development-menu-enter_180ms_ease-out_both] space-y-2 overflow-y-auto rounded-2xl border border-line bg-surface p-3 text-ink shadow-xl motion-reduce:animate-none"
          >
            <p className="px-2 pb-1 text-sm font-semibold text-muted">
              {t('tools')}
            </p>
            <button
              type="button"
              className="dev-tool-menu-button"
              onClick={() => openPanel('site')}
            >
              <span aria-hidden="true">⚑</span>
              {t('siteFlags')}
            </button>
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
              className="dev-tool-menu-button"
              onClick={() => openPanel('tutorials')}
            >
              <span aria-hidden="true">?</span>
              {t('tutorials')}
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
        <div className="fixed top-4 right-20 z-(--z-dev-tools)">
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
        breakpoints={breakpoints}
      />
      {(activePanel || pendingReset) && (
        <div className="pointer-events-auto fixed top-20 right-4 z-(--z-dev-tools) w-[min(28rem,calc(100vw-2rem))] animate-[development-menu-enter_180ms_ease-out_both] motion-reduce:animate-none">
          {activePanel === 'modules' && (
            <ModuleStatusPanel
              preloadState={preloadState}
              onClose={closePanel}
            />
          )}
          {activePanel === 'states' && (
            <ApplicationStatePanel onClose={closePanel} />
          )}
          {activePanel === 'tutorials' && (
            <TutorialsPanel
              onClose={closePanel}
              onTutorialStarted={closeAllTools}
              onResetAllTutorialFlags={handleResetTutorialFlags}
              onCompleteAllTutorials={handleCompleteAllTutorials}
            />
          )}
          {activePanel === 'site' && (
            <SiteFlagsPanel
              onClose={closePanel}
              onResetSite={() => askToReset('site')}
              onResetJournal={() => askToReset('journal')}
              onStartAllExpeditions={handleStartAllExpeditions}
              onProgressAllNextCheckpoints={handleProgressAllNextCheckpoints}
              onCompleteAllModules={handleCompleteAllModules}
            />
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

  return tools
}
