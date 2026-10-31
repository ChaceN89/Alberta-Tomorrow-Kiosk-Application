/**
  File: preloadFlightPlane.ts | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Load the plane overlay code and aircraft model on demand.

  Usage:
  - Called by useFlyoverControls once the map is ready, and by FlightPlaneLayer.

  Notes:
  - Keeps three.js and the aircraft files out of the main map bundle until the
    map is ready, so the plane is available when flyover starts.
 */
export const loadFlightPlaneOverlay = () =>
  import('../components/FlightPlaneOverlay')

// Function: Start loading the plane overlay and model in the background.
export function preloadFlightPlane() {
  void loadFlightPlaneOverlay().catch((error: unknown) =>
    console.error('Unable to load the flyover plane overlay.', error),
  )
  void import('./planeModel')
    .then((module) => module.loadFlightPlane())
    .catch((error: unknown) =>
      console.error('Unable to preload the flyover aircraft.', error),
    )
}
