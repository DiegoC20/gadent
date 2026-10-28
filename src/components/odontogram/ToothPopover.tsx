import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { DentalFinding, FindingAction } from '../../data/dentalFindings'
import { dentalFindings, dentalShortcuts, shortcutToFinding } from '../../data/dentalFindings'
import type { AppliedFinding, ToothSurface } from '../../data/odontogramState'
import type { OrthoGroup } from '../../data/orthoState'
import ToothFaceSvg from './ToothFaceSvg'
import type { SurfaceModalType } from './SurfaceModal'

// ──────────────────────────────────────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────────────────────────────────────
interface ToothPopoverProps {
  toothNumber: number
  anchorRef: React.RefObject<HTMLButtonElement | null>
  placement: 'above' | 'below'
  appliedFindings: AppliedFinding[]
  orthoGroups: OrthoGroup[]
  onClose: () => void
  onSelectFinding: (finding: DentalFinding, action: FindingAction) => void
  onRemoveAllFindings: () => void
  onRemoveFinding: (findingId: string) => void
  onOpenSurfaceModal: (type: SurfaceModalType) => void
  /** Llamado cuando se clickea ortho-fijo o removible */
  onOrthoAction: (findingId: string, variant: 'blue' | 'red', type: 'fijo' | 'removible') => void
  onRemoveOrthoGroup: (groupId: string) => void
}

// ──────────────────────────────────────────────────────────────────────────────
// Subcomponentes
// ──────────────────────────────────────────────────────────────────────────────
function ActionButton({
  action,
  label,
  onClick,
}: {
  action: FindingAction
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex h-7 w-7 items-center justify-center rounded text-xs font-semibold transition hover:scale-110 ${
        action.variant === 'red'
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : action.variant === 'blue'
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      aria-label={`${action.variant} – ${label}`}
    >
      {action.icon ? (
        <img src={action.icon} alt="" className="h-4 w-5 object-contain" />
      ) : (
        <span>{action.variant === 'red' ? 'R' : action.variant === 'blue' ? 'A' : 'S'}</span>
      )}
    </button>
  )
}

/** Mini preview de múltiples caras del diente para el tab Eliminar */
function ToothFacePreview({ surfaces, color }: { surfaces: ToothSurface[]; color: string }) {
  return <ToothFaceSvg selectedSurfaces={surfaces} color={color} />
}

// IDs de shortcuts que abren el modal de caras en lugar de aplicar directamente
const SURFACE_SHORTCUT_IDS: SurfaceModalType[] = ['caries', 'restau-ok', 'restau-nok']

// ──────────────────────────────────────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────────────────────────────────────
function ToothPopover({
  toothNumber,
  anchorRef,
  placement,
  appliedFindings,
  orthoGroups,
  onClose,
  onSelectFinding,
  onRemoveAllFindings,
  onRemoveFinding,
  onOpenSurfaceModal,
  onOrthoAction,
  onRemoveOrthoGroup,
}: ToothPopoverProps) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'agregar' | 'eliminar'>('agregar')

  const hasFindings = appliedFindings.length > 0 || orthoGroups.length > 0

  const filtered = search.trim()
    ? dentalFindings.filter(
        (f) =>
          f.label.toLowerCase().includes(search.toLowerCase()) ||
          f.aliases?.some((a) => a.toLowerCase().includes(search.toLowerCase())),
      )
    : dentalFindings

  function handleShortcut(shortcutId: string) {
    const mapped = shortcutToFinding(shortcutId)
    if (mapped) { onSelectFinding(mapped.finding, mapped.action); onClose() }
  }

  // ── Posicionamiento ─────────────────────────────────────────────────────────
  const anchor = anchorRef.current?.getBoundingClientRect()
  if (!anchor) return null

  // Estimamos una altura máxima deseada de 350px para el popover completo
  const ESTIMATED_HEIGHT = 380

  let finalPlacement = placement
  if (placement === 'below' && anchor.bottom + ESTIMATED_HEIGHT > window.innerHeight) {
    // Si se pidió abajo pero no cabe, lo mandamos arriba si hay más espacio arriba
    if (anchor.top > window.innerHeight - anchor.bottom) {
      finalPlacement = 'above'
    }
  } else if (placement === 'above' && anchor.top - ESTIMATED_HEIGHT < 0) {
    // Si se pidió arriba pero no cabe, lo mandamos abajo si hay más espacio abajo
    if (window.innerHeight - anchor.bottom > anchor.top) {
      finalPlacement = 'below'
    }
  }

  // Calculamos el espacio real disponible en la dirección elegida
  const spaceAvailable = finalPlacement === 'above' 
    ? anchor.top - 16 // 16px de padding respecto al borde superior
    : window.innerHeight - anchor.bottom - 16

  // La lista interior (ul) puede scrollear. Le restamos aprox 140px del header del popover.
  const listMaxHeight = Math.max(150, spaceAvailable - 140)

  const top =
    finalPlacement === 'above'
      ? anchor.top - 8
      : anchor.bottom + 8
  const left = anchor.left + anchor.width / 2
  const translateY = finalPlacement === 'above' ? '-100%' : '0%'

  return createPortal(
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      <div
        className="absolute w-72 rounded-xl border border-gray-200 bg-white shadow-xl flex flex-col"
        style={{ top, left, transform: `translateX(-50%) translateY(${translateY})`, maxHeight: spaceAvailable }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Tabs Agregar / Eliminar ─── */}
        {hasFindings && (
          <div className="flex border-b border-gray-200">
            {(['agregar', 'eliminar'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* ── Tab AGREGAR ─────────────────────────────────────────────────── */}
        {(!hasFindings || activeTab === 'agregar') && (
          <>
            {/* Shortcuts */}
            <div className="border-b border-gray-100 px-3 py-2">
              <div className="flex gap-2">
                {dentalShortcuts.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    className="cursor-pointer"
                    title={sc.label}
                    onClick={() => {
                      if ((SURFACE_SHORTCUT_IDS as string[]).includes(sc.id)) {
                        onOpenSurfaceModal(sc.id as SurfaceModalType)
                      } else {
                        handleShortcut(sc.id)
                      }
                    }}
                  >
                    <img src={sc.icon} alt={sc.label} className="w-14 object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Buscador */}
            <div className="border-b border-gray-100 px-4 py-2">
              <div className="flex items-center rounded-lg border border-gray-300 px-4 py-1 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400">
                <svg
                  className="mr-2 h-3.5 w-3.5 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar hallazgo"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Lista de hallazgos */}
            <ul 
              className="overflow-y-auto py-1"
              style={{ maxHeight: listMaxHeight }}
            >
              {filtered.map((finding) => (
                <li
                  key={finding.id}
                  className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm text-gray-700">{finding.label}</span>
                  <div className="flex gap-1">
                    {finding.actions.map((action, i) => (
                      <ActionButton
                        key={`${finding.id}-${i}`}
                        action={action}
                        label={finding.label}
                        onClick={() => {
                          // Ortho fijo o removible o edéntulo: iniciar flujo de 2 clicks
                          if (finding.id === 'ortodoncia-fijo' || finding.id === 'ortodoncia-removible' || finding.id === 'carillas-varios' || finding.id === 'edentulo-total' || finding.id === 'protesis-fija' || finding.id === 'protesis-removible' || finding.id === 'protesis-total') {
                            const isFijo = finding.id === 'ortodoncia-fijo'
                            const isCarillasVarios = finding.id === 'carillas-varios'
                            const isProtesisFija = finding.id === 'protesis-fija'
                            const isProtesisRemovible = finding.id === 'protesis-removible'
                            const isProtesisTotal = finding.id === 'protesis-total'
                            const isEdentulo = finding.id === 'edentulo-total'

                            let fId = ''
                            if (isFijo) fId = action.variant === 'blue' ? 'ortho-fijo-ok' : 'ortho-fijo-nok'
                            else if (isCarillasVarios) fId = action.variant === 'blue' ? 'carillas-varios-ok' : 'carillas-varios-nok'
                            else if (isEdentulo) fId = 'edentulo-total'
                            else if (isProtesisFija) fId = action.variant === 'blue' ? 'protesis-fija-ok' : 'protesis-fija-nok'
                            else if (isProtesisRemovible) fId = action.variant === 'blue' ? 'protesis-removible-ok' : 'protesis-removible-nok'
                            else if (isProtesisTotal) fId = action.variant === 'blue' ? 'protesis-total-ok' : 'protesis-total-nok'
                            else fId = action.variant === 'blue' ? 'ortho-rem-ok' : 'ortho-rem-nok'

                            const type = isFijo ? 'fijo' : isCarillasVarios ? 'carillas-varios' : isEdentulo ? 'edentulo-total' : isProtesisFija ? 'protesis-fija' : isProtesisRemovible ? 'protesis-removible' : isProtesisTotal ? 'protesis-total' : 'removible'
                            // @ts-ignore
                            onOrthoAction(fId, action.variant as 'blue' | 'red' | 'single', type)
                            onClose()
                            return
                          }
                          onSelectFinding(finding, action)
                          onClose()
                        }}
                      />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ── Tab ELIMINAR ─────────────────────────────────────────────────── */}
        {hasFindings && activeTab === 'eliminar' && (
          <div 
            className="p-3 space-y-2 overflow-y-auto"
            style={{ maxHeight: listMaxHeight }}
          >
            {appliedFindings.map((finding) => (
              <button
                key={finding.id}
                type="button"
                onClick={() => onRemoveFinding(finding.id)}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-left transition hover:bg-red-50"
              >
                {finding.surfaces && finding.surfaces.length > 0 ? (
                  <div className="h-6 w-8 shrink-0">
                    <ToothFacePreview
                      surfaces={finding.surfaces}
                      color={finding.variant === 'blue' ? '#3b82f6' : '#ef4444'}
                    />
                  </div>
                ) : finding.icon ? (
                  <img src={finding.icon} alt="" className="h-5 w-8 object-contain" />
                ) : (
                  <span className="h-5 w-8 text-center text-xs text-gray-400">—</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">{finding.label}</p>
                  {finding.surfaces && finding.surfaces.length > 0 && (
                    <p className="text-xs capitalize text-gray-400">
                      {finding.surfaces.join(', ')}
                      {finding.option ? ` · ${finding.option}` : ''}
                    </p>
                  )}
                </div>
              </button>
            ))}

            {/* Grupos ortodónticos — eliminar borra todo el grupo */}
            {orthoGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => { onRemoveOrthoGroup(group.id); onClose() }}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-left transition hover:bg-red-50"
              >
                <span
                  className={`h-5 w-8 shrink-0 rounded text-center text-[10px] font-bold leading-5 ${
                    group.variant === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {group.type === 'carillas-varios' ? 'CAR' : group.type === 'protesis-fija' ? 'PF' : group.type === 'protesis-removible' ? 'PR' : group.type === 'protesis-total' ? 'PT' : 'ORT'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">{group.label}</p>
                  <p className="text-xs text-gray-400">
                    Dientes: {group.teeth.join(', ')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default ToothPopover
