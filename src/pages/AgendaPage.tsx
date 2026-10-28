import React, { useState } from 'react'
import { format, addWeeks, subWeeks, startOfWeek, addDays, subDays, isSameDay, startOfMonth, isSameMonth, getDate, getDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import AppointmentModal from '../components/AppointmentModal'

interface DayConfig {
  name: string
  date: string
  current?: boolean
  fullDate: Date
}

export default function AgendaPage() {
  const [selectedYear, setSelectedYear] = useState('2026')
  const [activeTab, setActiveTab] = useState<'semana' | 'dia' | 'mes'>('semana')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Todos'])
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [popoverDate, setPopoverDate] = useState(new Date())
  const [now, setNow] = useState(new Date())
  
  // Appointment Modal States
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [modalIsPast, setModalIsPast] = useState(false)
  const [modalStartTime, setModalStartTime] = useState<Date | null>(null)
  const [modalEndTime, setModalEndTime] = useState<Date | null>(null)

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const endDate = addDays(startDate, 6)
  const currentDateRange = `${format(startDate, 'd MMM', { locale: es })} - ${format(endDate, 'd MMM yyyy', { locale: es })}`
  const currentMonthName = format(currentDate, 'MMMM yyyy', { locale: es })

  const monthStart = startOfMonth(currentDate)
  const monthGridStart = startOfWeek(monthStart, { weekStartsOn: 0 })

  const toggleStatus = (status: string) => {
    if (status === 'Todos') {
      setSelectedStatuses(['Todos'])
      return
    }
    
    setSelectedStatuses(prev => {
      const isSelected = prev.includes(status)
      let next = isSelected ? prev.filter(s => s !== status) : [...prev.filter(s => s !== 'Todos'), status]
      if (next.length === 0) next = ['Todos']
      return next
    })
  }

  const handleSlotClick = (dayDate: Date, hourNum: number, isFirstHalf: boolean) => {
    const start = new Date(dayDate)
    start.setHours(hourNum, isFirstHalf ? 0 : 30, 0, 0)
    const end = new Date(start)
    end.setMinutes(start.getMinutes() + 30)
    
    setModalStartTime(start)
    setModalEndTime(end)
    setModalIsPast(start < now)
    setIsAppointmentModalOpen(true)
  }

  const days: DayConfig[] = Array.from({ length: 6 }).map((_, i) => {
    const d = addDays(startDate, i)
    return {
      name: format(d, 'EEEE', { locale: es }).replace(/^\w/, c => c.toUpperCase()),
      date: format(d, 'd'),
      current: isSameDay(d, now),
      fullDate: d
    }
  })

  const hours = [
    '8 a. m.',
    '9 a. m.',
    '10 a. m.',
    '11 a. m.',
    '12 p. m.',
    '1 p. m.',
    '2 p. m.',
    '3 p. m.',
    '4 p. m.',
    '5 p. m.',
    '6 p. m.',
    '7 p. m.',
    '8 p. m.',
  ]

  return (
    <>
      {/* Top Bar / Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4 shadow-sm select-none">
        
        {/* Left Side: Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 relative">
            <button 
              type="button"
              onClick={() => setCurrentDate(activeTab === 'dia' ? subDays(currentDate, 1) : subWeeks(currentDate, 1))}
              className="flex h-8 w-8 items-center justify-center text-[#008f9f] hover:bg-[#edf7f9] rounded-md transition-colors"
              aria-label="Anterior"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              type="button"
              onClick={() => {
                setPopoverDate(currentDate)
                setIsCalendarOpen(!isCalendarOpen)
              }}
              className="flex h-8 w-8 items-center justify-center text-[#008f9f] hover:bg-[#edf7f9] rounded-md transition-colors"
              aria-label="Ver calendario"
            >
              <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <circle cx="16" cy="16" r="2.5" fill="currentColor" stroke="none" />
              </svg>
            </button>

            {/* Calendar Popover */}
            {isCalendarOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsCalendarOpen(false)} />
                <div className="absolute top-10 left-8 z-50 w-[270px] rounded-lg bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 p-4 font-sans text-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[15px] font-semibold text-gray-700 cursor-pointer">
                      {format(popoverDate, 'MMM. yyyy', { locale: es }).replace(/^\w/, c => c.toUpperCase())}
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="flex gap-2 text-gray-400">
                      <button type="button" onClick={() => setPopoverDate(subMonths(popoverDate, 1))} className="hover:text-gray-600 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button type="button" onClick={() => setPopoverDate(addMonths(popoverDate, 1))} className="hover:text-gray-600 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 mb-2 border-b border-gray-100 pb-2">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                      <div key={i} className="text-center text-[13px] font-medium text-gray-400 w-8 h-8 flex items-center justify-center">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                      {format(popoverDate, 'MMM.', { locale: es }).toUpperCase()}
                    </div>
                    <div className="grid grid-cols-7 gap-y-2">
                      {(() => {
                        const popoverMonthStart = startOfMonth(popoverDate)
                        const popoverGridStart = startOfWeek(popoverMonthStart, { weekStartsOn: 1 })
                        
                        return Array.from({ length: 42 }).map((_, i) => {
                          const d = addDays(popoverGridStart, i)
                          const isSelected = isSameDay(d, currentDate)
                          const isToday = isSameDay(d, new Date())
                          const isCurrentMonth = isSameMonth(d, popoverDate)
                          
                          if (!isCurrentMonth) {
                            return <div key={i} className="w-8 h-8" />
                          }

                          return (
                            <div key={i} className="flex justify-center items-center w-8 h-8">
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentDate(d)
                                  setIsCalendarOpen(false)
                                }}
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[13.5px] transition-all ${
                                  isSelected 
                                    ? 'bg-[#3f51b5] text-white ring-4 ring-[#e8ebf8]' 
                                    : isToday
                                      ? 'text-[#008f9f] font-bold bg-[#edf7f9]'
                                      : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {getDate(d)}
                              </button>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                </div>
              </>
            )}

            <button 
              type="button"
              onClick={() => setCurrentDate(activeTab === 'dia' ? addDays(currentDate, 1) : addWeeks(currentDate, 1))}
              className="flex h-8 w-8 items-center justify-center text-[#008f9f] hover:bg-[#edf7f9] rounded-md transition-colors"
              aria-label="Siguiente"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button 
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="rounded border border-[#008f9f] bg-white px-3 py-1.5 text-sm font-medium text-[#008f9f] hover:bg-[#edf7f9] transition-colors"
          >
            Hoy
          </button>

          <span className="text-[17px] font-medium text-[#4b616b] ml-2 tracking-wide capitalize">
            {activeTab === 'dia' ? format(currentDate, 'EEEE, d MMM', { locale: es }) : activeTab === 'mes' ? currentMonthName : currentDateRange}
          </span>
        </div>

        {/* Right Side: Filters & Controls */}
        <div className="flex items-center gap-4">
          
          {/* Estado Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="relative border border-[#9fd5da] rounded-md px-3 py-1.5 bg-[#f8fbfa] flex items-center min-w-[140px] h-[36px] text-left outline-none cursor-pointer"
            >
              <span className="absolute -top-2.5 left-2 bg-gradient-to-b from-white to-[#f8fbfa] px-1 text-[11px] text-[#71859c] font-medium tracking-wide">
                Estado
              </span>
              <span className="text-[13.5px] text-gray-600 font-medium select-none truncate max-w-[90px] ml-1">
                {selectedStatuses.includes('Todos') ? 'Todos' : selectedStatuses.length === 1 ? selectedStatuses[0] : `${selectedStatuses.length} select.`}
              </span>
              <span className="absolute right-3 text-[#008f9f] pointer-events-none">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {isStatusDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-[340px] rounded-lg bg-[#f4f9f9] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#e1f0f2] py-4 z-20">
                  {/* Todos option */}
                  <div className="px-5 pb-4 border-b border-[#e1f0f2]">
                    <button
                      onClick={() => toggleStatus('Todos')}
                      className="flex items-center gap-3 w-full text-left"
                    >
                      <div className={`w-[22px] h-[22px] rounded flex items-center justify-center transition-colors ${selectedStatuses.includes('Todos') ? 'bg-[#008f9f]' : 'bg-white border-2 border-[#b2d8dd]'}`}>
                        {selectedStatuses.includes('Todos') && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      <span className="text-[14px] text-gray-600 font-medium select-none">Todos</span>
                    </button>
                  </div>
                  
                  {/* Grid options */}
                  <div className="grid grid-cols-2 gap-y-5 px-5 pt-5">
                    {[
                      'Pendiente', 'En espera',
                      'Ausente', 'Confirmada',
                      'Cancelada', 'En consulta',
                      'Atendida', 'Reprogramada'
                    ].map(status => (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className="flex items-center gap-3 w-full text-left"
                      >
                        <div className={`w-[22px] h-[22px] rounded flex items-center justify-center transition-colors ${selectedStatuses.includes(status) ? 'bg-[#008f9f]' : 'bg-white border-2 border-[#b2d8dd]'}`}>
                          {selectedStatuses.includes(status) && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                        <span className="text-[14px] text-gray-600 font-medium select-none">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* S / D Switcher */}
          <div className="flex items-center h-[36px]">
            <button 
              type="button"
              title="Semana"
              onClick={() => setActiveTab('semana')}
              className={`w-[44px] h-full text-[15px] font-medium rounded-l-xl transition-colors border relative ${
                activeTab === 'semana'
                  ? 'border-[#008f9f] bg-[#f0f9fa] text-[#008f9f] z-10'
                  : 'border-[#c4dee1] bg-white text-[#4b616b] hover:bg-gray-50 z-0'
              }`}
            >
              S
            </button>
            <button 
              type="button"
              title="Día"
              onClick={() => setActiveTab('dia')}
              className={`w-[44px] h-full text-[15px] font-medium transition-colors border -ml-[1px] relative ${
                activeTab === 'dia'
                  ? 'border-[#008f9f] bg-[#f0f9fa] text-[#008f9f] z-10'
                  : 'border-[#c4dee1] bg-white text-[#4b616b] hover:bg-gray-50 z-0'
              }`}
            >
              D
            </button>
            <button 
              type="button"
              title="Mes"
              onClick={() => setActiveTab('mes')}
              className={`w-[44px] h-full text-[15px] font-medium transition-colors rounded-r-xl border -ml-[1px] relative ${
                activeTab === 'mes'
                  ? 'border-[#008f9f] bg-[#f0f9fa] text-[#008f9f] z-10'
                  : 'border-[#c4dee1] bg-white text-[#4b616b] hover:bg-gray-50 z-0'
              }`}
            >
              M
            </button>
          </div>

          <div className="relative flex items-center ml-2">
            {/* Vertical More Menu */}
            <button 
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`flex h-9 w-9 items-center justify-center transition-colors rounded-full ${isMoreMenuOpen ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {isMoreMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMoreMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-[230px] rounded-lg bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 py-3 z-20">
                  <button className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 text-left transition-colors group">
                    <svg className="h-[22px] w-[22px] text-[#008f9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-[15px] text-gray-600 font-medium group-hover:text-gray-800 tracking-wide">Descargar</span>
                  </button>
                  <button className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 text-left transition-colors group mt-2">
                    <svg className="h-[22px] w-[22px] text-[#008f9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
                      <path d="M16 2v4M8 2v4M3 10h18" strokeWidth={2} />
                      <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
                      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
                      <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
                      <circle cx="8" cy="18" r="1" fill="currentColor" stroke="none" />
                      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
                      <circle cx="16" cy="18" r="1" fill="currentColor" stroke="none" />
                    </svg>
                    <span className="text-[15px] text-gray-600 font-medium group-hover:text-gray-800 tracking-wide">Citas eliminadas</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Main Grid View */}
      <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6 thin-scrollbar">
        {activeTab === 'mes' ? (
          <div className="flex flex-col">
            {/* Header Columns - Floating without borders */}
            <div className="grid grid-cols-7 text-[13.5px] font-bold text-[#304f63] bg-transparent pb-4 pt-1">
              {['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].map(d => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>
            
            {/* Month Grid */}
            <div className="overflow-hidden bg-white border border-[#f0f0f0] rounded-sm">
              <div className="flex flex-col bg-white">
                {Array.from({ length: 6 }).map((_, wIdx) => (
                  <div key={wIdx} className="grid grid-cols-7 h-[120px] border-b border-[#f0f0f0] last:border-b-0">
                    {Array.from({ length: 7 }).map((_, dIdx) => {
                      const dayDate = addDays(monthGridStart, wIdx * 7 + dIdx)
                      const dayNumber = getDate(dayDate)
                      const isOtherMonth = !isSameMonth(dayDate, currentDate)
                      const isWeekend = getDay(dayDate) === 0 || getDay(dayDate) === 6
                      const isSelected = isSameDay(dayDate, new Date())
                      
                      let textColor = 'text-gray-500'
                      if (isOtherMonth) {
                        textColor = isWeekend ? 'text-rose-200' : 'text-gray-200'
                      } else if (isWeekend) {
                        textColor = 'text-rose-400'
                      } else if (isSelected) {
                        textColor = 'text-[#37a65b] text-[19px] font-medium'
                      }

                      return (
                        <div 
                          key={`${wIdx}-${dIdx}`} 
                          onClick={() => {
                            setCurrentDate(dayDate)
                            setActiveTab('dia')
                          }}
                          className={`relative border-r border-[#f0f0f0] last:border-r-0 p-3 flex justify-end cursor-pointer transition-colors ${isSelected ? 'bg-[#ebf7eb]' : 'bg-white hover:bg-gray-50'}`}
                        >
                          <span className={`${textColor} ${isSelected ? 'mt-3 mr-2' : ''}`}>{dayNumber}</span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'dia' ? (
          <div className="flex flex-col h-full rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden min-h-[500px]">
            {/* List Header */}
            <div className="bg-[#304f63] text-white flex text-[13px] font-medium tracking-wide">
              <div className="w-[80px] px-4 py-3 border-r border-[#3c5e73]">Hora</div>
              <div className="w-[200px] px-4 py-3 border-r border-[#3c5e73]">Paciente</div>
              <div className="w-[180px] px-4 py-3 border-r border-[#3c5e73]">Motivo</div>
              <div className="w-[150px] px-4 py-3 border-r border-[#3c5e73]">Estado</div>
              <div className="flex-1 px-4 py-3 border-r border-[#3c5e73]">Últ. nota de evolución</div>
              <div className="flex-1 px-4 py-3 flex justify-between items-center relative">
                Nota de la cita
              </div>
            </div>
            
            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center bg-white">
              <div className="mb-4">
                <svg className="w-[120px] h-[120px]" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M85 75C96.0457 75 105 66.0457 105 55C105 44.8133 97.3802 36.4116 87.5303 35.1587C84.3415 26.0503 75.6429 19.5 65 19.5C53.7917 19.5 44.595 26.5794 41.5273 36.391C40.0635 35.9859 38.5492 35.7727 37 35.7727C27.0589 35.7727 19 43.8315 19 53.7727C19 63.7139 27.0589 71.7727 37 71.7727H85Z" fill="#cff2f6"/>
                  <path d="M78 89C86.8366 89 94 81.8366 94 73C94 64.1634 86.8366 57 78 57C69.1634 57 62 64.1634 62 73C62 81.8366 69.1634 89 78 89Z" stroke="#4fc3d3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M89.3137 84.3137L106 101" stroke="#4fc3d3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-gray-500 text-[14px]">No se encontró ninguna información</p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            
            <table className="w-full border-collapse table-fixed">
            
            {/* Header Columns */}
            <thead>
              <tr className="bg-[#f8fafc] border-b border-gray-200 text-xs">
                {/* Time Label Column */}
                <th className="w-[80px] py-4 border-r border-gray-200 bg-white font-medium text-gray-400">
                  {/* Empty header for time column */}
                </th>
                
                {/* Days Columns */}
                {days.map((day) => (
                  <th 
                    key={day.name} 
                    onClick={() => {
                      setCurrentDate(day.fullDate)
                      setActiveTab('dia')
                    }}
                    className="border-r border-gray-200 last:border-r-0 py-2.5 bg-white text-center font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <span className={`text-[11px] font-medium tracking-wide ${day.current ? 'text-[#008f9f]' : 'text-gray-400'}`}>
                        {day.name}
                      </span>
                      {day.current ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#008f9f] text-[13px] font-bold text-white shadow-xs">
                          {day.date}
                        </span>
                      ) : (
                        <span className="text-[13px] text-gray-500 font-semibold">
                          {day.date}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Grid Body */}
            <tbody className="bg-white">
              {hours.map((hour) => {
                const isAM = hour.includes('a. m.')
                let h = parseInt(hour.replace(/[^\d]/g, ''))
                if (isAM && h === 12) h = 0
                if (!isAM && h !== 12) h += 12
                const isCurrentHour = h === now.getHours()
                const currentMinute = now.getMinutes()
                const isFirstHalf = currentMinute < 30
                const isSecondHalf = currentMinute >= 30
                
                return (
                  <React.Fragment key={hour}>
                    {/* First Half Hour (e.g. 9:00 - 9:30) */}
                    <tr className="group">
                      {/* Hour label */}
                      <td 
                        className="border-b border-gray-100 border-r border-gray-200 text-[12.5px] text-gray-500 text-center font-bold select-none bg-white align-top pt-2.5 px-1"
                      >
                        {hour}
                      </td>

                      {days.map((day) => {
                        const showRedLine = day.current && isCurrentHour && isFirstHalf
                        
                        return (
                          <td 
                            key={day.name} 
                            onClick={() => handleSlotClick(day.fullDate, h, true)}
                            className="border-b border-gray-100 border-r border-gray-200 last:border-r-0 h-10 relative hover:bg-gray-50/40 transition-colors cursor-pointer"
                          >
                            {/* Current time line (First Half) */}
                            {showRedLine && (
                              <div 
                                className="absolute left-0 right-0 h-[2px] bg-rose-500 z-10 shadow-sm pointer-events-none"
                                style={{ top: `${(currentMinute / 30) * 100}%` }}
                              >
                                <div className="absolute -left-1.5 -top-[5px] h-3 w-3 rounded-full bg-rose-500" />
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>

                    {/* Second Half Hour (e.g. 9:30 - 10:00) */}
                    <tr className="group">
                      {/* Blank cell for the time column in the second row */}
                      <td className="border-b border-gray-200 border-r border-gray-200 bg-[#f5fafc]"></td>
                      {days.map((day) => {
                        const showRedLine = day.current && isCurrentHour && isSecondHalf
                        
                        return (
                          <td 
                            key={day.name} 
                            onClick={() => handleSlotClick(day.fullDate, h, false)}
                            className="border-b border-gray-200 border-r border-gray-200 last:border-r-0 h-10 relative bg-[#f5fafc] hover:bg-[#ebf4f7] transition-colors cursor-pointer"
                          >
                            {/* Current time line (Second Half) */}
                            {showRedLine && (
                              <div 
                                className="absolute left-0 right-0 h-[2px] bg-rose-500 z-10 shadow-sm pointer-events-none"
                                style={{ top: `${((currentMinute - 30) / 30) * 100}%` }}
                              >
                                <div className="absolute -left-1.5 -top-[5px] h-3 w-3 rounded-full bg-rose-500" />
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  </React.Fragment>
                )
              })}
            </tbody>
            
            </table>
          </div>
        )}
      </main>

      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        isPast={modalIsPast}
        startTime={modalStartTime}
        endTime={modalEndTime}
      />
    </>
  )
}
