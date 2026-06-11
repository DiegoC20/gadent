import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { ToothSurface } from '../../data/odontogramState'
import ToothFaceSvg from './ToothFaceSvg'

// ──────────────────────────────────────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────────────────────────────────────
export type SurfaceModalType = 'caries' | 'restau-ok' | 'restau-nok'

interface ModalConfig {
  title: string
  color: string       // Color de las superficies seleccionadas
  options: string[]   // Opciones de radio button
}

export const SURFACE_MODAL_CONFIG: Record<SurfaceModalType, ModalConfig> = {
  caries: {
    title: 'Lesión de caries',
    color: '#ef4444',
    options: [
      'Mancha Blanca',
      'a nivel del esmalte',
      'a nivel de la dentina',
      'a nivel de la dentina/compromiso de la pulpa',
      'a nivel cervical',
    ],
  },
  'restau-ok': {
    title: 'Restauración definitiva en buen estado',
    color: '#3b82f6',
    options: [
      'Amalgama dental',
      'Resina',
      'Ionómero de vidrio',
      'Incrustación metálica',
      'Incrustación estética',
      'Carilla estética',
    ],
  },
  'restau-nok': {
    title: 'Restauración definitiva en mal estado',
    color: '#ef4444',
    options: [
      'Amalgama dental',
      'Resina',
      'Ionómero de vidrio',
      'Incrustación metálica',
      'Incrustación estética',
      'Carilla estética',
    ],
  },
}

// ──────────────────────────────────────────────────────────────────────────────
// Componente
// ──────────────────────────────────────────────────────────────────────────────
interface SurfaceModalProps {
  type: SurfaceModalType
  toothNumber: number
  onClose: () => void
  onSave: (surfaces: ToothSurface[], option?: string) => void
}

function SurfaceModal({ type, toothNumber, onClose, onSave }: SurfaceModalProps) {
  const [selectedSurfaces, setSelectedSurfaces] = useState<ToothSurface[]>([])
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined)
  const config = SURFACE_MODAL_CONFIG[type]
  const hasSurfaces = selectedSurfaces.length > 0

  function toggleSurface(surface: ToothSurface) {
    setSelectedSurfaces((prev) =>
      prev.includes(surface) ? prev.filter((s) => s !== surface) : [...prev, surface],
    )
  }

  function toggleOption(option: string) {
    setSelectedOption((prev) => (prev === option ? undefined : option))
  }

  function handleSave() {
    if (!hasSurfaces) return
    onSave(selectedSurfaces, selectedOption)
  }

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-[640px] max-w-[92vw] rounded-2xl bg-white px-10 py-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Encabezado */}
        <h2 className="mb-1 text-center text-2xl font-semibold text-blue-600">{config.title}</h2>
        <p className="mb-1 text-center text-xs text-gray-400">Diente {toothNumber}</p>
        <p className="mb-7 text-center text-sm text-gray-500">
          Elige el tipo de hallazgo (opcional)
        </p>

        {/* Cuerpo: diagrama + opciones */}
        <div className="flex items-center gap-10">
          {/* Diagrama de caras (interactivo) */}
          <div className="shrink-0">
            <ToothFaceSvg
              selectedSurfaces={selectedSurfaces}
              color={config.color}
              onToggle={toggleSurface}
              size={160}
            />
          </div>

          {/* Opciones: solo aparecen cuando hay al menos una cara seleccionada */}
          {hasSurfaces && (
            <ul className="flex-1 space-y-3.5">
              {config.options.map((option) => {
                const isActive = selectedOption === option
                return (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => toggleOption(option)}
                      className="flex w-full cursor-pointer items-center gap-3 text-left"
                    >
                      {/* Radio personalizado */}
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          isActive ? 'border-blue-500 bg-blue-500' : 'border-gray-400 bg-white'
                        }`}
                      >
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="text-sm text-gray-700">{option}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Guardar */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasSurfaces}
            className="rounded-lg bg-blue-500 px-12 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SurfaceModal
