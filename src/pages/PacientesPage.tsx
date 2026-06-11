import { useState } from 'react'
import { Link } from 'react-router-dom'
import { patients } from '../data/patients'
import type { AppointmentStatus } from '../types/patient'
import ChatWidget from '../components/ChatWidget'

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

  const filteredPatients = patients.filter((p) =>
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

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <p className="text-sm">
          <span className="font-semibold text-gray-800">Todos los pacientes</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="text-gray-500">{filteredPatients.length} pacientes</span>
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded bg-[#408a97] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#357580]"
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

          <button type="button" className="rounded p-1 hover:bg-gray-100" aria-label="Más opciones">
            <MoreIcon />
          </button>
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
                <td className="border-r border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className="h-8 w-8 shrink-0 rounded-full bg-gray-100 object-cover"
                    />
                    <a href="#" className="font-medium text-blue-500 hover:underline">
                      {patient.name}
                    </a>
                    <Link
                      to={`/pacientes/${patient.id}/historia`}
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

      <ChatWidget />
    </>
  )
}

export default PacientesPage
