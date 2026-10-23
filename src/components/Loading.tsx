/**
 * File: Loading.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Announce loading while an activity chunk is fetched.
 * Dependencies: react-i18next.
 */
import { useTranslation } from 'react-i18next'

export function Loading() {
  const { t } = useTranslation()

  return <p role="status">{t('app.loading')}</p>
}
