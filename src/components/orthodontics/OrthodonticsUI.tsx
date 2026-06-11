import { useState, ReactNode } from 'react'

interface AccordionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Accordion({ title, children, defaultOpen = true }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between bg-gray-50 px-6 py-4 text-left transition-colors hover:bg-gray-100 outline-none rounded-t-lg ${!isOpen ? 'rounded-b-lg' : ''}`}
      >
        <span className="font-semibold text-[#5B6973]">{title}</span>
        <svg
          className={`h-5 w-5 transform text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-6 border-t border-gray-200 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

export function Field({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 block text-xs font-medium text-[#5B6973]">{label}</label>
      {children}
    </div>
  )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      type="text" 
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-shadow bg-white text-gray-800" 
      {...props} 
    />
  )
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      rows={3} 
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none transition-shadow bg-white text-gray-800" 
      {...props} 
    />
  )
}

export function Select({ options, value, onChange, disabled, ...props }: { options: string[], value?: string, onChange?: (e: any) => void, disabled?: boolean } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value || "")

  const handleSelect = (option: string) => {
    setInternalValue(option)
    setIsOpen(false)
    if (onChange) {
      // Simulate event
      onChange({ target: { value: option } })
    }
  }

  return (
    <div className="relative w-full">
      {/* Invisible overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
      )}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm outline-none transition-all ${
          isOpen ? 'border-[#318B9F] ring-1 ring-[#318B9F]' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800 hover:border-gray-400'}`}
      >
        <span className={internalValue ? "text-gray-800" : "text-[#A1BDC8]"}>
          {internalValue || "Seleccionar"}
        </span>
        <svg
          className={`h-4 w-4 text-[#318B9F] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white py-2 shadow-[0_4px_12px_rgba(49,139,159,0.15)] border border-gray-100 max-h-96 overflow-y-auto">
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-4 py-2.5 text-sm text-[#455A64] hover:bg-[#F4F7F8] hover:text-[#2d6f85] transition-colors"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Checkbox({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" {...props} />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl flex flex-col relative animate-fade-in overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="px-6 pt-8 pb-6 text-center">
          <h2 className="text-xl font-medium text-[#2d6f85] uppercase tracking-wide">{title}</h2>
        </div>
        <div className="px-8 pb-8">
          {children}
        </div>
      </div>
    </div>
  )
}
