import { useState } from 'react'
import type { ToothSurface } from '../../data/odontogramState'

interface PartSurface {
  id: ToothSurface
  path: string
  label: string
}

// Centro de 50,50. Radio exterior 48. Radio interior 22.
// Coordenadas generadas con trigonometría para ángulos 45, 135, 225, 315.
// R_out = 48 -> offset = 33.94 -> (16.06, 16.06) o (83.94, 83.94)
// R_in = 22 -> offset = 15.55 -> (34.45, 34.45) o (65.55, 65.55)

const TOOTH_PARTS: PartSurface[] = [
  {
    id: 'vestibular',
    label: 'Vestibular',
    path: 'M 34.45,34.45 L 16.06,16.06 A 48 48 0 0 1 83.94,16.06 L 65.55,34.45 A 22 22 0 0 0 34.45,34.45 Z',
  },
  {
    id: 'distal',
    label: 'Distal/Mesial',
    path: 'M 65.55,34.45 L 83.94,16.06 A 48 48 0 0 1 83.94,83.94 L 65.55,65.55 A 22 22 0 0 0 65.55,34.45 Z',
  },
  {
    id: 'palatino',
    label: 'Palatino/Lingual',
    path: 'M 65.55,65.55 L 83.94,83.94 A 48 48 0 0 1 16.06,83.94 L 34.45,65.55 A 22 22 0 0 0 65.55,65.55 Z',
  },
  {
    id: 'mesial',
    label: 'Mesial/Distal',
    path: 'M 34.45,65.55 L 16.06,83.94 A 48 48 0 0 1 16.06,16.06 L 34.45,34.45 A 22 22 0 0 0 34.45,65.55 Z',
  },
]

interface ToothPartsSvgProps {
  selectedSurfaces: ToothSurface[]
  color: string
  onToggle: (surface: ToothSurface) => void
  size?: number
}

function ToothPartsSvg({ selectedSurfaces, color, onToggle, size = 60 }: ToothPartsSvgProps) {
  const [hovered, setHovered] = useState<ToothSurface | null>(null)

  return (
    <svg
      viewBox="0 0 100 100"
      aria-label="Superficies"
      style={{ display: 'block', width: size, height: size, overflow: 'visible' }}
    >
      {TOOTH_PARTS.map(({ id, path, label }) => {
        const isSelected = selectedSurfaces.includes(id)
        const isHovered = hovered === id && !isSelected
        const fill = isSelected ? color : isHovered ? `${color}28` : '#ffffff'

        return (
          <path
            key={id}
            d={path}
            fill={fill}
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinejoin="round"
            aria-label={label}
            style={{ cursor: 'pointer', transition: 'fill 0.1s ease' }}
            onClick={() => onToggle(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
          />
        )
      })}

      {(() => {
        const id: ToothSurface = 'oclusal'
        const isSelected = selectedSurfaces.includes(id)
        const isHovered = hovered === id && !isSelected
        const fill = isSelected ? color : isHovered ? `${color}28` : '#ffffff'

        return (
          <circle
            cx="50"
            cy="50"
            r="22"
            fill={fill}
            stroke="#9ca3af"
            strokeWidth="2"
            style={{ cursor: 'pointer', transition: 'fill 0.1s ease' }}
            onClick={() => onToggle(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
          />
        )
      })()}
    </svg>
  )
}

export default ToothPartsSvg
