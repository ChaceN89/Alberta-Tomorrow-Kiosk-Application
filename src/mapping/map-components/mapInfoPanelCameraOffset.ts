/**
  File: mapInfoPanelCameraOffset.ts | Author: Chace Nielson
  Date Created: Nov 8, 2026
  Date Updated: Nov 8, 2026

  Description:
  - Calculate a camera offset that centers POIs in the unobstructed map area.

  Usage:
  - Used when AlbertaMap opens a POI info panel.

  Notes:
  - Returns a pixel offset from the geometric center of the map container.
 */
export function getMapInfoPanelCameraOffset(
  mapContainer: HTMLElement,
): [number, number] {
  const panel = document.querySelector<HTMLElement>('.map-info-panel')
  if (!panel) return [0, 0]

  const mapBounds = mapContainer.getBoundingClientRect()
  const panelWidth = panel.getBoundingClientRect().width
  const panelInset = Number.parseFloat(
    window.getComputedStyle(panel).insetInlineEnd,
  )
  const panelLeft =
    window.innerWidth -
    (Number.isFinite(panelInset) ? panelInset : 0) -
    panelWidth
  const visibleRightEdge = Math.max(
    mapBounds.left,
    Math.min(mapBounds.right, panelLeft),
  )
  const unobstructedCenter = (mapBounds.left + visibleRightEdge) / 2
  const mapCenter = (mapBounds.left + mapBounds.right) / 2

  return [unobstructedCenter - mapCenter, 0]
}
