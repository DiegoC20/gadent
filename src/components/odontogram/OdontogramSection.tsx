import { useState } from 'react'
import type { DentalFinding, FindingAction } from '../../data/dentalFindings'
import {
  lowerLeftTeeth,
  lowerRightTeeth,
  upperLeftTeeth,
  upperRightTeeth,
} from '../../data/odontogramFindings'
import {
  createAppliedFinding,
  variantDotColor,
  SURFACE_LABELS,
  type ToothFindingsMap,
  type ToothSurface,
  type AppliedFinding,
} from '../../data/odontogramState'
import type { OrthoGroup, PendingOrtho, OrthoType } from '../../data/orthoState'
import {
  getTeethBetween,
  getToothArch,
} from '../../data/orthoState'
import type { SurfaceModalType } from './SurfaceModal'
import { SURFACE_MODAL_CONFIG } from './SurfaceModal'
import ToothButton from './ToothButton'

function ToothRow({
  teeth,
  position,
  selectedTooth,
  toothFindings,
  orthoGroups,
  pendingOrtho,
  onSelectTooth,
  onSelectFinding,
  onRemoveAllFindings,
  onRemoveFinding,
  onApplySurfaceFindings,
  onOrthoAction,
  onOrthoSecondClick,
  onRemoveOrthoGroup,
}: {
  teeth: number[]
  position: 'upper' | 'lower'
  selectedTooth: number | null
  toothFindings: ToothFindingsMap
  orthoGroups: OrthoGroup[]
  pendingOrtho: PendingOrtho | null
  onSelectTooth: (n: number | null) => void
  onSelectFinding: (tooth: number, finding: DentalFinding, action: FindingAction, option?: string) => void
  onRemoveAllFindings: (tooth: number) => void
  onRemoveFinding: (tooth: number, findingId: string) => void
  onApplySurfaceFindings: (tooth: number, type: SurfaceModalType, surfaces: ToothSurface[], option?: string) => void
  onOrthoAction: (tooth: number, findingId: string, variant: 'blue' | 'red', type: OrthoType) => void
  onOrthoSecondClick: (secondTooth: number) => void
  onRemoveOrthoGroup: (groupId: string) => void
}) {
  const midpoint = teeth.length / 2
  const align = position === 'upper' ? 'items-end' : 'items-start'

  return (
    <div className={`flex w-full justify-between gap-1 px-2 ${align}`}>
      {teeth.map((n, idx) => {
        const prevTooth = idx > 0 ? teeth[idx - 1] : null
        const hasLeftDiastema = prevTooth ? (toothFindings[prevTooth] ?? []).some((f) => f.findingId === 'diastema') : false
        const hasLeftFrenillo = prevTooth ? (toothFindings[prevTooth] ?? []).some((f) => f.findingId === 'frenillo-corto') : false
        const hasLeftFusion = prevTooth ? (toothFindings[prevTooth] ?? []).some((f) => f.findingId === 'fusion') : false
        const hasLeftSupernumeraria = prevTooth ? (toothFindings[prevTooth] ?? []).some((f) => f.findingId === 'supernumeraria') : false

        return (
          <ToothButton
            key={n}
            number={n}
            position={position}
            selected={selectedTooth === n}
            appliedFindings={toothFindings[n] ?? []}
            hasLeftDiastema={hasLeftDiastema}
            hasLeftFrenillo={hasLeftFrenillo}
            hasLeftFusion={hasLeftFusion}
            hasLeftSupernumeraria={hasLeftSupernumeraria}
            orthoGroups={orthoGroups.filter((g) => g.teeth.includes(n))}
            isPendingOrtho={pendingOrtho?.startTooth === n}
            isPendingTarget={!!pendingOrtho && pendingOrtho.startTooth !== n && getToothArch(n) === getToothArch(pendingOrtho.startTooth)}
            onSelect={(num) => {
              if (pendingOrtho) { onOrthoSecondClick(num); return }
              onSelectTooth(selectedTooth === num ? null : num)
            }}
            onDeselect={() => onSelectTooth(null)}
            onSelectFinding={(finding, action, option) => onSelectFinding(n, finding, action, option)}
            onRemoveAllFindings={onRemoveAllFindings}
            onRemoveFinding={onRemoveFinding}
            onApplySurfaceFindings={onApplySurfaceFindings}
            onOrthoAction={onOrthoAction}
            onOrthoSecondClick={onOrthoSecondClick}
            onRemoveOrthoGroup={onRemoveOrthoGroup}
          />
        )
      })}
    </div>
  )
}

function OdontogramSection() {
  const [activeTab, setActiveTab] = useState<'inicial' | 'evolucion' | 'alta'>('inicial')
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [multipleMarking, setMultipleMarking] = useState(false)
  const [toothFindings, setToothFindings] = useState<ToothFindingsMap>({})
  const [orthoGroups, setOrthoGroups] = useState<OrthoGroup[]>([])
  const [pendingOrtho, setPendingOrtho] = useState<PendingOrtho | null>(null)

  const hasTreatmentRows = Object.keys(toothFindings).length > 0 || orthoGroups.length > 0

  function handleSelectFinding(tooth: number, finding: DentalFinding, action: FindingAction, option?: string) {
    const applied = createAppliedFinding(tooth, finding, action)
    if (option) applied.option = option
    setToothFindings((prev) => ({
      ...prev,
      [tooth]: [...(prev[tooth] ?? []), applied],
    }))
  }

  function handleRemoveAllFindings(tooth: number) {
    setToothFindings((prev) => {
      const next = { ...prev }
      delete next[tooth]
      return next
    })
    setSelectedTooth(null)
  }

  function handleRemoveFinding(tooth: number, findingId: string) {
    setToothFindings((prev) => {
      const current = prev[tooth] ?? []
      const next = current.filter((f) => f.id !== findingId)
      if (next.length === 0) {
        const nextMap = { ...prev }
        delete nextMap[tooth]
        return nextMap
      }
      return { ...prev, [tooth]: next }
    })
  }

  function handleApplySurfaceFindings(
    tooth: number,
    type: SurfaceModalType,
    surfaces: ToothSurface[],
    option?: string,
  ) {
    const config = SURFACE_MODAL_CONFIG[type]
    const variant = type === 'restau-ok' ? 'blue' as const : 'red' as const

    // Un solo AppliedFinding con todas las superficies juntas
    const newFinding: AppliedFinding = {
      id: `${tooth}-${type}-${Date.now()}`,
      findingId: type,
      label: config.title,
      variant,
      icon: '',
      surfaces,
      option,
    }

    setToothFindings((prev) => ({
      ...prev,
      [tooth]: [...(prev[tooth] ?? []), newFinding],
    }))
  }

  /** Paso 1: usuario clickea el botón ortho en el popover de un diente */
  function handleOrthoAction(
    tooth: number,
    findingId: string,
    variant: 'blue' | 'red' | 'single',
    type: OrthoType,
  ) {
    // Cerrar popover y poner el diente en estado "pendiente"
    setSelectedTooth(null)
    setPendingOrtho({ startTooth: tooth, type, variant, findingId })
  }

  /** Paso 2: usuario clickea el segundo diente */
  function handleOrthoSecondClick(secondTooth: number) {
    if (!pendingOrtho) return
    const { startTooth, type, variant, findingId } = pendingOrtho

    // Si el usuario clickea el mismo diente: cancelar
    if (secondTooth === startTooth) {
      setPendingOrtho(null)
      return
    }

    const teeth = getTeethBetween(startTooth, secondTooth)
    if (!teeth) {
      // No están en el mismo arco
      setPendingOrtho(null)
      return
    }

    const label = type === 'fijo' ? 'Aparato ortodóntico fijo' : type === 'carillas-varios' ? 'Carillas' : type === 'edentulo-total' ? 'Edéntulo total' : type === 'protesis-fija' ? 'Prótesis fija' : type === 'protesis-removible' ? 'Prótesis removible' : type === 'protesis-total' ? 'Prótesis total' : 'Aparato ortodóntico removible'
    const group: OrthoGroup = {
      id: `ortho-${Date.now()}`,
      type,
      variant,
      findingId,
      label,
      teeth,
    }
    setOrthoGroups((prev) => [...prev, group])
    setPendingOrtho(null)
  }

  function handleRemoveOrthoGroup(groupId: string) {
    setOrthoGroups((prev) => prev.filter((g) => g.id !== groupId))
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Fila 1: pestañas (izquierda) + leyenda + nuevo odontograma (derecha) */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-gray-200 px-4">
        <div className="flex gap-6">
          {(
            [
              { id: 'inicial' as const, label: 'Odo. Inicial' },
              { id: 'evolucion' as const, label: 'Odo. Evolución' },
              { id: 'alta' as const, label: 'Odo. Alta' },
            ]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-3 text-sm font-medium ${activeTab === tab.id ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400" />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Mal estado
          </span>
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Buen estado
          </span>
          <button
            type="button"
            className="rounded border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
          >
            Nuevo odontog.
          </button>
        </div>
      </div>

      {/* Fila 2: marcado múltiple (izquierda) + doctor, tipo, nomenclatura (derecha) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 text-xs">
        <button
          type="button"
          onClick={() => setMultipleMarking(!multipleMarking)}
          className={`flex items-center gap-1.5 rounded border px-3 py-1.5 ${multipleMarking
              ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Marcado múltiple
        </button>

        <div className="flex flex-wrap items-center gap-4">
          <fieldset className="relative rounded border border-gray-300 px-3 pb-1.5 pt-2">
            <legend className="px-1 text-[11px] text-gray-500">Doctor</legend>
            <select className="min-w-[130px] bg-transparent text-sm text-gray-700 outline-none">
              <option>Diego Cruzado</option>
            </select>
          </fieldset>
          <fieldset className="relative rounded border border-gray-300 px-3 pb-1.5 pt-2">
            <legend className="px-1 text-[11px] text-gray-500">Tipo</legend>
            <select className="min-w-[90px] bg-transparent text-sm text-gray-700 outline-none">
              <option>Adultos</option>
              <option>Niños</option>
            </select>
          </fieldset>
          <fieldset className="relative rounded border border-gray-300 px-3 pb-1.5 pt-2">
            <legend className="px-1 text-[11px] text-gray-500">Nomenclatura</legend>
            <select className="min-w-[120px] bg-transparent text-sm text-gray-700 outline-none">
              <option>Internacional</option>
              <option>Universal</option>
            </select>
          </fieldset>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto overflow-y-visible px-4 py-6">
        <div className="relative mx-auto w-full min-w-[820px] space-y-5">
          <ToothRow
            teeth={[...upperRightTeeth, ...upperLeftTeeth]}
            position="upper"
            selectedTooth={selectedTooth}
            toothFindings={toothFindings}
            orthoGroups={orthoGroups}
            pendingOrtho={pendingOrtho}
            onSelectTooth={setSelectedTooth}
            onSelectFinding={handleSelectFinding}
            onRemoveAllFindings={handleRemoveAllFindings}
            onRemoveFinding={handleRemoveFinding}
            onApplySurfaceFindings={handleApplySurfaceFindings}
            onOrthoAction={handleOrthoAction}
            onOrthoSecondClick={handleOrthoSecondClick}
            onRemoveOrthoGroup={handleRemoveOrthoGroup}
          />
          <div className="h-px w-full bg-gray-300" />
          <ToothRow
            teeth={[...lowerRightTeeth, ...lowerLeftTeeth]}
            position="lower"
            selectedTooth={selectedTooth}
            toothFindings={toothFindings}
            orthoGroups={orthoGroups}
            pendingOrtho={pendingOrtho}
            onSelectTooth={setSelectedTooth}
            onSelectFinding={handleSelectFinding}
            onRemoveAllFindings={handleRemoveAllFindings}
            onRemoveFinding={handleRemoveFinding}
            onApplySurfaceFindings={handleApplySurfaceFindings}
            onOrthoAction={handleOrthoAction}
            onOrthoSecondClick={handleOrthoSecondClick}
            onRemoveOrthoGroup={handleRemoveOrthoGroup}
          />
        </div>
      </div>

      {/* Plan de tratamiento */}
      <div className="border-t border-gray-200 px-4 pb-4 pt-3">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Plan de tratamiento</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#33475b] text-white">
              <th className="px-4 py-2.5 text-left font-medium">N° diente</th>
              <th className="px-4 py-2.5 text-left font-medium">Hallazgo</th>
              <th className="px-4 py-2.5 text-left font-medium">Servicios</th>
              <th className="px-4 py-2.5 text-left font-medium">Nota</th>
            </tr>
          </thead>
          <tbody>
            {!hasTreatmentRows && (
              <tr>
                <td colSpan={4} className="border border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
                  {selectedTooth
                    ? `Selecciona un hallazgo para el diente ${selectedTooth}`
                    : 'Haz clic en un diente para registrar hallazgos'}
                </td>
              </tr>
            )}

            {/* Filas de hallazgos por diente */}
            {Object.entries(toothFindings).flatMap(([toothStr, findings]) =>
              findings.map((row) => {
                let displayToothStr = toothStr
                if (row.findingId === 'supernumeraria') {
                  const toothNum = parseInt(toothStr, 10)
                  const upperRow = [...upperRightTeeth, ...upperLeftTeeth]
                  const lowerRow = [...lowerRightTeeth, ...lowerLeftTeeth]
                  
                  const upperIdx = upperRow.indexOf(toothNum)
                  if (upperIdx !== -1 && upperIdx < upperRow.length - 1) {
                    displayToothStr = `${toothStr}-${upperRow[upperIdx + 1]}`
                  } else {
                    const lowerIdx = lowerRow.indexOf(toothNum)
                    if (lowerIdx !== -1 && lowerIdx < lowerRow.length - 1) {
                      displayToothStr = `${toothStr}-${lowerRow[lowerIdx + 1]}`
                    }
                  }
                }

                return (
                  <tr key={row.id} className="border-b border-gray-200">
                    <td className="border border-gray-200 px-4 py-2">{displayToothStr}</td>
                    <td className="border border-gray-200 px-4 py-2">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${row.findingId === 'defectos-esmalte' ? 'bg-yellow-400' :
                          row.findingId === 'extraccion' ? 'bg-red-500' :
                            row.findingId === 'fractura' ? 'bg-red-500' :
                              row.findingId === 'frenillo-corto' ? 'bg-red-500' :
                                row.findingId === 'fusion' ? 'bg-blue-500' :
                                  row.findingId === 'geminacion' ? 'bg-blue-500' :
                                    row.findingId === 'gingivitis' ? 'bg-red-500' :
                                      row.findingId === 'giroversion' ? 'bg-blue-500' :
                                        variantDotColor(row.variant)
                        }`} />
                      <span>
                        {row.findingId === 'giroversion' && row.icon?.includes('_b_thumb')
                          ? 'Giroversión der a izq'
                          : row.findingId === 'trat-pulpar'
                            ? (row.variant === 'blue' ? 'Trat. pulpar (trat. conducto) (Tratamiento de conductos)' : 'Trat. pulpar afectada (trat. conducto) (mal estado)')
                          : row.findingId === 'pulpectomia'
                            ? 'Trat. pulpar (pulpectomía)'
                          : row.findingId === 'pulpotomia'
                            ? (row.variant === 'blue' ? 'Pulpotomía (Buen estado)' : 'Pulpotomía (mal estado)')
                          : row.findingId === 'sellantes'
                            ? (row.variant === 'blue' ? 'Sellantes (buen estado)' : 'Sellantes (mal estado)')
                            : row.findingId === 'implante'
                              ? (row.variant === 'blue' ? 'Implante dental (buen estado)' : 'Implante dental (mal estado)')
                              : row.label}
                        {row.surfaces && row.surfaces.length > 0 && (
                          <span className="text-gray-600">
                            {' '}{row.surfaces.map((s) => SURFACE_LABELS[s]).join(', ')}
                          </span>
                        )}
                      </span>
                      {row.option && (
                        <span className="text-xs text-gray-400">· {row.option}</span>
                      )}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-blue-500">
                    <button type="button" className="flex items-center gap-1 hover:underline">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Vincular
                    </button>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-400">
                    <button type="button" className="flex items-center gap-1 hover:text-gray-600">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar
                    </button>
                  </td>
                </tr>
                )
              })
            )}

            {/* Filas de grupos ortodónticos fijos */}
            {orthoGroups.map((group) => (
              <tr key={group.id} className="border-b border-gray-200">
                <td className="border border-gray-200 px-4 py-2 font-medium">
                  {group.teeth[0]}-{group.teeth[group.teeth.length - 1]}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${group.variant === 'red' ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <span>{group.label}</span>
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-2 text-blue-500">
                  <button type="button" className="flex items-center gap-1 hover:underline">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Vincular
                  </button>
                </td>
                <td className="border border-gray-200 px-4 py-2 text-gray-400">
                  <button type="button" className="flex items-center gap-1 hover:text-gray-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Campos adicionales inferiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-4 pb-6 pt-4">
        {/* Especificaciones */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-500">Especificaciones:</label>
          <textarea
            className="h-28 w-full resize-none rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700 outline-none"
          />
        </div>
        {/* Diagnóstico */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm text-gray-500">Diagnóstico:</label>
            <button type="button" className="text-sm font-medium text-cyan-400 hover:text-cyan-500">
              Usar lista CIE-10
            </button>
          </div>
          <textarea
            className="h-28 w-full resize-none rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700 outline-none"
          />
        </div>
        {/* Observaciones */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-500">Observaciones:</label>
          <textarea
            className="h-28 w-full resize-none rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700 outline-none"
          />
        </div>
        {/* Plan de trabajo */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-500">Plan de trabajo:</label>
          <textarea
            className="h-28 w-full resize-none rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700 outline-none"
          />
        </div>
      </div>
    </div>
  )
}

export default OdontogramSection
