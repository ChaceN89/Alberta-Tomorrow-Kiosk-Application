/**
 * File: ModuleTitle.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-28
 * Description: Render a module's localized title from its own translation namespace.
 * Dependencies: react-i18next, learning-module metadata.
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
