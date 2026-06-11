import type { AppliedFinding } from '../../data/odontogramState'
import type { ToothSurface } from '../../data/odontogramState'

interface ToothOverlaysProps {
  findings: AppliedFinding[]
  position: 'upper' | 'lower'
  hasLeftDiastema?: boolean
}

// Mapeo de tipo de hallazgo → carpeta local de los SVGs de superficie
const SURFACE_DIR: Record<string, string> = {
  red:    'caries',    // caries y restau-nok usan rojo
  blue:   'restau-ok', // restau-ok usa azul
  single: 'caries',   // fallback
}

// La carpeta específica por findingId (para override exacto)
const FINDING_DIR: Record<string, string> = {
  'caries':     'caries',
  'restau-ok':  'restau-ok',
  'restau-nok': 'restau-nok',
}

/**
 * Retorna la ruta al SVG de superficie local.
 * Usa la misma estructura que el app original (doctocliq):
 *   /odontogram/surfaces/{tipo}/{superficie}.svg
 * Cada SVG tiene viewBox="0 0 80 150" → escala igual que el diente.
 */
function surfaceSrc(findingId: string, variant: string, surface: ToothSurface): string {
  const dir = FINDING_DIR[findingId] ?? SURFACE_DIR[variant] ?? 'caries'
  return `/odontogram/surfaces/${dir}/${surface}.svg`
}

function ToothOverlays({ findings, position, hasLeftDiastema }: ToothOverlaysProps) {
  // Hallazgos de caras (caries / restauración) — tienen surfaces[]
  const surfaceFindings = findings.filter((f) => f.surfaces && f.surfaces.length > 0)
  // Hallazgos con ícono SVG tradicional (corona, extracción, etc.)
  const iconFindings = findings.filter((f) => !f.surfaces && f.icon)
  
  if (surfaceFindings.length === 0 && iconFindings.length === 0) return null

  const isUpper = position === 'upper'

  return (
    <div className="pointer-events-none absolute inset-0">
      {/*
       * Overlay de superficies: una imagen SVG por cada cara afectada.
       * Los SVGs tienen viewBox="0 0 80 150" → el mismo sistema de coordenadas
       * que los archivos del diente, por lo que se alinean perfectamente.
       *
       * Para dientes INFERIORES (scaleY(-1)), la imagen del diente está volteada.
       * La imagen de overlay también necesita estar volteada para que las
       * superficies coincidan con el diente visualmente.
       */}
      {surfaceFindings.map((finding) =>
        finding.surfaces!.map((surface) => (
          <img
            key={`${finding.id}-${surface}`}
            src={surfaceSrc(finding.findingId, finding.variant, surface)}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 h-full w-full"
            style={
              isUpper
                ? undefined
                : { transform: 'scaleY(-1)' }
            }
          />
        )),
      )}

      {/* Íconos SVG tradicionales (corona, extracción, etc.) y Carillas */}
      {iconFindings.map((finding) => {
        const isCarilla = finding.findingId === 'carillas' || finding.findingId === 'carillas-varios'
        const isCorona = finding.findingId === 'corona' || finding.findingId === 'corona-temporal'
        const isDefecto = finding.findingId === 'defectos-esmalte'

        if (isCarilla || isCorona || isDefecto) {
          let color = '#e8281e' // default para single/red/corona-temporal
          if (finding.variant === 'blue') color = '#0880D7'

          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full">
                {isCarilla && (
                  <path d="M 10.1,74.7 L 69.6,74.7 L 69.6,105 C 69.6,128 10.1,128 10.1,105 Z" fill={color} />
                )}
                {isCorona && (
                  <rect x="10.1" y="74.7" width="59.5" height="42.46" fill="none" stroke={color} strokeWidth="3" />
                )}
                {isDefecto && (
                  <circle cx="39.85" cy="95.93" r="14" fill="#fde047" stroke="#374151" strokeWidth="1.5" />
                )}
              </svg>
            </div>
          )
        }



        if (finding.findingId === 'espigo-munon') {
          const color = finding.variant === 'blue' ? '#307dc1' : '#e31e26'
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full">
                {/* Rectángulo relleno cubriendo el rectángulo interior de la corona
                    (coordenadas del rect interior del molar: ~x=29,y=83 w=22 h=34) */}
                <rect
                  x="18" y="83"
                  width="44" height="34"
                  fill={color}
                />
                {/* Línea vertical recta desde el centro del rectángulo
                    hasta la punta de la raíz */}
                <line
                  x1="40" y1="83"
                  x2="40" y2="30"
                  stroke={color}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )
        }



        if (finding.findingId === 'pulpotomia') {
          const color = finding.variant === 'blue' ? '#307dc1' : '#e31e26'
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none z-[25]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible">
                <rect x="19" y="82" width="42" height="28" ry="14" fill={color} />
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'restauracion-temporal') {
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none z-[25]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible">
                <rect x="19" y="82" width="42" height="28" ry="14" fill="none" stroke="#e31e26" strokeWidth="2.5" />
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'sellantes') {
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none z-[25]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible">
                <image
                  href={finding.icon}
                  x="20" y="76"
                  width="40" height="40"
                />
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'diastema' || finding.findingId === 'supernumeraria') return null
        if (finding.findingId === 'fosa-fisuras') return null
        if (finding.findingId === 'frenillo-corto') return null
        if (finding.findingId === 'fusion') return null

        if (finding.findingId === 'geminacion' || finding.findingId === 'clavija') {
          const isClavija = finding.findingId === 'clavija'
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none z-[25]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible">
                {isClavija ? (
                  <polygon points="40,4 28,24 52,24" fill="none" stroke="#007cd6" strokeWidth="2" strokeLinejoin="round" />
                ) : (
                  <circle cx="40" cy="16" r="10" fill="none" stroke="#4886e0" strokeWidth="2" />
                )}
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'erupcion') {
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none z-[25]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible">
                {/* Flecha en zigzag indicando erupción (Escalada al 80% y centrada) */}
                <g transform="translate(8, 15) scale(0.8)">
                  <polyline points="40,30 50,50 35,70 45,90 35,120" fill="none" stroke="#007cd6" strokeWidth="4" strokeLinejoin="miter" />
                  <polyline points="20,105 35,120 50,105" fill="none" stroke="#007cd6" strokeWidth="4" strokeLinejoin="miter" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'gingivitis') {
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none z-[25]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible">
                <path d="M 3,85 Q 40,65 77,85" fill="none" stroke="#e31e26" strokeWidth="1.5" strokeLinecap="butt" />
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'lesion-cervical') {
          const color = finding.variant === 'blue' ? '#307dc1' : '#e31e26'
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none z-[25]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible">
                <path d="M 20,85 Q 40,65 60,85" fill="none" stroke={color} strokeWidth="6" strokeLinecap="butt" />
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'giroversion') {
          const isLeft = finding.icon?.includes('_b_thumb')
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none z-[25] flex flex-col justify-end pb-1"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 142 52" className="w-full h-auto px-2" style={{ transform: isLeft ? 'scaleX(-1)' : undefined }}>
                <path d="M141.44,18.05,130.25,48.14a4.7,4.7,0,0,1-8.82-3.27h0l7.46-20.07c-23.81,14.08-44.9,23-62.73,23C45.2,47.7,28.92,36.7,18,29.63S1.27,15.5,1.05,15.23a4.7,4.7,0,1,1,7.3-5.92h0l0,0A69.35,69.35,0,0,0,24,22.32c9.82,6.14,24,16,42.18,16,16.06,0,35.44-8.34,58.11-21.77L104.63,9.1a4.7,4.7,0,0,1,1.7-9.1A4.64,4.64,0,0,1,108,.31L138.7,12a4.7,4.7,0,0,1,2.74,6Z" fill="#2f7abf" />
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'fractura') {
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none"
            >
              <svg viewBox="0 0 80 150" className="h-full w-full">
                {/* Línea oblicua roja: de abajo-izquierda a arriba-derecha,
                    replicando el trazo del thumbnail original */}
                <line
                  x1="18" y1="125"
                  x2="62" y2="25"
                  stroke="#e31e26"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'extraccion' || finding.findingId === 'pieza-ausente') {
          const isExtraccion = finding.findingId === 'extraccion'
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none"
            >
              <svg viewBox="0 0 80 150" className="h-full w-full">
                {/* X centrada en el div del diente */}
                <line x1="15" y1="15" x2="65" y2="135" stroke={isExtraccion ? "#e31e26" : "#007cd6"} strokeWidth="5" strokeLinecap="round" />
                <line x1="65" y1="15" x2="15" y2="135" stroke={isExtraccion ? "#e31e26" : "#007cd6"} strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
          )
        }

        const isExtruida = finding.findingId === 'pieza-extruida'
        const isIntruida = finding.findingId === 'pieza-intruida' || finding.findingId === 'pieza-intruida-anquilosis'

        if (isExtruida || isIntruida) {
          return (
            <div
              key={finding.id}
              className="absolute inset-0 pointer-events-none z-[30]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible">
                {isExtruida ? (
                  <g fill="#307dc1">
                    <rect x="36" y="125" width="8" height="15" />
                    <polygon points="30,140 50,140 40,150" />
                  </g>
                ) : (
                  <g fill="#307dc1">
                    <rect x="36" y="135" width="8" height="15" />
                    <polygon points="30,135 50,135 40,125" />
                  </g>
                )}
              </svg>
            </div>
          )
        }

        if (finding.findingId === 'perno-fibra') {
          return (
            <div
              key={finding.id}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-[30]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <img
                src={finding.icon}
                alt={finding.label}
                className="w-[26%] h-auto object-contain drop-shadow-sm pb-[28px]"
                aria-hidden
              />
            </div>
          )
        }

        if (finding.findingId === 'perno-metalico') {
          return (
            <div
              key={finding.id}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-[30]"
              style={{
                transform: isUpper ? undefined : 'scaleY(-1)',
              }}
            >
              <img
                src={finding.icon}
                alt={finding.label}
                className="w-[22%] h-auto object-contain drop-shadow-sm pb-[30px]"
                aria-hidden
              />
            </div>
          )
        }

        // Ignoramos implante porque solo usa abreviatura en el diente, no gráfico
        if (finding.findingId === 'implante') return null;

        if (finding.findingId === 'endodoncia' || finding.findingId === 'pulpectomia') {
          return (
            <div
              key={finding.id}
              className="absolute left-0 right-0 overflow-hidden flex justify-center"
              style={{
                height: '44px',
                ...(isUpper ? { bottom: '20px' } : { top: '20px' }),
              }}
            >
              <img
                src={finding.icon}
                alt=""
                className="h-full w-[80%] object-contain"
                style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}
                aria-hidden
              />
            </div>
          )
        }




        return (
          <div
            key={finding.id}
            className="absolute left-0 right-0 overflow-hidden"
            style={{
              height: '44px',
              ...(isUpper ? { bottom: 0 } : { top: 0 }),
            }}
          >
            <img
              src={finding.icon}
              alt=""
              className="w-full h-full object-contain"
              aria-hidden
            />
          </div>
        )
      })}

      {/* Ya no dibujamos diastemas aquí, se manejan en ToothButton */}
    </div>
  )
}

export default ToothOverlays
