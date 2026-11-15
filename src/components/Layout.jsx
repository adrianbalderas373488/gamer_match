import { NavLink, Outlet } from 'react-router'
import { Gamepad2 } from 'lucide-react'

const enlaces = [
  { ruta: '/juegos', texto: 'Juegos' },
  { ruta: '/solicitudes', texto: 'Solicitudes' },
  { ruta: '/perfil', texto: 'Mi perfil' },
]

export default function Layout() {
  return (
    <div className="gamermatch min-h-screen bg-violet-50 text-slate-900">
      <header className="bg-violet-700 px-4 py-4 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Gamepad2 aria-hidden="true" /> GamerMatch
          </h1>
          <nav aria-label="Principal">
            <ul className="flex gap-2">
              {enlaces.map(({ ruta, texto }) => (
                <li key={ruta}>
                  <NavLink
                    to={ruta}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2 ${isActive ? 'bg-white text-violet-700' : 'hover:bg-violet-600'}`
                    }
                  >
                    {texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
