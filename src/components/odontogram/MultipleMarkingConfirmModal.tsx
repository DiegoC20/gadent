import { useState } from 'react'
import { createPortal } from 'react-dom'
import { OPTION_ABBREVIATIONS } from '../../data/dentalFindings'
import type { ToothSurface } from '../../data/odontogramState'
import type { MultipleMarkingTarget } from './MultipleMarkingView'
import ToothPartsSvg from './ToothPartsSvg'
import { getDisplayColor } from './MultipleMarkingView'

interface AffectedTooth {
  tooth: number
  surfaces: ToothSurface[]
}

interface MultipleMarkingConfirmModalProps {
  target: MultipleMarkingTarget
  affectedTeeth: AffectedTooth[]
  onCancel: () => void
  onConfirm: (optionsMap: Record<number, string>) => void
}

function getOptionsForFinding(findingId: string): string[] {
  if (findingId === 'caries') {
    return [
      'Mancha Blanca',
      'a nivel del esmalte',
      'a nivel de la dentina',
      'a nivel de la dentina/compromiso de la pulpa',
      'a nivel cervical',
    ]
  }
  if (findingId === 'defectos-esmalte') {
    return [
      'Decoloración del Esmalte',
      'Fluorosis',
      'Hipo mineralización',
      'Hipoplasia',
      'Opacidades del Esmalte',
    ]
  }
  if (findingId === 'movilidad') {
    return [
      'Movilidad patológica nivel 1',
      'Movilidad patológica nivel 2',
    ]
  }
  if (findingId === 'posicion') {
    return [
      'Distalizado',
      'Lingualizado',
      'Mesializado',
      'Palatinizado',
      'Vestibularizado',
    ]
  }
  return [
    'Amalgama dental',
    'Carilla estética',
    'Incrustación estética',
    'Incrustación metálica',
    'Ionómero de vidrio',
    'Resina',
  ]
}

function MultipleMarkingConfirmModal({ target, affectedTeeth, onCancel, onConfirm }: MultipleMarkingConfirmModalProps) {
  const [specify, setSpecify] = useState(false)
  const [toothOptions, setToothOptions] = useState<Record<number, string>>({})
  const [globalOption, setGlobalOption] = useState<string | null>(null)

  const options = getOptionsForFinding(target.finding.id)
  const findingLabel = target.finding.label // "Caries", "Carillas", etc.

  const handleGlobalChange = (option: string) => {
    setGlobalOption(option)
    const newMap: Record<number, string> = {}
    affectedTeeth.forEach((t) => {
      newMap[t.tooth] = option
    })
    setToothOptions(newMap)
  }

  const handleIndividualChange = (tooth: number, option: string) => {
    setToothOptions((prev) => ({ ...prev, [tooth]: option }))
    setGlobalOption(null) // si se cambia uno individualmente, quitar el check global
  }

  const handleSave = () => {
    onConfirm(specify ? toothOptions : {})
  }

  const color = getDisplayColor(target)

  return createPortal(
    <div className="fixed inset-0 z-[40000] flex items-center justify-center bg-black/40 animate-fade-in" onClick={onCancel}>
      <div 
        className={`relative max-h-[90vh] overflow-y-auto rounded-3xl bg-white px-8 py-8 shadow-2xl transition-all duration-300 ${
          specify ? 'w-[900px] max-w-[95vw]' : 'w-[500px] max-w-[90vw]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-700">Confirmar operación</h3>
          <p className="mt-2 text-sm text-gray-500">
            El hallazgo "{findingLabel}" se registrará en los dientes seleccionados.
          </p>
        </div>

        {/* Specify Checkbox */}
        <div className="mt-6 flex justify-center">
          <label className="flex cursor-pointer items-center gap-3">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                specify ? 'border-[#519fb2] bg-[#519fb2]' : 'border-gray-300 bg-white'
              }`}
            >
              {specify && (
                <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={specify} 
              onChange={(e) => {
                setSpecify(e.target.checked)
                if (!e.target.checked) setToothOptions({})
              }} 
            />
            <span className="text-sm text-gray-600">Especificar el tipo de hallazgo</span>
          </label>
        </div>

        {/* Expandable Table */}
        {specify && (
          <div className="mt-6 w-full border-t border-gray-100 pt-4">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-center text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-3"></th>
                    {options.map((opt) => (
                      <th key={opt} className="px-2 py-3 align-top font-normal text-gray-600">
                        <div className="font-semibold">{OPTION_ABBREVIATIONS[opt]}</div>
                        <div className="text-[11px] leading-tight text-gray-500 mb-2">{opt}</div>
                        <label className="inline-flex cursor-pointer">
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded border ${
                              globalOption === opt ? 'border-[#519fb2] bg-[#519fb2]' : 'border-gray-300 bg-white'
                            }`}
                          >
                            {globalOption === opt && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={globalOption === opt}
                            onChange={() => handleGlobalChange(opt)}
                          />
                        </label>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {affectedTeeth.map((toothData) => (
                    <tr key={toothData.tooth} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-2 py-3 align-middle">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500">{toothData.tooth}</span>
                          <ToothPartsSvg 
                            selectedSurfaces={toothData.surfaces} 
                            color={color} 
                            onToggle={() => {}} 
                            size={32} 
                          />
                        </div>
                      </td>
                      {options.map((opt) => (
                        <td key={opt} className="px-2 py-3 align-middle">
                          <label className="inline-flex cursor-pointer p-2">
                            <div
                              className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
                                toothOptions[toothData.tooth] === opt ? 'border-[#519fb2] bg-white' : 'border-gray-300 bg-white'
                              }`}
                            >
                              {toothOptions[toothData.tooth] === opt && (
                                <div className="h-2.5 w-2.5 rounded-full bg-[#519fb2]" />
                              )}
                            </div>
                            <input
                              type="radio"
                              name={`tooth-${toothData.tooth}`}
                              className="hidden"
                              checked={toothOptions[toothData.tooth] === opt}
                              onChange={() => handleIndividualChange(toothData.tooth, opt)}
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="min-w-[120px] rounded-xl bg-[#f4f5f7] py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="min-w-[120px] rounded-xl bg-[#519fb2] py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#3e8697] transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MultipleMarkingConfirmModal
