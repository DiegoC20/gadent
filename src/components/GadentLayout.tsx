import { NavLink, Outlet } from 'react-router-dom'

function GadentLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <header className="shrink-0">
        <div className="bg-[#2b3a4a] px-6 py-3">
          <span className="text-lg font-bold tracking-wide text-white">Gadent</span>
        </div>
        <nav className="flex gap-8 bg-[#3d4f63] px-6">
          <NavLink
            to="/agenda"
            className={({ isActive }) =>
              `relative py-3 text-sm font-medium text-white transition-colors hover:text-cyan-200 ${
                isActive ? 'text-white' : 'text-white/80'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Agenda
                {isActive && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400" />}
              </>
            )}
          </NavLink>
          <NavLink
            to="/pacientes"
            className={({ isActive }) =>
              `relative py-3 text-sm font-medium text-white transition-colors hover:text-cyan-200 ${
                isActive ? 'text-white' : 'text-white/80'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Pacientes
                {isActive && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400" />}
              </>
            )}
          </NavLink>
        </nav>
      </header>

      <Outlet />
    </div>
  )
}

export default GadentLayout
