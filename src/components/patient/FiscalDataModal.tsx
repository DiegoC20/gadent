import type { ReactNode } from 'react'

interface FiscalDataModalProps {
  isOpen: boolean
  onClose: () => void
}

function ModalFormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
      <label className="w-40 text-sm text-gray-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function FiscalDataModal({ isOpen, onClose }: FiscalDataModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
          aria-label="Cerrar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-6 text-center text-lg font-medium tracking-wide text-[#2f75b5]">
          AGREGAR DATOS FISCALES
        </h2>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose() }}>
          <ModalFormField label="Tipo de Documento:">
            <div className="relative">
              <select className="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pr-8 text-sm outline-none focus:border-cyan-400">
                <option>RUC</option>
                <option>DNI</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </ModalFormField>

          <ModalFormField label="Documento:">
            <input type="text" className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-cyan-400" />
          </ModalFormField>

          <ModalFormField label="Razón Social:">
            <input type="text" placeholder="Diego Cruzado" className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-cyan-400" />
          </ModalFormField>

          <ModalFormField label="Dirección:">
            <input type="text" className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-cyan-400" />
          </ModalFormField>

          <ModalFormField label="Departamento:">
            <div className="relative">
              <select className="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pr-8 text-sm outline-none focus:border-cyan-400">
                <option>Lima</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </ModalFormField>

          <ModalFormField label="Ciudad:">
            <div className="relative">
              <select className="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pr-8 text-sm outline-none focus:border-cyan-400">
                <option>Lima</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </ModalFormField>

          <ModalFormField label="Distrito:">
            <div className="relative">
              <select className="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pr-8 text-sm outline-none focus:border-cyan-400">
                <option>Ancón</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </ModalFormField>

          <div className="mt-8 flex justify-center pt-4">
            <button
              type="submit"
              className="rounded-full bg-[#aae2e9] px-12 py-2.5 text-sm font-medium text-white hover:bg-[#86d4de]"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FiscalDataModal
