/**
  File: map-settings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Configure map behavior for the residential-school module.

  Usage:
  - Combined with module POI data by the residential-schools module definition.

  Notes:
  - Coordinates use longitude, latitude order.
 */
import type { ModuleMapSettings } from '../../types'

export const residentialSchoolMapSettings: ModuleMapSettings = {
  baseMapEntry: {
    coordinates: [-113.625, 53.63],
  },
  defaultPoisVisible: false,
  modulePoisVisible: true,
}
