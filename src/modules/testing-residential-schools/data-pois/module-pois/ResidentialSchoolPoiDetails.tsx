/**
  File: ResidentialSchoolPoiDetails.tsx | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 7, 2026

  Description:
  - Render shared school facts around each residential-school POI's unique media.

  Usage:
  - Used by residential-school POI info-content components.

  Notes:
  - Media controls remain specific to each POI component.
 */
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { ResidentialSchoolDetails } from './useResidentialSchool'

type ResidentialSchoolPoiDetailsProps = {
  school: ResidentialSchoolDetails
  image: string
  children?: ReactNode
}

export function ResidentialSchoolPoiDetails({
  school,
  image,
  children,
}: ResidentialSchoolPoiDetailsProps) {
  const { t } = useTranslation('residentialSchool')

  return (
    <div className="space-y-4">
      <img
        src={image}
        alt={school.imageAlt}
        className="mapping-poi-info-image"
      />
      <p>
        <span className="font-semibold">{t('activity.location')}</span>{' '}
        {school.location}
      </p>
      <p>
        <span className="font-semibold">{t('activity.operatingYears')}</span>{' '}
        {school.operatingYears}
      </p>
      <p className="text-muted">{school.description}</p>
      {children}
      <a
        href={school.source}
        target="_blank"
        rel="noreferrer"
        className="inline-block font-semibold text-pine underline underline-offset-4"
      >
        {t('activity.sourceLabel')}
      </a>
    </div>
  )
}
