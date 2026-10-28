import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Patient } from '../../types/patient'
import CreateBudgetDrawer from './CreateBudgetDrawer'

interface PatientQuickViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
}

function PatientQuickViewDrawer({ isOpen, onClose, patient }: PatientQuickViewDrawerProps) {
  const [activeTab, setActiveTab] = useState<'citas' | 'presupuesto'>('citas')
  const [isBudgetDrawerOpen, setIsBudgetDrawerOpen] = useState(false)

  if (!isOpen || !patient) return null

  return (
    <>
      {/* Backdrop (invisible but handles clicks outside) */}
      <div className="fixed inset-0 z-[40]" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[50] w-[600px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.1)] flex flex-col">
        
        {/* Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <img src={patient.avatar} alt={patient.name} className="h-16 w-16 rounded-full object-cover" />
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#2b3a4a]">{patient.name}</h2>
                  <Link
                    to={`/pacientes/${patient.id || 999}/historia`}
                    className="flex items-center gap-1.5 rounded bg-[#008f9f] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#007a88]"
                  >
                    Abrir historia
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
                
                <div className="mt-2 flex items-center gap-1 text-sm text-[#008f9f]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{patient.detail?.telefono || 'No registrado'}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Creado el {patient.detail?.createdAt || 'Hoy'}
            </div>
          </div>

          {/* Nota General */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Nota general</h3>
            <textarea 
              rows={2} 
              placeholder="Escribe aquí..." 
              className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm italic text-gray-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-[#e5e7eb]">
            <nav className="flex gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('citas')}
                className={`relative pb-3 text-sm font-semibold transition-colors ${
                  activeTab === 'citas'
                    ? 'text-[#2b3a4a] border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Citas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presupuesto')}
                className={`relative pb-3 text-sm font-semibold transition-colors ${
                  activeTab === 'presupuesto'
                    ? 'text-[#2b3a4a] border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Presupuesto
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'citas' && (
            <div className="mt-6">
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0070c0] text-white">
                      <th className="px-3 py-2.5 font-semibold text-center w-[25%]">Fecha</th>
                      <th className="px-3 py-2.5 font-semibold text-center border-l border-white/20 w-[20%]">Doctor</th>
                      <th className="px-3 py-2.5 font-semibold text-center border-l border-white/20 w-[20%]">Motivo</th>
                      <th className="px-3 py-2.5 font-semibold text-center border-l border-white/20 w-[15%]">Estado</th>
                      <th className="px-3 py-2.5 font-semibold text-center border-l border-white/20 w-[20%]">Comentario</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {patient.appointments && patient.appointments.length > 0 ? (
                      patient.appointments.map((app, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 text-gray-700 text-center">{app.date}</td>
                          <td className="px-3 py-3 text-gray-600 text-center">{app.doctor}</td>
                          <td className="px-3 py-3 text-gray-600 text-center">{app.reason}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              app.status === 'Confirmada' || app.status === 'Realizada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              app.status === 'Pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              app.status === 'Cancelada' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              'bg-gray-50 text-gray-700 border border-gray-200'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-gray-500 text-center">{app.comment || '--'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-gray-400">
                          No hay citas registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'presupuesto' && (
            <div className="mt-16 flex flex-col items-center">
              {/* Presupuesto Illustration */}
              <div className="relative mb-6 h-36 w-36 rounded-full bg-gradient-to-tr from-[#f4fbfc] to-white border border-[#edf6f7] flex items-center justify-center">
                {/* Sparkles */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                  <path d="M 20,20 L 22,25 L 27,27 L 22,29 L 20,34 L 18,29 L 13,27 L 18,25 Z" fill="#d0eaef" />
                  <path d="M 80,30 L 81,33 L 84,34 L 81,35 L 80,38 L 79,35 L 76,34 L 79,33 Z" fill="#d0eaef" />
                  <path d="M 75,70 L 76,73 L 79,74 L 76,75 L 75,78 L 74,75 L 71,74 L 74,73 Z" fill="#d0eaef" />
                </svg>
                
                <div className="relative z-10">
                  <svg className="h-[72px] w-[72px]" viewBox="0 0 64 64" fill="none">
                    {/* Document back */}
                    <rect x="22" y="6" width="26" height="34" rx="2" stroke="#b0d4da" strokeWidth="1.5" fill="white" />
                    {/* Pie Chart */}
                    <circle cx="22" cy="26" r="14" fill="#2b6ba3" />
                    <path d="M 22 26 L 22 12 A 14 14 0 0 1 36 26 Z" fill="#75cdd8" />
                    <circle cx="22" cy="26" r="5" fill="white" />
                    {/* Coins */}
                    <rect x="16" y="42" width="6" height="10" rx="1" fill="#e8a341" />
                    <rect x="18" y="38" width="6" height="14" rx="1" fill="#f4b857" />
                    <rect x="22" y="40" width="6" height="12" rx="1" fill="#fcd34d" />
                    {/* Bars */}
                    <rect x="34" y="40" width="5" height="12" rx="1" fill="#2b6ba3" />
                    <rect x="42" y="32" width="5" height="20" rx="1" fill="#2b6ba3" />
                    {/* Magnifying glass */}
                    <circle cx="46" cy="28" r="5" stroke="#75cdd8" strokeWidth="1.5" fill="white" />
                    <line x1="50" y1="32" x2="54" y2="36" stroke="#75cdd8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setIsBudgetDrawerOpen(true)}
                className="rounded-md bg-[#008f9f] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#007a88] transition-colors shadow-sm"
              >
                + Crear Presupuesto
              </button>
            </div>
          )}

        </div>
      </div>

      <CreateBudgetDrawer 
        isOpen={isBudgetDrawerOpen}
        onClose={() => setIsBudgetDrawerOpen(false)}
        patient={patient}
      />
    </>
  )
}

export default PatientQuickViewDrawer
