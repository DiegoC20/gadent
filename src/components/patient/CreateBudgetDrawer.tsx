import { useState } from 'react'
import type { Patient } from '../../types/patient'

interface CreateBudgetDrawerProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
}

export default function CreateBudgetDrawer({ isOpen, onClose, patient }: CreateBudgetDrawerProps) {
  const [showOptional, setShowOptional] = useState(true)
  const [title, setTitle] = useState('')
  const [doctor, setDoctor] = useState('Diego Cruzado')
  const [patientNote, setPatientNote] = useState('')
  const [internalNote, setInternalNote] = useState('')
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer Container */}
      <div className="fixed right-0 top-0 bottom-0 z-[70] w-[800px] bg-[#f8fafc] shadow-[-8px_0_32px_rgba(0,0,0,0.15)] flex flex-col transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-5">
          <h2 className="text-xl font-bold text-[#1e293b] flex-1 text-center">Crear Presupuesto</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 custom-scrollbar">
          
          {/* Agregar servicio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">
              Agregar servicio <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar"
                className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#33475b] text-white">
                  <th className="px-3 py-3 font-semibold text-center w-[20%]">Item</th>
                  <th className="px-3 py-3 font-semibold text-center border-l border-white/10 w-[10%]">Diente</th>
                  <th className="px-3 py-3 font-semibold text-center border-l border-white/10 w-[10%]">Cant.</th>
                  <th className="px-3 py-3 font-semibold text-center border-l border-white/10 w-[10%]">Mon.</th>
                  <th className="px-3 py-3 font-semibold text-center border-l border-white/10 w-[15%]">Precio Unit.</th>
                  <th className="px-3 py-3 font-semibold text-center border-l border-white/10 w-[10%]">Dcto.</th>
                  <th className="px-3 py-3 font-semibold text-center border-l border-white/10 w-[12%]">Subtotal</th>
                  <th className="px-3 py-3 font-semibold text-center border-l border-white/10 w-[13%]">Comentario</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="py-12 bg-white">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50">
                        <svg className="h-6 w-6 text-[#008f9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-400">Agrega servicios o productos</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Datos Opcionales Accordion */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#008f9f] hover:text-[#007a88] transition-colors self-start"
            >
              Datos opcionales
              <svg 
                className={`h-4 w-4 transition-transform duration-200 ${showOptional ? 'rotate-0' : '-rotate-90'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showOptional && (
              <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-lg border border-gray-200">
                {/* Título del presupuesto */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500">Título del presupuesto</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Tratamiento de Ortodoncia"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                {/* Doctor responsable */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500">
                    Doctor responsable <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="Diego Cruzado">Diego Cruzado</option>
                    <option value="Dra. Milagros">Dra. Milagros</option>
                    <option value="Dr. Carlos">Dr. Carlos</option>
                  </select>
                </div>

                {/* Nota para el paciente */}
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-xs font-semibold text-gray-500">Nota para el paciente</label>
                  <textarea
                    rows={3}
                    value={patientNote}
                    onChange={(e) => setPatientNote(e.target.value)}
                    placeholder="Mensaje o términos visibles para el paciente"
                    className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                {/* Nota interna */}
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-xs font-semibold text-gray-500">Nota interna</label>
                  <textarea
                    rows={3}
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Anotaciones de uso interno clínico"
                    className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-[#f8fafc] px-8 py-4 shrink-0 rounded-b-2xl">
          {/* Guardar como plantilla */}
          <button
            type="button"
            onClick={() => setSaveAsTemplate(!saveAsTemplate)}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              saveAsTemplate ? 'text-[#008f9f]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg 
              className="h-5 w-5" 
              fill={saveAsTemplate ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            Guardar como plantilla
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="rounded-md bg-[#6cc3d5] hover:bg-[#5bb2c4] text-white px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
