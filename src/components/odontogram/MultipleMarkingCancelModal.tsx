import { createPortal } from 'react-dom'

interface MultipleMarkingCancelModalProps {
  onCancel: () => void
  onConfirm: () => void
}

function MultipleMarkingCancelModal({ onCancel, onConfirm }: MultipleMarkingCancelModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[30000] flex items-center justify-center bg-black/40 animate-fade-in" onClick={onCancel}>
      <div 
        className="relative w-[500px] max-w-[90vw] rounded-3xl bg-white px-8 py-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button 
          onClick={onCancel}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon Circle */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f9fb]">
            <svg className="h-10 w-10 text-[#519fb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>

          {/* Text */}
          <p className="mb-10 text-[18px] font-semibold leading-relaxed text-gray-600">
            La información registrada se perderá.
            <br />
            ¿Está seguro que desea continuar?
          </p>

          {/* Buttons */}
          <div className="flex w-full items-center justify-center gap-6">
            <button
              onClick={onCancel}
              className="min-w-[130px] rounded-xl border border-[#519fb2] bg-white py-2.5 text-sm font-medium text-[#519fb2] hover:bg-[#f4f9fb] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="min-w-[130px] rounded-xl bg-[#c86a64] py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#b55b56] transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MultipleMarkingCancelModal
