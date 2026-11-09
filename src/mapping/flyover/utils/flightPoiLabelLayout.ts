/**
  File: flightPoiLabelLayout.ts | Author: Chace Nielson
  Date Created: Nov 9, 2026
  Date Updated: Nov 9, 2026

  Description:
  - Separate background flight labels sideways or upward without moving POIs.

  Usage:
  - Retain layout state across map frames and request repaint while settling.

  Notes:
  - Bounded offsets and release padding keep dense groups stable near edges.
 */
import {
  FLYOVER_POI_LABEL_GAP_PIXELS,
  FLYOVER_POI_LABEL_MAX_OFFSET_PIXELS,
  FLYOVER_POI_LABEL_MAX_LIFT_PIXELS,
  FLYOVER_POI_LABEL_MOVE_DURATION_MS,
} from '../../map-settings/flyoverPoiSettings'

export type FlightPoiLabelBounds = {
  id: string
  x: number
  bottom: number
  width: number
  height: number
  priority: number
  depth: number
}

export type FlightPoiLabelOffset = {
  current: number
  target: number
  lift: number
  targetLift: number
  velocity: number
  liftVelocity: number
}

export function layoutFlightPoiLabels(
  labels: readonly FlightPoiLabelBounds[],
  offsets: Map<string, FlightPoiLabelOffset>,
  viewportWidth: number,
  elapsedMs: number,
  reducedMotion: boolean,
  minimumTop = 16,
) {
  const gap = FLYOVER_POI_LABEL_GAP_PIXELS
  const placed: FlightPoiLabelBounds[] = []
  let isAnimating = false
  const ids = new Set(labels.map(({ id }) => id))
  for (const id of offsets.keys()) if (!ids.has(id)) offsets.delete(id)
  const sorted = [...labels].sort(
    (a, b) =>
      a.depth - b.depth || b.priority - a.priority || a.id.localeCompare(b.id),
  )
  for (const label of sorted) {
    const state = offsets.get(label.id) ?? {
      current: 0,
      target: 0,
      lift: 0,
      targetLift: 0,
      velocity: 0,
      liftVelocity: 0,
    }
    const limit = FLYOVER_POI_LABEL_MAX_OFFSET_PIXELS
    const minimum = Math.max(-limit, gap + label.width / 2 - label.x)
    const maximum = Math.min(
      limit,
      viewportWidth - gap - label.width / 2 - label.x,
    )
    // Partially offscreen labels cannot always fit within their lean limit.
    const low = Math.min(minimum, maximum)
    const high = Math.max(minimum, maximum)
    const clampOffset = (value: number) =>
      Math.max(-limit, Math.min(limit, Math.max(low, Math.min(high, value))))
    const maxLift = Math.max(
      0,
      Math.min(
        FLYOVER_POI_LABEL_MAX_LIFT_PIXELS,
        label.bottom - label.height - minimumTop,
      ),
    )
    const clampLift = (value: number) => Math.max(0, Math.min(maxLift, value))
    const overlap = (offset: number, lift: number, padding = gap) =>
      placed.reduce((total, other) => {
        const horizontal = Math.max(
          0,
          Math.min(
            label.x + offset + label.width / 2,
            other.x + other.width / 2 + padding,
          ) -
            Math.max(
              label.x + offset - label.width / 2,
              other.x - other.width / 2 - padding,
            ),
        )
        const vertical = Math.max(
          0,
          Math.min(label.bottom - lift, other.bottom + padding) -
            Math.max(
              label.bottom - lift - label.height,
              other.bottom - other.height - padding,
            ),
        )
        return total + horizontal * vertical
      }, 0)
    const home = clampOffset(0)
    const previous = clampOffset(state.target)
    const horizontal = [
      home,
      previous,
      clampOffset(-limit),
      clampOffset(limit),
      ...placed.flatMap((other) => [
        clampOffset(other.x - (other.width + label.width) / 2 - gap - label.x),
        clampOffset(other.x + (other.width + label.width) / 2 + gap - label.x),
      ]),
    ]
    const lifts = [
      0,
      clampLift(state.targetLift),
      maxLift,
      ...placed.map((other) =>
        clampLift(label.bottom - other.bottom + other.height + gap),
      ),
    ]
    const candidates = horizontal.flatMap((x) =>
      lifts.map((lift) => ({ x, lift })),
    )
    const score = ({ x, lift }: { x: number; lift: number }) =>
      overlap(x, lift) * 1000 +
      Math.hypot(x, lift) +
      Math.hypot(x - previous, lift - state.targetLift) * 0.8
    const target =
      overlap(home, 0, gap * 2) === 0
        ? { x: home, lift: 0 }
        : candidates.reduce(
            (best, candidate) =>
              score(candidate) < score(best) ? candidate : best,
            { x: previous, lift: clampLift(state.targetLift) },
          )
    state.target = target.x
    state.targetLift = target.lift
    const damp = (
      current: number,
      target: number,
      velocity: number,
    ): [number, number] => {
      if (reducedMotion || FLYOVER_POI_LABEL_MOVE_DURATION_MS <= 0)
        return [target, 0]
      const omega = 2 / FLYOVER_POI_LABEL_MOVE_DURATION_MS
      const dt = Math.min(32, Math.max(0, elapsedMs))
      const change = current - target
      const step = (velocity + omega * change) * dt
      const decay = Math.exp(-omega * dt)
      const next = target + (change + step) * decay
      const nextVelocity = (velocity - omega * step) * decay
      if (Math.abs(next - target) < 0.1 && Math.abs(nextVelocity) < 0.001)
        return [target, 0]
      isAnimating = true
      return [next, nextVelocity]
    }
    ;[state.current, state.velocity] = damp(
      state.current,
      state.target,
      state.velocity,
    )
    ;[state.lift, state.liftVelocity] = damp(
      state.lift,
      state.targetLift,
      state.liftVelocity,
    )
    offsets.set(label.id, state)
    placed.push({
      ...label,
      x: label.x + state.target,
      bottom: label.bottom - state.targetLift,
    })
  }
  return isAnimating
}
