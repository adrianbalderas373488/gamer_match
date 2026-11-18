import { useEffect, useState } from 'react'
import { Check, MessageCircle, X } from 'lucide-react'
import { obtenerSolicitudes, responderSolicitud } from '@/api/solicitudes'
import { useSesion } from '@/store/sesion'
import { Card } from './ui/card'

export default function Solicitudes() {
  const usuario = useSesion((state) => state.usuario)
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
    } catch (error) {
      setErrorRespuesta(error.message)
    } finally {
      setProcesando(null)
    }
  }

  if (cargando) return <p role="status" className="text-center">Cargando solicitudes...</p>
  if (error) return <p role="alert" className="text-center text-red-700">Error: {error}</p>

  const matches = solicitudes.filter((s) => s.estado === 'aceptada')
  const recibidas = solicitudes.filter((s) => s.estado === 'pendiente' && s.para_id === usuario.id)
  const enviadas = solicitudes.filter((s) => s.estado !== 'aceptada' && s.de_id === usuario.id)
  const otroJugador = (s) => (s.de_id === usuario.id ? s.para : s.de)

  return (
    <section aria-labelledby="titulo-solicitudes" className="space-y-8">
      <h2 id="titulo-solicitudes" className="text-2xl font-bold">Solicitudes</h2>
      {errorRespuesta && <p role="alert" className="text-red-700">{errorRespuesta}</p>}

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
                  className="flex items-center justify-center gap-1 rounded-md bg-violet-700 px-4 py-2 text-white hover:bg-violet-800"
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
                className="flex flex-1 items-center justify-center gap-1 rounded-md bg-violet-700 px-4 py-2 text-white hover:bg-violet-800 disabled:opacity-60"
              >
                <Check aria-hidden="true" className="h-4 w-4" /> Aceptar
              </button>
              <button
                type="button"
                onClick={() => responder(s.id, 'rechazada')}
                disabled={procesando === s.id}
                className="flex flex-1 items-center justify-center gap-1 rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:opacity-60"
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
            <p className="text-sm text-slate-600">
              {s.estado === 'pendiente' ? 'Esperando respuesta' : 'Rechazada'}
            </p>
          </Fila>
        ))}
      </Grupo>
    </section>
  )
}

function Grupo({ titulo, vacio, children }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-bold">{titulo}</h3>
      {children.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      ) : (
        <p className="text-slate-600">{vacio}</p>
      )}
    </div>
  )
}

function Fila({ jugador, juego, children }) {
  return (
    <Card className="gap-3 border border-violet-200 bg-white p-4">
      <div className="flex items-center gap-3">
        {jugador?.avatar_url ? (
          <img src={jugador.avatar_url} alt="" className="h-12 w-12 rounded-full" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-violet-200" aria-hidden="true" />
        )}
        <div>
          <p className="font-bold">{jugador?.usuario ?? 'Jugador'}</p>
          <p className="text-sm text-slate-600">{juego}</p>
        </div>
      </div>
      {children}
    </Card>
  )
}
