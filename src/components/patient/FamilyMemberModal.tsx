import type { ReactNode } from 'react'

interface FamilyMemberModalProps {
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

function FamilyMemberModal({ isOpen, onClose }: FamilyMemberModalProps) {
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
          AGREGAR FAMILIAR
        </h2>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose() }}>
          <ModalFormField label="Email">
            <input type="email" placeholder="ejemplo@gmail.com" className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-cyan-400" />
          </ModalFormField>

          <ModalFormField label="Documento" required>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="relative">
                  <select className="w-24 appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pr-8 text-sm outline-none focus:border-cyan-400">
                    <option>DNI</option>
                    <option>CE</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input type="text" placeholder="76565656" className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-cyan-400" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex h-4 w-4 items-center justify-center rounded-full border border-cyan-400 bg-white"></div>
                No tiene documento
              </label>
            </div>
          </ModalFormField>

          <ModalFormField label="Nombre" required>
            <input type="text" placeholder="Nombres" className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-cyan-400" />
          </ModalFormField>

          <ModalFormField label="Apellidos" required>
            <input type="text" placeholder="Apellidos" className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-cyan-400" />
          </ModalFormField>

          <ModalFormField label="Dirección">
            <input type="text" placeholder="Dirección" className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-cyan-400" />
          </ModalFormField>

          <ModalFormField label="Teléfono">
            <div className="flex gap-2">
              <div className="relative flex w-28 items-center rounded-full border border-gray-300 bg-white px-3 py-2 text-sm">
                <span>🇵🇪 +51</span>
                <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <input type="text" placeholder="000000000" className="flex-1 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-cyan-400 focus:bg-white" />
            </div>
          </ModalFormField>

          <ModalFormField label="Relación con el paciente" required>
            <div className="relative w-48">
              <select className="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pr-8 text-sm outline-none focus:border-cyan-400">
                <option>Mamá</option>
                <option>Papá</option>
                <option>Hijo/a</option>
                <option>Otro</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </ModalFormField>

          <div className="mt-4 flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400 bg-white"></div>
              Marcar este familiar como apoderado
            </label>
            <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="mt-8 flex justify-center pt-4">
            <button
              type="submit"
              className="rounded-full bg-[#75cdd8] px-12 py-2.5 text-sm font-medium text-white hover:bg-[#5db8c4]"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FamilyMemberModal
