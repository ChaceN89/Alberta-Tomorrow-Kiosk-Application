/**
  File: poiClusterSettings.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Configure the screen-space distance used to group nearby map markers.

  Usage:
  - Imported by AlbertaMap and its map settings controls.

  Notes:
  - A radius of zero disables marker clustering.
 */
// Starting screen-space distance in pixels; increase to group more POIs and
// decrease to keep more POIs separate until they are closer together.
export const DEFAULT_POI_CLUSTER_RADIUS = 70

// Smallest slider value in pixels; 0 disables clustering. Raising it enforces
// a larger minimum grouping distance, while lowering it allows finer control.
export const MIN_POI_CLUSTER_RADIUS = 0

// Largest slider value in pixels; raising it allows broader clusters, while
// lowering it limits how far apart POIs can be and still cluster.
export const MAX_POI_CLUSTER_RADIUS = 160

// Slider increment in pixels; increase for coarser adjustments or decrease
// for finer adjustments to the cluster distance.
export const POI_CLUSTER_RADIUS_STEP = 10

// Additional zoom levels applied after a cluster's calculated split zoom.
export const POI_CLUSTER_ZOOM_OVERSHOOT = 2

// Cluster-click camera transition duration in milliseconds; increase for a
// slower transition or decrease for a faster one.
export const POI_CLUSTER_ZOOM_DURATION = 800
