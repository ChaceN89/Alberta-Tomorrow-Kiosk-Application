/**
  File: frankSlide.ts | Author: Chace Nielson
  Date Created: Nov 6, 2026
  Date Updated: Nov 6, 2026

  Description:
  - Define the shared Frank Slide base-map point and camera destination.

  Usage:
  - Included in DEFAULT_POI_SETTINGS and reused by the Frank Slide module.

  Notes:
  - The marker is placed at the Frank Slide Interpretive Centre.
 */
import type { DefaultPoi } from '../defaultPOISettings'

export const frankSlideDefaultPoi = {
  id: 'frankSlide',
  titleKey: 'view.defaultPois.frankSlide',
  coordinates: [-114.3943, 49.6],
  view: {
    center: [-114.3943, 49.6],
    zoom: 12,
    pitch: 65,
    bearing: -90,
  },
} as const satisfies DefaultPoi
