/**
  File: i18n.ts | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Register bundled English and French resources with typed keys.

  Usage:
  - App bootstrap and configuration files coordinate startup, routes, and translations.

  Notes:
  - Contains a lot of json files. anoying in this file, but makes adding text easier and more organized.
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enDevelopment from '@/locales/en/development.json'
import enGlobal from '@/locales/en/global.json'
import enFunfacts from '@/locales/en/funfacts.json'
import enHome from '@/locales/en/home.json'
import enTutorials from '@/locales/en/tutorials.json'
import enJournal from '@/locales/en/journal.json'
import enGeology from '@/locales/en/module.geology.json'
import enModuleTools from '@/locales/en/moduleTools.json'
import enMapping from '@/locales/en/mapping.json'
import enResidentialSchool from '@/locales/en/module.residentialSchools.json'
import enWildlifeFinder from '@/locales/en/module.wildlifeFinder.json'
import frDevelopment from '@/locales/fr/development.json'
import frGlobal from '@/locales/fr/global.json'
import frFunfacts from '@/locales/fr/funfacts.json'
import frHome from '@/locales/fr/home.json'
import frTutorials from '@/locales/fr/tutorials.json'
import frJournal from '@/locales/fr/journal.json'
import frGeology from '@/locales/fr/module.geology.json'
import frModuleTools from '@/locales/fr/moduleTools.json'
import frMapping from '@/locales/fr/mapping.json'
import frResidentialSchool from '@/locales/fr/module.residentialSchools.json'
import frWildlifeFinder from '@/locales/fr/module.wildlifeFinder.json'

// Extend i18next with typed resources for better autocompletion and type safety.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'home'
    resources: {
      development: typeof enDevelopment // Add a trailing comment to indicate the type is for English development resources.
      global: typeof enGlobal // English global resources
      funfacts: typeof enFunfacts // English funfacts resources
      geology: typeof enGeology // English geology module resources
      home: typeof enHome // English home resources
      tutorials: typeof enTutorials // English tutorial resources
      journal: typeof enJournal // English journal resources
      mapping: typeof enMapping // English mapping resources
      moduleTools: typeof enModuleTools // English shared module tool resources
      residentialSchool: typeof enResidentialSchool // English residential school module resources
      wildlifeFinder: typeof enWildlifeFinder // English wildlife finder module resources
    }
  }
}

// Initialize i18next with React integration and bundled language resources.
void i18n.use(initReactI18next).init({
  resources: {
    en: {
      development: enDevelopment,
      global: enGlobal,
      funfacts: enFunfacts,
      geology: enGeology,
      home: enHome,
      tutorials: enTutorials,
      journal: enJournal,
      mapping: enMapping,
      moduleTools: enModuleTools,
      residentialSchool: enResidentialSchool,
      wildlifeFinder: enWildlifeFinder,
    },
    fr: {
      development: frDevelopment,
      global: frGlobal,
      funfacts: frFunfacts,
      geology: frGeology,
      home: frHome,
      tutorials: frTutorials,
      journal: frJournal,
      mapping: frMapping,
      moduleTools: frModuleTools,
      residentialSchool: frResidentialSchool,
      wildlifeFinder: frWildlifeFinder,
    },
  },
  ns: [
    'development',
    'global',
    'home',
    'tutorials',
    'journal',
    'mapping',
    'moduleTools',
    'funfacts',
    'geology',
    'wildlifeFinder',
    'residentialSchool',
  ],
  defaultNS: 'home',
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'fr'],
  interpolation: { escapeValue: false },
})

export default i18n
