import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Check, ChevronRight, MessageCircle, X } from 'lucide-react'
import { obtenerSolicitudes, responderSolicitud, cancelarSolicitud } from '@/api/solicitudes'
import { useSesion } from '@/store/sesion'
import { usePendientes } from '@/store/pendientes'
import { Card } from './ui/card'

export default function Solicitudes() {
  const usuario = useSesion((state) => state.usuario)
  const actualizarPendientes = usePendientes((state) => state.actualizar)
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [errorRespuesta, setErrorRespuesta] = useState(null)
  const [procesando, setProcesando] = useState(null)

  useEffect(() => {
    let activo = true

    async function cargarSolicitudes() {
      try {
        const datos = await obtenerSolicitudes()
        if (activo) setSolicitudes(datos)
      } catch (error) {
        if (activo) setError(error.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarSolicitudes()
    return () => { activo = false }
  }, [usuario.id])

  async function responder(id, estado) {
    setProcesando(id)
    setErrorRespuesta(null)
    try {
      await responderSolicitud(id, estado)
      setSolicitudes((actuales) => actuales.map((s) => (s.id === id ? { ...s, estado } : s)))
      actualizarPendientes(usuario.id)
    } catch (error) {
      setErrorRespuesta(error.message)
    } finally {
      setProcesando(null)
    }
  }

  async function cancelar(id) {
    setProcesando(id)
    setErrorRespuesta(null)
    try {
      await cancelarSolicitud(id)
      setSolicitudes((actuales) => actuales.filter((s) => s.id !== id))
    } catch (error) {
      setErrorRespuesta(error.message)
    } finally {
      setProcesando(null)
    }
  }

  if (cargando) return <p role="status" className="py-10 text-center text-muted-foreground">Cargando solicitudes...</p>
  if (error) return <p role="alert" className="py-10 text-center text-destructive">Error: {error}</p>

  const matches = solicitudes.filter((s) => s.estado === 'aceptada')
  const recibidas = solicitudes.filter((s) => s.estado === 'pendiente' && s.para_id === usuario.id)
  const enviadas = solicitudes.filter((s) => s.estado !== 'aceptada' && s.de_id === usuario.id)
  const otroJugador = (s) => (s.de_id === usuario.id ? s.para : s.de)

  return (
    <section aria-labelledby="titulo-solicitudes" className="space-y-8">
      <h1 id="titulo-solicitudes" className="font-display text-4xl font-bold uppercase">Solicitudes</h1>
      {errorRespuesta && <p role="alert" className="text-destructive">{errorRespuesta}</p>}

      <Grupo titulo="Matches" vacio="Todavía no tienes matches.">
        {matches.map((s) => {
          const jugador = otroJugador(s)
          return (
            <Fila key={s.id} jugador={jugador} juego={s.juego_nombre}>
              {jugador?.discord_id && (
                <a
                  href={`https://discord.com/users/${jugador.discord_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center justify-center gap-1.5 rounded-md bg-primary px-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4" /> Abrir en Discord
                </a>
              )}
            </Fila>
          )
        })}
      </Grupo>

      <Grupo titulo="Recibidas" vacio="No tienes solicitudes por responder.">
        {recibidas.map((s) => (
          <Fila key={s.id} jugador={s.de} juego={s.juego_nombre}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => responder(s.id, 'aceptada')}
                disabled={procesando === s.id}
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
              >
                <Check aria-hidden="true" className="h-4 w-4" /> Aceptar
              </button>
              <button
                type="button"
                onClick={() => responder(s.id, 'rechazada')}
                disabled={procesando === s.id}
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-secondary px-4 font-semibold transition-colors hover:bg-elevado disabled:opacity-60"
              >
                <X aria-hidden="true" className="h-4 w-4" /> Rechazar
              </button>
            </div>
          </Fila>
        ))}
      </Grupo>

      <Grupo titulo="Enviadas" vacio="No tienes solicitudes enviadas.">
        {enviadas.map((s) => (
          <Fila key={s.id} jugador={s.para} juego={s.juego_nombre}>
            {s.estado === 'pendiente' ? (
              <div className="flex items-center gap-2">
                <p className="flex-1 rounded-md bg-secondary/60 px-3 py-2 text-sm font-medium text-muted-foreground">Esperando respuesta</p>
                <button
                  type="button"
                  onClick={() => cancelar(s.id)}
                  disabled={procesando === s.id}
                  aria-label={`Cancelar solicitud a ${s.para?.usuario ?? 'este jugador'}`}
                  className="min-h-11 rounded-md px-3 text-sm font-medium text-muted-foreground ring-1 ring-border ring-inset hover:bg-secondary hover:text-foreground disabled:opacity-60"
                >
                  {procesando === s.id ? 'Cancelando...' : 'Cancelar'}
                </button>
              </div>
            ) : (
              <p className="rounded-md bg-secondary/60 px-3 py-2 text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/60">
                Rechazada
              </p>
            )}
          </Fila>
        ))}
      </Grupo>
    </section>
  )
}

function Grupo({ titulo, vacio, children }) {
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {titulo}
        <span className="rounded bg-secondary px-1.5 py-0.5 text-foreground">{children.length}</span>
      </h2>
      {children.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-4 py-5 text-muted-foreground">{vacio}</p>
      )}
    </div>
  )
}

function Fila({ jugador, juego, children }) {
  return (
    <Card className="gap-3 rounded-lg bg-card p-4 ring-1 ring-border">
      <Link
        to={`/jugador/${jugador?.id}`}
        aria-label={`Ver perfil de ${jugador?.usuario ?? 'este jugador'}`}
        className="group -m-1 flex items-center gap-3 rounded-md p-1 hover:bg-secondary/60"
      >
        {jugador?.avatar_url ? (
          <img src={jugador.avatar_url} alt="" className="h-12 w-12 rounded-full" />
        ) : (
          <span className="h-12 w-12 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold group-hover:text-acento">{jugador?.usuario ?? 'Jugador'}</p>
          <p className="truncate text-sm text-muted-foreground">{juego}</p>
        </div>
        <ChevronRight aria-hidden="true" className="ml-auto h-5 w-5 shrink-0 text-muted-foreground group-hover:text-acento" />
      </Link>
      {children}
    </Card>
  )
}
