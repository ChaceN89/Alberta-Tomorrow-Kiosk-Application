/**
  File: useResidentialSchool.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Read one localized residential-school record for its map POI.

  Usage:
  - Used by residential-school POI info-content components.

  Notes:
  - School records are keyed by their stable POI ids in both locale files.
 */
import { useTranslation } from 'react-i18next'

export type ResidentialSchoolId =
  'st-marys-blood' | 'st-albert-youville' | 'lesser-slave-lake'

export type ResidentialSchoolDetails = {
  name: string
  location: string
  operatingYears: string
  description: string
  imageAlt: string
  source: string
}

export function useResidentialSchool(id: ResidentialSchoolId) {
  const { t } = useTranslation('residentialSchool')
  const schools = t('activity.schools', { returnObjects: true })
  const school = schools[id]

  if (!school) {
    throw new Error(`Missing residential-school data for POI "${id}".`)
  }

  return school
}
