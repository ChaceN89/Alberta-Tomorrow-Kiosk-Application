/**
  File: ModuleTitle.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Render a module's localized title from its own translation namespace.

  Usage:
  - Module shared UI is used by module pages.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import type { LearningModule } from '../../modules/types'

type ModuleTitleProps = {
  module: LearningModule
}

export function ModuleTitle({ module }: ModuleTitleProps) {
  const { t } = useTranslation(module.translationNamespace)

  return <>{t('title')}</>
}
