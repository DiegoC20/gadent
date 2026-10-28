import { useState } from 'react'
import { Link } from 'react-router-dom'
import { patients, addPatient } from '../data/patients'
import ChatWidget from '../components/ChatWidget'
import NewPatientModal from '../components/patient/NewPatientModal'
import PatientQuickViewDrawer from '../components/patient/PatientQuickViewDrawer'
import type { Patient } from '../types/patient'

function SearchIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )
  }

  if (status === 'missed') {
    return (
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    )
  }

  return null
}

function BudgetProgress({ current, total }: { current: number; total: number }) {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0

  return (
    <div className="min-w-[80px]">
      <span className="text-sm text-gray-700">
        {current} / {total}
      </span>
      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
        <div className="h-1.5 rounded-full bg-sky-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function PacientesPage() {
  const [activeTab, setActiveTab] = useState<'pacientes' | 'asistencias'>('pacientes')
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(1)
  const [showNewPatientModal, setShowNewPatientModal] = useState(false)
  const [localPatients, setLocalPatients] = useState<Patient[]>(patients)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isBusinessLineDropdownOpen, setIsBusinessLineDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedBusinessLine, setSelectedBusinessLine] = useState('Todos los pacientes')
  const [selectedStatus, setSelectedStatus] = useState('Selecciona una opción')
  const [isLegendOpen, setIsLegendOpen] = useState(false)
  const [isAsistenciasSearchOpen, setIsAsistenciasSearchOpen] = useState(false)
  const [asistenciasSearch, setAsistenciasSearch] = useState('')
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState('2026')
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const [isPatientsMoreOptionsOpen, setIsPatientsMoreOptionsOpen] = useState(false)

  const filteredAsistenciasPatients = localPatients.filter((p) =>
    p.name.toLowerCase().includes(asistenciasSearch.toLowerCase())
  )

  const filteredPatients = localPatients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <nav className="flex gap-8 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('pacientes')}
            className={`relative py-4 text-sm font-medium transition-colors ${
              activeTab === 'pacientes' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mis pacientes
            {activeTab === 'pacientes' && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('asistencias')}
            className={`relative py-4 text-sm font-medium transition-colors ${
              activeTab === 'asistencias' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Asistencias
            {activeTab === 'asistencias' && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400" />
            )}
          </button>
        </nav>
      </header>

      {activeTab === 'pacientes' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
            <p className="text-sm">
              <span className="font-semibold text-gray-800">Todos los pacientes</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-500">{filteredPatients.length} pacientes</span>
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowNewPatientModal(true)}
                className="rounded bg-[#008f9f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#007a88]"
              >
                Nuevo Paciente
              </button>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Nombre, apellido, doc., tlf..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  className="w-64 rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <SearchIcon />
                </span>
              </div>

              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => setIsPatientsMoreOptionsOpen(!isPatientsMoreOptionsOpen)}
                  className="rounded p-1 hover:bg-gray-100 transition-colors cursor-pointer outline-none flex items-center justify-center"
                  aria-label="Más opciones"
                >
                  <MoreIcon />
                </button>

                {isPatientsMoreOptionsOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsPatientsMoreOptionsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-[220px] rounded-lg bg-white shadow-xl border border-gray-100 py-1.5 z-20 overflow-hidden">
                      <button
                        type="button"
                        className="w-full px-5 py-3.5 text-left text-xs font-semibold text-[#008f9f] hover:bg-cyan-50/50 flex items-center gap-3.5 transition-colors"
                      >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 16V4m0 0l-4 4m4-4l4 4" />
                        </svg>
                        <span>Importar pacientes</span>
                      </button>

                      <button
                        type="button"
                        className="w-full px-5 py-3.5 text-left text-xs font-semibold text-[#008f9f] hover:bg-cyan-50/50 flex items-center gap-3.5 transition-colors"
                      >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4" />
                        </svg>
                        <span>Descargar pacientes</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-x-auto px-6 py-0">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#33475b] text-white">
                  <th className="border-r border-[#4a5f73] px-4 py-3 text-left font-medium">Paciente</th>
                  <th className="px-4 py-3 text-left font-medium">Última cita</th>
                  <th className="px-4 py-3 text-left font-medium">Próxima cita</th>
                  <th className="px-4 py-3 text-left font-medium">Tarea</th>
                  <th className="px-4 py-3 text-left font-medium">Presupuesto</th>
                  <th className="px-4 py-3 text-left font-medium">Fuente de captación</th>
                  <th className="px-4 py-3 text-left font-medium">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((patient) => (
                  <tr key={patient.id} className="group border-b border-gray-200 bg-white hover:bg-gray-50">
                    <td className="border-r border-gray-200 px-4 py-3 cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                      <div className="flex items-center gap-3">
                        <img
                          src={patient.avatar}
                          alt={patient.name}
                          className="h-10 w-10 shrink-0 rounded-full bg-gray-100 object-cover"
                        />
                        <button type="button" className="text-[15px] font-medium text-[#3b82f6] hover:underline">
                          {patient.name}
                        </button>
                        <Link
                          to={`/pacientes/${patient.id}/historia`}
                          onClick={(e) => e.stopPropagation()}
                          className="ml-2 rounded border border-[#408a97] bg-white px-2.5 py-1 text-xs font-medium text-[#408a97] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#408a97] hover:text-white"
                        >
                          Abrir Historia
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <AppointmentBadge status={patient.lastAppointmentStatus} />
                        <span>{patient.lastAppointment}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{patient.nextAppointment}</td>
                    <td className="px-4 py-3 text-gray-500">{patient.task}</td>
                    <td className="px-4 py-3">
                      {patient.budget ? (
                        <BudgetProgress current={patient.budget.current} total={patient.budget.total} />
                      ) : (
                        <span className="text-gray-500">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{patient.source}</td>
                    <td className="px-4 py-3 text-gray-500">{patient.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-white px-6 py-3 text-sm text-gray-600">
            <span>{filteredPatients.length} resultados</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="rounded border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página anterior"
              >
                <ChevronLeft />
              </button>
              <span className="min-w-[3rem] rounded border border-gray-300 px-2 py-1 text-center text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="rounded border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página siguiente"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span>Mostrar</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                className="rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-cyan-400"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>resultados por página</span>
            </div>
          </footer>
        </>
      )}

      {activeTab === 'asistencias' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Línea de negocio Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsBusinessLineDropdownOpen(!isBusinessLineDropdownOpen)
                    setIsStatusDropdownOpen(false)
                    setIsYearDropdownOpen(false)
                  }}
                  className="relative border border-gray-200 rounded-md px-3 py-1.5 bg-white flex items-center min-w-[170px] h-[38px] text-left outline-none cursor-pointer"
                >
                  <span className="absolute -top-2.5 left-2 bg-white px-1 text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                    Línea de negocio
                  </span>
                  <span className="text-xs text-gray-700 font-medium select-none">
                    {selectedBusinessLine}
                  </span>
                  <span className="absolute right-3 text-gray-400 pointer-events-none">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isBusinessLineDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsBusinessLineDropdownOpen(false)} />
                    <div className="absolute left-0 mt-1 w-[200px] rounded-md bg-white shadow-lg border border-gray-100 py-1 z-20">
                      {[
                        'Todos los pacientes',
                        'Ortodoncia',
                        'Rehabilitación',
                        'Estética',
                        'Endodoncia',
                        'Tratamiento integral',
                        'Odontopediatría',
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setSelectedBusinessLine(item)
                            setIsBusinessLineDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center justify-between transition-colors ${
                            selectedBusinessLine === item
                              ? 'text-[#3f51b5] font-semibold bg-[#3f51b5]/5'
                              : 'text-gray-700 font-medium'
                          }`}
                        >
                          <span className="select-none">{item}</span>
                          {selectedBusinessLine === item && (
                            <svg className="h-3.5 w-3.5 text-[#3f51b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Estado Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusDropdownOpen(!isStatusDropdownOpen)
                    setIsBusinessLineDropdownOpen(false)
                    setIsYearDropdownOpen(false)
                  }}
                  className="relative border border-gray-200 rounded-md px-3 py-1.5 bg-white flex items-center min-w-[170px] h-[38px] text-left outline-none cursor-pointer"
                >
                  <span className="absolute -top-2.5 left-2 bg-white px-1 text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                    Estado
                  </span>
                  <span className="text-xs text-gray-700 font-medium select-none">
                    {selectedStatus}
                  </span>
                  <span className="absolute right-3 text-gray-400 pointer-events-none">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isStatusDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                    <div className="absolute left-0 mt-1 w-[380px] rounded-md bg-white shadow-lg border border-gray-100 py-1 z-20">
                      
                      {/* Default Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStatus('Selecciona una opción')
                          setIsStatusDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 transition-colors ${
                          selectedStatus === 'Selecciona una opción'
                            ? 'text-[#3f51b5] font-semibold bg-[#3f51b5]/5'
                            : 'text-gray-700 font-medium'
                        }`}
                      >
                        <span className="select-none">Selecciona una opción</span>
                        {selectedStatus === 'Selecciona una opción' && (
                          <svg className="h-3.5 w-3.5 text-[#3f51b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Custom options with subtitles */}
                      {[
                        {
                          title: 'Deudores',
                          subtitle: 'Pacientes que no han realizado un pago en el mes a filtrar'
                        },
                        {
                          title: 'Sin cita programada',
                          subtitle: 'Pacientes que no tienen una cita agendada en el mes a filtrar'
                        },
                        {
                          title: 'Ausentes',
                          subtitle: 'Pacientes que tienen una cita con estado cancelado, reprogramado, ausente.'
                        }
                      ].map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(item.title)
                            setIsStatusDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-start justify-between transition-colors ${
                            selectedStatus === item.title ? 'bg-[#3f51b5]/5' : ''
                          }`}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-xs select-none ${
                              selectedStatus === item.title ? 'text-[#3f51b5] font-semibold' : 'text-gray-800 font-semibold'
                            }`}>
                              {item.title}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-[300px] select-none">
                              {item.subtitle}
                            </span>
                          </div>
                          {selectedStatus === item.title && (
                            <svg className="h-3.5 w-3.5 text-[#3f51b5] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Año Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsYearDropdownOpen(!isYearDropdownOpen)
                    setIsBusinessLineDropdownOpen(false)
                    setIsStatusDropdownOpen(false)
                  }}
                  className="relative border border-gray-200 rounded-md px-3 py-1.5 bg-white flex items-center min-w-[100px] h-[38px] text-left outline-none cursor-pointer"
                >
                  <span className="absolute -top-2.5 left-2 bg-white px-1 text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                    Año
                  </span>
                  <span className="text-xs text-gray-700 font-medium select-none">
                    {selectedYear}
                  </span>
                  <span className="absolute right-3 text-gray-400 pointer-events-none">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isYearDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsYearDropdownOpen(false)} />
                    <div className="absolute left-0 mt-1 w-[120px] rounded-md bg-white shadow-lg border border-gray-100 py-1 z-20">
                      {['2026', '2025', '2024'].map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => {
                            setSelectedYear(year)
                            setIsYearDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center justify-between transition-colors ${
                            selectedYear === year
                              ? 'text-[#3f51b5] font-semibold bg-[#3f51b5]/5'
                              : 'text-gray-700 font-medium'
                          }`}
                        >
                          <span className="select-none">{year}</span>
                          {selectedYear === year && (
                            <svg className="h-3.5 w-3.5 text-[#3f51b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Colored circles pill with popover legend */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLegendOpen(!isLegendOpen)}
                  className="flex items-center gap-2 bg-[#edf3f6] hover:bg-[#e2edf3] rounded-md px-3 py-2 transition-colors cursor-pointer outline-none"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </button>

                {isLegendOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLegendOpen(false)} />
                    <div className="absolute right-0 mt-2 w-[420px] rounded-lg bg-white shadow-2xl border border-gray-100 p-6 z-20 flex flex-col gap-4 text-left">
                      <p className="text-xs text-gray-700 font-medium leading-relaxed">
                        El número dentro de cada círculo indica el día en la que se agendó la cita
                      </p>

                      {/* Row 1: Slate-blue-gray circle (10) */}
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full bg-[#9ab0c0] text-white flex items-center justify-center text-[11px] font-bold shrink-0 select-none">
                          10
                        </div>
                        <span className="text-xs text-gray-600 font-semibold select-none">
                          El día 10 hubo/hay una cita en estado pendiente
                        </span>
                      </div>

                      {/* Row 2: Salmon-red circle (15) */}
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full bg-[#f38b8b] text-white flex items-center justify-center text-[11px] font-bold shrink-0 select-none">
                          15
                        </div>
                        <span className="text-xs text-gray-600 font-semibold select-none">
                          El día 15 hubo una cita y fue cancelada
                        </span>
                      </div>

                      {/* Row 3: Minty teal-green circle (20) */}
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full bg-[#4bd6a3] text-white flex items-center justify-center text-[11px] font-bold shrink-0 select-none">
                          20
                        </div>
                        <span className="text-xs text-gray-600 font-semibold select-none">
                          El día 20 hubo una cita y fue atendido
                        </span>
                      </div>

                      {/* Row 4: Dollar circle */}
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full border border-[#b2ebf2] bg-[#e0f7fa]/40 text-[#00acc1] flex items-center justify-center text-xs font-bold shrink-0 select-none">
                          $
                        </div>
                        <span className="text-xs text-gray-600 font-semibold select-none">
                          En el mes hubo un pago registrado en caja
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Search Button/Input */}
              {isAsistenciasSearchOpen ? (
                <div className="relative flex items-center bg-[#edf3f6] rounded-md px-3 py-1.5 h-9 w-64 border border-gray-200">
                  <input
                    type="text"
                    value={asistenciasSearch}
                    onChange={(e) => setAsistenciasSearch(e.target.value)}
                    placeholder="Buscar a un paciente"
                    className="bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none w-full pr-6"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAsistenciasSearch('')
                      setIsAsistenciasSearchOpen(false)
                    }}
                    className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAsistenciasSearchOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-[#edf3f6] text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {/* Play Button */}
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-md bg-[#edf3f6] text-gray-500 hover:bg-gray-200 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* More Options */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMoreOptionsOpen(!isMoreOptionsOpen)}
                  className="flex h-9 w-5 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer outline-none"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>

                {isMoreOptionsOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMoreOptionsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-[220px] rounded-xl bg-[#133b5c] shadow-2xl py-1 z-20 overflow-hidden border border-[#0d2a42]">
                      <button
                        type="button"
                        className="w-full px-5 py-3.5 text-left text-xs font-semibold text-white hover:bg-white/10 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Descargar PDF</span>
                        </div>
                        <svg className="h-3 w-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <div className="h-[1px] bg-white/15 w-full" />

                      <button
                        type="button"
                        className="w-full px-5 py-3.5 text-left text-xs font-semibold text-white hover:bg-white/10 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Descargar excel</span>
                        </div>
                        <svg className="h-3 w-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-x-auto px-6 py-4 thin-scrollbar">
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm overflow-x-auto thin-scrollbar">
              <table className="w-full min-w-[1600px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#33475b] text-white">
                    <th className="sticky left-0 bg-[#33475b] z-20 border-r border-[#4a5f73] px-4 py-3.5 text-left font-semibold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)] min-w-[280px]">
                      Paciente
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[100px]">
                      enero
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[100px]">
                      febrero
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[100px]">
                      marzo
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[100px]">
                      abril
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[100px]">
                      mayo
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[100px]">
                      junio
                    </th>
                    <th className="bg-[#008f9f] border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[110px]">
                      julio
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[100px]">
                      agosto
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[110px]">
                      septiembre
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[100px]">
                      octubre
                    </th>
                    <th className="border-r border-[#4a5f73] px-4 py-3.5 text-center font-semibold min-w-[110px]">
                      noviembre
                    </th>
                    <th className="px-4 py-3.5 text-center font-semibold min-w-[100px]">
                      diciembre
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredAsistenciasPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 group transition-colors">
                      {/* Patient Column (Sticky) */}
                      <td className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 border-r border-gray-200 px-4 py-3 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[280px]">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            {/* Row Menu (three dots vertical) */}
                            <span className="text-gray-300 font-bold cursor-grab hover:text-gray-500 pr-1 select-none">
                              ⋮
                            </span>
                            
                            {/* Avatar */}
                            <img
                              src={patient.avatar}
                              alt={patient.name}
                              className="h-10 w-10 shrink-0 rounded-full bg-gray-100 object-cover cursor-pointer"
                              onClick={() => setSelectedPatient(patient)}
                            />
                            
                            {/* Name link */}
                            <button
                              type="button"
                              onClick={() => setSelectedPatient(patient)}
                              className="text-[15px] font-semibold text-[#008f9f] hover:underline hover:text-[#007a88] transition-colors"
                            >
                              {patient.name}
                            </button>
                          </div>

                          {/* Open History Button (box with arrow) */}
                          <Link
                            to={`/pacientes/${patient.id}/historia`}
                            className="text-gray-400 hover:text-[#008f9f] transition-colors p-1.5 rounded hover:bg-gray-100"
                            title="Abrir historia"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        </div>
                      </td>

                      {/* Months Columns */}
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="border-r border-gray-200 px-4 py-3 bg-cyan-50/10"></td>
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="border-r border-gray-200 px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </>
      )}

      <ChatWidget />

      {showNewPatientModal && (
        <NewPatientModal 
          onClose={() => setShowNewPatientModal(false)} 
          onCreate={(newPatientData) => {
            const newId = localPatients.length > 0 ? Math.max(...localPatients.map(p => p.id)) + 1 : 1
            const newPatient = {
              ...newPatientData,
              id: newId
            } as Patient
            
            addPatient(newPatient) // Guardar en el "backend" mock para que se mantenga en otras rutas
            setLocalPatients([...patients]) // Refrescar la vista con la nueva lista
            setShowNewPatientModal(false)
            setSelectedPatient(newPatient) // Abre el drawer automáticamente
          }}
        />
      )}

      <PatientQuickViewDrawer
        isOpen={selectedPatient !== null}
        onClose={() => setSelectedPatient(null)}
        patient={selectedPatient}
      />
    </>
  )
}

export default PacientesPage
