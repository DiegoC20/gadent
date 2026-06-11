export default function RightPanel() {
  return (
    <aside className="w-[300px] shrink-0 overflow-y-auto bg-white p-6 shadow-sm border-l border-gray-100 flex flex-col gap-10">
      
      {/* Presupuesto Section */}
      <div className="flex flex-col items-center">
        <div className="w-full mb-6">
          <h3 className="text-[15px] font-semibold text-[#4a5568]">Presupuesto</h3>
        </div>
        
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

        <button className="rounded-md bg-[#318B9F] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#256c7d] transition-colors w-full sm:w-auto shadow-sm">
          + Crear Presupuesto
        </button>
      </div>

      {/* Notas de evolución Section */}
      <div className="flex flex-col items-center pt-2">
        <div className="mb-8 flex w-full items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#4a5568]">Notas de evolución</h3>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
              aria-label="Agregar nota"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
              aria-label="Filtrar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Notas Illustration */}
        <div className="relative mb-6 h-36 w-36 rounded-full bg-gradient-to-tr from-[#f4fbfc] to-white border border-[#edf6f7] flex items-center justify-center">
          {/* Sparkles */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            <path d="M 30,20 L 32,24 L 36,26 L 32,28 L 30,32 L 28,28 L 24,26 L 28,24 Z" fill="#d0eaef" />
            <path d="M 75,30 L 76,33 L 79,34 L 76,35 L 75,38 L 74,35 L 71,34 L 74,33 Z" fill="#d0eaef" />
            <path d="M 25,65 L 26,68 L 29,69 L 26,70 L 25,73 L 24,70 L 21,69 L 24,68 Z" fill="#d0eaef" />
            <path d="M 80,60 L 81,63 L 84,64 L 81,65 L 80,68 L 79,65 L 76,64 L 79,63 Z" fill="#d0eaef" />
          </svg>
          
          <div className="relative z-10">
            <svg className="h-[72px] w-[72px]" viewBox="0 0 64 64" fill="none">
              {/* Document tilted */}
              <g transform="rotate(-5 32 32)">
                <rect x="18" y="10" width="28" height="40" rx="2" stroke="#318B9F" strokeWidth="1.5" fill="white" />
                <line x1="24" y1="18" x2="40" y2="18" stroke="#318B9F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="24" x2="36" y2="24" stroke="#318B9F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="30" x2="40" y2="30" stroke="#318B9F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="36" x2="32" y2="36" stroke="#318B9F" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              {/* Pen overlay */}
              <path d="M 32 46 L 48 30 L 52 34 L 36 50 Z" fill="#1e405a" />
              <path d="M 32 46 L 29 53 L 36 50 Z" fill="#318B9F" />
              <path d="M 48 30 L 52 34" stroke="white" strokeWidth="1" />
            </svg>
          </div>
        </div>

        <button className="rounded-md bg-[#318B9F] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#256c7d] transition-colors w-full sm:w-auto shadow-sm">
          + Crear nota de evaluación
        </button>
      </div>

    </aside>
  )
}
