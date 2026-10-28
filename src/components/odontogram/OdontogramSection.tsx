import { useState } from 'react'
import type { DentalFinding, FindingAction } from '../../data/dentalFindings'
import {
  lowerLeftTeeth,
  lowerRightTeeth,
  upperLeftTeeth,
  upperRightTeeth,
  upperRightTeethDeciduous,
  upperLeftTeethDeciduous,
  lowerRightTeethDeciduous,
  lowerLeftTeethDeciduous,
  getToothLabel,
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
import MultipleMarkingPopover from './MultipleMarkingPopover'
import MultipleMarkingView, { type MultipleMarkingTarget, getDisplayLabel } from './MultipleMarkingView'
import MultipleMarkingCancelModal from './MultipleMarkingCancelModal'
import MultipleMarkingConfirmModal from './MultipleMarkingConfirmModal'
import { useRef } from 'react'

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
  nomenclatura,
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
  nomenclatura: 'Internacional' | 'ADA'
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
            nomenclatura={nomenclatura}
          />
        )
      })}
    </div>
  )
}

function OdontogramSection() {
  const [activeTab, setActiveTab] = useState<'inicial' | 'evolucion' | 'alta'>('inicial')
  const [patientType, setPatientType] = useState<'Adultos' | 'Niño' | 'Mixto'>('Adultos')
  const [nomenclatura, setNomenclatura] = useState<'Internacional' | 'ADA'>('Internacional')
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [multipleMarkingOpen, setMultipleMarkingOpen] = useState(false)
  const multipleMarkingRef = useRef<HTMLButtonElement>(null)

  // ── Estado Odo. Inicial ──────────────────────────────────────────────────────
  const [inicialToothFindings, setInicialToothFindings] = useState<ToothFindingsMap>({})
  const [inicialOrthoGroups, setInicialOrthoGroups] = useState<OrthoGroup[]>([])
  const [inicialSaved, setInicialSaved] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false)
  const [inicialEspecificaciones, setInicialEspecificaciones] = useState('')
  const [inicialDiagnostico, setInicialDiagnostico] = useState('')
  const [inicialObservaciones, setInicialObservaciones] = useState('')
  const [inicialPlanTrabajo, setInicialPlanTrabajo] = useState('')

  // ── Estado Odo. Evolución ────────────────────────────────────────────────────
  const [evolucionToothFindings, setEvolucionToothFindings] = useState<ToothFindingsMap>({})
  const [evolucionOrthoGroups, setEvolucionOrthoGroups] = useState<OrthoGroup[]>([])
  const [evolucionEspecificaciones, setEvolucionEspecificaciones] = useState('')
  const [evolucionDiagnostico, setEvolucionDiagnostico] = useState('')
  const [evolucionObservaciones, setEvolucionObservaciones] = useState('')
  const [evolucionPlanTrabajo, setEvolucionPlanTrabajo] = useState('')

  // ── Estado Odo. Alta (historial archivado) ──────────────────────────────────
  type ArchivedRecord = {
    id: string
    inicialDate: string
    altaDate: string
    inicialFindings: ToothFindingsMap
    inicialOrtho: OrthoGroup[]
    altaFindings: ToothFindingsMap
    altaOrtho: OrthoGroup[]
    patientType: 'Adultos' | 'Niño' | 'Mixto'
    nomenclatura: 'Internacional' | 'ADA'
    inicialEspecificaciones: string
    inicialDiagnostico: string
    inicialObservaciones: string
    inicialPlanTrabajo: string
    altaEspecificaciones: string
    altaDiagnostico: string
    altaObservaciones: string
    altaPlanTrabajo: string
  }
  const [archivedRecords, setArchivedRecords] = useState<ArchivedRecord[]>([])
  const [showAltaConfirm, setShowAltaConfirm] = useState(false)
  const [viewingArchive, setViewingArchive] = useState<ArchivedRecord | null>(null)
  const [viewingArchiveTab, setViewingArchiveTab] = useState<'inicial' | 'alta'>('inicial')
  const [showNuevoConfirm, setShowNuevoConfirm] = useState(false)

  const evolucionHasTreatments = Object.keys(evolucionToothFindings).length > 0 || evolucionOrthoGroups.length > 0

  // ── Variables activas según pestaña ──────────────────────────────────────────
  const isReadOnly = (activeTab === 'inicial' && inicialSaved) || activeTab === 'alta'
  const toothFindings = activeTab === 'evolucion' ? evolucionToothFindings : inicialToothFindings
  const setToothFindings = activeTab === 'evolucion' ? setEvolucionToothFindings : setInicialToothFindings
  const orthoGroups = activeTab === 'evolucion' ? evolucionOrthoGroups : inicialOrthoGroups
  const setOrthoGroups = activeTab === 'evolucion' ? setEvolucionOrthoGroups : setInicialOrthoGroups

  const [pendingOrtho, setPendingOrtho] = useState<PendingOrtho | null>(null)
  const [multipleMarkingTarget, setMultipleMarkingTarget] = useState<{ finding: DentalFinding, action: FindingAction } | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [affectedTeethForConfirm, setAffectedTeethForConfirm] = useState<{ tooth: number, surfaces: ToothSurface[] }[]>([])
  const [toothFindingsBackup, setToothFindingsBackup] = useState<ToothFindingsMap | null>(null)

  const hasTreatmentRows = Object.keys(toothFindings).length > 0 || orthoGroups.length > 0

  // ── Guardar Odo. Inicial ─────────────────────────────────────────────────────
  function handleSaveInicial() {
    // Deep-copy datos del Inicial al Evolución
    const findingsCopy: ToothFindingsMap = {}
    for (const key in inicialToothFindings) {
      findingsCopy[key] = inicialToothFindings[key].map(f => ({ ...f }))
    }
    setEvolucionToothFindings(findingsCopy)
    setEvolucionOrthoGroups(inicialOrthoGroups.map(g => ({ ...g, teeth: [...g.teeth] })))
    setEvolucionEspecificaciones(inicialEspecificaciones)
    setEvolucionDiagnostico(inicialDiagnostico)
    setEvolucionObservaciones(inicialObservaciones)
    setEvolucionPlanTrabajo(inicialPlanTrabajo)
    setInicialSaved(true)
    setShowSaveConfirm(false)
    setSelectedTooth(null)
    setPendingOrtho(null)
    // Automáticamente ir a Evolución
    setActiveTab('evolucion')
  }

  function handleUnlockInicial() {
    setInicialSaved(false)
    setShowUnlockConfirm(false)
    setActiveTab('inicial')
  }

  // ── Nuevo Odontograma (reiniciar Inicial) ──────────────────────────────────────
  function handleNuevoOdontograma() {
    setInicialToothFindings({})
    setInicialOrthoGroups([])
    setInicialEspecificaciones('')
    setInicialDiagnostico('')
    setInicialObservaciones('')
    setInicialPlanTrabajo('')
    setSelectedTooth(null)
    setPendingOrtho(null)
    setMultipleMarkingTarget(null)
    setToothFindingsBackup(null)
    setShowNuevoConfirm(false)
  }

  // ── Dar de Alta ──────────────────────────────────────────────────────────────
  function handleDarDeAlta() {
    const now = new Date()
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

    // Buscar la fecha en la que se guardó el inicial (usamos la fecha actual del más antiguo o la misma)
    const inicialDateStr = dateStr

    const record: ArchivedRecord = {
      id: `archive-${Date.now()}`,
      inicialDate: inicialDateStr,
      altaDate: dateStr,
      inicialFindings: (() => {
        const copy: ToothFindingsMap = {}
        for (const key in inicialToothFindings) {
          copy[key] = inicialToothFindings[key].map(f => ({ ...f }))
        }
        return copy
      })(),
      inicialOrtho: inicialOrthoGroups.map(g => ({ ...g, teeth: [...g.teeth] })),
      altaFindings: (() => {
        const copy: ToothFindingsMap = {}
        for (const key in evolucionToothFindings) {
          copy[key] = evolucionToothFindings[key].map(f => ({ ...f }))
        }
        return copy
      })(),
      altaOrtho: evolucionOrthoGroups.map(g => ({ ...g, teeth: [...g.teeth] })),
      patientType,
      nomenclatura,
      inicialEspecificaciones,
      inicialDiagnostico,
      inicialObservaciones,
      inicialPlanTrabajo,
      altaEspecificaciones: evolucionEspecificaciones,
      altaDiagnostico: evolucionDiagnostico,
      altaObservaciones: evolucionObservaciones,
      altaPlanTrabajo: evolucionPlanTrabajo,
    }

    setArchivedRecords(prev => [...prev, record])

    // Limpiar estados de Inicial y Evolución para un nuevo ciclo
    setInicialToothFindings({})
    setInicialOrthoGroups([])
    setInicialSaved(false)
    setInicialEspecificaciones('')
    setInicialDiagnostico('')
    setInicialObservaciones('')
    setInicialPlanTrabajo('')
    setEvolucionToothFindings({})
    setEvolucionOrthoGroups([])
    setEvolucionEspecificaciones('')
    setEvolucionDiagnostico('')
    setEvolucionObservaciones('')
    setEvolucionPlanTrabajo('')
    setSelectedTooth(null)
    setPendingOrtho(null)
    setShowAltaConfirm(false)

    // Ir a Odo. Alta para ver el historial
    setActiveTab('alta')
  }

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

  function handleToggleSurfaceMultiple(tooth: number, type: string, surface: ToothSurface | 'completo') {
    setToothFindings((prev) => {
      const findings = prev[tooth] ?? []
      const existingIndex = findings.findIndex((f) => f.findingId === type)
      
      if (existingIndex >= 0) {
        if (surface === 'completo') {
          // Toggle off whole tooth finding
          const updatedFindings = [...findings]
          updatedFindings.splice(existingIndex, 1)
          return { ...prev, [tooth]: updatedFindings }
        }

        // Ya existe, modificar superficies
        const existing = findings[existingIndex]
        const newSurfaces = existing.surfaces?.includes(surface as ToothSurface)
          ? existing.surfaces.filter((s) => s !== surface)
          : [...(existing.surfaces ?? []), surface as ToothSurface]
          
        if (newSurfaces.length === 0) {
          // Remover finding si ya no tiene superficies
          const updatedFindings = [...findings]
          updatedFindings.splice(existingIndex, 1)
          return { ...prev, [tooth]: updatedFindings }
        } else {
          const updatedFindings = [...findings]
          updatedFindings[existingIndex] = { ...existing, surfaces: newSurfaces }
          return { ...prev, [tooth]: updatedFindings }
        }
      } else {
        // No existe, crearlo
        const variant = multipleMarkingTarget?.action.variant || 'blue'
        const label = multipleMarkingTarget?.finding.label || ''
        const icon = multipleMarkingTarget?.action.icon || ''
        
        const newFinding: AppliedFinding = {
          id: `${tooth}-${type}-${Date.now()}`,
          findingId: type,
          label,
          variant,
          icon,
        }
        
        if (surface !== 'completo') {
          newFinding.surfaces = [surface as ToothSurface]
        }
        
        return { ...prev, [tooth]: [...findings, newFinding] }
      }
    })
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

  function handleFinishMultipleMarking() {
    if (!multipleMarkingTarget) return

    const type = multipleMarkingTarget.finding.id
                 
    const affected: { tooth: number; surfaces: ToothSurface[] }[] = []

    const findingId = multipleMarkingTarget.finding.id
    const hasOptions = findingId === 'caries' || findingId === 'restau-ok' || findingId === 'restau-nok' || findingId === 'defectos-esmalte' || findingId === 'movilidad' || findingId === 'posicion'

    for (const toothStr in toothFindings) {
      const toothNum = parseInt(toothStr, 10)
      const currentList = toothFindings[toothNum]
      const backupList = toothFindingsBackup?.[toothNum] ?? []
      
      const currentFinding = currentList.find(f => f.findingId === type)
      const backupFinding = backupList.find(f => f.findingId === type)
      
      if (currentFinding) {
        const isSurfaceBased = type === 'caries' || type === 'restau-ok' || type === 'restau-nok'
        
        if (isSurfaceBased) {
          if (currentFinding.surfaces) {
            const currentSurfaces = [...currentFinding.surfaces].sort().join(',')
            const backupSurfaces = backupFinding?.surfaces ? [...backupFinding.surfaces].sort().join(',') : ''
            
            if (currentSurfaces !== backupSurfaces && currentFinding.surfaces.length > 0) {
              affected.push({ tooth: toothNum, surfaces: currentFinding.surfaces })
            }
          }
        } else if (hasOptions) {
          // Para hallazgos de diente completo que tienen opciones
          if (!backupFinding) {
            affected.push({ tooth: toothNum, surfaces: [] })
          }
        }
      }
    }

    if (affected.length > 0 && hasOptions) {
      setAffectedTeethForConfirm(affected)
      setShowConfirmModal(true)
    } else {
      setMultipleMarkingTarget(null)
      setToothFindingsBackup(null)
    }
  }

  function handleConfirmSave(optionsMap: Record<number, string>) {
    if (!multipleMarkingTarget) return
    const type = multipleMarkingTarget.finding.id

    if (Object.keys(optionsMap).length > 0) {
      setToothFindings(prev => {
        const nextMap = { ...prev }
        for (const toothStr in optionsMap) {
          const tooth = parseInt(toothStr, 10)
          const opt = optionsMap[tooth]
          const list = nextMap[tooth]
          if (list) {
            const idx = list.findIndex(f => f.findingId === type)
            if (idx !== -1) {
              const newList = [...list]
              newList[idx] = { ...newList[idx], option: opt }
              nextMap[tooth] = newList
            }
          }
        }
        return nextMap
      })
    }

    setMultipleMarkingTarget(null)
    setToothFindingsBackup(null)
    setShowConfirmModal(false)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Fila 1: pestañas (izquierda) + leyenda + nuevo odontograma (derecha) */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-gray-200 px-4">
        <div className="flex gap-6">
          {(
            [
              { id: 'inicial' as const, label: 'Odo. Inicial', locked: false },
              { id: 'evolucion' as const, label: 'Odo. Evolución', locked: !inicialSaved },
              { id: 'alta' as const, label: 'Odo. Alta', locked: false },
            ]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.locked) return
                setSelectedTooth(null)
                setPendingOrtho(null)
                setActiveTab(tab.id)
              }}
              className={`relative py-3 text-sm font-medium flex items-center gap-1.5 ${
                tab.locked
                  ? 'text-gray-300 cursor-not-allowed'
                  : activeTab === tab.id ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'
              }`}
              title={tab.locked ? (tab.id === 'evolucion' ? 'Guarda el Odo. Inicial primero' : 'Próximamente') : ''}
            >
              {tab.locked && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              {tab.label}
              {tab.id === 'inicial' && inicialSaved && (
                <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
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
          {activeTab === 'inicial' && !inicialSaved && (
            <button
              type="button"
              onClick={() => {
                if (hasTreatmentRows) {
                  setShowNuevoConfirm(true)
                } else {
                  handleNuevoOdontograma()
                }
              }}
              className="rounded border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
            >
              Nuevo odontog.
            </button>
          )}
        </div>
      </div>

      {/* Fila 2: marcado múltiple (izquierda) + doctor, tipo, nomenclatura (derecha) */}
      {activeTab === 'alta' ? null : activeTab === 'inicial' && inicialSaved ? (
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-amber-50">
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-medium">Odontograma Inicial guardado</span>
            <span className="text-amber-600">— Solo lectura</span>
          </div>
          <button
            type="button"
            onClick={() => setShowUnlockConfirm(true)}
            className="rounded-md border border-amber-400 bg-white px-4 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
          >
            Desbloquear para editar
          </button>
        </div>
      ) : multipleMarkingTarget ? (
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-white">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="text-gray-400 hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Hallazgo:</span>
              <span className={`${multipleMarkingTarget.action.variant === 'red' ? 'text-red-500' : 'text-blue-500'} text-sm font-medium`}>
                {getDisplayLabel(multipleMarkingTarget)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFinishMultipleMarking}
            className="rounded-md bg-[#519fb2] px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3e8697] transition-colors"
          >
            Terminar
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 text-xs">
          <div className="relative">
            <button
              ref={multipleMarkingRef}
              type="button"
              onClick={() => setMultipleMarkingOpen(!multipleMarkingOpen)}
              className={`flex items-center gap-1.5 rounded border px-3 py-1.5 ${multipleMarkingOpen
                  ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Marcado múltiple
            </button>
            
            {multipleMarkingOpen && (
              <MultipleMarkingPopover
                anchorRef={multipleMarkingRef}
                onClose={() => setMultipleMarkingOpen(false)}
                onSelectFinding={(finding, action) => {
                  setMultipleMarkingOpen(false)
                  setMultipleMarkingTarget({ finding, action })
                  setToothFindingsBackup(toothFindings)
                }}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {!hasTreatmentRows && (
              <>
                <fieldset className="relative rounded border border-gray-300 px-3 pb-1.5 pt-2">
                  <legend className="px-1 text-[11px] text-gray-500">Doctor</legend>
                  <select className="min-w-[130px] bg-transparent text-sm text-gray-700 outline-none">
                    <option>Diego Cruzado</option>
                  </select>
                </fieldset>
                <fieldset className="relative rounded border border-gray-300 px-3 pb-1.5 pt-2">
                  <legend className="px-1 text-[11px] text-gray-500">Tipo</legend>
                  <select 
                    value={patientType}
                    onChange={(e) => setPatientType(e.target.value as any)}
                    className="min-w-[90px] bg-transparent text-sm text-gray-700 outline-none"
                  >
                    <option>Niño</option>
                    <option>Mixto</option>
                    <option>Adultos</option>
                  </select>
                </fieldset>
              </>
            )}
            <fieldset className="relative rounded border border-gray-300 px-3 pb-1.5 pt-2">
              <legend className="px-1 text-[11px] text-gray-500">Nomenclatura</legend>
              <select 
                value={nomenclatura}
                onChange={(e) => setNomenclatura(e.target.value as any)}
                className="min-w-[120px] bg-transparent text-sm text-gray-700 outline-none"
              >
                <option>Internacional</option>
                <option>ADA</option>
              </select>
            </fieldset>
          </div>
        </div>
      )}

      {/* Chart Area with Sliding Animation — only for Inicial/Evolución */}
      {activeTab !== 'alta' ? (
      <div className="relative overflow-hidden px-4 py-6">
        <div
          className={`flex transition-transform duration-500 ease-in-out ${
            multipleMarkingTarget ? '-translate-x-1/2' : 'translate-x-0'
          }`}
          style={{ width: '200%' }}
        >
          {/* Vista 1: Normal */}
          <div className="w-1/2 shrink-0">
            <div className="mx-auto w-full min-w-[600px] xl:min-w-[820px] space-y-6 px-2">
              {(patientType === 'Adultos' || patientType === 'Mixto') && (
                <ToothRow
                  teeth={[...upperRightTeeth, ...upperLeftTeeth]}
                  position="upper"
                  selectedTooth={isReadOnly ? null : selectedTooth}
                  toothFindings={toothFindings}
                  orthoGroups={orthoGroups}
                  pendingOrtho={isReadOnly ? null : pendingOrtho}
                  onSelectTooth={(n) => { if (!isReadOnly) setSelectedTooth(n) }}
                  onSelectFinding={handleSelectFinding}
                  onRemoveAllFindings={handleRemoveAllFindings}
                  onRemoveFinding={handleRemoveFinding}
                  onApplySurfaceFindings={handleApplySurfaceFindings}
                  onOrthoAction={handleOrthoAction}
                  onOrthoSecondClick={handleOrthoSecondClick}
                  onRemoveOrthoGroup={handleRemoveOrthoGroup}
                  nomenclatura={nomenclatura}
                />
              )}

              {(patientType === 'Niño' || patientType === 'Mixto') && (
                <div className={patientType === 'Mixto' ? 'mx-auto w-[65%]' : 'w-full'}>
                  <ToothRow
                    teeth={[...upperRightTeethDeciduous, ...upperLeftTeethDeciduous]}
                    position="upper"
                    selectedTooth={isReadOnly ? null : selectedTooth}
                    toothFindings={toothFindings}
                    orthoGroups={orthoGroups}
                    pendingOrtho={isReadOnly ? null : pendingOrtho}
                    onSelectTooth={(n) => { if (!isReadOnly) setSelectedTooth(n) }}
                    onSelectFinding={handleSelectFinding}
                    onRemoveAllFindings={handleRemoveAllFindings}
                    onRemoveFinding={handleRemoveFinding}
                    onApplySurfaceFindings={handleApplySurfaceFindings}
                    onOrthoAction={handleOrthoAction}
                    onOrthoSecondClick={handleOrthoSecondClick}
                    onRemoveOrthoGroup={handleRemoveOrthoGroup}
                    nomenclatura={nomenclatura}
                  />
                </div>
              )}

              <div className="h-px w-full bg-gray-300" />

              {(patientType === 'Niño' || patientType === 'Mixto') && (
                <div className={patientType === 'Mixto' ? 'mx-auto w-[65%]' : 'w-full'}>
                  <ToothRow
                    teeth={[...lowerRightTeethDeciduous, ...lowerLeftTeethDeciduous]}
                    position="lower"
                    selectedTooth={isReadOnly ? null : selectedTooth}
                    toothFindings={toothFindings}
                    orthoGroups={orthoGroups}
                    pendingOrtho={isReadOnly ? null : pendingOrtho}
                    onSelectTooth={(n) => { if (!isReadOnly) setSelectedTooth(n) }}
                    onSelectFinding={handleSelectFinding}
                    onRemoveAllFindings={handleRemoveAllFindings}
                    onRemoveFinding={handleRemoveFinding}
                    onApplySurfaceFindings={handleApplySurfaceFindings}
                    onOrthoAction={handleOrthoAction}
                    onOrthoSecondClick={handleOrthoSecondClick}
                    onRemoveOrthoGroup={handleRemoveOrthoGroup}
                    nomenclatura={nomenclatura}
                  />
                </div>
              )}

              {(patientType === 'Adultos' || patientType === 'Mixto') && (
                <ToothRow
                  teeth={[...lowerRightTeeth, ...lowerLeftTeeth]}
                  position="lower"
                  selectedTooth={isReadOnly ? null : selectedTooth}
                  toothFindings={toothFindings}
                  orthoGroups={orthoGroups}
                  pendingOrtho={isReadOnly ? null : pendingOrtho}
                  onSelectTooth={(n) => { if (!isReadOnly) setSelectedTooth(n) }}
                  onSelectFinding={handleSelectFinding}
                  onRemoveAllFindings={handleRemoveAllFindings}
                  onRemoveFinding={handleRemoveFinding}
                  onApplySurfaceFindings={handleApplySurfaceFindings}
                  onOrthoAction={handleOrthoAction}
                  onOrthoSecondClick={handleOrthoSecondClick}
                  onRemoveOrthoGroup={handleRemoveOrthoGroup}
                  nomenclatura={nomenclatura}
                />
              )}
            </div>

            {/* Plan de tratamiento y campos adicionales DENTRO del deslizador */}
            <div className="mt-8 border-t border-gray-200 px-4 pb-4 pt-3">
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
                          ? `Selecciona un hallazgo para el diente ${getToothLabel(selectedTooth, nomenclatura)}`
                          : 'Haz clic en un diente para registrar hallazgos'}
                      </td>
                    </tr>
                  )}

                  {Object.entries(toothFindings).flatMap(([toothStr, findings]) =>
                    findings.map((row) => {
                      let displayToothStr = getToothLabel(parseInt(toothStr, 10), nomenclatura)
                      if (row.findingId === 'supernumeraria') {
                        const toothNum = parseInt(toothStr, 10)
                        const upperRow = [...upperRightTeeth, ...upperLeftTeeth]
                        const lowerRow = [...lowerRightTeeth, ...lowerLeftTeeth]
                        const upperDeciduousRow = [...upperRightTeethDeciduous, ...upperLeftTeethDeciduous]
                        const lowerDeciduousRow = [...lowerRightTeethDeciduous, ...lowerLeftTeethDeciduous]
                        
                        const upperIdx = upperRow.indexOf(toothNum)
                        if (upperIdx !== -1 && upperIdx < upperRow.length - 1) {
                          displayToothStr = `${getToothLabel(toothNum, nomenclatura)}-${getToothLabel(upperRow[upperIdx + 1], nomenclatura)}`
                        } else {
                          const lowerIdx = lowerRow.indexOf(toothNum)
                          if (lowerIdx !== -1 && lowerIdx < lowerRow.length - 1) {
                            displayToothStr = `${getToothLabel(toothNum, nomenclatura)}-${getToothLabel(lowerRow[lowerIdx + 1], nomenclatura)}`
                          } else {
                            const upperDecIdx = upperDeciduousRow.indexOf(toothNum)
                            if (upperDecIdx !== -1 && upperDecIdx < upperDeciduousRow.length - 1) {
                              displayToothStr = `${getToothLabel(toothNum, nomenclatura)}-${getToothLabel(upperDeciduousRow[upperDecIdx + 1], nomenclatura)}`
                            } else {
                              const lowerDecIdx = lowerDeciduousRow.indexOf(toothNum)
                              if (lowerDecIdx !== -1 && lowerDecIdx < lowerDeciduousRow.length - 1) {
                                displayToothStr = `${getToothLabel(toothNum, nomenclatura)}-${getToothLabel(lowerDeciduousRow[lowerDecIdx + 1], nomenclatura)}`
                              }
                            }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-4 pb-6 pt-4">
              <div className="flex flex-col">
                <label className="mb-2 text-sm text-gray-500">Especificaciones:</label>
                <textarea
                  value={activeTab === 'evolucion' ? evolucionEspecificaciones : inicialEspecificaciones}
                  onChange={(e) => activeTab === 'evolucion' ? setEvolucionEspecificaciones(e.target.value) : setInicialEspecificaciones(e.target.value)}
                  readOnly={isReadOnly}
                  className={`h-28 w-full resize-none rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700 outline-none ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-gray-500">Diagnóstico:</label>
                  <button type="button" className="text-sm font-medium text-cyan-400 hover:text-cyan-500">
                    Usar lista CIE-10
                  </button>
                </div>
                <textarea
                  value={activeTab === 'evolucion' ? evolucionDiagnostico : inicialDiagnostico}
                  onChange={(e) => activeTab === 'evolucion' ? setEvolucionDiagnostico(e.target.value) : setInicialDiagnostico(e.target.value)}
                  readOnly={isReadOnly}
                  className={`h-28 w-full resize-none rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700 outline-none ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-sm text-gray-500">Observaciones:</label>
                <textarea
                  value={activeTab === 'evolucion' ? evolucionObservaciones : inicialObservaciones}
                  onChange={(e) => activeTab === 'evolucion' ? setEvolucionObservaciones(e.target.value) : setInicialObservaciones(e.target.value)}
                  readOnly={isReadOnly}
                  className={`h-28 w-full resize-none rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700 outline-none ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-sm text-gray-500">Plan de trabajo:</label>
                <textarea
                  value={activeTab === 'evolucion' ? evolucionPlanTrabajo : inicialPlanTrabajo}
                  onChange={(e) => activeTab === 'evolucion' ? setEvolucionPlanTrabajo(e.target.value) : setInicialPlanTrabajo(e.target.value)}
                  readOnly={isReadOnly}
                  className={`h-28 w-full resize-none rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700 outline-none ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            {/* Botón Guardar Odontograma Inicial */}
            {activeTab === 'inicial' && !inicialSaved && hasTreatmentRows && (
              <div className="flex justify-end px-4 pb-4">
                <button
                  type="button"
                  onClick={() => setShowSaveConfirm(true)}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Odontograma Inicial
                </button>
              </div>
            )}

            {/* Botón Dar de Alta al Paciente */}
            {activeTab === 'evolucion' && evolucionHasTreatments && (
              <div className="flex justify-end px-4 pb-4">
                <button
                  type="button"
                  onClick={() => setShowAltaConfirm(true)}
                  className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-cyan-600 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dar de Alta al Paciente
                </button>
              </div>
            )}
          </div>

          {/* Vista 2: Multiple Marking */}
          <div className="w-1/2 shrink-0">
            <div className="mx-auto w-full min-w-[600px] xl:min-w-[820px] px-2 h-full">
              {multipleMarkingTarget && (
                <MultipleMarkingView
                  target={multipleMarkingTarget}
                  patientType={patientType}
                  nomenclatura={nomenclatura}
                  toothFindings={toothFindings}
                  onToggleSurface={handleToggleSurfaceMultiple}
                  onCancel={() => setShowCancelModal(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      ) : (
        /* ── Vista Odo. Alta: Historial de registros archivados ── */
        <div className="px-4 py-6">
          {archivedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="mb-4 h-16 w-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-400">No hay registros de alta</p>
              <p className="mt-1 text-xs text-gray-300">Los registros aparecerán aquí cuando des de alta un paciente desde Odo. Evolución</p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Historial de Odontogramas</h3>
              {archivedRecords.map((record, idx) => (
                <div key={record.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-2.5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registro {idx + 1}</span>
                    <span className="text-xs text-gray-400">{record.patientType} · {record.nomenclatura}</span>
                  </div>

                  {/* Fila: Odontograma Inicial */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                    <span className="text-sm text-gray-700 font-medium">Odontograma Inicial</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{record.inicialDate}</span>
                      <button
                        type="button"
                        onClick={() => { setViewingArchive(record); setViewingArchiveTab('inicial') }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-cyan-500 hover:bg-cyan-50 transition-colors"
                        title="Ver odontograma inicial"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Fila: Odontograma de Alta */}
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm text-gray-700 font-medium">Odontograma de Alta</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{record.altaDate}</span>
                      <button
                        type="button"
                        onClick={() => { setViewingArchive(record); setViewingArchiveTab('alta') }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-cyan-500 hover:bg-cyan-50 transition-colors"
                        title="Ver odontograma de alta"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showCancelModal && (
        <MultipleMarkingCancelModal
          onCancel={() => setShowCancelModal(false)}
          onConfirm={() => {
            if (toothFindingsBackup) setToothFindings(toothFindingsBackup)
            setMultipleMarkingTarget(null)
            setToothFindingsBackup(null)
            setShowCancelModal(false)
          }}
        />
      )}

      {showConfirmModal && multipleMarkingTarget && (
        <MultipleMarkingConfirmModal
          target={multipleMarkingTarget}
          affectedTeeth={affectedTeethForConfirm}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSave}
        />
      )}

      {/* Modal: Confirmar Nuevo Odontograma */}
      {showNuevoConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40" onClick={() => setShowNuevoConfirm(false)}>
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Nuevo Odontograma</h3>
            </div>
            <p className="mb-2 text-sm text-gray-600">
              ¿Estás seguro de que deseas comenzar un nuevo odontograma?
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Se <strong>eliminarán todos los hallazgos</strong> registrados actualmente en el Odo. Inicial. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNuevoConfirm(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleNuevoOdontograma}
                className="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Borrar y empezar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar guardar Odo. Inicial */}
      {showSaveConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40" onClick={() => setShowSaveConfirm(false)}>
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Guardar Odontograma Inicial</h3>
            </div>
            <p className="mb-2 text-sm text-gray-600">
              Al guardar, el odontograma inicial quedará <strong>bloqueado</strong> y no podrás editarlo directamente.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Todos los hallazgos se copiarán automáticamente al <strong>Odo. Evolución</strong> para que puedas continuar trabajando desde ahí.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSaveConfirm(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveInicial}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
              >
                Guardar y continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar desbloquear Odo. Inicial */}
      {showUnlockConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40" onClick={() => setShowUnlockConfirm(false)}>
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Desbloquear Odontograma Inicial</h3>
            </div>
            <p className="mb-2 text-sm text-gray-600">
              ¿Estás seguro de que deseas desbloquear el Odontograma Inicial?
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Podrás editarlo nuevamente, pero los cambios en <strong>Odo. Evolución</strong> se mantendrán independientes. Deberás volver a guardar el Inicial cuando termines.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowUnlockConfirm(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleUnlockInicial}
                className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
              >
                Desbloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Dar de Alta */}
      {showAltaConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40" onClick={() => setShowAltaConfirm(false)}>
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                <svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Dar de Alta al Paciente</h3>
            </div>
            <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
              <div className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-amber-700">
                  <strong>Atención:</strong> El <strong>Odo. Inicial</strong> y <strong>Odo. Evolución</strong> serán archivados permanentemente y ya no podrán ser editados.
                </p>
              </div>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              Ambos odontogramas se guardarán en el historial del paciente dentro de <strong>Odo. Alta</strong> y podrás consultarlos en cualquier momento. El sistema quedará listo para iniciar un nuevo ciclo de tratamiento.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAltaConfirm(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDarDeAlta}
                className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-medium text-white hover:bg-cyan-600 transition-colors"
              >
                Confirmar Alta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Visualizar odontograma archivado */}
      {viewingArchive && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50" onClick={() => setViewingArchive(null)}>
          <div className="mx-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {viewingArchiveTab === 'inicial' ? 'Odontograma Inicial' : 'Odontograma de Alta'}
                </h3>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewingArchiveTab('inicial')}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${viewingArchiveTab === 'inicial' ? 'bg-cyan-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    Inicial
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingArchiveTab('alta')}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${viewingArchiveTab === 'alta' ? 'bg-cyan-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    Alta
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  {viewingArchiveTab === 'inicial' ? viewingArchive.inicialDate : viewingArchive.altaDate}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingArchive(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Odontograma archivado read-only */}
            <div className="p-6">
              <div className="mx-auto w-full min-w-[600px] xl:min-w-[820px] space-y-6 px-2">
                {(() => {
                  const archiveFindings = viewingArchiveTab === 'inicial' ? viewingArchive.inicialFindings : viewingArchive.altaFindings
                  const archiveOrtho = viewingArchiveTab === 'inicial' ? viewingArchive.inicialOrtho : viewingArchive.altaOrtho
                  const pt = viewingArchive.patientType
                  const nom = viewingArchive.nomenclatura

                  return (
                    <>
                      {(pt === 'Adultos' || pt === 'Mixto') && (
                        <ToothRow teeth={[...upperRightTeeth, ...upperLeftTeeth]} position="upper" selectedTooth={null} toothFindings={archiveFindings} orthoGroups={archiveOrtho} pendingOrtho={null} onSelectTooth={() => {}} onSelectFinding={() => {}} onRemoveAllFindings={() => {}} onRemoveFinding={() => {}} onApplySurfaceFindings={() => {}} onOrthoAction={() => {}} onOrthoSecondClick={() => {}} onRemoveOrthoGroup={() => {}} nomenclatura={nom} />
                      )}
                      {(pt === 'Niño' || pt === 'Mixto') && (
                        <div className={pt === 'Mixto' ? 'mx-auto w-[65%]' : 'w-full'}>
                          <ToothRow teeth={[...upperRightTeethDeciduous, ...upperLeftTeethDeciduous]} position="upper" selectedTooth={null} toothFindings={archiveFindings} orthoGroups={archiveOrtho} pendingOrtho={null} onSelectTooth={() => {}} onSelectFinding={() => {}} onRemoveAllFindings={() => {}} onRemoveFinding={() => {}} onApplySurfaceFindings={() => {}} onOrthoAction={() => {}} onOrthoSecondClick={() => {}} onRemoveOrthoGroup={() => {}} nomenclatura={nom} />
                        </div>
                      )}
                      <div className="h-px w-full bg-gray-300" />
                      {(pt === 'Niño' || pt === 'Mixto') && (
                        <div className={pt === 'Mixto' ? 'mx-auto w-[65%]' : 'w-full'}>
                          <ToothRow teeth={[...lowerRightTeethDeciduous, ...lowerLeftTeethDeciduous]} position="lower" selectedTooth={null} toothFindings={archiveFindings} orthoGroups={archiveOrtho} pendingOrtho={null} onSelectTooth={() => {}} onSelectFinding={() => {}} onRemoveAllFindings={() => {}} onRemoveFinding={() => {}} onApplySurfaceFindings={() => {}} onOrthoAction={() => {}} onOrthoSecondClick={() => {}} onRemoveOrthoGroup={() => {}} nomenclatura={nom} />
                        </div>
                      )}
                      {(pt === 'Adultos' || pt === 'Mixto') && (
                        <ToothRow teeth={[...lowerRightTeeth, ...lowerLeftTeeth]} position="lower" selectedTooth={null} toothFindings={archiveFindings} orthoGroups={archiveOrtho} pendingOrtho={null} onSelectTooth={() => {}} onSelectFinding={() => {}} onRemoveAllFindings={() => {}} onRemoveFinding={() => {}} onApplySurfaceFindings={() => {}} onOrthoAction={() => {}} onOrthoSecondClick={() => {}} onRemoveOrthoGroup={() => {}} nomenclatura={nom} />
                      )}
                    </>
                  )
                })()}
              </div>

              {/* Plan de tratamiento archivado */}
              {(() => {
                const archFindings = viewingArchiveTab === 'inicial' ? viewingArchive.inicialFindings : viewingArchive.altaFindings
                const archOrthoGrps = viewingArchiveTab === 'inicial' ? viewingArchive.inicialOrtho : viewingArchive.altaOrtho
                const allRows: { toothStr: string; row: AppliedFinding }[] = []
                for (const toothStr in archFindings) {
                  for (const row of archFindings[toothStr]) {
                    allRows.push({ toothStr, row })
                  }
                }
                const hasData = allRows.length > 0 || archOrthoGrps.length > 0

                return (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="mb-3 text-sm font-semibold text-gray-700">Plan de tratamiento</h4>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#33475b] text-white">
                          <th className="px-4 py-2.5 text-left font-medium">N° diente</th>
                          <th className="px-4 py-2.5 text-left font-medium">Hallazgo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!hasData && (
                          <tr><td colSpan={2} className="border border-gray-200 bg-white py-4 text-center text-xs text-gray-400">Sin hallazgos registrados</td></tr>
                        )}
                        {allRows.map(({ toothStr, row }) => (
                          <tr key={row.id} className="border-b border-gray-200">
                            <td className="border border-gray-200 px-4 py-2 font-medium">{getToothLabel(parseInt(toothStr, 10), viewingArchive.nomenclatura)}</td>
                            <td className="border border-gray-200 px-4 py-2">
                              <span className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 shrink-0 rounded-full ${row.variant === 'blue' ? 'bg-blue-500' : 'bg-red-500'}`} />
                                <span>{row.label}{row.surfaces && row.surfaces.length > 0 && <span className="text-gray-500"> {row.surfaces.map(s => SURFACE_LABELS[s]).join(', ')}</span>}{row.option && <span className="text-xs text-gray-400"> · {row.option}</span>}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                        {archOrthoGrps.map((group) => (
                          <tr key={group.id} className="border-b border-gray-200">
                            <td className="border border-gray-200 px-4 py-2 font-medium">{group.teeth[0]}-{group.teeth[group.teeth.length - 1]}</td>
                            <td className="border border-gray-200 px-4 py-2">
                              <span className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 shrink-0 rounded-full ${group.variant === 'red' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                <span>{group.label}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })()}

              {/* Campos de texto archivados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-0 pb-2 pt-4">
                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-gray-500">Especificaciones:</label>
                  <div className="min-h-[70px] w-full rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700">
                    {(viewingArchiveTab === 'inicial' ? viewingArchive.inicialEspecificaciones : viewingArchive.altaEspecificaciones) || <span className="text-gray-300 italic">Sin datos</span>}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-gray-500">Diagnóstico:</label>
                  <div className="min-h-[70px] w-full rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700">
                    {(viewingArchiveTab === 'inicial' ? viewingArchive.inicialDiagnostico : viewingArchive.altaDiagnostico) || <span className="text-gray-300 italic">Sin datos</span>}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-gray-500">Observaciones:</label>
                  <div className="min-h-[70px] w-full rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700">
                    {(viewingArchiveTab === 'inicial' ? viewingArchive.inicialObservaciones : viewingArchive.altaObservaciones) || <span className="text-gray-300 italic">Sin datos</span>}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-gray-500">Plan de trabajo:</label>
                  <div className="min-h-[70px] w-full rounded-2xl bg-[#f4f8fb] p-3 text-sm text-gray-700">
                    {(viewingArchiveTab === 'inicial' ? viewingArchive.inicialPlanTrabajo : viewingArchive.altaPlanTrabajo) || <span className="text-gray-300 italic">Sin datos</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OdontogramSection
