import { useState } from 'react'
import type { Patient } from '../../types/patient'

interface NewPatientModalProps {
  onClose: () => void
  onCreate: (patient: Partial<Patient>) => void
}

function NewPatientModal({ onClose, onCreate }: NewPatientModalProps) {
  const [expanded, setExpanded] = useState(false)
  const [nombres, setNombres] = useState('')
  const [paterno, setPaterno] = useState('')
  const [materno, setMaterno] = useState('')
  const [telefono, setTelefono] = useState('')

  const handleCreate = () => {
    // Generate mock patient data based on inputs
    const fullName = `${nombres.trim()} ${paterno.trim()} ${materno.trim()}`.trim() || 'Nuevo Paciente'
    
    const newPatient: Partial<Patient> = {
      name: fullName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
      lastAppointment: 'Recién creado',
      lastAppointmentStatus: 'none',
      nextAppointment: '--',
      task: '--',
      budget: { current: 0, total: 0 },
      source: '--',
      comment: '--',
      detail: {
        nombres: nombres,
        apellidos: `${paterno} ${materno}`.trim(),
        apodo: '',
        documento: '',
        telefono: telefono,
        email: '',
        fechaNacimiento: '',
        paisNacimiento: 'Perú',
        telFijo: '',
        numeroHC: '0',
        sexo: 'Hombre',
        aseguradora: 'Seleccionar',
        lineaNegocio: 'Seleccionar',
        grupo: 'Seleccionar',
        ocupacion: '',
        adicional: '',
        ultimaCita: '-',
        createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        age: 0,
      },
      appointments: []
    }
    
    onCreate(newPatient)
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className={`relative mx-4 flex max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl ${expanded ? 'w-full max-w-4xl' : 'w-full max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-700 mx-auto">Crear nuevo paciente</h2>
          <button type="button" onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-6 custom-scrollbar">
          <div className={`flex gap-8 ${expanded ? 'flex-row' : 'flex-col'}`}>
            
            {/* Columna Izquierda: Documentos obligatorios */}
            <div className={`${expanded ? 'w-1/2 border-r border-gray-200 pr-8' : 'w-full'}`}>
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Documentos obligatorios</h3>
              
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Documento<span className="text-red-500">*</span></label>
                <div className="flex rounded-lg border border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 overflow-hidden">
                  <select className="w-24 bg-gray-50 border-r border-red-400 px-3 py-2 text-sm text-gray-700 outline-none">
                    <option>DNI</option>
                    <option>CE</option>
                  </select>
                  <input type="text" placeholder="98765431" className="flex-1 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none" />
                </div>
                <p className="mt-1 text-xs text-red-500">Por favor ingrese su documento</p>
                <div className="mt-2 flex items-center gap-2">
                  <input type="checkbox" id="no-doc" className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
                  <label htmlFor="no-doc" className="text-sm text-gray-600">No tiene</label>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Nombres<span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Maria Clara" 
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Apellidos<span className="text-red-500">*</span></label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Paterno" 
                    value={paterno}
                    onChange={(e) => setPaterno(e.target.value)}
                    className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
                  />
                  <input 
                    type="text" 
                    placeholder="Materno (opcional)" 
                    value={materno}
                    onChange={(e) => setMaterno(e.target.value)}
                    className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Teléfono<span className="text-red-500">*</span></label>
                <div className="flex rounded-lg border border-gray-300 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 overflow-hidden">
                  <div className="flex items-center bg-gray-50 border-r border-gray-300 px-2">
                    <span className="mr-1 text-base">🇵🇪</span>
                    <select className="bg-transparent py-2 pl-1 pr-0 text-sm text-gray-700 outline-none">
                      <option>+51</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Ejemplo: 999 123 4567" 
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm text-gray-700 outline-none" 
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input type="checkbox" id="no-tel" className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
                  <label htmlFor="no-tel" className="text-sm text-gray-600">No tiene</label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="apoderado" className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
                  <label htmlFor="apoderado" className="text-sm text-gray-600">Tiene un apoderado</label>
                </div>
                
                <button 
                  type="button" 
                  onClick={() => setExpanded(!expanded)}
                  className="text-sm font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition-colors"
                >
                  {expanded ? (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Menos datos
                    </>
                  ) : (
                    <>
                      Más datos
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Columna Derecha: Datos opcionales (Solo visible si está expandido) */}
            {expanded && (
              <div className="w-1/2">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">Datos opcionales</h3>

                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">F. nacimiento</label>
                  <div className="relative">
                    <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Sexo</label>
                  <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
                    <option>Hombre</option>
                    <option>Mujer</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Fuente captación</label>
                  <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
                    <option value="" disabled selected>Seleccione una opción</option>
                    <option value="redes">Redes Sociales</option>
                    <option value="recomendacion">Recomendación</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Aseguradora</label>
                  <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
                    <option value="" disabled selected>Seleccionar</option>
                    <option value="pacifico">Pacífico</option>
                    <option value="mapfre">Mapfre</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Etiquetas</label>
                  <button type="button" className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Etiquetas
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-center gap-4 rounded-b-2xl border-t border-gray-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#008f9f] px-8 py-2 text-sm font-medium text-[#008f9f] hover:bg-cyan-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-[#008f9f] px-8 py-2 text-sm font-medium text-white hover:bg-[#007a88] transition-colors"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewPatientModal
