/**
 * File: i18n.ts | Author: Chace Nielson
 * Created: 2026-10-23 | Updated: 2026-10-23
 * Description: Register bundled English and French resources with typed keys.
 * Dependencies: i18next, react-i18next; language selection is session-only.
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enGlobal from '../locales/en/global.json'
import enFunfacts from '../locales/en/funfacts.json'
import enHome from '../locales/en/home.json'
import enResidentialSchool from '../locales/en/residentialSchool.json'
import enWildlifeFinder from '../locales/en/wildlifeFinder.json'
import frGlobal from '../locales/fr/global.json'
import frFunfacts from '../locales/fr/funfacts.json'
import frHome from '../locales/fr/home.json'
import frResidentialSchool from '../locales/fr/residentialSchool.json'
import frWildlifeFinder from '../locales/fr/wildlifeFinder.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'home'
    resources: {
      global: typeof enGlobal
      funfacts: typeof enFunfacts
      home: typeof enHome
      residentialSchool: typeof enResidentialSchool
      wildlifeFinder: typeof enWildlifeFinder
    }
  }
}

// Initialize i18next with React integration and bundled language resources.
void i18n.use(initReactI18next).init({
  resources: {
    en: {
      global: enGlobal,
      funfacts: enFunfacts,
      home: enHome,
      residentialSchool: enResidentialSchool,
      wildlifeFinder: enWildlifeFinder,
    },
    fr: {
      global: frGlobal,
      funfacts: frFunfacts,
      home: frHome,
      residentialSchool: frResidentialSchool,
      wildlifeFinder: frWildlifeFinder,
    },
  },
  ns: ['global', 'home', 'funfacts', 'wildlifeFinder', 'residentialSchool'],
  defaultNS: 'home',
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'fr'],
  interpolation: { escapeValue: false },
})

export default i18n
