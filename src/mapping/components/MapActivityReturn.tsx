/**
  File: MapActivityReturn.tsx | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Highlight the activity link after completing a module's map discoveries.

  Usage:
  - Rendered by ExploreMapNavBar for module activity links.

  Notes:
  - Reminders expire ten seconds after first appearing, or when dismissed.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ActivityIcon } from '@/components/icons/ActivityIcon'
import { Tooltip } from '@/components/shared/Tooltip'
import { useJournal } from '@/journal/context/useJournal'
import type { LearningModule } from '@/modules/types'
import { useMapInfoPanel } from '@/module-tools/map-info-panel/hooks/useMapInfoPanel'
import { useExpeditionProgress } from '@/save-data/expedition-progress'
import { TutorialPopover } from '@/tutorials/components/TutorialPopover'
import { TutorialStepContent } from '@/tutorials/components/TutorialStepContent'
import { useTutorialAnchorMeasurement } from '@/tutorials/hooks/useTutorialAnchorMeasurement'
import { getSideTutorialPosition } from '@/tutorials/utils/tutorialPositioning'
import { hasCompletedMapWithActivityRemaining } from '../map-functions/hasCompletedMapWithActivityRemaining'
import { useMapControls } from './MapControlsContext'

type MapActivityReturnProps = {
  module?: LearningModule
  activityPath: string
  isNavigationOpen: boolean
}

export function MapActivityReturn(props: MapActivityReturnProps) {
  const { getCompletedCheckpoints } = useExpeditionProgress()
  const reminderKey = props.module?.map?.settings.activityReminderKey
  const eligible =
    !!props.module &&
    !!reminderKey &&
    hasCompletedMapWithActivityRemaining(
      props.module,
      getCompletedCheckpoints(props.module.id),
    )
  return (
    <ActivityReturnLink
      key={`${props.module?.id}:${eligible}`}
      {...props}
      eligible={eligible}
    />
  )
}

function ActivityReturnLink({
  module,
  activityPath,
  isNavigationOpen,
  eligible,
}: MapActivityReturnProps & { eligible: boolean }) {
  const { t, i18n } = useTranslation('mapping')
  const {
    isMapReady,
    isResettingMap,
    isStyleLoading,
    isTerrainTransitioning,
    isFlyoverTransitioning,
    isPreparingFlyover,
  } = useMapControls()
  const { isOpen: isInfoOpen } = useMapInfoPanel()
  const { isOpen: isJournalOpen } = useJournal()
  const [expired, setExpired] = useState(false)
  const expiresAt = useRef<number | null>(null)
  const popupRef = useRef<HTMLElement>(null)
  const anchorId = useId()
  const titleId = useId()
  const descriptionId = useId()
  const showReminder =
    eligible &&
    !expired &&
    isMapReady &&
    !isResettingMap &&
    !isStyleLoading &&
    !isTerrainTransitioning &&
    !isPreparingFlyover &&
    !isFlyoverTransitioning &&
    !isInfoOpen &&
    !isJournalOpen &&
    !isNavigationOpen
  const measurement = useTutorialAnchorMeasurement({
    anchor: showReminder ? anchorId : null,
    selector: `[data-activity-return="${anchorId}"]`,
    popupRef,
  })
  const position = measurement
    ? getSideTutorialPosition(
        measurement.targetRect,
        measurement.popupSize,
        window.innerWidth - 16,
      )
    : null
  const isVisible = showReminder && position !== null

  useEffect(() => {
    if (!isVisible && expiresAt.current === null) return
    expiresAt.current ??= performance.now() + 10000
    const timer = window.setTimeout(
      () => setExpired(true),
      Math.max(0, expiresAt.current - performance.now()),
    )
    return () => window.clearTimeout(timer)
  }, [isVisible])

  const link = (
    <Link
      to={activityPath}
      data-activity-return={anchorId}
      className={`flex size-12 items-center justify-center rounded-full border border-line bg-surface text-pine shadow-lg hover:bg-canvas ${isVisible ? 'mapping-activity-return--pulse' : ''}`}
      aria-label={t('navigation.moduleActivity')}
      aria-describedby={isVisible ? descriptionId : undefined}
    >
      <ActivityIcon className="size-6" />
    </Link>
  )
  const reminderKey = module?.map?.settings.activityReminderKey
  return (
    <>
      {showReminder ? (
        link
      ) : (
        <Tooltip text={t('navigation.moduleActivity')} placement="right">
          {link}
        </Tooltip>
      )}
      {showReminder && module && reminderKey && (
        <TutorialPopover
          popupRef={popupRef}
          titleId={titleId}
          descriptionId={descriptionId}
          position={position}
          isVisible={isVisible}
          className="mapping-activity-reminder"
        >
          <div className="p-4" role="status">
            <TutorialStepContent
              titleId={titleId}
              descriptionId={descriptionId}
              title={t('navigation.mapCompleteTitle')}
              description={i18n.t(reminderKey, {
                ns: module.translationNamespace,
              })}
              skipAction={{
                label: t('navigation.dismissReminder'),
                onClick: () => setExpired(true),
              }}
            />
          </div>
        </TutorialPopover>
      )}
    </>
  )
}
