/**
  File: buildQuizQuestions.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 28, 2026

  Description:
  - Combine shared quiz definitions with localized question content and optional media.

  Usage:
  - Call from a module activity before passing questions to the shared Quiz component.

  Notes:
  - Throws when a definition references missing content or an invalid correct answer index.
 */
import type { ReactNode } from 'react'
import type {
  LocalizedQuizQuestion,
  QuizQuestion,
  QuizQuestionDefinition,
} from './types'

export function buildQuizQuestions(
  definitions: readonly QuizQuestionDefinition[],
  localizedQuestions: readonly LocalizedQuizQuestion[],
  mediaByQuestionId: Readonly<Record<string, ReactNode>> = {},
): QuizQuestion[] {
  return definitions.map((definition) => {
    const localizedQuestion = localizedQuestions[definition.contentIndex]

    if (!localizedQuestion) {
      throw new Error(
        `Quiz question "${definition.id}" references missing localized content at index ${definition.contentIndex}.`,
      )
    }

    if (
      definition.correctIndex < 0 ||
      definition.correctIndex >= localizedQuestion.options.length
    ) {
      throw new Error(
        `Quiz question "${definition.id}" has an invalid correct answer index.`,
      )
    }

    return {
      id: definition.id,
      prompt: localizedQuestion.prompt,
      media: mediaByQuestionId[definition.id],
      options: localizedQuestion.options,
      correctIndex: definition.correctIndex,
      correctFeedback: localizedQuestion.correct,
      incorrectFeedback: localizedQuestion.tryAgain,
    }
  })
}
