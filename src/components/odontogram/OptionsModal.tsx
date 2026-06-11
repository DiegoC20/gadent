import { useState } from 'react'
import { createPortal } from 'react-dom'

export type OptionsModalType = 'defectos-esmalte' | 'movilidad' | 'posicion'

interface ModalConfig {
  title: string
  options: { label: string; abbr: string }[]
}

export const OPTIONS_MODAL_CONFIG: Record<OptionsModalType, ModalConfig> = {
  'defectos-esmalte': {
    title: 'Selecciona un tipo de Hallazgo',
    options: [
      { abbr: 'D', label: 'Decoloración del Esmalte' },
      { abbr: 'Fluorosis', label: 'Fluorosis' },
      { abbr: 'HM', label: 'Hipo mineralización' },
      { abbr: 'HP', label: 'Hipoplasia' },
      { abbr: 'O', label: 'Opacidades del Esmalte' },
    ],
  },
  'movilidad': {
    title: 'Selecciona un tipo de Hallazgo',
    options: [
      { abbr: 'M1', label: 'Movilidad patológica nivel 1' },
      { abbr: 'M2', label: 'Movilidad patológica nivel 2' },
    ],
  },
  'posicion': {
    title: 'Selecciona un tipo de Hallazgo',
    options: [
      { abbr: 'D', label: 'Distalizado' },
      { abbr: 'L', label: 'Lingualizado' },
      { abbr: 'M', label: 'Mesializado' },
      { abbr: 'P', label: 'Palatinizado' },
      { abbr: 'V', label: 'Vestibularizado' },
    ],
  },
}

interface OptionsModalProps {
  type: OptionsModalType
  onClose: () => void
  onSave: (option: string) => void
}

function OptionsModal({ type, onClose, onSave }: OptionsModalProps) {
  const config = OPTIONS_MODAL_CONFIG[type]

  return createPortal(
    <div
      className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="relative w-[400px] max-w-[92vw] rounded-2xl bg-white px-8 py-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-center text-xl font-semibold text-blue-600">{config.title}</h2>
        
        <ul className="space-y-2">
          {config.options.map((opt) => (
            <li key={opt.label}>
              <button
                type="button"
                onClick={() => onSave(opt.label)}
                className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 hover:border-blue-400"
              >
                <span className="w-16 text-left font-medium text-gray-700">{opt.abbr}</span>
                <span className="text-gray-500">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-cyan-300 px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default OptionsModal
