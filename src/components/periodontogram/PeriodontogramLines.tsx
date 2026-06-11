import type { PeriodontogramState } from './PeriodontogramSection'

interface PeriodontogramLinesProps {
  data: PeriodontogramState
  teethOrder: number[]
  view: 'vestibular' | 'palatinoLingual'
  rootsPointUp: boolean
  isLowerArch?: boolean
}

export default function PeriodontogramLines({ data, teethOrder, view, rootsPointUp, isLowerArch = false }: PeriodontogramLinesProps) {
  // SVG Coordinate space: 0 to 1000 in X, 0 to 100 in Y
  const width = 1000
  const height = 100
  
  let baselineY
  if (isLowerArch) {
    baselineY = rootsPointUp ? 66.5 : 36 // Adjusted lower arch baselines (moved up by 1)
  } else {
    baselineY = rootsPointUp ? 64 : 33.5 // Upper arch specific baselines
  }
  
  const spacingY = 3.5 // Spacing between each of the 17 lines in %

  // Generate the 48 points (16 teeth * 3 sites)
  const totalPoints = 48
  const startX = 30
  const endX = 970
  const stepX = (endX - startX) / (totalPoints - 1)

  const redPoints: string[] = []
  const bluePoints: string[] = []

  let pointIndex = 0

  teethOrder.forEach(tooth => {
    const toothData = data[tooth][view]
    
    for (let site = 0; site < 3; site++) {
      const x = startX + (stepX * pointIndex)
      
      const margen = typeof toothData.margen[site] === 'number' ? toothData.margen[site] : 0
      const profundidad = typeof toothData.profundidad[site] === 'number' ? toothData.profundidad[site] : 0
      
      let redY, blueY

      if (rootsPointUp) {
        redY = baselineY - (margen * spacingY) // Negative margin goes UP
        blueY = baselineY - ((margen - profundidad) * spacingY)
      } else {
        redY = baselineY + (margen * spacingY) // Negative margin goes DOWN
        blueY = baselineY + ((margen - profundidad) * spacingY)
      }

      redPoints.push(`${x},${redY}`)
      bluePoints.push(`${x},${blueY}`)
      
      pointIndex++
    }
  })

  // Generate the 17 grid lines
  const gridLines = []
  for (let i = 0; i < 17; i++) {
    const y = rootsPointUp ? baselineY - (i * spacingY) : baselineY + (i * spacingY)
    gridLines.push(
      <line 
        key={i} 
        x1="10" 
        y1={y} 
        x2="990" 
        y2={y} 
        stroke={i === 0 ? "#9ca3af" : "#e5e7eb"} // baseline is slightly darker
        strokeWidth={i === 0 ? "0.8" : "0.5"} 
      />
    )
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10" style={{ opacity: 0.8 }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
        {/* 17 Background Grid Lines */}
        {gridLines}
        
        {/* Margen Gingival (Red Lines) */}
        <polyline
          points={redPoints.slice(0, 24).join(' ')}
          fill="none"
          stroke="#ef4444" // red-500
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <polyline
          points={redPoints.slice(24).join(' ')}
          fill="none"
          stroke="#ef4444" // red-500
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Nivel de Inserción / Profundidad (Blue Lines) */}
        <polyline
          points={bluePoints.slice(0, 24).join(' ')}
          fill="none"
          stroke="#3b82f6" // blue-500
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <polyline
          points={bluePoints.slice(24).join(' ')}
          fill="none"
          stroke="#3b82f6" // blue-500
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
