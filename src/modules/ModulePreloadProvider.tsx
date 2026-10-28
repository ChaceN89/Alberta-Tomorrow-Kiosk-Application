/**
  File: ModulePreloadProvider.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Coordinate cancellable module preloads and expose their progress.

  Usage:
  - Providers supply or wrap state.

  Notes:
  - None.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import {
  ModulePreloadContext,
  type ModulePreloadState,
} from './useModulePreload'
import type { LearningModule } from './types'

type ActivePreload = {
  moduleId: string
  toastId: string
  controller: AbortController
  promise: Promise<boolean>
}

const MODULE_PRELOAD_TOAST_ID = 'module-preload'

const idleState: ModulePreloadState = {
  moduleId: null,
  status: 'idle',
  progress: 0,
}

type ModulePreloadProviderProps = {
  children: ReactNode
}

export function ModulePreloadProvider({
  children,
}: ModulePreloadProviderProps) {
  const { pathname } = useLocation()
  const { t } = useTranslation('global')
  const { i18n } = useTranslation()
  const [state, setState] = useState<ModulePreloadState>(idleState)
  const activePreload = useRef<ActivePreload | null>(null)
  const readyModules = useRef(new Set<string>())

  const cancelPreload = useCallback(() => {
    const active = activePreload.current

    if (!active) {
      return
    }

    activePreload.current = null
    active.controller.abort()
    toast(t('preload.toastCancelled'), {
      id: active.toastId,
      duration: 2500,
    })
    setState((current) =>
      current.moduleId === active.moduleId && current.status === 'loading'
        ? idleState
        : current,
    )
  }, [t])

  const isModuleReady = useCallback(
    (moduleId: string) => readyModules.current.has(moduleId),
    [],
  )

  const preloadModule = useCallback(
    (module: LearningModule) => {
      if (readyModules.current.has(module.id)) {
        return Promise.resolve(true)
      }

      if (activePreload.current?.moduleId === module.id) {
        return activePreload.current.promise
      }

      cancelPreload()
      const controller = new AbortController()
      const toastId = MODULE_PRELOAD_TOAST_ID
      const activityName = i18n.t('title', { ns: module.translationNamespace })
      toast.loading(t('preload.toastLoading'), { id: toastId })
      setState({ moduleId: module.id, status: 'loading', progress: 5 })

      const promise = Promise.resolve().then(async () => {
        const reportProgress = (progress: number) => {
          if (
            activePreload.current?.controller !== controller ||
            controller.signal.aborted
          ) {
            return
          }

          const boundedProgress = Math.max(0, Math.min(100, progress))
          setState({
            moduleId: module.id,
            status: 'loading',
            progress: Math.round(20 + boundedProgress * 0.8),
          })
        }

        try {
          await module.loadActivity()
          reportProgress(0)
          await module.preload?.({
            signal: controller.signal,
            onProgress: reportProgress,
          })

          if (controller.signal.aborted) {
            return false
          }

          readyModules.current.add(module.id)
          toast.success(t('preload.toastSuccess', { activityName }), {
            id: toastId,
          })
          setState({
            moduleId: module.id,
            status: 'ready',
            progress: 100,
          })
          return true
        } catch (error) {
          if (controller.signal.aborted) {
            return false
          }

          console.error(`Failed to prepare module "${module.id}".`, error)
          toast.error(t('preload.toastError'), {
            id: toastId,
          })
          setState({ moduleId: module.id, status: 'error', progress: 0 })
          return false
        } finally {
          if (activePreload.current?.controller === controller) {
            activePreload.current = null
          }
        }
      })

      activePreload.current = {
        moduleId: module.id,
        toastId,
        controller,
        promise,
      }

      return promise
    },
    [cancelPreload, i18n, t],
  )

  useEffect(() => {
    const active = activePreload.current

    if (!active) {
      return
    }

    const modulePath = `/modules/${active.moduleId}`
    const isOnModuleRoute =
      pathname === modulePath || pathname.startsWith(`${modulePath}/`)

    if (!isOnModuleRoute) {
      cancelPreload()
    }
  }, [cancelPreload, pathname])

  const contextValue = useMemo(
    () => ({ state, preloadModule, cancelPreload, isModuleReady }),
    [cancelPreload, isModuleReady, preloadModule, state],
  )

  return (
    <ModulePreloadContext.Provider value={contextValue}>
      {children}
    </ModulePreloadContext.Provider>
  )
}
