/**
  File: defaultPOISettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Define the default Alberta points of interest and camera destinations.

  Usage:
  - Imported by AlbertaMap and MapActionControls.

  Notes:
  - Coordinates use longitude, latitude order.
 */
export const POI_NAVIGATION_DURATION = 1800

export const DEFAULT_POI_SETTINGS = [
  {
    id: 'athabascaFalls',
    labelKey: 'view.defaultPois.athabascaFalls',
    view: {
      center: [-117.884, 52.6648] as [number, number],
      zoom: 13,
      pitch: 65,
      bearing: 0,
    },
    // name, abd some infoamtion to read about it, including option images and thigns, not everything here needs a ton, but fill out some options here, maybe jsut some html for custom content
  },
  {
    id: 'banff',
    labelKey: 'view.defaultPois.banff',
    view: {
      center: [-115.5708, 51.1784] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: -20,
    },
  },
  {
    id: 'calgary',
    labelKey: 'view.defaultPois.calgary',
    view: {
      center: [-114.0719, 51.0447] as [number, number],
      zoom: 11,
      pitch: 50,
      bearing: 0,
    },
  },
  {
    id: 'canmore',
    labelKey: 'view.defaultPois.canmore',
    view: {
      center: [-115.359, 51.089] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: -30,
    },
  },
  {
    id: 'dinosaurProvincialPark',
    labelKey: 'view.defaultPois.dinosaurProvincialPark',
    view: {
      center: [-111.528, 50.7566] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: 0,
    },
  },
  {
    id: 'drumheller',
    labelKey: 'view.defaultPois.drumheller',
    view: {
      center: [-112.71, 51.463] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: 0,
    },
  },
  {
    id: 'edmonton',
    labelKey: 'view.defaultPois.edmonton',
    view: {
      center: [-113.4938, 53.5461] as [number, number],
      zoom: 11,
      pitch: 50,
      bearing: 0,
    },
  },
  {
    id: 'elkIsland',
    labelKey: 'view.defaultPois.elkIsland',
    view: {
      center: [-112.86, 53.6] as [number, number],
      zoom: 11,
      pitch: 60,
      bearing: 0,
    },
  },
  {
    id: 'jasper',
    labelKey: 'view.defaultPois.jasper',
    view: {
      center: [-118.0814, 52.8737] as [number, number],
      zoom: 11,
      pitch: 65,
      bearing: -20,
    },
  },
  {
    id: 'lakeLouise',
    labelKey: 'view.defaultPois.lakeLouise',
    view: {
      center: [-116.1773, 51.4254] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: -20,
    },
  },
  {
    id: 'watertonLakes',
    labelKey: 'view.defaultPois.watertonLakes',
    view: {
      center: [-113.9179, 49.052] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: -20,
    },
  },
  {
    id: 'woodBuffalo',
    labelKey: 'view.defaultPois.woodBuffalo',
    view: {
      center: [-111.17, 58.72] as [number, number],
      zoom: 10,
      pitch: 55,
      bearing: 0,
    },
  },
  {
    id: 'writingOnStone',
    labelKey: 'view.defaultPois.writingOnStone',
    view: {
      center: [-112.976, 49.078] as [number, number],
      zoom: 12,
      pitch: 60,
      bearing: 0,
    },
  },
] as const

export type DefaultPoiId = (typeof DEFAULT_POI_SETTINGS)[number]['id']

export function isDefaultPoiId(poiId: string): poiId is DefaultPoiId {
  return DEFAULT_POI_SETTINGS.some(({ id }) => id === poiId)
}

export function getDefaultPoi(poiId: string) {
  const poi = DEFAULT_POI_SETTINGS.find(({ id }) => id === poiId)

  if (!poi) {
    throw new Error(`Unknown default point of interest "${poiId}"`)
  }

  return poi
}
