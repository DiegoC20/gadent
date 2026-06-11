import { useState, useRef, useEffect } from 'react'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DAYS_OF_WEEK = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

interface DatePickerProps {
  value?: string // YYYY-MM-DD
  onChange?: (date: string) => void
  disabled?: boolean
  className?: string
  variant?: 'default' | 'minimal'
}

export function DatePicker({ value, onChange, disabled, className = "", variant = "default" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Base date parsing
  const initialDate = value ? new Date(value + 'T12:00:00') : new Date()
  
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth())
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? initialDate : null)
  const [view, setView] = useState<'days' | 'months' | 'years'>('days')
  
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T12:00:00')
      setSelectedDate(d)
      setCurrentMonth(d.getMonth())
      setCurrentYear(d.getFullYear())
    } else {
      setSelectedDate(null)
    }
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const handlePrevMonth = () => {
    if (view === 'years') {
      setCurrentYear(prev => prev - 12)
    } else if (view === 'months') {
      setCurrentYear(prev => prev - 1)
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(prev => prev - 1)
      } else {
        setCurrentMonth(prev => prev - 1)
      }
    }
  }

  const handleNextMonth = () => {
    if (view === 'years') {
      setCurrentYear(prev => prev + 12)
    } else if (view === 'months') {
      setCurrentYear(prev => prev + 1)
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(prev => prev + 1)
      } else {
        setCurrentMonth(prev => prev + 1)
      }
    }
  }

  const handleSelectDay = (day: number) => {
    const d = new Date(currentYear, currentMonth, day)
    setSelectedDate(d)
    setIsOpen(false)
    if (onChange) {
      const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      onChange(formatted)
    }
  }

  const displayString = selectedDate 
    ? `${String(selectedDate.getDate()).padStart(2, '0')}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${selectedDate.getFullYear()}`
    : "dd/mm/aaaa"

  // Generate grid
  const blanks = Array(firstDayOfMonth).fill(null)
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1)

  const isMinimal = variant === 'minimal'

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {isMinimal ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-full w-full items-center justify-center transition-colors ${
            disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-[#318B9F]'
          } ${selectedDate ? 'text-[#4a5568] font-semibold' : 'text-gray-400'}`}
        >
          {selectedDate ? (
            <span>{`${String(selectedDate.getDate()).padStart(2, '0')} ${MONTHS[selectedDate.getMonth()]} ${String(selectedDate.getFullYear()).slice(2)}`}</span>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          )}
        </button>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm outline-none transition-all ${
            isOpen ? 'border-[#318B9F] ring-1 ring-[#318B9F]' : 'border-gray-300'
          } ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800 hover:border-gray-400'}`}
        >
          <span className={selectedDate ? "text-gray-800" : "text-[#A1BDC8]"}>
            {displayString}
          </span>
          <svg
            className={`h-4 w-4 ${isOpen ? 'text-[#318B9F] rotate-180' : 'text-[#318B9F]'} transition-transform`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-[260px] rounded-lg bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden text-gray-800 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
            <div 
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded truncate"
              onClick={() => {
                if (view === 'days') setView('months')
                else if (view === 'months') setView('years')
                else setView('days')
              }}
            >
              <span className="font-medium text-[14px] text-[#2C3E50] truncate">
                {view === 'days' && `${MONTHS[currentMonth]}. ${currentYear}`}
                {view === 'months' && currentYear}
                {view === 'years' && `${currentYear - 4} - ${currentYear + 7}`}
              </span>
              <svg className="h-4 w-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex-shrink-0 flex items-center justify-center h-7 w-7">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex-shrink-0 flex items-center justify-center h-7 w-7">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-3 pb-3 min-h-[220px]">
            {view === 'days' && (
              <>
                {/* Days of week */}
                <div className="grid grid-cols-7 mb-2 mt-1 border-b border-gray-50 pb-1">
                  {DAYS_OF_WEEK.map((d, i) => (
                    <div key={i} className="text-center text-[13px] font-medium text-[#A1BDC8] w-8 h-8 flex items-center justify-center">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Grid */}
                <div className="pt-1">
                  <div className="text-[11px] font-semibold text-[#5B6973] uppercase tracking-wider mb-1 ml-2">
                    {MONTHS[currentMonth]}.
                  </div>
                  <div className="grid grid-cols-7 gap-y-1">
                    {blanks.map((_, i) => (
                      <div key={`blank-${i}`} className="w-8 h-8" />
                    ))}
                    {days.map(d => {
                      const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear
                      return (
                        <div key={d} className="flex justify-center items-center w-8 h-8">
                          <button
                            onClick={() => handleSelectDay(d)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] transition-all ${
                              isSelected 
                                ? 'bg-[#C2CDEC] text-[#2C3E50] border border-[#2C3E50]' 
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {d}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {view === 'months' && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => {
                      setCurrentMonth(i)
                      setView('days')
                    }}
                    className={`py-2 text-[13px] rounded-lg transition-all ${
                      currentMonth === i 
                        ? 'bg-[#C2CDEC] text-[#2C3E50] border border-[#2C3E50] font-medium' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {view === 'years' && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {Array.from({ length: 12 }).map((_, i) => {
                  const y = currentYear - 4 + i
                  return (
                    <button
                      key={y}
                      onClick={() => {
                        setCurrentYear(y)
                        setView('months')
                      }}
                      className={`py-2 text-[13px] rounded-lg transition-all ${
                        currentYear === y 
                          ? 'bg-[#C2CDEC] text-[#2C3E50] border border-[#2C3E50] font-medium' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {y}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
