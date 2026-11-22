import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CalendarDays, ChevronRight, Clock, Trophy, UserRound } from 'lucide-react'
import { obtenerEstadisticasSteam } from '@/api/steam'
import { Card } from './ui/card'

// El nivel se distingue por marcas (1 a 3), no por color: los colores están reservados
const marcasNivel = { Principiante: 1, Intermedio: 2, Avanzado: 3 }

export default function JugadorCard({ jugador, coincidencias, juego, solicitud, onEnviar }) {
  const dias = jugador.disponibilidad?.dias ?? []
  const horarios = jugador.disponibilidad?.horarios ?? []

  return (
    <Card className="gap-3 rounded-lg bg-card p-4 ring-1 ring-border">
      <Link
        to={`/jugador/${jugador.id}`}
        aria-label={`Ver perfil de ${jugador.usuario ?? 'este jugador'}`}
        className="group -m-1 flex items-center gap-3 rounded-md p-1 hover:bg-secondary/60"
      >
        {jugador.avatar_url ? (
          <img src={jugador.avatar_url} alt="" className="h-12 w-12 rounded-full" />
        ) : (
          <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary" aria-hidden="true">
            <UserRound className="h-6 w-6 text-muted-foreground" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground group-hover:text-acento">
            {jugador.usuario ?? 'Jugador'}
          </h3>
          <div className="mt-1"><Nivel nivel={jugador.nivel} /></div>
        </div>
        <ChevronRight aria-hidden="true" className="ml-auto h-5 w-5 shrink-0 text-muted-foreground group-hover:text-acento" />
      </Link>

      <div className="space-y-1.5 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span><span className="sr-only">Días: </span>{dias.length ? dias.join(', ') : 'Sin días definidos'}</span>
        </p>
        <p className="flex items-start gap-2">
          <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span><span className="sr-only">Horario: </span>{horarios.length ? horarios.join(', ') : 'Sin horario definido'}</span>
        </p>
        {jugador.steam_id && <HorasSteam steamId={jugador.steam_id} juego={juego} />}
      </div>

      <p
        className={`rounded-md px-3 py-2 text-sm ${
          coincidencias.total ? 'bg-coincide/10 text-cyan-100 ring-1 ring-coincide/30 ring-inset' : 'bg-secondary/60 text-muted-foreground'
        }`}
      >
        {coincidencias.total
          ? `Coinciden: ${[...coincidencias.dias, ...coincidencias.horarios].join(', ')}`
          : 'Sin horarios en común contigo'}
      </p>

      <div className="mt-auto pt-1">
        <AccionSolicitud jugador={jugador} solicitud={solicitud} onEnviar={onEnviar} />
      </div>
    </Card>
  )
}

export function Nivel({ nivel }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded bg-secondary px-2 py-0.5 text-xs font-semibold ${nivel ? 'text-foreground' : 'text-muted-foreground'}`}>
      {marcasNivel[nivel] && (
        <span className="flex gap-0.5" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`h-2.5 w-1 rounded-sm ${n <= marcasNivel[nivel] ? 'bg-acento' : 'bg-elevado'}`} />
          ))}
        </span>
      )}
      {nivel ?? 'Nivel sin definir'}
    </span>
  )
}

// Dato extra de la tarjeta: si Steam falla, simplemente no se muestra
function HorasSteam({ steamId, juego }) {
  const [datos, setDatos] = useState(null)

  useEffect(() => {
    let activo = true

    async function cargarHoras() {
      try {
        const respuesta = await obtenerEstadisticasSteam(steamId, juego)
        if (activo) setDatos(respuesta)
      } catch {
        if (activo) setDatos(null)
      }
    }

    cargarHoras()
    return () => { activo = false }
  }, [steamId, juego])

  if (!datos) return null

  let texto = 'Perfil de Steam privado'
  if (!datos.privado) {
    texto = datos.horasJuego !== null
      ? `${datos.horasJuego.toLocaleString('es-MX')} h en este juego (Steam)`
      : `${datos.horasTotales.toLocaleString('es-MX')} h en Steam`
  }

  return (
    <p className="flex items-start gap-2">
      <Trophy aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <span className={datos.privado ? '' : 'font-medium text-foreground'}>{texto}</span>
    </p>
  )
}

function AccionSolicitud({ jugador, solicitud, onEnviar }) {
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState(null)

  async function enviar() {
    setProcesando(true)
    setError(null)
    try {
      await onEnviar(jugador)
    } catch (error) {
      setError(error.message)
    } finally {
      setProcesando(false)
    }
  }

  const enlace = 'flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-semibold'

  if (solicitud?.estado === 'aceptada') {
    return <Link to="/solicitudes" className={`${enlace} bg-primary/15 text-acento hover:bg-primary/25`}>¡Hicieron match! Ver contacto</Link>
  }
  if (solicitud?.estado === 'pendiente' && solicitud.de_id === jugador.id) {
    return <Link to="/solicitudes" className={`${enlace} bg-aviso/15 text-rose-200 hover:bg-aviso/25`}>Te envió una solicitud · Responder</Link>
  }
  if (solicitud) {
    return (
      <p className={`${enlace} bg-secondary/60 font-medium text-muted-foreground`}>
        {solicitud.estado === 'pendiente' ? 'Solicitud enviada' : 'Solicitud rechazada'}
      </p>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={enviar}
        disabled={procesando || !onEnviar}
        className={`${enlace} w-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50`}
      >
        {procesando ? 'Enviando...' : 'Enviar solicitud'}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    </>
  )
}
