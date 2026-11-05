/**
  File: ExploreMapTutorial.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Introduce the map and its points of interest on the first Explore visit.

  Usage:
  - Render inside AlbertaMap so the tutorial is shared by both Explore routes.

  Notes:
  - The map must be ready before the tutorial opens over the startup screen.
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT,
  hasCompletedIntroToMapTutorial,
  markIntroToMapTutorialCompleted,
} from '@/save-data/tutorial-progress/introToMapTutorialStorage'
import { TutorialDialog } from '@/tutorials/components/TutorialDialog'
import { EXPLORE_MAP_TUTORIAL_START_REQUEST } from './exploreMapTutorialEvents'

const START_DELAY_MS = 350

type ExploreMapTutorialProps = {
  isMapReady: boolean
}

export function ExploreMapTutorial({ isMapReady }: ExploreMapTutorialProps) {
  const { t } = useTranslation('tutorials')
  const [isActive, setIsActive] = useState(false)
  const [shouldAutoStart] = useState(() => !hasCompletedIntroToMapTutorial())
  const [isStartRequested, setIsStartRequested] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(
    hasCompletedIntroToMapTutorial,
  )

  useEffect(() => {
    const syncCompletion = () => {
      const completed = hasCompletedIntroToMapTutorial()
      setHasCompleted(completed)
      if (completed) setIsActive(false)
    }

    window.addEventListener(INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT, syncCompletion)
    return () =>
      window.removeEventListener(
        INTRO_TO_MAP_TUTORIAL_STORAGE_EVENT,
        syncCompletion,
      )
  }, [])

  useEffect(() => {
    const startTutorial = () => {
      setHasCompleted(false)
      setIsStartRequested(true)
    }

    window.addEventListener(EXPLORE_MAP_TUTORIAL_START_REQUEST, startTutorial)
    return () =>
      window.removeEventListener(
        EXPLORE_MAP_TUTORIAL_START_REQUEST,
        startTutorial,
      )
  }, [])

  useEffect(() => {
    if (!isStartRequested || !isMapReady) return

    const timer = window.setTimeout(() => {
      setIsActive(true)
      setIsStartRequested(false)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [isMapReady, isStartRequested])

  useEffect(() => {
    if (!shouldAutoStart || !isMapReady || hasCompleted) return

    const timer = window.setTimeout(() => setIsActive(true), START_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [hasCompleted, isMapReady, shouldAutoStart])

  const finish = () => {
    markIntroToMapTutorialCompleted()
    setHasCompleted(true)
    setIsActive(false)
  }

  if (!isActive) return null

  return (
    <TutorialDialog
      title={t('exploreMap.title')}
      description={t('exploreMap.description')}
      actionLabel={t('exploreMap.done')}
      onAction={finish}
    />
  )
}
