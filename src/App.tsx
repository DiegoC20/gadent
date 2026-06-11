import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GadentLayout from './components/GadentLayout'
import AgendaPage from './pages/AgendaPage'
import PacientesPage from './pages/PacientesPage'
import PatientHistoryPage from './pages/PatientHistoryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GadentLayout />}>
          <Route index element={<Navigate to="/pacientes" replace />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="pacientes/:id/historia" element={<PatientHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
