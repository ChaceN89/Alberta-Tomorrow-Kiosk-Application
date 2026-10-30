/**
  File: ModelViewerCanvas.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Render an FBX model with mouse and touch orbit controls.

  Usage:
  - Rendered by ModelViewerBody for content opened in the shared media viewer.

  Notes:
  - External PSD references in FBX files are redirected to the optional PNG texture.
 */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box3,
  DirectionalLight,
  HemisphereLight,
  LoadingManager,
  Mesh,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
  type Group,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import type { ModelViewerContent } from '../provider/types'
import { ExpandableText } from './ExpandableText'

type ModelViewerCanvasProps = {
  content: ModelViewerContent
}

type ModelLoadState =
  | { src: string; textureUrl?: string; status: 'loaded' }
  | {
      src: string
      textureUrl?: string
      status: 'error'
      message: string
    }

function disposeModel(model: Group) {
  model.traverse((child) => {
    if (!(child instanceof Mesh)) return

    child.geometry.dispose()
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material]

    for (const material of materials) {
      if ('map' in material && material.map instanceof Texture) {
        material.map.dispose()
      }
      material.dispose()
    }
  })
}

export function ModelViewerCanvas({ content }: ModelViewerCanvasProps) {
  const { t } = useTranslation('moduleTools')
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadState, setLoadState] = useState<ModelLoadState | null>(null)
  const isCurrentLoadState =
    loadState?.src === content.src &&
    loadState.textureUrl === content.textureUrl
  const isLoaded = isCurrentLoadState && loadState.status === 'loaded'
  const loadError =
    isCurrentLoadState && loadState.status === 'error'
      ? loadState.message
      : null

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current

    if (!stage || !canvas) return

    let isDisposed = false
    let frameId = 0
    let model: Group | null = null
    let hasTextureError = false
    let renderer: WebGLRenderer

    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch (error) {
      console.error('Unable to initialize the 3D model viewer.', error)
      window.queueMicrotask(() => {
        if (isDisposed) return

        setLoadState({
          src: content.src,
          textureUrl: content.textureUrl,
          status: 'error',
          message: t('mediaViewer.modelUnavailable'),
        })
      })
      return () => {
        isDisposed = true
      }
    }

    renderer.outputColorSpace = SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

    const scene = new Scene()
    const camera = new PerspectiveCamera(40, 1, 0.1, 100)
    const ambientLight = new HemisphereLight(0xffffff, 0x4a6259, 2)
    const keyLight = new DirectionalLight(0xffffff, 2.5)
    const fillLight = new DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(4, 6, 5)
    fillLight.position.set(-5, 2, -4)
    scene.add(ambientLight, keyLight, fillLight)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 3
    controls.maxDistance = 6

    const resize = () => {
      const width = stage.clientWidth
      const height = stage.clientHeight
      if (width <= 0 || height <= 0) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(stage)
    resize()

    const manager = new LoadingManager()
    const textureUrl = content.textureUrl
    if (textureUrl) {
      manager.setURLModifier((url) =>
        url.toLowerCase().endsWith('.psd') ? textureUrl : url,
      )
    }
    manager.onError = (url) => {
      if (isDisposed) return

      hasTextureError = true
      const error = new Error(`Unable to load 3D model texture: ${url}`)
      console.error(error)
      setLoadState({
        src: content.src,
        textureUrl: content.textureUrl,
        status: 'error',
        message: t('mediaViewer.modelError'),
      })
    }

    const loader = new FBXLoader(manager)
    loader.load(
      content.src,
      (loadedModel) => {
        if (isDisposed) {
          disposeModel(loadedModel)
          return
        }

        const bounds = new Box3().setFromObject(loadedModel)
        const size = bounds.getSize(new Vector3())
        const center = bounds.getCenter(new Vector3())
        const maxDimension = Math.max(size.x, size.y, size.z)

        if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
          const error = new Error('The 3D model has invalid dimensions.')
          console.error(error)
          disposeModel(loadedModel)
          setLoadState({
            src: content.src,
            textureUrl: content.textureUrl,
            status: 'error',
            message: t('mediaViewer.modelError'),
          })
          return
        }

        loadedModel.traverse((child) => {
          if (!(child instanceof Mesh)) return

          child.castShadow = true
          child.receiveShadow = true
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material]

          for (const material of materials) {
            if ('map' in material && material.map instanceof Texture) {
              material.map.colorSpace = SRGBColorSpace
            }
          }
        })

        const scale = 3 / maxDimension
        loadedModel.scale.setScalar(scale)
        loadedModel.position.set(
          -center.x * scale,
          -center.y * scale,
          -center.z * scale,
        )
        scene.add(loadedModel)
        model = loadedModel

        camera.position.set(4.5, 3.2, 5.5)
        camera.lookAt(0, 0, 0)
        controls.target.set(0, 0, 0)
        controls.update()
        controls.saveState()

        if (!hasTextureError) {
          setLoadState({
            src: content.src,
            textureUrl: content.textureUrl,
            status: 'loaded',
          })
        }
      },
      undefined,
      (error) => {
        if (isDisposed) return

        console.error(`Unable to load 3D model: ${content.src}`, error)
        setLoadState({
          src: content.src,
          textureUrl: content.textureUrl,
          status: 'error',
          message: t('mediaViewer.modelError'),
        })
      },
    )

    const renderFrame = () => {
      frameId = window.requestAnimationFrame(renderFrame)
      controls.update()
      renderer.render(scene, camera)
    }
    renderFrame()

    return () => {
      isDisposed = true
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      controls.dispose()
      if (model) disposeModel(model)
      renderer.dispose()
    }
  }, [content.src, content.textureUrl, t])

  return (
    <div className="media-viewer-model">
      {content.description && (
        <div className="shrink-0 border-b border-line px-4 py-3 md:px-6">
          <ExpandableText text={content.description} />
        </div>
      )}
      <div ref={stageRef} className="media-viewer-model__stage">
        <canvas
          ref={canvasRef}
          aria-label={content.title}
          className="media-viewer-model__canvas"
        />
        {!isLoaded && !loadError && (
          <p role="status" className="media-viewer-model__status text-muted">
            {t('mediaViewer.modelLoading')}
          </p>
        )}
        {loadError && (
          <p
            role="alert"
            className="media-viewer-model__status media-viewer-model__status--error"
          >
            {loadError}
          </p>
        )}
      </div>
      <p className="px-4 pb-3 text-center text-sm text-muted">
        {t('mediaViewer.modelInstructions')}
      </p>
    </div>
  )
}
