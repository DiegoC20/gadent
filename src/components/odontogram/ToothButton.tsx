import { useRef, useState } from 'react'
import { dentalFindings, OPTION_ABBREVIATIONS, dentalShortcuts, type DentalFinding, type FindingAction } from '../../data/dentalFindings'
import { variantDotColor, type AppliedFinding, type ToothSurface } from '../../data/odontogramState'
import { getOrthoRole, type OrthoRole, type OrthoGroup, type OrthoType } from '../../data/orthoState'
import { SURFACE_MODAL_CONFIG } from './SurfaceModal'
import type { SurfaceModalType } from './SurfaceModal'
import SurfaceModal from './SurfaceModal'
import type { OptionsModalType } from './OptionsModal'
import OptionsModal from './OptionsModal'
import ToothNoteBox from './ToothNoteBox'
import ToothOverlays from './ToothOverlays'
import ToothPopover from './ToothPopover'
import ToothSvg from './ToothSvg'

interface ToothButtonProps {
  number: number
  position: 'upper' | 'lower'
  selected: boolean
  appliedFindings: AppliedFinding[]
  /** Grupos ortho a los que pertenece este diente */
  orthoGroups: OrthoGroup[]
  /** Este diente es el primer diente de un ortho pendiente */
  isPendingOrtho: boolean
  /** Hay un ortho pendiente y este diente puede ser el segundo */
  isPendingTarget: boolean
  /** Si el diente anterior (visualmente a la izquierda) tiene diastema */
  hasLeftDiastema?: boolean
  /** Si el diente anterior (visualmente a la izquierda) tiene frenillo */
  hasLeftFrenillo?: boolean
  /** Si el diente anterior (visualmente a la izquierda) tiene fusión */
  hasLeftFusion?: boolean
  /** Si el diente anterior (visualmente a la izquierda) tiene supernumeraria */
  hasLeftSupernumeraria?: boolean
  onSelect: (number: number) => void
  onDeselect: () => void
  onSelectFinding: (finding: DentalFinding, action: FindingAction, option?: string) => void
  onRemoveAllFindings: (toothNumber: number) => void
  onRemoveFinding: (toothNumber: number, findingId: string) => void
  onApplySurfaceFindings: (toothNumber: number, type: SurfaceModalType, surfaces: ToothSurface[], option?: string) => void
  onOrthoAction: (toothNumber: number, findingId: string, variant: 'blue' | 'red', type: OrthoType) => void
  onOrthoSecondClick: (secondToothNumber: number) => void
  onRemoveOrthoGroup: (groupId: string) => void
}

function ToothButton({
  number,
  position,
  selected,
  appliedFindings,
  orthoGroups,
  isPendingOrtho,
  isPendingTarget,
  hasLeftDiastema,
  hasLeftFrenillo,
  hasLeftFusion,
  hasLeftSupernumeraria,
  onSelect,
  onDeselect,
  onSelectFinding,
  onRemoveAllFindings,
  onRemoveFinding,
  onApplySurfaceFindings,
  onOrthoAction,
  onRemoveOrthoGroup,
}: ToothButtonProps) {
  const isUpper = position === 'upper'
  const toothBtnRef = useRef<HTMLButtonElement>(null)

  // Estado local para el modal de superficies
  const [surfaceModal, setSurfaceModal] = useState<SurfaceModalType | null>(null)
  const [pendingOptionsFinding, setPendingOptionsFinding] = useState<{ finding: DentalFinding, action: FindingAction, type: OptionsModalType } | null>(null)
  const [showAbbrPopover, setShowAbbrPopover] = useState(false)

  // Hallazgos con abreviatura (ej. 'CT' para Corona Temporal, o de opciones)
  const abbrFindings = appliedFindings
    .map((af) => {
      let meta: Partial<DentalFinding> | undefined = dentalFindings.find((df) => df.id === af.findingId)
      
      if (!meta) {
        const sc = dentalShortcuts.find((s) => s.id === af.findingId)
        if (sc) meta = { id: sc.id, label: sc.label }
      }

      let abbreviation = meta?.abbreviation
      let label = meta?.label

      if (af.option && OPTION_ABBREVIATIONS[af.option]) {
        abbreviation = OPTION_ABBREVIATIONS[af.option]
        label = af.option
      }

      if (af.findingId === 'trat-pulpar') {
        abbreviation = 'TC'
        label = af.variant === 'blue' ? 'Tratamiento de conductos' : 'mal estado'
      }

      if (af.findingId === 'pulpectomia') {
        abbreviation = 'PC'
      }

      if (af.findingId === 'pulpotomia') {
        abbreviation = 'PP'
        label = af.variant === 'blue' ? 'Pulpotomía (buen estado)' : 'Pulpotomía (mal estado)'
      }

      if (af.findingId === 'sellantes') {
        abbreviation = 'S'
        label = af.variant === 'blue' ? 'Sellantes (buen estado)' : 'Sellantes (mal estado)'
      }

      if (af.findingId === 'implante') {
        abbreviation = 'IMP'
        label = af.variant === 'blue' ? 'Implante dental (buen estado)' : 'Implante dental (mal estado)'
      }

      if (af.findingId === 'movilidad') {
        abbreviation = af.option === 'Movilidad patológica nivel 1' ? 'M1' : af.option === 'Movilidad patológica nivel 2' ? 'M2' : 'M'
        label = af.option || 'Movilidad patológica'
      }

      if (af.findingId === 'posicion') {
        abbreviation = af.option?.charAt(0) || ''
        label = af.option ? `Posición dentaria (${af.option})` : 'Posición dentaria'
      }

      if (af.findingId === 'pieza-intruida-anquilosis') {
        abbreviation = 'Anquil.'
      }

      return abbreviation ? { ...af, abbreviation, label: label || '' } : null
    })
    .filter(Boolean) as (AppliedFinding & { abbreviation: string; label: string })[]

  function handleOpenSurfaceModal(type: SurfaceModalType) {
    onDeselect()          // Cierra el popover deseleccionando el diente
    setSurfaceModal(type) // Abre el modal de superficies
  }

  function handleSurfaceModalSave(surfaces: ToothSurface[], option?: string) {
    if (surfaceModal) {
      onApplySurfaceFindings(number, surfaceModal, surfaces, option)
    }
    setSurfaceModal(null)
  }

  // Clases visuales del botón
  const btnCls = [
    'w-full rounded px-0.5 py-1 transition-colors',
    selected        ? 'bg-cyan-100 ring-2 ring-cyan-300'  : '',
    isPendingOrtho  ? 'ring-2 ring-amber-400 bg-amber-50' : '',
    isPendingTarget ? 'cursor-crosshair hover:bg-blue-50'  : 'hover:bg-gray-100',
    !selected && !isPendingOrtho ? '' : '',
  ].filter(Boolean).join(' ')

  const renderAbbreviations = () => {
    if (abbrFindings.length === 0) return null

    const displayAbbrs = abbrFindings.slice(0, 1).map((f) => f.abbreviation || f.label)
    const hasMore = abbrFindings.length > 1
    const displayText = displayAbbrs.join(', ') + (hasMore ? ', ...' : '')

    // Color de la abreviatura: azul si todos son blue, rojo si alguno es red, gris si single
    let abbrColor = abbrFindings.some((f) => f.variant === 'red')
      ? 'text-red-600'
      : abbrFindings.some((f) => f.variant === 'blue')
      ? 'text-blue-600'
      : 'text-red-600'

    // Forzar color rojo para la abreviatura de Anquilosis aunque su variante sea blue (para el plan de tto)
    if (abbrFindings.some(f => f.findingId === 'pieza-intruida-anquilosis')) {
      abbrColor = 'text-red-600'
    }

    return (
      <div className={`relative flex flex-col items-center ${isUpper ? 'mb-1' : 'mt-1'}`}>
        <button
          type="button"
          className={`text-sm font-medium hover:underline ${abbrColor}`}
          title={abbrFindings.map((f) => {
            const abbr = f.abbreviation || f.label;
            return `${abbr}: ${f.label}. Clic para eliminar`
          }).join(' | ')}
          onClick={(e) => {
            e.stopPropagation()
            setShowAbbrPopover(true)
          }}
        >
          {displayText}
        </button>

        {showAbbrPopover && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={(e) => { e.stopPropagation(); setShowAbbrPopover(false) }}
            />
            <div className={`absolute z-50 w-max rounded-lg border border-gray-200 bg-white p-2 shadow-lg ${isUpper ? 'top-full mt-1' : 'bottom-full mb-1'}`}>
              <div className="flex flex-col gap-2">
                {abbrFindings.map((f) => (
                  <div 
                    key={f.id} 
                    className="flex items-center gap-3 rounded-md border border-gray-400 bg-white px-2 py-1"
                    title={`${f.abbreviation}: ${f.label}`}
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${
                        f.findingId === 'defectos-esmalte' ? 'bg-yellow-400' :
                        f.findingId === 'extraccion' ? 'bg-red-500' :
                        f.findingId === 'fractura' ? 'bg-red-500' :
                        f.findingId === 'frenillo-corto' ? 'bg-red-500' :
                        f.findingId === 'fusion' ? 'bg-blue-500' :
                        f.findingId === 'geminacion' ? 'bg-blue-500' :
                        f.findingId === 'gingivitis' ? 'bg-red-500' :
                        f.findingId === 'giroversion' ? 'bg-blue-500' :
                        variantDotColor(f.variant)
                      }`} />
                    <span className="text-sm font-medium text-gray-700">
                      {f.findingId === 'giroversion' && f.icon?.includes('_b_thumb') ? 'Giroversión der a izq' : f.abbreviation || f.label}
                    </span>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveFinding(number, f.id)
                        if (abbrFindings.length <= 1) setShowAbbrPopover(false)
                      }}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 min-w-0 max-w-[100px] flex-col items-center">
      {isUpper && (
        <>
          {renderAbbreviations()}
          <ToothNoteBox toothNumber={number} />
          <span className="my-0.5 text-sm font-medium text-gray-500">{number}</span>
        </>
      )}

      <button
        ref={toothBtnRef}
        type="button"
        onClick={() => (selected ? onDeselect() : onSelect(number))}
        className={btnCls}
        aria-label={`Diente ${number}`}
        aria-pressed={selected}
      >
        <div className="relative w-full">
          <div className={appliedFindings.some(f => f.findingId === 'pieza-ausente') ? 'opacity-30' : ''}>
            <ToothSvg number={number} flipped={!isUpper} />
          </div>
          
          {/* Ortho overlays — dibujados exactamente encima del diente */}
          {orthoGroups.map((group) => {
            if (group.type === 'carillas-varios') {
              const color = group.variant === 'red' ? '#e8281e' : '#0880D7'
              return (
                <div
                  key={group.id}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    transform: isUpper ? undefined : 'scaleY(-1)',
                  }}
                >
                  <svg viewBox="0 0 80 150" className="h-full w-full">
                    <path d="M 10.1,74.7 L 69.6,74.7 L 69.6,105 C 69.6,128 10.1,128 10.1,105 Z" fill={color} />
                  </svg>
                </div>
              )
            }

            const role = getOrthoRole(number, group)
            
            // Calculamos sangría para que las líneas se unan a pesar del 'gap-1' (4px)
            const style: React.CSSProperties = {
              width: role === 'medium' ? 'calc(100% + 4px)' : 'calc(100% + 2px)',
              left: role === 'end' || role === 'medium' ? '-2px' : '0px',
              top: '0px',
              transform: isUpper ? undefined : 'scaleY(-1)',
            }

            if (group.type === 'protesis-fija') {
              const color = group.variant === 'red' ? '#e8281e' : '#007cd6'
              return (
                <div key={group.id} className="pointer-events-none absolute z-[30] h-full" style={style}>
                  <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible" preserveAspectRatio="none">
                    {role === 'begin' && (
                      <g>
                        <path stroke={color} strokeWidth="3" fill="none" d="M 40,25 V 5" />
                        <path stroke={color} strokeWidth="3" fill="none" d="M 40,5 H 80" />
                      </g>
                    )}
                    {role === 'medium' && (
                      <path stroke={color} strokeWidth="3" fill="none" d="M 0,5 H 80" />
                    )}
                    {role === 'end' && (
                      <g>
                        <path stroke={color} strokeWidth="3" fill="none" d="M 40,25 V 5" />
                        <path stroke={color} strokeWidth="3" fill="none" d="M 0,5 H 40" />
                      </g>
                    )}
                  </svg>
                </div>
              )
            }

            if (group.type === 'protesis-total') {
              const color = group.variant === 'red' ? '#e8281e' : '#007cd6'
              return (
                <div key={group.id} className="pointer-events-none absolute z-[30] h-full" style={style}>
                  <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible" preserveAspectRatio="none">
                    <path stroke={color} strokeWidth="3" fill="none" d="M 0,92 H 80" />
                    <path stroke={color} strokeWidth="3" fill="none" d="M 0,97 H 80" />
                  </svg>
                </div>
              )
            }

            if (group.type === 'protesis-removible') {
              const color = group.variant === 'red' ? '#e8281e' : '#007cd6'
              return (
                <div
                  key={group.id}
                  className="absolute inset-0 pointer-events-none z-[30]"
                  style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}
                >
                  <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible">
                    <path stroke={color} strokeWidth="3" fill="none" d="M 0,3 H 80" />
                    <path stroke={color} strokeWidth="3" fill="none" d="M 0,10 H 80" />
                  </svg>
                </div>
              )
            }

            if (group.type === 'edentulo-total') {
              return (
                <div
                  key={group.id}
                  className="pointer-events-none absolute z-[30]"
                  style={{
                    ...style,
                    top: isUpper ? '64%' : '36%', // Exactamente en el centro de la corona (y=96 en viewBox 150)
                    transform: 'translateY(-50%)',
                    height: '6px',
                    backgroundColor: '#007cd6',
                  }}
                />
              )
            }

            return (
              <img
                key={group.id}
                src={`/odontogram/ortho/${group.type === 'removible' ? 'removable/' : ''}${group.variant === 'blue' ? 'blue' : 'red'}${group.type === 'removible' ? '' : `-${role}`}.svg`}
                alt=""
                aria-hidden
                draggable={false}
                className="pointer-events-none absolute top-0 h-full max-w-none"
                style={style}
              />
            )
          })}

          {/* Diastemas: se dibujan usando el mismo viewBox del diente (80x150) para estar a la misma altura */}
          {/* Mitad derecha (`)`) */}
          {appliedFindings.some((f) => f.findingId === 'diastema') && (
            <svg viewBox="0 0 80 150" className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-visible" style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}>
              <path d="M 70,45 Q 95,95 70,145" fill="none" stroke="#007cd6" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          )}
          {/* Mitad izquierda (`(`) */}
          {hasLeftDiastema && (
            <svg viewBox="0 0 80 150" className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-visible" style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}>
              <path d="M 10,45 Q -15,95 10,145" fill="none" stroke="#007cd6" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          )}

          {/* Frenillo corto: arcos rojos en la zona de la raíz, apuntando hacia afuera */}
          {/* Mitad derecha: curva abajo-derecha desde el borde derecho de la corona */}
          {appliedFindings.some((f) => f.findingId === 'frenillo-corto') && (
            <svg viewBox="0 0 80 150" className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-visible"
              style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}>
              <path d="M 56,123 C 76,123 78,129 78,142" fill="none" stroke="#e40000" strokeWidth="4" strokeLinecap="round" />
            </svg>
          )}
          {/* Mitad izquierda: curva abajo-izquierda en el diente vecino */}
          {hasLeftFrenillo && (
            <svg viewBox="0 0 80 150" className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-visible"
              style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}>
              <path d="M 24,123 C 4,123 2,129 2,142" fill="none" stroke="#e40000" strokeWidth="4" strokeLinecap="round" />
            </svg>
          )}

          {/* Fusión: dos lunas enfrentadas en la parte superior (sobre la raíz, pero dentro del div) */}
          {/* Mitad derecha: luna que mira hacia la izquierda, ubicada en la parte derecha */}
          {appliedFindings.some((f) => f.findingId === 'fusion') && (
            <svg viewBox="0 0 80 150" className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-visible"
              style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}>
              <path d="M 80,0 C 45,0 45,36 80,36 C 73,36 73,0 80,0 Z" fill="none" stroke="#4886e0" strokeWidth="2" />
            </svg>
          )}
          {/* Mitad izquierda: luna que mira hacia la derecha, en el diente vecino */}
          {hasLeftFusion && (
            <svg viewBox="0 0 80 150" className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-visible"
              style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}>
              <path d="M 0,0 C 35,0 35,36 0,36 C 7,36 7,0 0,0 Z" fill="none" stroke="#4886e0" strokeWidth="2" />
            </svg>
          )}

          {/* Pieza dental supernumeraria: Círculo con una "S" en medio, ubicado entre dos dientes, dibujando mitades a la altura de la raíz */}
          {appliedFindings.some((f) => f.findingId === 'supernumeraria') && (
            <svg viewBox="0 0 80 150" className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-hidden"
              style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}>
              <circle cx="80" cy="20" r="15" fill="none" stroke="#007cd6" strokeWidth="3" />
              <text x="80" y="28" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#007cd6">S</text>
            </svg>
          )}
          {hasLeftSupernumeraria && (
            <svg viewBox="0 0 80 150" className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-hidden"
              style={{ transform: isUpper ? undefined : 'scaleY(-1)' }}>
              <circle cx="0" cy="20" r="15" fill="none" stroke="#007cd6" strokeWidth="3" />
              <text x="0" y="28" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#007cd6">S</text>
            </svg>
          )}

          <ToothOverlays findings={appliedFindings} position={position} />
        </div>
      </button>

      {!isUpper && (
        <>
          <span className="my-0.5 text-sm font-medium text-gray-500">{number}</span>
          <ToothNoteBox toothNumber={number} />
          {renderAbbreviations()}
        </>
      )}

      {/* Indicador visual de "esperando segundo diente" */}
      {isPendingOrtho && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-amber-400 px-1 py-0.5 text-[9px] font-bold text-white shadow">
          ←selecciona otro diente
        </span>
      )}

      {/* Popover de hallazgos */}
      {selected && (
        <ToothPopover
          toothNumber={number}
          anchorRef={toothBtnRef}
          placement="above"
          appliedFindings={appliedFindings}
          orthoGroups={orthoGroups}
          onClose={onDeselect}
          onSelectFinding={(finding, action) => {
            if (finding.id === 'defectos-esmalte' || finding.id === 'movilidad' || finding.id === 'posicion') {
              onDeselect()
              setPendingOptionsFinding({ finding, action, type: finding.id as OptionsModalType })
              return
            } else {
              onSelectFinding(finding, action)
            }
          }}
          onRemoveAllFindings={() => onRemoveAllFindings(number)}
          onRemoveFinding={(findingId) => onRemoveFinding(number, findingId)}
          onOpenSurfaceModal={handleOpenSurfaceModal}
          onOrthoAction={(findingId, variant, type) => onOrthoAction(number, findingId, variant, type)}
          onRemoveOrthoGroup={onRemoveOrthoGroup}
        />
      )}

      {/* Modal de selección de superficies (caries / restauración) */}
      {surfaceModal && (
        <SurfaceModal
          type={surfaceModal}
          toothNumber={number}
          onClose={() => setSurfaceModal(null)}
          onSave={handleSurfaceModalSave}
        />
      )}

      {/* Modal de opciones simples (ej. defectos-esmalte) */}
      {pendingOptionsFinding && (
        <OptionsModal
          type={pendingOptionsFinding.type}
          onClose={() => setPendingOptionsFinding(null)}
          onSave={(option) => {
            onSelectFinding(pendingOptionsFinding.finding, pendingOptionsFinding.action, option)
            setPendingOptionsFinding(null)
          }}
        />
      )}
    </div>
  )
}

export default ToothButton
