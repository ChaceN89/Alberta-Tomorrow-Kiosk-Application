/**
  File: useTerrainControls.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Manage terrain state, exaggeration, and the 2D/3D transition.

  Usage:
  - Used by useAlbertaMapController.

  Notes:
  - Terrain source and hillshade layers are managed by mapLayerFunctions.
 */
import { useState } from 'react'
import type { RefObject } from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import type { Map as MapLibreMap } from 'maplibre-gl'
import {
  DEFAULT_TERRAIN_EXAGGERATION,
  DEFAULT_TERRAIN_PITCH,
  MAX_CAMERA_PITCH,
  TERRAIN_EXAGGERATION_MAX,
  TERRAIN_EXAGGERATION_MIN,
  TERRAIN_SOURCE_ID,
  TERRAIN_TRANSITION_DURATION,
} from '../map-settings/terrainSettings'
import { START_IN_3D_DEFAULT } from '../map-settings/mapSettings'
import { getAnimationDuration } from './mapAnimationFunctions'
import { ensureTerrainSource } from './mapLayerFunctions'

type UseTerrainControlsOptions = {
  mapRef: RefObject<MapRef | null>
  isMapReady: boolean
  isStyleLoading: boolean
  reportError: (error: unknown) => void
  clearError: () => void
}

// Function: Manage terrain state and actions for the map.
export function useTerrainControls({
  mapRef,
  isMapReady,
  isStyleLoading,
  reportError,
  clearError,
}: UseTerrainControlsOptions) {
  const [isTerrainEnabled, setIsTerrainEnabled] = useState(START_IN_3D_DEFAULT)
  const [isTerrainTransitioning, setIsTerrainTransitioning] = useState(false)
  const [terrainExaggeration, setTerrainExaggeration] = useState(
    DEFAULT_TERRAIN_EXAGGERATION,
  )

  // Function: Apply or remove terrain and keep the enabled state synchronized.
  const applyTerrain = (enabled: boolean): MapLibreMap | null => {
    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return null

    try {
      clearError()
      ensureTerrainSource(map)
      map.setTerrain(
        enabled
          ? {
              source: TERRAIN_SOURCE_ID,
              exaggeration: terrainExaggeration,
            }
          : null,
      )
      setIsTerrainEnabled(enabled)
      return map
    } catch (error) {
      reportError(error)
      return null
    }
  }

  // Function: Initialize terrain and the camera pitch from startup defaults.
  const initializeTerrain = (map: MapLibreMap) => {
    map.setTerrain(
      START_IN_3D_DEFAULT
        ? {
            source: TERRAIN_SOURCE_ID,
            exaggeration: DEFAULT_TERRAIN_EXAGGERATION,
          }
        : null,
    )
    map.setMaxPitch(START_IN_3D_DEFAULT ? MAX_CAMERA_PITCH : 0)
  }

  // Function: Validate and apply a new terrain exaggeration value.
  const changeTerrainExaggeration = (exaggeration: number) => {
    try {
      if (
        !Number.isInteger(exaggeration) ||
        exaggeration < TERRAIN_EXAGGERATION_MIN ||
        exaggeration > TERRAIN_EXAGGERATION_MAX
      ) {
        throw new Error(
          `Terrain exaggeration must be an integer from ${TERRAIN_EXAGGERATION_MIN} to ${TERRAIN_EXAGGERATION_MAX}.`,
        )
      }

      const map = mapRef.current?.getMap()
      if (isTerrainEnabled) {
        if (!map || !isMapReady) {
          throw new Error('Cannot update terrain before the map is ready.')
        }

        map.setTerrain({
          source: TERRAIN_SOURCE_ID,
          exaggeration,
        })
      }

      setTerrainExaggeration(exaggeration)
      clearError()
    } catch (error) {
      reportError(error)
    }
  }

  // Function: Toggle terrain with a smooth camera transition between 2D and 3D.
  const toggleTerrain = () => {
    if (isTerrainTransitioning || isStyleLoading) return

    const map = mapRef.current?.getMap()
    if (!map || !isMapReady) return

    if (!isTerrainEnabled) {
      const terrainMap = applyTerrain(true)
      if (!terrainMap) return

      let transitionFinished = false
      // Function: End the transition into 3D only once the camera stops moving.
      const finishTransition = () => {
        if (transitionFinished) return
        transitionFinished = true
        terrainMap.off('moveend', finishTransition)
        setIsTerrainTransitioning(false)
      }

      try {
        terrainMap.setMaxPitch(MAX_CAMERA_PITCH)
        terrainMap.stop()
        setIsTerrainTransitioning(true)
        terrainMap.once('moveend', finishTransition)
        terrainMap.easeTo({
          pitch: DEFAULT_TERRAIN_PITCH,
          duration: getAnimationDuration(TERRAIN_TRANSITION_DURATION),
        })
        if (!terrainMap.isMoving()) finishTransition()
      } catch (error) {
        terrainMap.off('moveend', finishTransition)
        setIsTerrainTransitioning(false)
        reportError(error)
      }

      return
    }

    setIsTerrainTransitioning(true)
    let transitionFinished = false
    // Function: Remove terrain after the camera returns to a flat view.
    const finishTransition = () => {
      if (transitionFinished) return
      transitionFinished = true
      map.off('moveend', finishTransition)

      try {
        if (map.getPitch() <= 0.5) {
          map.setTerrain(null)
          map.setMaxPitch(0)
          setIsTerrainEnabled(false)
          clearError()
        }
      } catch (error) {
        reportError(error)
      } finally {
        setIsTerrainTransitioning(false)
      }
    }

    try {
      map.stop()
      map.once('moveend', finishTransition)
      map.easeTo({
        pitch: 0,
        duration: getAnimationDuration(TERRAIN_TRANSITION_DURATION),
      })
      if (!map.isMoving()) finishTransition()
    } catch (error) {
      map.off('moveend', finishTransition)
      setIsTerrainTransitioning(false)
      reportError(error)
    }
  }

  return {
    isTerrainEnabled,
    isTerrainTransitioning,
    terrainExaggeration,
    applyTerrain,
    initializeTerrain,
    changeTerrainExaggeration,
    toggleTerrain,
  }
}
