import { useState } from 'react'
import { useParams } from 'react-router-dom'
import OdontogramSection from '../components/odontogram/OdontogramSection'
import PeriodontogramSection from '../components/periodontogram/PeriodontogramSection'
import OrthodonticsSection from '../components/orthodontics/OrthodonticsSection'
import FiliacionSection from '../components/patient/FiliacionSection'
import HistoriaClinicaSection from '../components/patient/HistoriaClinicaSection'
import EstadoCuentaSection from '../components/patient/EstadoCuentaSection'
import ArchivosSection from '../components/patient/ArchivosSection'
import PatientSidebar, { type PatientSection } from '../components/patient/PatientSidebar'
import RightPanel from '../components/patient/RightPanel'
import SummaryCards from '../components/patient/SummaryCards'
import ChatWidget from '../components/ChatWidget'
import { getPatientById } from '../data/patients'

function PatientHistoryPage() {
  const { id } = useParams<{ id: string }>()
  const patient = getPatientById(Number(id))
  const [activeSection, setActiveSection] = useState<PatientSection>('Filiación')
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)

  if (!patient) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-gray-500">
        Paciente no encontrado.
      </div>
    )
  }

  const currentPatient = patient

  function renderSection() {
    if (activeSection === 'Filiación') {
      return <FiliacionSection patient={currentPatient} />
    }

    if (activeSection === 'Historia clínica') {
      return <HistoriaClinicaSection />
    }

    if (activeSection === 'Odontograma') {
      return <OdontogramSection />
    }

    if (activeSection === 'Periodontograma') {
      return <PeriodontogramSection />
    }

    if (activeSection === 'Ortodoncia') {
      return <OrthodonticsSection />
    }

    if (activeSection === 'Estado de cuenta') {
      return <EstadoCuentaSection />
    }

    if (activeSection === 'Archivos') {
      return <ArchivosSection />
    }

    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-16 text-sm text-gray-500 shadow-sm">
        Módulo &quot;{activeSection}&quot; en construcción.
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar
          patient={patient}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 transition-all duration-300">
          <SummaryCards 
            isRightPanelOpen={isRightPanelOpen}
            onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
          />
          {renderSection()}
        </main>

        {isRightPanelOpen && <RightPanel />}
      </div>
    </>
  )
}

export default PatientHistoryPage
