/**
  File: FlightPlaneOverlay.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Draw the aircraft over the map and pose it from the flight visual state.

  Usage:
  - Rendered through FlightPlaneLayer while flyover mode is active.

  Notes:
  - The chase camera keeps the plane in the same place on screen, so the plane
    is drawn on its own transparent canvas instead of inside the map.
 */
import { useEffect, useEffectEvent, useRef } from 'react'
import type { RefObject } from 'react'
import {
  DirectionalLight,
  Euler,
  Group,
  HemisphereLight,
  PerspectiveCamera,
  Quaternion,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import {
  FLYOVER_PLANE_VIEW,
  FLYOVER_FOV_DEFAULT,
} from '../../map-settings/flyoverSettings'
import type { FlightVisualState } from '../types'
import { degreesToRadians } from '../utils/flightMath'
import { getFlightOrbitCamera } from '../utils/flightCamera'
import { getFlightPlaneOpacity } from '../utils/flightVisual'
import { loadFlightPlane } from '../utils/planeModel'

type FlightPlaneOverlayProps = {
  visualRef: RefObject<FlightVisualState>
  onReady?: () => void
  onError?: (error: unknown) => void
}

export function FlightPlaneOverlay({
  visualRef,
  onReady,
  onError,
}: FlightPlaneOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const notifyReady = useEffectEvent(() => onReady?.())
  const notifyError = useEffectEvent((error: unknown) => onError?.(error))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch (error) {
      console.error('Unable to initialize the flyover plane.', error)
      notifyError(error)
      return
    }

    renderer.outputColorSpace = SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

    const scene = new Scene()
    const camera = new PerspectiveCamera(FLYOVER_PLANE_VIEW.fov, 1, 0.1, 100)
    camera.position.set(...FLYOVER_PLANE_VIEW.cameraPosition)
    camera.lookAt(...FLYOVER_PLANE_VIEW.lookAt)
    camera.updateMatrixWorld()
    const forwardRotation = camera.quaternion.clone()
    camera.lookAt(0, 0, 0)
    const centeredRotation = camera.quaternion.clone()
    camera.quaternion.copy(forwardRotation)
    const lookRotation = new Euler(0, 0, 0, 'YXZ')
    const lookQuaternion = new Quaternion()
    const keyLight = new DirectionalLight(0xffffff, 2.5)
    keyLight.position.set(4, 6, 5)
    scene.add(new HemisphereLight(0xffffff, 0x4a6259, 2), keyLight)

    const pivot = new Group()
    pivot.rotation.order = 'YXZ'
    scene.add(pivot)

    const cameraRight = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
    const cameraUp = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion)
    const halfHeightAtPlane =
      camera.position.length() *
      Math.tan(degreesToRadians(FLYOVER_PLANE_VIEW.fov) / 2)

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width <= 0 || height <= 0) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    resize()

    let isDisposed = false
    void loadFlightPlane()
      .then((template) => {
        if (!isDisposed) pivot.add(template.clone(true))
      })
      .catch((error: unknown) => {
        console.error('Unable to load the flyover aircraft.', error)
        if (!isDisposed) notifyError(error)
      })

    let frameId = 0
    let hasRenderedAircraft = false
    const renderFrame = () => {
      frameId = window.requestAnimationFrame(renderFrame)

      const visual = visualRef.current
      lookRotation.set(
        degreesToRadians(visual.lookPitch),
        -degreesToRadians(visual.lookYaw),
        0,
      )
      camera.quaternion
        .copy(forwardRotation)
        .slerp(centeredRotation, visual.freeLookProgress)
        .premultiply(lookQuaternion.setFromEuler(lookRotation))
      const orbit = getFlightOrbitCamera(
        visual.lookYaw,
        visual.lookPitch,
        visual.fieldOfView,
      )
      camera.position.copy(orbit.position)
      canvas.style.opacity = String(
        getFlightPlaneOpacity(
          orbit.distance,
          visual.fieldOfView,
          visual.poiFocusProgress,
        ),
      )
      camera.fov =
        (FLYOVER_PLANE_VIEW.fov * visual.fieldOfView) / FLYOVER_FOV_DEFAULT
      camera.updateProjectionMatrix()
      pivot.visible = visual.isVisible
      pivot.position
        .set(0, 0, 0)
        .addScaledVector(
          cameraRight,
          visual.offsetX * halfHeightAtPlane * camera.aspect,
        )
        .addScaledVector(cameraUp, visual.offsetY * halfHeightAtPlane)
      pivot.scale.setScalar(visual.scale)
      // Heading turns clockwise from above, and a right bank rolls clockwise from behind.
      pivot.rotation.set(
        degreesToRadians(visual.pitchDegrees),
        degreesToRadians(-visual.yawDegrees),
        degreesToRadians(-visual.rollDegrees),
      )
      try {
        renderer.render(scene, camera)
        if (
          !hasRenderedAircraft &&
          pivot.children.length > 0 &&
          pivot.visible
        ) {
          hasRenderedAircraft = true
          notifyReady()
        }
      } catch (error) {
        window.cancelAnimationFrame(frameId)
        console.error('Unable to render the flyover aircraft.', error)
        notifyError(error)
      }
    }
    renderFrame()

    return () => {
      isDisposed = true
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      renderer.dispose()
    }
  }, [visualRef])

  return (
    <canvas
      ref={canvasRef}
      className="mapping-flyover-plane"
      aria-hidden="true"
    />
  )
}
