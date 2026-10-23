/**
 * File: SplashScreen.tsx | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Show the branded initial loading screen and fade transition.
 * Dependencies: Loading spinner, react-i18next, bundled expedition logo.
 */
import { useTranslation } from 'react-i18next'
import logo from '../assets/expedition.svg'
import { Loading } from './Loading'

type SplashScreenProps = {
  isExiting: boolean
}

export function SplashScreen({ isExiting }: SplashScreenProps) {
  const { t } = useTranslation('global')

  return (
    <div
      className={`splash-screen fixed inset-0 z-50 grid place-items-center bg-canvas ${
        isExiting ? 'splash-screen--exiting' : ''
      }`}
    >
      <div className="flex flex-col items-center px-6 text-center">
        <img src={logo} alt="" className="mb-5 size-16" />
        <h1 className="text-2xl font-bold text-pine">{t('app.name')}</h1>
        <Loading label={t('app.startupLoading')} />
      </div>
    </div>
  )
}
