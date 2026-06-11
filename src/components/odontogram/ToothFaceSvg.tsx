import { useState } from 'react'
import type { ToothSurface } from '../../data/odontogramState'

// viewBox 0 0 100 100
// Inner square: 28,28 → 72,72 (28% inset from each edge)
interface FaceSurface {
  id: ToothSurface
  points: string
  label: string
}

const FACE_SURFACES: FaceSurface[] = [
  { id: 'vestibular', points: '0,0 100,0 72,28 28,28',   label: 'Vestibular' },
  { id: 'palatino',   points: '28,72 72,72 100,100 0,100', label: 'Palatino'  },
  { id: 'mesial',     points: '0,0 28,28 28,72 0,100',   label: 'Mesial'     },
  { id: 'distal',     points: '72,28 100,0 100,100 72,72', label: 'Distal'    },
  { id: 'oclusal',    points: '28,28 72,28 72,72 28,72',  label: 'Oclusal'   },
]

interface ToothFaceSvgProps {
  selectedSurfaces: ToothSurface[]
  color: string                              // Hex color para superficies seleccionadas
  onToggle?: (surface: ToothSurface) => void // Si se provee: modo interactivo
  size?: number                              // Tamaño fijo en px; sin él: fill container
}

function ToothFaceSvg({ selectedSurfaces, color, onToggle, size }: ToothFaceSvgProps) {
  const [hovered, setHovered] = useState<ToothSurface | null>(null)
  const isInteractive = !!onToggle

  return (
    <svg
      viewBox="0 0 100 100"
      aria-label="Diagrama de superficies del diente"
      style={
        size
          ? { display: 'block', width: size, height: size }
          : { display: 'block', width: '100%', height: '100%' }
      }
    >
      {FACE_SURFACES.map(({ id, points, label }) => {
        const isSelected = selectedSurfaces.includes(id)
        const isHovered  = hovered === id && isInteractive && !isSelected

        const fill = isSelected ? color : isHovered ? `${color}28` : '#ffffff'

        return (
          <polygon
            key={id}
            points={points}
            fill={fill}
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinejoin="miter"
            aria-label={label}
            style={{ cursor: isInteractive ? 'pointer' : 'default', transition: 'fill 0.1s ease' }}
            onClick={onToggle ? () => onToggle(id) : undefined}
            onMouseEnter={onToggle ? () => setHovered(id) : undefined}
            onMouseLeave={onToggle ? () => setHovered(null) : undefined}
          />
        )
      })}
    </svg>
  )
}

export default ToothFaceSvg
