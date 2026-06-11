import type { ReactNode } from 'react'

interface EvolutionNoteModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EvolutionNoteModal({ isOpen, onClose }: EvolutionNoteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-center border-b border-gray-100 py-5">
          <h2 className="text-lg font-medium text-[#2b6ba3]">
            Agregar última nota de evolución
          </h2>
          <button
            onClick={onClose}
            className="absolute right-5 text-gray-400 hover:text-gray-700"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose() }}>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">Doctor:</span>
              <button type="button" className="flex items-center gap-1 text-[#3f8a9e] hover:text-[#2d6878]">
                Diego Cruzado
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">Evolución</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">Observación</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 border-t border-gray-100 py-4 bg-white rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 px-8 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#3f8a9e] px-8 py-2 text-sm font-medium text-white hover:bg-[#327081]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
