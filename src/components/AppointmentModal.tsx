import React, { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  isPast: boolean
  startTime: Date | null
  endTime: Date | null
}

export default function AppointmentModal({ isOpen, onClose, isPast, startTime, endTime }: AppointmentModalProps) {
  const [activeTab, setActiveTab] = useState<'cita' | 'evento'>('cita')
  const [showMoreData, setShowMoreData] = useState(false)
  const [pastStatus, setPastStatus] = useState('atendida')
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'agendar' | 'nuevo-paciente'>('agendar')
  
  const [isEditingTime, setIsEditingTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedStartTime, setSelectedStartTime] = useState<Date>(new Date())
  const [selectedEndTime, setSelectedEndTime] = useState<Date>(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false)
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false)
  const [isRepeatDropdownOpen, setIsRepeatDropdownOpen] = useState(false)
  const [selectedRepeat, setSelectedRepeat] = useState('No se repite')
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())

  const isCurrentlyPast = selectedStartTime < new Date()

  React.useEffect(() => {
    if (isOpen && startTime && endTime) {
      setSelectedDate(startTime)
      setSelectedStartTime(startTime)
      setSelectedEndTime(endTime)
      setCalendarMonth(startTime)
      setIsEditingTime(false)
      setIsDatePickerOpen(false)
      setIsStartTimeOpen(false)
      setIsEndTimeOpen(false)
      setIsRepeatDropdownOpen(false)
    }
  }, [isOpen, startTime, endTime])
  
  if (!isOpen || !startTime || !endTime) return null

  const colors = [
    'bg-[#B21F56]', 'bg-[#F25E22]', 'bg-[#E3C326]', 'bg-[#158C46]', 'bg-[#3F51B5]', 'bg-[#8E24AA]', 'bg-[#D81B60]', 'bg-[#E65100]', 'bg-[#AFB42B]',
    'bg-[#00897B]', 'bg-[#7986CB]', 'bg-[#795548]', 'bg-[#E53935]', 'bg-[#F9A825]', 'bg-[#7CB342]', 'bg-[#039BE5]', 'bg-[#B39DDB]', 'bg-[#616161]',
    'bg-[#E57373]', 'bg-[#FFCA28]', 'bg-[#4DB6AC]', 'bg-[#64B5F6]', 'bg-[#BA68C8]', 'bg-[#A1887F]'
  ]

  const generateTimeOptions = (fromTime?: Date) => {
    const options: { date: Date, label: string, durationLabel?: string }[] = []
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    let current = startOfDay
    if (fromTime) {
      current = new Date(fromTime)
      current.setMinutes(current.getMinutes() + 30)
    }

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 30, 0, 0)

    while (current <= endOfDay) {
      let durationStr = ''
      if (fromTime) {
        const diffMins = (current.getTime() - fromTime.getTime()) / 60000
        const h = Math.floor(diffMins / 60)
        const m = diffMins % 60
        if (h > 0 && m > 0) durationStr = `(${h}h ${m}min)`
        else if (h > 0) durationStr = `(${h}h)`
        else durationStr = `(${m} min)`
      }
      
      options.push({
        date: new Date(current),
        label: format(current, 'h:mm a').toLowerCase(),
        durationLabel: durationStr
      })
      
      current.setMinutes(current.getMinutes() + 30)
    }
    return options
  }

  const renderCalendar = () => {
    const monthStart = startOfMonth(calendarMonth)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const days = []
    
    for (let i = 0; i < 42; i++) {
      days.push(addDays(startDate, i))
    }

    return (
      <div className="w-[240px]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[14px] font-bold text-gray-700 capitalize">{format(calendarMonth, 'MMM. yyyy', { locale: es })}</span>
          <div className="flex gap-2">
            <button onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))} className="text-gray-400 hover:text-gray-700"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))} className="text-gray-400 hover:text-gray-700"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-gray-400 mb-2">
          {['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((d, i) => {
            const isSelected = isSameDay(d, selectedDate)
            const isCurrentMonth = isSameMonth(d, calendarMonth)
            return (
              <button
                key={i}
                onClick={() => {
                  setSelectedDate(d)
                  setIsDatePickerOpen(false)
                  const newStart = new Date(d)
                  newStart.setHours(selectedStartTime.getHours(), selectedStartTime.getMinutes())
                  setSelectedStartTime(newStart)
                  const newEnd = new Date(d)
                  newEnd.setHours(selectedEndTime.getHours(), selectedEndTime.getMinutes())
                  setSelectedEndTime(newEnd)
                }}
                className={`mx-auto h-7 w-7 rounded-full text-[13px] flex items-center justify-center transition-colors ${!isCurrentMonth ? 'text-gray-300' : isSelected ? 'bg-[#3F51B5] text-white shadow-sm ring-2 ring-[#3F51B5] ring-offset-1' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {format(d, 'd')}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderTimeBlock = (hasTopBorder: boolean = true) => (
    <div className={`flex flex-col gap-2 pt-3 pb-4 border-b ${hasTopBorder ? 'border-t' : ''} border-gray-100 ${hasTopBorder ? 'mt-1' : ''} mb-1 relative`}>
      {!isEditingTime ? (
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors"
          onClick={() => setIsEditingTime(true)}
        >
          <svg className="w-[22px] h-[22px] text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth={1.5}/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
          </svg>
          <div className="flex flex-col">
            <div className="flex gap-3 text-[13.5px] font-medium text-gray-700">
              <span className="capitalize">{format(selectedDate, 'EEEE, d MMM', { locale: es })}</span>
              <span>{format(selectedStartTime, 'h:mm a').toLowerCase()} - {format(selectedEndTime, 'h:mm a').toLowerCase()}</span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">no se repite</span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 pt-1">
          <svg className="w-[22px] h-[22px] text-gray-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth={1.5}/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
          </svg>
          
          <div className="flex flex-col gap-3 w-full">
            {isCurrentlyPast && (
              <span className="text-[#d89614] text-[12px] font-medium -mb-2 -mt-1">Fecha pasada</span>
            )}
            <div className="flex items-center gap-3 relative z-40">
              {/* Date Picker Button */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsDatePickerOpen(!isDatePickerOpen)
                    setIsStartTimeOpen(false)
                    setIsEndTimeOpen(false)
                    setIsRepeatDropdownOpen(false)
                  }}
                  className="flex items-center gap-2 border border-[#c4dee1] rounded-md px-3 py-1.5 text-[13.5px] font-medium text-gray-600 hover:border-[#008f9f] focus:outline-none focus:ring-1 focus:ring-[#008f9f] bg-white"
                >
                  {format(selectedDate, 'dd/MM/yyyy')}
                  <svg className="w-4 h-4 text-[#008f9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </button>
                {isDatePickerOpen && (
                  <div className="absolute top-[110%] left-0 bg-white rounded-lg shadow-xl border border-gray-100 p-4 min-w-[280px]">
                    {renderCalendar()}
                  </div>
                )}
              </div>
              
              {/* Start Time Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsStartTimeOpen(!isStartTimeOpen)
                    setIsDatePickerOpen(false)
                    setIsEndTimeOpen(false)
                    setIsRepeatDropdownOpen(false)
                  }}
                  className="border border-[#c4dee1] rounded-md px-3 py-1.5 text-[13.5px] font-medium text-gray-600 hover:border-[#008f9f] w-[90px] text-center focus:outline-none focus:ring-1 focus:ring-[#008f9f] bg-white"
                >
                  {format(selectedStartTime, 'h:mm a').toLowerCase()}
                </button>
                {isStartTimeOpen && (
                  <div className="absolute top-[110%] left-0 bg-white rounded-md shadow-xl border border-gray-100 max-h-[220px] overflow-y-auto w-[120px] custom-scrollbar py-1">
                     {generateTimeOptions().map((opt, i) => (
                       <button
                         key={i}
                         onClick={() => {
                           setSelectedStartTime(opt.date)
                           const newEnd = new Date(opt.date)
                           newEnd.setMinutes(newEnd.getMinutes() + 30)
                           setSelectedEndTime(newEnd)
                           setIsStartTimeOpen(false)
                         }}
                         className={`w-full text-left px-3 py-2 text-[13.5px] hover:bg-gray-50 transition-colors ${opt.date.getTime() === selectedStartTime.getTime() ? 'text-[#008f9f] font-medium bg-[#edf7f9]' : 'text-gray-600'}`}
                       >
                         {opt.label}
                       </button>
                     ))}
                  </div>
                )}
              </div>
              
              <span className="text-gray-400 font-medium">-</span>
              
              {/* End Time Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsEndTimeOpen(!isEndTimeOpen)
                    setIsDatePickerOpen(false)
                    setIsStartTimeOpen(false)
                    setIsRepeatDropdownOpen(false)
                  }}
                  className="border border-[#008f9f] rounded-md px-3 py-1.5 text-[13.5px] font-medium text-gray-700 w-[90px] text-center focus:outline-none focus:ring-1 focus:ring-[#008f9f] shadow-[0_0_0_1px_#008f9f] bg-white"
                >
                  {format(selectedEndTime, 'h:mm a').toLowerCase()}
                </button>
                {isEndTimeOpen && (
                  <div className="absolute top-[110%] right-0 bg-white rounded-md shadow-xl border border-gray-100 max-h-[220px] overflow-y-auto w-[180px] custom-scrollbar py-1">
                     {generateTimeOptions(selectedStartTime).map((opt, i) => (
                       <button
                         key={i}
                         onClick={() => {
                           setSelectedEndTime(opt.date)
                           setIsEndTimeOpen(false)
                         }}
                         className={`w-full text-left px-3 py-2 text-[13.5px] hover:bg-gray-50 transition-colors flex justify-between items-center ${opt.date.getTime() === selectedEndTime.getTime() ? 'text-[#008f9f] font-medium bg-[#edf7f9]' : 'text-gray-600'}`}
                       >
                         <span>{opt.label}</span>
                         {opt.durationLabel && <span className="text-[12px] text-gray-400">{opt.durationLabel}</span>}
                       </button>
                     ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Repeat Dropdown */}
            <div className="relative w-full z-30 mt-1">
              <button
                onClick={() => {
                  setIsRepeatDropdownOpen(!isRepeatDropdownOpen)
                  setIsDatePickerOpen(false)
                  setIsStartTimeOpen(false)
                  setIsEndTimeOpen(false)
                }}
                className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] bg-white focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f] font-medium text-gray-600 flex items-center justify-between"
              >
                {selectedRepeat}
                <svg className={`w-4 h-4 text-[#008f9f] transition-transform ${isRepeatDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isRepeatDropdownOpen && (
                <div className="absolute top-[110%] left-0 bg-white rounded-md shadow-xl border border-gray-100 max-h-[220px] overflow-y-auto w-full custom-scrollbar py-1">
                  {['No se repite', 'Todos los días', 'Cada semana', 'Cada 02 semanas', 'Cada 03 semanas', 'Cada 04 semanas'].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedRepeat(opt)
                        setIsRepeatDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13.5px] hover:bg-gray-50 transition-colors flex justify-between items-center text-gray-700"
                    >
                      <span className={opt === selectedRepeat ? 'text-[#008f9f] font-medium' : ''}>{opt}</span>
                      {opt === selectedRepeat && (
                        <svg className="w-4 h-4 text-[#008f9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${showMoreData && activeTab === 'cita' ? 'w-[750px]' : 'w-[400px]'}`}>
        
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0 border-b border-gray-200">
          <div className="flex gap-6">
            <button
              className={`pb-3 text-[15px] font-semibold transition-colors relative ${activeTab === 'cita' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setActiveTab('cita')}
            >
              Agendar cita
              {activeTab === 'cita' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4fc3d3] rounded-t-sm" />
              )}
            </button>
            <button
              className={`pb-3 text-[15px] font-semibold transition-colors relative ${activeTab === 'evento' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setActiveTab('evento')}
            >
              Crear evento
              {activeTab === 'evento' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4fc3d3] rounded-t-sm" />
              )}
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
          
          {/* Past Time Status */}
          {isCurrentlyPast && (
            <div className="mb-6 pb-4 border-b border-gray-100">
              <label className="block text-[13.5px] font-bold text-gray-600 mb-3">Estado de la cita (Pasada)</label>
              <div className="flex gap-5">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="status" value="atendida" checked={pastStatus === 'atendida'} onChange={() => setPastStatus('atendida')} className="w-4 h-4 text-[#008f9f] focus:ring-[#008f9f]" />
                  <span className="text-[13.5px] text-gray-600 font-medium group-hover:text-gray-800">Atendida</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="status" value="no-asistio" checked={pastStatus === 'no-asistio'} onChange={() => setPastStatus('no-asistio')} className="w-4 h-4 text-[#008f9f] focus:ring-[#008f9f]" />
                  <span className="text-[13.5px] text-gray-600 font-medium group-hover:text-gray-800">No asistió</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="status" value="cancelada" checked={pastStatus === 'cancelada'} onChange={() => setPastStatus('cancelada')} className="w-4 h-4 text-[#008f9f] focus:ring-[#008f9f]" />
                  <span className="text-[13.5px] text-gray-600 font-medium group-hover:text-gray-800">Cancelada</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'cita' && (
            <>
              {currentView === 'agendar' ? (
                <div className={`flex gap-6 ${showMoreData ? 'flex-row' : 'flex-col'}`}>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="relative">
                      <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Paciente<span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Buscar" 
                          onClick={() => setIsPatientDropdownOpen(true)}
                          className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f] cursor-pointer text-gray-500" 
                          readOnly
                        />
                        <svg className={`w-4 h-4 text-[#008f9f] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${isPatientDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {isPatientDropdownOpen && (
                        <div className="absolute top-0 left-0 w-full z-50 bg-white rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.15)] border border-gray-50 overflow-hidden -mt-2 -ml-2 w-[calc(100%+16px)]">
                          <div className="p-3 pb-2">
                            <div className="relative">
                              <input type="text" placeholder="Buscar Paciente" className="w-full border border-[#008f9f] rounded-md px-3 py-2 text-[13.5px] focus:outline-none italic text-gray-400 focus:ring-1 focus:ring-[#008f9f]" autoFocus />
                              <button onClick={() => setIsPatientDropdownOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                          
                          <div className="px-4 py-2 text-[12px] text-gray-400 font-medium">
                            Pacientes agregados recientemente
                          </div>
                          
                          <div className="flex flex-col max-h-[160px] overflow-y-auto custom-scrollbar">
                            {['QQQ, Aaa', 'YYY, Aaa', 'XD, Zzz', 'CRUZADO, Diego'].map((pac, idx) => (
                              <div key={idx} className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between group">
                                <span className="text-[13.5px] text-gray-700">{pac}</span>
                                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                            ))}
                          </div>
                          
                          <button 
                            onClick={() => {
                              setIsPatientDropdownOpen(false);
                              setCurrentView('nuevo-paciente');
                            }}
                            className="w-full px-4 py-3 flex items-center gap-2 text-[#008f9f] hover:bg-[#edf7f9] transition-colors border-t border-gray-50 text-[13.5px] font-medium"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v8m-4-4h8" />
                            </svg>
                            Agregar nuevo paciente
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Doctor<span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] appearance-none bg-transparent focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f]">
                          <option>Diego Cruzado</option>
                        </select>
                        <svg className="w-4 h-4 text-[#008f9f] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Motivo<span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] appearance-none bg-transparent focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f] text-gray-500">
                          <option>Control de limpieza</option>
                        </select>
                        <svg className="w-4 h-4 text-[#008f9f] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {renderTimeBlock(true)}

                    {!showMoreData && (
                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Nota de la cita</label>
                        <textarea placeholder="Ej. viene promoción de Black Friday" rows={3} className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] resize-none focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f] italic text-gray-400 placeholder:text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Extra Data Column */}
                  {showMoreData && (
                    <div className="flex-1 flex flex-col gap-4 border-l border-gray-100 pl-6">
                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Servicios</label>
                        <div className="relative">
                          <input type="text" placeholder="Ej. Limpieza" className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] italic text-gray-400 placeholder:text-gray-300 focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f]" />
                          <svg className="w-4 h-4 text-[#008f9f] absolute right-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Nota de la cita</label>
                        <textarea placeholder="Ej. viene promoción de Black Friday" rows={4} className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] resize-none focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f] italic text-gray-400 placeholder:text-gray-300" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2 -ml-2">
                    <button onClick={() => setCurrentView('agendar')} className="text-[#008f9f] hover:text-[#007b8a] p-2 rounded-full hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h3 className="text-[15px] font-bold text-gray-600">Nuevo paciente</h3>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Nombres<span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f]" />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Apellidos<span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f]" />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Teléfono<span className="text-red-500">*</span></label>
                    <div className="flex">
                      <div className="relative">
                        <select className="border border-[#c4dee1] rounded-l-md px-3 py-2 text-[13.5px] appearance-none bg-gray-50 focus:outline-none focus:border-[#008f9f] pr-8 text-gray-700 font-medium h-[37px]">
                          <option>🇵🇪 +51</option>
                          <option>🇲🇽 +52</option>
                          <option>🇨🇴 +57</option>
                        </select>
                        <svg className="w-3.5 h-3.5 text-[#008f9f] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <input type="text" placeholder="Ejemplo: 999 123 4567" className="flex-1 border border-l-0 border-[#c4dee1] rounded-r-md px-3 py-2 text-[13.5px] italic text-gray-400 placeholder:text-gray-300 focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f] h-[37px]" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'evento' && (
            <div className="flex flex-col gap-4 pt-1">
              {renderTimeBlock(false)}

              <div>
                <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Nombre<span className="text-red-500">*</span></label>
                <input type="text" placeholder="Ej. Congreso" className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] italic text-gray-400 placeholder:text-gray-300 focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f]" />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-600 mb-1.5">Doctor<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] appearance-none bg-transparent focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f] text-gray-600">
                    <option>Diego Cruzado</option>
                  </select>
                  <svg className="w-4 h-4 text-[#008f9f] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="mt-1">
                <label className="block text-[13px] font-medium text-gray-600 mb-2">Color</label>
                <div className="flex flex-wrap gap-x-2 gap-y-3">
                  {colors.map((color, idx) => (
                    <button key={idx} type="button" className={`w-5 h-5 rounded-full ${color} transition-transform hover:scale-110 cursor-pointer`} />
                  ))}
                </div>
              </div>

              <div className="mt-1">
                <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Nota adicional</label>
                <textarea placeholder="Ej. Cualquier consulta escribirle a luisa" rows={2} className="w-full border border-[#c4dee1] rounded-md px-3 py-2 text-[13.5px] resize-none focus:outline-none focus:border-[#008f9f] focus:ring-1 focus:ring-[#008f9f] italic text-gray-400 placeholder:text-gray-300" />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 flex items-center justify-center rounded-b-lg mt-auto bg-white border-t border-gray-100">
          {activeTab === 'cita' ? (
            <div className="flex items-center gap-6">
              {currentView === 'agendar' ? (
                <>
                  <button 
                    onClick={() => setShowMoreData(!showMoreData)}
                    className="text-[13.5px] text-[#008f9f] font-medium hover:underline flex items-center gap-1.5"
                  >
                    {showMoreData ? (
                      <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg> Menos datos</>
                    ) : (
                      <>Más datos <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
                    )}
                  </button>
                  <button className="bg-[#008f9f] text-white px-8 py-2 rounded-md font-medium text-[14px] hover:bg-[#007b8a] transition-colors shadow-sm">
                    Agendar
                  </button>
                </>
              ) : (
                <button className="bg-[#008f9f] text-white px-8 py-2 rounded-md font-medium text-[14px] hover:bg-[#007b8a] transition-colors shadow-sm">
                  Guardar paciente
                </button>
              )}
            </div>
          ) : (
            <button className="bg-[#008f9f] text-white px-8 py-2 rounded-md font-medium text-[14px] hover:bg-[#007b8a] transition-colors shadow-sm">
              Crear evento
            </button>
          )}
        </div>

      </div>
    </>
  )
}
