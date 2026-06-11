/**
 * ToothSurfaceOverlay
 *
 * Renders colored SVG polygons directly in the tooth's coordinate space (viewBox 0 0 80 150),
 * matching exactly the sections of the crown as drawn in each tooth SVG file.
 *
 * Crown geometry (shared by all tooth types — confirmed from each SVG):
 *   Outer rect: x≈10.5, y≈75.0, w≈59.3, h≈42.3  → bottom-right: (69.8, 117.3)
 *   Inner rect: x≈22.5, y≈83.5, w≈35.0, h≈25.0  → bottom-right: (57.5, 108.5)
 *
 * For UPPER teeth (not flipped): crown is at the BOTTOM of the 150px SVG.
 * For LOWER teeth (scaleY(-1)): the tooth image is flipped, so the overlay
 *   coordinates must be mirrored vertically (y → 150 - y) so they align
 *   with the visually-top crown.
 */

import type { ToothSurface } from '../../data/odontogramState'

// ── Upper-tooth polygon points (viewBox 0 0 80 150) ──────────────────────────
// Outer corners:  TL=(10.5,75)  TR=(69.8,75)  BR=(69.8,117.3) BL=(10.5,117.3)
// Inner corners:  TL=(22.5,83.5) TR=(57.5,83.5) BR=(57.5,108.5) BL=(22.5,108.5)

const UPPER: Record<ToothSurface, string> = {
  vestibular: '10.5,75  69.8,75  57.5,83.5  22.5,83.5',
  palatino:   '22.5,108.5  57.5,108.5  69.8,117.3  10.5,117.3',
  mesial:     '10.5,75  22.5,83.5  22.5,108.5  10.5,117.3',
  distal:     '57.5,83.5  69.8,75  69.8,117.3  57.5,108.5',
  oclusal:    '22.5,83.5  57.5,83.5  57.5,108.5  22.5,108.5',
}

// ── Lower-tooth polygon points (y mirrored: 150 - y_upper) ───────────────────
// After scaleY(-1) the tooth image is flipped.  The overlay is NOT flipped,
// so we mirror the y-coordinates so they land on the visually-top crown area.
// Outer corners:  TL=(10.5,32.7) TR=(69.8,32.7) BR=(69.8,75) BL=(10.5,75)
// Inner corners:  TL=(22.5,41.5) TR=(57.5,41.5) BR=(57.5,66.5) BL=(22.5,66.5)

const LOWER: Record<ToothSurface, string> = {
  vestibular: '10.5,32.7  69.8,32.7  57.5,41.5  22.5,41.5',
  palatino:   '22.5,66.5  57.5,66.5  69.8,75  10.5,75',
  mesial:     '10.5,32.7  22.5,41.5  22.5,66.5  10.5,75',
  distal:     '57.5,41.5  69.8,32.7  69.8,75  57.5,66.5',
  oclusal:    '22.5,41.5  57.5,41.5  57.5,66.5  22.5,66.5',
}

interface ToothSurfaceOverlayProps {
  surfaces: ToothSurface[]
  color: string
  position: 'upper' | 'lower'
}

/**
 * Renders an SVG overlay in the same 0 0 80 150 coordinate space as the tooth,
 * painting only the selected surface polygons with the given color.
 *
 * The SVG is sized to match the tooth image (38 × 72 px) and is absolutely
 * positioned to cover the full tooth (including roots), then each polygon
 * naturally covers only its crown section.
 */
function ToothSurfaceOverlay({ surfaces, color, position }: ToothSurfaceOverlayProps) {
  const MAP = position === 'upper' ? UPPER : LOWER

  return (
    <svg
      viewBox="0 0 80 150"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {surfaces.map((surface) => (
        <polygon
          key={surface}
          points={MAP[surface]}
          fill={color}
          fillOpacity="0.75"
        />
      ))}
    </svg>
  )
}

export default ToothSurfaceOverlay
