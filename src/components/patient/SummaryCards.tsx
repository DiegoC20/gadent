interface SummaryCardsProps {
  isRightPanelOpen?: boolean
  onToggleRightPanel?: () => void
}

function SummaryCards({ isRightPanelOpen = true, onToggleRightPanel }: SummaryCardsProps) {
  return (
    <>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex flex-1 gap-3">
          <div className="flex-1 rounded-xl border border-[#f0f4f8] bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="mb-2 flex items-center gap-2">
              <svg className="h-4 w-4 text-[#f0c34e]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              <span className="text-[15px] font-medium text-[#4a5568]">Notas</span>
            </div>
            <p className="text-[13px] text-[#718096]">Escribe aquí</p>
          </div>
          <div className="flex-1 rounded-xl border border-[#f0f4f8] bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="mb-2 flex items-center gap-2">
              <svg className="h-4 w-4 text-[#d93a3a]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span className="text-[15px] font-medium text-[#4a5568]">Alergias</span>
            </div>
            <p className="text-[13px] text-[#718096]">Escribe aquí</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleRightPanel}
          className="mt-1 rounded-full border border-gray-300 bg-white p-2 text-gray-400 hover:bg-gray-50 transition-transform"
          aria-label={isRightPanelOpen ? "Ocultar panel lateral" : "Mostrar panel lateral"}
        >
          <svg className={`h-4 w-4 transition-transform ${isRightPanelOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <button type="button" className="mb-4 flex items-center gap-1 text-xs text-cyan-600 hover:underline">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        Ver &apos;Barra de progreso&apos;
      </button>
    </>
  )
}

export default SummaryCards
