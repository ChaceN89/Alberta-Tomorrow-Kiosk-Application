/**
  File: buildQuizQuestions.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Combine shared quiz definitions with localized question content and optional media.

  Usage:
  - Call from a module activity before passing questions to the shared Quiz component.

  Notes:
  - Question and correct-option ids resolve localized content; throws for missing ids.
 */
import type { ReactNode } from 'react'
import type {
  LocalizedQuizQuestion,
  QuizQuestion,
  QuizQuestionDefinition,
} from './types'

export function buildQuizQuestions(
  definitions: readonly QuizQuestionDefinition[],
  localizedQuestions: Readonly<Record<string, LocalizedQuizQuestion>>,
  mediaByQuestionId: Readonly<Record<string, ReactNode>> = {},
): QuizQuestion[] {
  return definitions.map((definition) => {
    const localizedQuestion = localizedQuestions[definition.id]

    if (!localizedQuestion) {
      throw new Error(
        `Quiz question "${definition.id}" references missing localized content.`,
      )
    }

    const options = Object.entries(localizedQuestion.options).map(
      ([id, text]) => ({ id, text }),
    )

    if (!options.some((option) => option.id === definition.correctOptionId)) {
      throw new Error(
        `Quiz question "${definition.id}" references missing correct option "${definition.correctOptionId}".`,
      )
    }

    return {
      id: definition.id,
      prompt: localizedQuestion.prompt,
      media: mediaByQuestionId[definition.id],
      options,
      correctOptionId: definition.correctOptionId,
      correctFeedback: localizedQuestion.correct,
      incorrectFeedback: localizedQuestion.tryAgain,
    }
  })
}
