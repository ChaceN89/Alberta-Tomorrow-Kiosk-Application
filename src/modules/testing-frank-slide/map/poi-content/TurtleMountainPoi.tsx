/**
  File: TurtleMountainPoi.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Present Turtle Mountain's history, summit, trail, and monitoring context.

  Usage:
  - Opened by selecting Turtle Mountain on the Frank Slide module map.

  Notes:
  - Route conditions and access can change; hikers should check locally.
 */
import { useTranslation } from 'react-i18next'

export function TurtleMountainPoi() {
  const { t } = useTranslation('frankSlide')

  return (
    <div className="space-y-4">
      <p>{t('poi.turtleMountain.description')}</p>
      <section className="space-y-2">
        <h3 className="font-semibold text-pine">
          {t('poi.turtleMountain.trailHeading')}
        </h3>
        <p>{t('poi.turtleMountain.trailDescription')}</p>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold text-pine">
          {t('poi.turtleMountain.monitoringHeading')}
        </h3>
        <p>{t('poi.turtleMountain.monitoringDescription')}</p>
      </section>
      <p className="text-sm text-muted">{t('poi.turtleMountain.safetyNote')}</p>
    </div>
  )
}
