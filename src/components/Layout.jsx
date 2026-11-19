import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Gamepad2, LogOut } from 'lucide-react'
import { useSesion } from '@/store/sesion'
import { useMisJuegos } from '@/store/misJuegos'
import { usePendientes } from '@/store/pendientes'
import { cerrarSesion } from '@/api/auth'

const enlaces = [
  { ruta: '/juegos', texto: 'Juegos' },
  { ruta: '/solicitudes', texto: 'Solicitudes' },
  { ruta: '/perfil', texto: 'Mi perfil' },
]

export default function Layout() {
  const usuario = useSesion((state) => state.usuario)
  const datosDiscord = usuario?.user_metadata ?? {}
  const nombre = datosDiscord.custom_claims?.global_name ?? datosDiscord.full_name ?? datosDiscord.name

  // Cargar la lista "Buscando equipo" una vez, para todas las páginas
  const misJuegosCargados = useMisJuegos((state) => state.cargado)
  const cargarMisJuegos = useMisJuegos((state) => state.cargar)

  useEffect(() => {
    if (!misJuegosCargados) cargarMisJuegos(usuario.id)
  }, [misJuegosCargados, cargarMisJuegos, usuario.id])

  // Revisar solicitudes pendientes cada vez que cambia la página
  const { pathname } = useLocation()
  const pendientes = usePendientes((state) => state.total)
  const actualizarPendientes = usePendientes((state) => state.actualizar)

  useEffect(() => {
    actualizarPendientes(usuario.id)
  }, [pathname, actualizarPendientes, usuario.id])

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
                    {ruta === '/solicitudes' && pendientes > 0 && (
                      <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-xs font-bold text-slate-900">
                        {pendientes}<span className="sr-only"> pendientes</span>
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/perfil"
              aria-label={`Mi perfil: ${nombre ?? 'usuario'}`}
              className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-violet-600"
            >
              {datosDiscord.avatar_url && (
                <img src={datosDiscord.avatar_url} alt="" className="h-8 w-8 rounded-full" />
              )}
              <span className="font-medium">{nombre}</span>
            </Link>
            <button
              type="button"
              onClick={cerrarSesion}
              className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-violet-600"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
