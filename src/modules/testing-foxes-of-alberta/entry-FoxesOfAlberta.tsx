/**
  File: entry-FoxesOfAlberta.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Wildlife expedition with two views: listen to audio clips, then take the habitat quiz.
  - Both views use shared module tools (audio player, quiz system) and record journal checkpoints.

  Usage:
  - Registered activity components are lazy-loaded by the module registry.

  Notes:
  - ListenSection and HabitatQuiz hold each view; this file only switches between them.
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { ModuleActivityProps } from '@/modules/types'
import { HabitatQuiz } from './components/HabitatQuiz'
import { ListenSection } from './components/ListenSection'

type View = 'activity' | 'quiz'

export default function FoxesOfAlberta({
  moduleId,
  completedCheckpoints,
  completeCheckpoint,
}: ModuleActivityProps) {
  const { t } = useTranslation('wildlifeFinder')
  const [view, setView] = useState<View>('activity')

  useEffect(() => {
    completeCheckpoint('habitats-matter')
  }, [completeCheckpoint])

  const startQuiz = () => setView('quiz')
  const showActivity = () => setView('activity')

  return (
    <section aria-labelledby="activity-title" className="w-full space-y-6">
      <div className="max-w-3xl space-y-6">
        <p className="font-semibold text-pine">{t('category')}</p>
        <h1 id="activity-title">{t('title')}</h1>
        <p className="text-lg text-muted">{t('activity.introduction')}</p>
      </div>
      {view === 'activity' ? (
        <>
          <ListenSection
            completedCheckpoints={completedCheckpoints}
            completeCheckpoint={completeCheckpoint}
          />
          <div className="panel space-y-4">
            <h2>{t('quiz.heading')}</h2>
            <p className="text-muted">{t('quiz.description')}</p>
            <button type="button" className="button" onClick={startQuiz}>
              {t('quiz.start')}
            </button>
          </div>
        </>
      ) : (
        <HabitatQuiz
          completedCheckpoints={completedCheckpoints}
          completeCheckpoint={completeCheckpoint}
          onBackToActivity={showActivity}
        />
      )}
      <Link to={`/modules/${moduleId}`} className="button-secondary">
        {t('backToOverview')}
      </Link>
    </section>
  )
}
