import { useState } from 'react'
import { Link } from 'react-router'
import { CalendarDays, Clock } from 'lucide-react'
import { Card } from './ui/card'

const coloresNivel = {
  Principiante: 'bg-sky-100 text-sky-800',
  Intermedio: 'bg-amber-100 text-amber-800',
  Avanzado: 'bg-rose-100 text-rose-800',
}

export default function JugadorCard({ jugador, coincidencias, solicitud, onEnviar }) {
  const dias = jugador.disponibilidad?.dias ?? []
  const horarios = jugador.disponibilidad?.horarios ?? []

  return (
    <Card className="gap-3 border border-violet-200 bg-white p-4">
      <div className="flex items-center gap-3">
        {jugador.avatar_url ? (
          <img src={jugador.avatar_url} alt="" className="h-12 w-12 rounded-full" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-violet-200" aria-hidden="true" />
        )}
        <div>
          <h3 className="font-bold">{jugador.usuario ?? 'Jugador'}</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${coloresNivel[jugador.nivel] ?? 'bg-slate-100 text-slate-700'}`}>
            {jugador.nivel ?? 'Nivel sin definir'}
          </span>
        </div>
      </div>

      <p className="flex items-start gap-2 text-sm">
        <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
        <span><span className="sr-only">Días: </span>{dias.length ? dias.join(', ') : 'Sin días definidos'}</span>
      </p>
      <p className="flex items-start gap-2 text-sm">
        <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
        <span><span className="sr-only">Horario: </span>{horarios.length ? horarios.join(', ') : 'Sin horario definido'}</span>
      </p>

      <p className={`rounded-md px-3 py-2 text-sm ${coincidencias.total ? 'bg-green-50 text-green-800' : 'bg-slate-50 text-slate-600'}`}>
        {coincidencias.total
          ? `Coinciden: ${[...coincidencias.dias, ...coincidencias.horarios].join(', ')}`
          : 'Sin horarios en común contigo'}
      </p>

      <div className="mt-auto">
        <AccionSolicitud jugador={jugador} solicitud={solicitud} onEnviar={onEnviar} />
      </div>
    </Card>
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

  if (solicitud?.estado === 'aceptada') {
    return <Link to="/solicitudes" className="font-medium text-violet-800 hover:underline">¡Hicieron match! Ver contacto</Link>
  }
  if (solicitud?.estado === 'pendiente' && solicitud.de_id === jugador.id) {
    return <Link to="/solicitudes" className="font-medium text-violet-800 hover:underline">Te envió una solicitud. Responder</Link>
  }
  if (solicitud) {
    return <p className="text-sm text-slate-600">{solicitud.estado === 'pendiente' ? 'Solicitud enviada' : 'Solicitud rechazada'}</p>
  }

  return (
    <>
      <button
        type="button"
        onClick={enviar}
        disabled={procesando || !onEnviar}
        className="w-full rounded-md bg-violet-700 px-4 py-2 text-white hover:bg-violet-800 disabled:opacity-50"
      >
        {procesando ? 'Enviando...' : 'Enviar solicitud'}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </>
  )
}
