import type { ReactNode } from 'react'
import type { Patient } from '../../types/patient'

export const sidebarMenu = [
  'Filiación',
  'Historia clínica',
  'Odontograma',
  'Periodontograma',
  'Ortodoncia',
  'Estado de cuenta',
  'Archivos',
] as const

export type PatientSection = (typeof sidebarMenu)[number]

const menuIcons: Record<PatientSection, ReactNode> = {
  'Filiación': (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  'Historia clínica': (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5m-7.5 4.5h7.5m-7.5 4.5h7.5" />
    </svg>
  ),
  'Odontograma': (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4c-1.5 0-2.5 1-2.5 2.5C4.5 9 6 11 6 14v4c0 1 1 2 2 2h0c1 0 2-1 2-2v-3h4v3c0 1 1 2 2 2h0c1 0 2-1 2-2v-4c0-3 1.5-5 1.5-7.5C19.5 5 18.5 4 17 4c-1.5 0-2.5 1-3 2-0.5-1-1.5-2-3-2z" />
    </svg>
  ),
  'Periodontograma': (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4c-1.5 0-2.5 1-2.5 2.5C4.5 9 6 11 6 14v4c0 1 1 2 2 2h0c1 0 2-1 2-2v-3h4v3c0 1 1 2 2 2h0c1 0 2-1 2-2v-4c0-3 1.5-5 1.5-7.5C19.5 5 18.5 4 17 4c-1.5 0-2.5 1-3 2-0.5-1-1.5-2-3-2z" />
    </svg>
  ),
  'Ortodoncia': (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4c-1.5 0-2.5 1-2.5 2.5C4.5 9 6 11 6 14v4c0 1 1 2 2 2h0c1 0 2-1 2-2v-3h4v3c0 1 1 2 2 2h0c1 0 2-1 2-2v-4c0-3 1.5-5 1.5-7.5C19.5 5 18.5 4 17 4c-1.5 0-2.5 1-3 2-0.5-1-1.5-2-3-2z" />
      <line x1="4.5" y1="10" x2="19.5" y2="10" />
      <rect x="7" y="9" width="2" height="2" />
      <rect x="11" y="9" width="2" height="2" />
      <rect x="15" y="9" width="2" height="2" />
    </svg>
  ),
  'Estado de cuenta': (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v14c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" />
      <path d="M5 19c0 1.66 3.13 3 7 3s7-1.34 7-3" />
    </svg>
  ),
  'Archivos': (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
}

interface PatientSidebarProps {
  patient: Patient
  activeSection: PatientSection
  onSectionChange: (section: PatientSection) => void
}

function PatientSidebar({ patient, activeSection, onSectionChange }: PatientSidebarProps) {
  const { detail } = patient

  return (
    <aside className="w-64 shrink-0 overflow-y-auto bg-gray-50 p-4 flex flex-col gap-6">
      {/* Profile Card */}
      <div className="flex flex-col items-center rounded-2xl bg-white pb-6 shadow-sm overflow-hidden border border-gray-100">
        <div className="h-24 w-full bg-gradient-to-b from-[#2b6ba3] to-[#5ba0c4]"></div>
        <div className="-mt-12 mb-3 rounded-full border-4 border-white bg-white shadow-sm">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="h-24 w-24 rounded-full object-cover"
          />
        </div>
        <h2 className="text-lg font-bold text-gray-700">{patient.name}</h2>
        <p className="mt-1 text-sm text-gray-500">Creado el {detail.createdAt}</p>
        
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-emerald-500 transition-colors shadow-sm"
            aria-label="WhatsApp"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Email"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Más opciones"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Card */}
      <nav className="flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        {sidebarMenu.map((item) => {
          const isActive = activeSection === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => onSectionChange(item)}
              className={`flex items-center gap-3 border-b border-gray-100 px-5 py-3.5 text-left text-sm transition-colors last:border-b-0 ${
                isActive
                  ? 'bg-[#75cdd8] text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                {menuIcons[item]}
              </div>
              {item}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default PatientSidebar
