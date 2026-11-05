/**
  File: TutorialStepContent.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Share step labels, headings, descriptions, and action layout across tutorials.

  Usage:
  - Render inside a tutorial dialog or popover.

  Notes:
  - Children provide tutorial-specific content between the description and actions.
 */
import type { ReactNode } from 'react'

export type TutorialAction = {
  label: string
  onClick: () => void
  autoFocus?: boolean
}

type TutorialStepContentProps = {
  title: string
  description: string
  titleId: string
  descriptionId: string
  stepLabel?: string
  stepLabelClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  leadingContent?: ReactNode
  children?: ReactNode
  skipAction?: TutorialAction
  nextAction?: TutorialAction
  className?: string
}

export function TutorialStepContent({
  title,
  description,
  titleId,
  descriptionId,
  stepLabel,
  stepLabelClassName,
  titleClassName,
  descriptionClassName = 'text-muted',
  leadingContent,
  children,
  skipAction,
  nextAction,
  className = '',
}: TutorialStepContentProps) {
  return (
    <div className={`tutorial-step-content ${className}`}>
      {leadingContent}
      {stepLabel && (
        <p className={stepLabelClassName ?? 'text-sm font-semibold text-muted'}>
          {stepLabel}
        </p>
      )}
      <h2 id={titleId} className={titleClassName}>
        {title}
      </h2>
      <p id={descriptionId} className={descriptionClassName}>
        {description}
      </p>
      {children}
      {(skipAction || nextAction) && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {skipAction && (
            <button
              type="button"
              className="text-link tutorial-step-action tutorial-step-content__skip"
              onClick={skipAction.onClick}
            >
              {skipAction.label}
            </button>
          )}
          {nextAction && (
            <button
              type="button"
              className={`button tutorial-step-action ${
                skipAction ? '' : 'ml-auto'
              }`}
              autoFocus={nextAction.autoFocus}
              onClick={nextAction.onClick}
            >
              {nextAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
