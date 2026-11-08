/**
  File: types.ts | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Define POI icon categories and their reusable component contract.

  Usage:
  - Shared POI data and category icon components use these types.

  Notes:
  - Categories describe a POI's primary map-marker identity.
 */
import type { ComponentType } from 'react'

export type PoiIconCategory =
  | 'community'
  | 'naturalPlace'
  | 'historicSite'
  | 'indigenousHeritage'
  | 'residentialSchool'
  | 'interpretiveCentre'

export type PoiIconProps = {
  className?: string
}

export type PoiIconComponent = ComponentType<PoiIconProps>
