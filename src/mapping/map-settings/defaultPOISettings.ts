/**
  File: defaultPOISettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 6, 2026 - CN - Separate marker locations from camera views and add more places.

  Description:
  - Define the default Alberta points of interest and camera destinations.

  Usage:
  - Imported by AlbertaMap and the map camera controls.

  Notes:
  - Coordinates use longitude, latitude order.
  - location is where the marker sits; view is where the camera goes. They can
    match, but a view may frame a whole mountain while the marker stays exact.
  - For large parks and lakes, put the marker on a visitor centre, viewpoint, or
    other real feature rather than an arbitrary center point.
 */
import type { ParseKeys } from 'i18next'
import type { MapPoiDefinition, MapPoiView } from '@/modules/types'
import { frankSlideDefaultPoi } from './default-pois/frankSlide'

export type DefaultPoi = Omit<MapPoiDefinition, 'titleKey' | 'view'> & {
  titleKey: ParseKeys<'mapping'>
  descriptionKey?: ParseKeys<'mapping'>
  imageKey?: 'banff' | 'dinosaurProvincialPark' | 'watertonLakes'
  imageAltKey?: ParseKeys<'mapping'>
  view: MapPoiView
}

export const POI_NAVIGATION_DURATION = 1800

export const DEFAULT_POI_SETTINGS = [
  {
    id: 'athabascaFalls',
    titleKey: 'view.defaultPois.athabascaFalls',
    coordinates: [-117.884, 52.6648] as [number, number],
    view: {
      center: [-117.884, 52.6648] as [number, number],
      zoom: 13,
      pitch: 65,
      bearing: 0,
    },
  },
  {
    id: 'banff',
    titleKey: 'view.defaultPois.banff',
    descriptionKey: 'view.defaultPoiInfo.banff.description',
    imageKey: 'banff',
    imageAltKey: 'view.defaultPoiInfo.banff.imageAlt',
    coordinates: [-115.5708, 51.1784] as [number, number],
    view: {
      center: [-115.5708, 51.1784] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: -20,
    },
  },
  {
    id: 'calgary',
    titleKey: 'view.defaultPois.calgary',
    descriptionKey: 'view.defaultPoiInfo.calgary.description',
    coordinates: [-114.0719, 51.0447] as [number, number],
    view: {
      center: [-114.0719, 51.0447] as [number, number],
      zoom: 11,
      pitch: 50,
      bearing: 0,
    },
  },
  {
    id: 'canmore',
    titleKey: 'view.defaultPois.canmore',
    coordinates: [-115.359, 51.089] as [number, number],
    view: {
      center: [-115.359, 51.089] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: -30,
    },
  },
  {
    id: 'cypressHills',
    titleKey: 'view.defaultPois.cypressHills',
    // Elkwater, the visitor hub of the Alberta side of the park.
    coordinates: [-110.2823, 49.6614] as [number, number],
    view: {
      center: [-110.2823, 49.6614] as [number, number],
      zoom: 11,
      pitch: 60,
      bearing: 0,
    },
  },
  {
    id: 'dinosaurProvincialPark',
    titleKey: 'view.defaultPois.dinosaurProvincialPark',
    descriptionKey: 'view.defaultPoiInfo.dinosaurProvincialPark.description',
    imageKey: 'dinosaurProvincialPark',
    imageAltKey: 'view.defaultPoiInfo.dinosaurProvincialPark.imageAlt',
    coordinates: [-111.528, 50.7566] as [number, number],
    view: {
      center: [-111.528, 50.7566] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: 0,
    },
  },
  {
    id: 'drumheller',
    titleKey: 'view.defaultPois.drumheller',
    coordinates: [-112.71, 51.463] as [number, number],
    view: {
      center: [-112.71, 51.463] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: 0,
    },
  },
  {
    id: 'dunvegan',
    titleKey: 'view.defaultPois.dunvegan',
    // Historic Dunvegan, in the Peace River valley.
    coordinates: [-118.5969, 55.923] as [number, number],
    view: {
      center: [-118.5969, 55.923] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: -20,
    },
  },
  {
    id: 'edmonton',
    titleKey: 'view.defaultPois.edmonton',
    descriptionKey: 'view.defaultPoiInfo.edmonton.description',
    coordinates: [-113.4938, 53.5461] as [number, number],
    view: {
      center: [-113.4938, 53.5461] as [number, number],
      zoom: 11,
      pitch: 50,
      bearing: 0,
    },
  },
  {
    id: 'elkIsland',
    titleKey: 'view.defaultPois.elkIsland',
    coordinates: [-112.86, 53.6] as [number, number],
    view: {
      center: [-112.86, 53.6] as [number, number],
      zoom: 11,
      pitch: 60,
      bearing: 0,
    },
  },
  frankSlideDefaultPoi,
  {
    id: 'headSmashedIn',
    titleKey: 'view.defaultPois.headSmashedIn',
    // The interpretive centre built into the buffalo jump cliffs.
    coordinates: [-113.653, 49.7075] as [number, number],
    view: {
      center: [-113.653, 49.7075] as [number, number],
      zoom: 13,
      pitch: 65,
      bearing: -90,
    },
  },
  {
    id: 'jasper',
    titleKey: 'view.defaultPois.jasper',
    descriptionKey: 'view.defaultPoiInfo.jasper.description',
    coordinates: [-118.0814, 52.8737] as [number, number],
    view: {
      center: [-118.0814, 52.8737] as [number, number],
      zoom: 11,
      pitch: 65,
      bearing: -20,
    },
  },
  {
    id: 'lakeLouise',
    titleKey: 'view.defaultPois.lakeLouise',
    coordinates: [-116.1773, 51.4254] as [number, number],
    view: {
      center: [-116.1773, 51.4254] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: -20,
    },
  },
  {
    id: 'lesserSlaveLake',
    titleKey: 'view.defaultPois.lesserSlaveLake',
    // Lesser Slave Lake Provincial Park, home of the bird observatory.
    coordinates: [-114.8128, 55.4434] as [number, number],
    view: {
      center: [-114.8128, 55.4434] as [number, number],
      zoom: 10,
      pitch: 55,
      bearing: 0,
    },
  },
  {
    id: 'oilSandsDiscoveryCentre',
    titleKey: 'view.defaultPois.oilSandsDiscoveryCentre',
    // The Oil Sands Discovery Centre in Fort McMurray.
    coordinates: [-111.346, 56.6711] as [number, number],
    view: {
      center: [-111.346, 56.6711] as [number, number],
      zoom: 12,
      pitch: 60,
      bearing: 0,
    },
  },
  {
    id: 'rockyMountainHouse',
    titleKey: 'view.defaultPois.rockyMountainHouse',
    coordinates: [-114.9458, 52.362] as [number, number],
    view: {
      center: [-114.9458, 52.362] as [number, number],
      zoom: 13,
      pitch: 60,
      bearing: 0,
    },
  },
  {
    id: 'watertonLakes',
    titleKey: 'view.defaultPois.watertonLakes',
    descriptionKey: 'view.defaultPoiInfo.watertonLakes.description',
    imageKey: 'watertonLakes',
    imageAltKey: 'view.defaultPoiInfo.watertonLakes.imageAlt',
    coordinates: [-113.9179, 49.052] as [number, number],
    view: {
      center: [-113.9179, 49.052] as [number, number],
      zoom: 12,
      pitch: 65,
      bearing: -20,
    },
  },
  {
    id: 'woodBuffalo',
    titleKey: 'view.defaultPois.woodBuffalo',
    coordinates: [-111.17, 58.72] as [number, number],
    view: {
      center: [-111.17, 58.72] as [number, number],
      zoom: 10,
      pitch: 55,
      bearing: 0,
    },
  },
  {
    id: 'writingOnStone',
    titleKey: 'view.defaultPois.writingOnStone',
    coordinates: [-112.976, 49.078] as [number, number],
    view: {
      center: [-112.976, 49.078] as [number, number],
      zoom: 12,
      pitch: 60,
      bearing: 0,
    },
  },
] as const satisfies readonly DefaultPoi[]

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
