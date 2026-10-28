/**
  File: FunFact.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Show a reusable random localized Alberta fact.

  Usage:
  - Shared and app-state UI is imported by app or feature flows.

  Notes:
  - None.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function FunFact() {
  const { t } = useTranslation('funfacts')
  const facts = t('items', { returnObjects: true })
  const [factIndex] = useState(() => Math.floor(Math.random() * facts.length))
  const fact = facts[factIndex]

  if (!fact) {
    throw new Error('Add at least one entry to the funfacts.items resource.')
  }

  return (
    <aside className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-muted">{fact}</p>
    </aside>
  )
}
