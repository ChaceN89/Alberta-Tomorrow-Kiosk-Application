/**
  File: JournalTitlePage.tsx | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Explain how the expedition journal works and guide learners to browse modules.

  Usage:
  - Rendered on the title page of JournalModal.

  Notes:
  - None.
 */
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import logo from '@/assets/expedition.svg'

type JournalTitlePageProps = {
  hasEntries: boolean
  onNavigate: () => void
}

export function JournalTitlePage({
  hasEntries,
  onNavigate,
}: JournalTitlePageProps) {
  const { t } = useTranslation('journal')
  const stepsId = useId()
  const steps = t('about.steps', { returnObjects: true })

  return (
    <article className="space-y-5">
      <header className="flex items-center gap-4">
        <img src={logo} alt="" className="size-16 shrink-0" />
      </header>
      <p className="text-muted">{t('about.description')}</p>
      <section aria-labelledby={stepsId} className="space-y-3">
        <h4 id={stepsId} className="text-base font-semibold">
          {t('about.stepsHeading')}
        </h4>
        <ol className="list-decimal space-y-2 pl-6 text-muted">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <p className="text-sm text-muted">{t('about.saved')}</p>
      {!hasEntries && (
        <div className="space-y-3 rounded-xl border border-dashed border-line p-4">
          <p className="font-semibold">{t('about.empty')}</p>
          <Link className="button" to="/" onClick={onNavigate}>
            {t('about.browse')}
          </Link>
        </div>
      )}
    </article>
  )
}
