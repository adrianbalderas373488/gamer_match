import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeft, CalendarDays, Clock, MessageCircle, UserRound } from 'lucide-react'
import { obtenerPerfil } from '@/api/perfiles'
import { obtenerMisJuegos } from '@/api/juegos'
import { obtenerSolicitudes } from '@/api/solicitudes'
import { useSesion } from '@/store/sesion'
import { calcularCoincidencias } from '@/lib/compatibilidad'
import { Nivel } from './JugadorCard'
import { EstadisticasSteam } from './Perfil'

// Perfil público de otro jugador: sus datos, sus juegos y, si hay match, su contacto
export default function PerfilJugador() {
  const { id } = useParams()
  const usuario = useSesion((state) => state.usuario)

  const [jugador, setJugador] = useState(null)
  const [juegos, setJuegos] = useState([])
  const [miPerfil, setMiPerfil] = useState(null)
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id === usuario.id) return
    let activo = true

    async function cargarDatos() {
      setCargando(true)
      setError(null)
      try {
        const [datosJugador, datosJuegos, datosMiPerfil, datosSolicitudes] = await Promise.all([
          obtenerPerfil(id),
          obtenerMisJuegos(id),
          obtenerPerfil(usuario.id),
          obtenerSolicitudes(),
        ])
        if (activo) {
          setJugador(datosJugador)
          setJuegos(datosJuegos)
          setMiPerfil(datosMiPerfil)
          setSolicitudes(datosSolicitudes)
        }
      } catch {
        if (activo) setError('No se pudo cargar este jugador. Puede que el enlace esté mal o que ya no exista.')
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarDatos()
    return () => { activo = false }
  }, [id, usuario.id])

  // Mi propio perfil se edita en /perfil
  if (id === usuario.id) return <Navigate to="/perfil" replace />

  if (cargando) return <p role="status" className="py-10 text-center text-muted-foreground">Cargando jugador...</p>
  if (error) {
    return (
      <div className="py-10 text-center">
        <p role="alert" className="text-destructive">{error}</p>
        <Link to="/juegos" className="mt-3 inline-flex min-h-11 items-center font-medium text-acento underline underline-offset-4">
          Volver a Juegos
        </Link>
      </div>
    )
  }

  const dias = jugador.disponibilidad?.dias ?? []
  const horarios = jugador.disponibilidad?.horarios ?? []
  const coincidencias = calcularCoincidencias(jugador, miPerfil)
  const matches = solicitudes.filter((s) => s.estado === 'aceptada' && (s.de_id === id || s.para_id === id))

  return (
    <section aria-labelledby="titulo-jugador" className="max-w-2xl">
      <button
        type="button"
        onClick={() => history.back()}
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Volver
      </button>

      <div className="mb-4 flex items-center gap-4 rounded-lg bg-card p-5 ring-1 ring-border">
        {jugador.avatar_url ? (
          <img src={jugador.avatar_url} alt="" className="h-20 w-20 rounded-full" />
        ) : (
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-secondary" aria-hidden="true">
            <UserRound className="h-8 w-8 text-muted-foreground" />
          </span>
        )}
        <div className="min-w-0">
          <h1 id="titulo-jugador" className="truncate font-display text-4xl leading-none font-bold uppercase">
            {jugador.usuario ?? 'Jugador'}
          </h1>
          <div className="mt-2"><Nivel nivel={jugador.nivel} /></div>
        </div>
      </div>

      {matches.length > 0 && jugador.discord_id && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-primary/15 p-4">
          <p className="font-medium text-acento">
            Hicieron match en {matches.map((s) => s.juego_nombre).join(', ')}
          </p>
          <a
            href={`https://discord.com/users/${jugador.discord_id}`}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" /> Abrir en Discord
          </a>
        </div>
      )}

      <div className="mb-4 space-y-3 rounded-lg bg-card p-5 ring-1 ring-border">
        <h2 className="text-lg font-semibold">Disponibilidad</h2>
        <p className="flex items-start gap-2 text-muted-foreground">
          <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span><span className="sr-only">Días: </span>{dias.length ? dias.join(', ') : 'Sin días definidos'}</span>
        </p>
        <p className="flex items-start gap-2 text-muted-foreground">
          <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span><span className="sr-only">Horario: </span>{horarios.length ? horarios.join(', ') : 'Sin horario definido'}</span>
        </p>
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            coincidencias.total ? 'bg-coincide/10 text-cyan-100 ring-1 ring-coincide/30 ring-inset' : 'bg-secondary/60 text-muted-foreground'
          }`}
        >
          {coincidencias.total
            ? `Coinciden: ${[...coincidencias.dias, ...coincidencias.horarios].join(', ')}`
            : 'Sin horarios en común contigo'}
        </p>
      </div>

      <div className="mb-4 rounded-lg bg-card p-5 ring-1 ring-border">
        <h2 className="mb-3 text-lg font-semibold">Busca equipo en</h2>
        {juegos.length === 0 ? (
          <p className="text-muted-foreground">Todavía no agrega juegos.</p>
        ) : (
          <>
            <ul className="flex flex-wrap gap-2">
              {juegos.map((juego) => (
                <li key={juego.rawg_id}>
                  <Link
                    to={`/jugadores/${juego.rawg_id}`}
                    className="flex min-h-11 items-center gap-2.5 overflow-hidden rounded-lg border border-border bg-secondary pr-3 font-medium hover:text-acento"
                  >
                    {juego.imagen ? (
                      <img src={juego.imagen} alt="" className="h-11 w-16 object-cover" />
                    ) : (
                      <span className="h-11 w-16 bg-elevado" aria-hidden="true" />
                    )}
                    {juego.nombre}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">Abre un juego para enviarle una solicitud.</p>
          </>
        )}
      </div>

      {jugador.steam_id && <EstadisticasSteam key={jugador.steam_id} steamId={jugador.steam_id} />}
    </section>
  )
}
