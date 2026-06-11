import { useState } from 'react'
import ExamenClinicoTab from './ExamenClinicoTab'
import PlanTrabajoTab from './PlanTrabajoTab'
import PlanTratamientoTab from './PlanTratamientoTab'
import ResumenTab from './ResumenTab'
import FotografiasTab from './FotografiasTab'

type OrthodonticsTab = 'Examen clínico' | 'Plan de Trabajo' | 'Plan de tratamiento' | 'Resumen' | 'Fotografias'

export default function OrthodonticsSection() {
  const [activeTab, setActiveTab] = useState<OrthodonticsTab>('Examen clínico')

  const tabs: OrthodonticsTab[] = [
    'Examen clínico',
    'Plan de Trabajo',
    'Plan de tratamiento',
    'Resumen',
    'Fotografias'
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Examen clínico': return <ExamenClinicoTab />
      case 'Plan de Trabajo': return <PlanTrabajoTab />
      case 'Plan de tratamiento': return <PlanTratamientoTab />
      case 'Resumen': return <ResumenTab />
      case 'Fotografias': return <FotografiasTab />
      default: return null
    }
  }

  return (
    <div className="flex flex-col bg-white h-full overflow-hidden">
      {/* Tabs Header */}
      <div className="flex gap-8 border-b border-gray-200 px-6 pt-4 bg-white">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-cyan-500 text-cyan-600 -mb-[2px]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Doctor:</span>
          <select className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-cyan-600 outline-none focus:border-cyan-400">
            <option>Diego Cruzado</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full bg-[#318B9F] px-6 py-2 text-sm font-medium text-white hover:bg-[#256c7d] transition-colors">
            Guardar
          </button>
          
          <button className="text-gray-400 hover:text-cyan-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#F2F5F8] p-6">
        {renderTabContent()}
      </div>
    </div>
  )
}
