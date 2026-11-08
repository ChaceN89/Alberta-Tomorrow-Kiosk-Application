/**
  File: map-settings.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Configure Frank Slide map visibility and its startup flyover.

  Usage:
  - Combined with Frank Slide POI data by the module definition.

  Notes:
  - The map first flies to an east-of-site camera view, facing west.
 */
import type { ModuleMapSettings } from '@/modules/types'

export const frankSlideMapSettings: ModuleMapSettings = {
  defaultPoisVisible: false,
  modulePoisVisible: true,
  activityMapLinkPlacement: 'insideActivity',
  startup: {
    view: {
      center: [-114.06, 49.58],
      zoom: 12,
      pitch: 80,
      bearing: -90,
    },
    startFlyover: true,
  },
}
