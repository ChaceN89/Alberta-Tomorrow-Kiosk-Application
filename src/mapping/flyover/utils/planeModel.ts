/**
  File: planeModel.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Load the aircraft FBX once and hand out sized, correctly facing copies.

  Usage:
  - Imported by FlightPlaneOverlay and preloadFlightPlane.

  Notes:
  - Uses the same aircraft files as the journal's model viewer. Copies share
    geometry and materials, so they must not be disposed.
 */
import {
  Box3,
  Group,
  LoadingManager,
  Mesh,
  SRGBColorSpace,
  Texture,
  Vector3,
} from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import planeModelUrl from '@/assets/plane/GArt-Plane.fbx?url'
import planeTextureUrl from '@/assets/plane/GArt-Plane-texture.png'
import {
  FLYOVER_PLANE_MODEL_ROTATION_DEGREES,
  FLYOVER_PLANE_SIZE,
} from '../../map-settings/flyoverSettings'
import { degreesToRadians } from './flightMath'

let planeTemplate: Promise<Group> | null = null

// Function: Scale and center the loaded model, then turn it to face away from the camera.
function prepareModel(model: Group) {
  const bounds = new Box3().setFromObject(model)
  const size = bounds.getSize(new Vector3())
  const center = bounds.getCenter(new Vector3())
  const largestSide = Math.max(size.x, size.y, size.z)

  if (!Number.isFinite(largestSide) || largestSide <= 0) {
    throw new Error('The aircraft model has invalid dimensions.')
  }

  const scale = FLYOVER_PLANE_SIZE / largestSide
  model.scale.setScalar(scale)
  model.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
  model.traverse((child) => {
    if (!(child instanceof Mesh)) return

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material]
    for (const material of materials) {
      if ('map' in material && material.map instanceof Texture) {
        material.map.colorSpace = SRGBColorSpace
      }
    }
  })

  const holder = new Group()
  holder.add(model)
  holder.rotation.set(
    degreesToRadians(FLYOVER_PLANE_MODEL_ROTATION_DEGREES.x),
    degreesToRadians(FLYOVER_PLANE_MODEL_ROTATION_DEGREES.y),
    degreesToRadians(FLYOVER_PLANE_MODEL_ROTATION_DEGREES.z),
  )
  return holder
}

// Function: Load the aircraft model once; later calls reuse the result.
export function loadFlightPlane() {
  planeTemplate ??= new Promise<Group>((resolve, reject) => {
    const manager = new LoadingManager()
    manager.setURLModifier((url) =>
      url.toLowerCase().endsWith('.psd') ? planeTextureUrl : url,
    )
    manager.onError = (url) =>
      console.error(new Error(`Unable to load aircraft asset: ${url}`))

    new FBXLoader(manager).load(
      planeModelUrl,
      (model) => {
        try {
          resolve(prepareModel(model))
        } catch (error) {
          reject(error)
        }
      },
      undefined,
      reject,
    )
  }).catch((error: unknown) => {
    planeTemplate = null
    throw error
  })

  return planeTemplate
}
