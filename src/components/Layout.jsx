import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Gamepad2, Inbox, LogOut, UserRound } from 'lucide-react'
import { useSesion } from '@/store/sesion'
import { useMisJuegos } from '@/store/misJuegos'
import { usePendientes } from '@/store/pendientes'
import { cerrarSesion } from '@/api/auth'

const enlaces = [
  { ruta: '/juegos', texto: 'Juegos', Icono: Gamepad2 },
  { ruta: '/solicitudes', texto: 'Solicitudes', Icono: Inbox },
  { ruta: '/perfil', texto: 'Mi perfil', Icono: UserRound },
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

  const avatar = <Avatar url={datosDiscord.avatar_url} />

  return (
    <div className="gamermatch min-h-screen bg-background text-foreground md:flex">
      {/* Escritorio: barra lateral fija con el panel de usuario abajo */}
      <aside className="hidden border-r border-border bg-panel md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col">
        <Logo className="h-16 px-5" />
        <nav aria-label="Principal" className="flex-1 px-3 pt-2">
          <ul className="space-y-1">
            {enlaces.map(({ ruta, texto, Icono }) => (
              <li key={ruta}>
                <NavLink
                  to={ruta}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center gap-3 rounded-md px-3 font-medium transition-colors ${
                      isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icono aria-hidden="true" className={`h-5 w-5 ${isActive ? 'text-acento' : ''}`} />
                      {texto}
                      {ruta === '/solicitudes' && <Contador total={pendientes} className="ml-auto" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1 border-t border-border p-2">
          <Link
            to="/perfil"
            aria-label={`Mi perfil: ${nombre ?? 'usuario'}`}
            className="flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-md px-2 hover:bg-secondary"
          >
            {avatar}
            <span className="truncate text-sm font-semibold">{nombre}</span>
          </Link>
          <BotonSalir />
        </div>
      </aside>

      {/* Celular: barra superior */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-panel/95 px-4 backdrop-blur md:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <Link
            to="/perfil"
            aria-label={`Mi perfil: ${nombre ?? 'usuario'}`}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-md"
          >
            {avatar}
          </Link>
          <BotonSalir />
        </div>
      </header>

      <main className="min-w-0 flex-1 px-4 pt-6 pb-28 sm:px-6 md:px-10 md:pt-8 md:pb-12">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      {/* Celular: pestañas abajo, al alcance del pulgar */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="grid grid-cols-3">
          {enlaces.map(({ ruta, texto, Icono }) => (
            <li key={ruta}>
              <NavLink
                to={ruta}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative">
                      <Icono aria-hidden="true" className={`h-6 w-6 ${isActive ? 'text-acento' : ''}`} />
                      {ruta === '/solicitudes' && <Contador total={pendientes} className="absolute -top-1.5 -right-3" />}
                    </span>
                    {texto}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

function Logo({ className = '' }) {
  return (
    <Link to="/juegos" className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Gamepad2 aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="font-display text-2xl font-bold tracking-wide uppercase">GamerMatch</span>
    </Link>
  )
}

function Avatar({ url }) {
  return url ? (
    <img src={url} alt="" className="h-8 w-8 shrink-0 rounded-full" />
  ) : (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary" aria-hidden="true">
      <UserRound className="h-5 w-5 text-muted-foreground" />
    </span>
  )
}

function Contador({ total, className = '' }) {
  if (!total) return null
  return (
    <span className={`grid h-5 min-w-5 place-items-center rounded-full bg-aviso px-1.5 text-xs font-bold text-white ${className}`}>
      {total}<span className="sr-only"> pendientes</span>
    </span>
  )
}

function BotonSalir() {
  return (
    <button
      type="button"
      onClick={cerrarSesion}
      aria-label="Salir"
      title="Salir"
      className="grid min-h-11 min-w-11 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
    >
      <LogOut aria-hidden="true" className="h-5 w-5" />
    </button>
  )
}
