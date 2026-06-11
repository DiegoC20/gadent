import { useState } from 'react'

export default function ArchivosSection() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  return (
    <div className="flex flex-col h-full p-4 font-sans text-gray-700">
      
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-xl font-bold text-[#318B9F]">Archivos digitales</h2>
        
        <div className="flex items-end gap-6">
          {/* Espacio usado */}
          <div className="flex flex-col text-sm text-[#5B6973]">
            <span>Espacio usado:</span>
            <div className="font-medium text-[#4a5568] border-b-2 border-[#d0e4ef] pb-0.5">
              0.0 MB de 20 GB
            </div>
          </div>
          
          {/* Toggle View */}
          <div className="flex items-center pb-1">
            {viewMode === 'list' ? (
              <button 
                onClick={() => setViewMode('grid')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Vista cuadrícula"
              >
                <svg className="h-[22px] w-[22px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
                </svg>
              </button>
            ) : (
              <button 
                onClick={() => setViewMode('list')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Vista lista"
              >
                <svg className="h-[26px] w-[26px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2zm4-10h12v2H8V6zm0 5h12v2H8v-2zm0 5h12v2H8v-2z" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Upload Button */}
          <button className="rounded bg-[#75cdd8] px-5 py-2 text-sm font-medium text-white hover:bg-[#5dbbc8] transition-colors shadow-sm mb-0.5">
            Subir archivo
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {viewMode === 'list' ? (
          <div className="rounded-xl border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
            {/* Table Header */}
            <div className="flex items-center bg-[#2f3d4a] text-white px-6 py-4 text-sm font-medium">
              <div className="w-[20%]">Nombre</div>
              <div className="w-[15%]">Preview</div>
              <div className="w-[20%]">Subido por</div>
              <div className="w-[25%]">Descripción</div>
              <div className="w-[20%]">Fecha de creación</div>
            </div>
            
            {/* Empty State */}
            <div className="flex h-[350px] flex-col items-center justify-center bg-white text-center">
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
              <p className="text-gray-500 font-medium text-sm">No se encontró ningún archivo médico</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] h-[400px] flex flex-col items-center justify-center text-center">
            {/* Empty State */}
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
            <p className="text-gray-500 font-medium text-sm">No se encontró ningún archivo médico</p>
          </div>
        )}
      </div>

    </div>
  )
}
