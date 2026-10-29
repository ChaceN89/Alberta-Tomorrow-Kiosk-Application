/**
  File: HabitatQuiz.tsx | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Wildlife expedition quiz view built on the shared quiz system.
  - Supplies translated fox questions and records their journal checkpoints when answered correctly.

  Usage:
  - Rendered by entry-FoxesOfAlberta after the learner starts the quiz.

  Notes:
  - Question content lives in module.wildlifeFinder.json under activity.
 */
import { useTranslation } from 'react-i18next'
import { buildQuizQuestions } from '@/module-tools/quiz-system/buildQuizQuestions'
import { Quiz } from '@/module-tools/quiz-system/Quiz'
import { TrackPlayButton } from '@/module-tools/media-player/TrackPlayButton'
import type { ModuleCheckpointProps } from '@/modules/types'
import { getPreloadedFoxAudioSource } from '@/modules/testing-foxes-of-alberta/audioCache'
import { foxesOfAlbertaQuizQuestions } from '@/modules/testing-foxes-of-alberta/quiz'
import { foxesOfAlbertaTracks } from '@/modules/testing-foxes-of-alberta/tracks'

type HabitatQuizProps = ModuleCheckpointProps & {
  onBackToActivity: () => void
}

export function HabitatQuiz({
  completedCheckpoints,
  completeCheckpoint,
  onBackToActivity,
}: HabitatQuizProps) {
  const { t } = useTranslation('wildlifeFinder')
  const redFoxTrack = foxesOfAlbertaTracks[2]

  const questions = buildQuizQuestions(
    foxesOfAlbertaQuizQuestions,
    t('quiz.questions', { returnObjects: true }),
    {
      'red-fox-sound-identification': (
        <TrackPlayButton
          track={{
            type: 'audio',
            id: redFoxTrack.id,
            src: getPreloadedFoxAudioSource(redFoxTrack.src),
            coverArt: redFoxTrack.coverArt,
            title: t('listen.tracks.redFoxSound.title'),
            subtitle: t('title'),
            translation: {
              namespace: 'wildlifeFinder',
              titleKey: 'listen.tracks.redFoxSound.title',
              subtitleKey: 'title',
            },
          }}
          onStart={() => completeCheckpoint(redFoxTrack.startCheckpoint)}
        />
      ),
    },
  )

  return (
    <div className="space-y-6">
      <Quiz
        questions={questions}
        completedQuestionIds={completedCheckpoints}
        onQuestionCorrect={(question) => completeCheckpoint(question.id)}
        renderComplete={({ restart }) => (
          <div className="panel space-y-4">
            <h2>{t('quiz.complete.title')}</h2>
            <p className="text-muted">{t('quiz.complete.description')}</p>
            <button
              type="button"
              className="button-secondary"
              onClick={restart}
            >
              {t('quiz.complete.retry')}
            </button>
          </div>
        )}
      />
      <button type="button" className="button" onClick={onBackToActivity}>
        {t('quiz.backToActivity')}
      </button>
    </div>
  )
}
