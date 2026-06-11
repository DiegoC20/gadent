import { useState } from 'react'

const TABS = ['Presupuestos', 'Historial de pagos']

export default function EstadoCuentaSection() {
  const [activeTab, setActiveTab] = useState(TABS[0])

  return (
    <div className="flex flex-col space-y-4">
      {/* Header and Controls */}
      <div className="flex justify-between items-end">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 w-full md:w-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-[#5ba0c4] text-[#2b6ba3]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button className="flex items-center gap-2 text-sm text-[#5ba0c4] hover:text-[#2b6ba3] transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver "Barra de progreso"
          </button>
          <div className="flex items-center gap-2">
            <button className="rounded-md bg-[#318B9F] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#256c7d] transition-colors">
              + Nuevo
            </button>
            <button className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm min-h-[400px]">
        {activeTab === 'Presupuestos' && (
          <div className="flex h-[400px] flex-col items-center justify-center text-center">
            {/* Cloud Icon */}
            <div className="relative mb-4 text-[#dbebf1]">
              <svg className="h-20 w-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1325 20.1751 10.1912 17.857 10.0211C17.4326 6.6436 14.551 4 11 4C7.13401 4 4 7.13401 4 11C4 11.2372 4.01183 11.4716 4.03478 11.7025C1.7828 12.0628 0 14.0766 0 16.5C0 19.1417 2.05146 21.2982 4.65431 21.4883L5 21.5H17.5V19Z" />
              </svg>
              <div className="absolute -bottom-2 -right-2 text-[#75cdd8] bg-white rounded-full p-1">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 font-medium text-sm">Este paciente aún no tiene presupuestos</p>
          </div>
        )}

        {activeTab === 'Historial de pagos' && (
          <div className="p-4 flex flex-col h-full min-h-[400px]">
            <div className="flex justify-end mb-4">
              <button className="flex items-center justify-center rounded border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-x-auto w-full border-t border-gray-100">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-left font-semibold text-gray-700">Fecha</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-700">Doctor</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-700">Motivo</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-700">Comentario</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-700">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      {/* Empty state visually matching */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-auto flex items-center justify-end gap-6 pt-4 text-sm text-gray-500">
              <span>Mostrar 10</span>
              <div className="flex items-center gap-2">
                <button className="text-gray-300 hover:text-gray-500" disabled>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="text-gray-300 hover:text-gray-500" disabled>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
