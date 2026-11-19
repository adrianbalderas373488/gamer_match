import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { obtenerJuego } from '@/api/rawg'
import { buscarJugadoresPorJuego } from '@/api/jugadores'
import { obtenerPerfil } from '@/api/perfiles'
import { obtenerSolicitudes, enviarSolicitud } from '@/api/solicitudes'
import { useSesion } from '@/store/sesion'
import { useMisJuegos } from '@/store/misJuegos'
import { calcularCoincidencias } from '@/lib/compatibilidad'
import { NIVELES, DIAS, HORARIOS } from '@/data/opciones'
import JugadorCard from './JugadorCard'

export default function Jugadores() {
  const { rawgId } = useParams()
  const usuario = useSesion((state) => state.usuario)

  const [juego, setJuego] = useState(null)
  const [jugadores, setJugadores] = useState([])
  const [miPerfil, setMiPerfil] = useState(null)
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [nivel, setNivel] = useState('')
  const [dia, setDia] = useState('')
  const [horario, setHorario] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      try {
        const [datosJuego, datosJugadores, datosPerfil, datosSolicitudes] = await Promise.all([
          obtenerJuego(rawgId),
          buscarJugadoresPorJuego(rawgId, usuario.id),
          obtenerPerfil(usuario.id),
          obtenerSolicitudes(),
        ])
        if (activo) {
          setJuego(datosJuego)
          setJugadores(datosJugadores)
          setMiPerfil(datosPerfil)
          setSolicitudes(datosSolicitudes)
        }
      } catch (error) {
        if (activo) setError(error.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarDatos()
    return () => { activo = false }
  }, [rawgId, usuario.id])

  // Aplicar filtros y ordenar: primero los que más coinciden con mi disponibilidad
  const filtrados = jugadores
    .filter((jugador) => !nivel || jugador.nivel === nivel)
    .filter((jugador) => !dia || jugador.disponibilidad?.dias?.includes(dia))
    .filter((jugador) => !horario || jugador.disponibilidad?.horarios?.includes(horario))
    .map((jugador) => ({ jugador, coincidencias: calcularCoincidencias(jugador, miPerfil) }))
    .sort((a, b) => b.coincidencias.total - a.coincidencias.total)

  async function enviar(jugador) {
    const nueva = await enviarSolicitud(jugador.id, juego)
    setSolicitudes((actuales) => [nueva, ...actuales])
  }

  // Todas las solicitudes cargadas son mías, basta con buscar al otro jugador
  const solicitudCon = (jugador) => solicitudes.find((s) =>
    s.rawg_id === Number(rawgId) && (s.de_id === jugador.id || s.para_id === jugador.id)
  )

  if (cargando) return <p role="status" className="text-center">Cargando jugadores...</p>
  if (error) return <p role="alert" className="text-center text-red-700">Error: {error}</p>

  return (
    <section aria-labelledby="titulo-jugadores">
      <Link to="/juegos" className="mb-4 inline-flex items-center gap-1 text-violet-800 hover:underline">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Volver a juegos
      </Link>

      <div className="mb-6 flex items-center gap-4">
        {juego?.imagen && <img src={juego.imagen} alt="" className="h-20 w-32 rounded-lg object-cover" />}
        <div>
          <h2 id="titulo-jugadores" className="text-2xl font-bold">{juego?.nombre ?? 'Juego no encontrado'}</h2>
          <p className="text-slate-600">Jugadores buscando equipo</p>
        </div>
      </div>

      {juego && <AvisoMiLista juego={juego} />}

      <div className="mb-6 grid gap-4 rounded-xl border border-violet-200 bg-white p-4 sm:grid-cols-3">
        <Filtro id="filtro-nivel" etiqueta="Nivel" valor={nivel} onCambio={setNivel} opciones={NIVELES} />
        <Filtro id="filtro-dia" etiqueta="Día" valor={dia} onCambio={setDia} opciones={DIAS} />
        <Filtro id="filtro-horario" etiqueta="Horario" valor={horario} onCambio={setHorario} opciones={HORARIOS} />
        <p className="text-sm text-slate-600 sm:col-span-3" role="status">
          Jugadores encontrados: {filtrados.length}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map(({ jugador, coincidencias }) => (
          <JugadorCard
            key={jugador.id}
            jugador={jugador}
            coincidencias={coincidencias}
            juego={juego?.nombre}
            solicitud={solicitudCon(jugador)}
            onEnviar={juego ? enviar : undefined}
          />
        ))}
        {filtrados.length === 0 && (
          <p className="col-span-full text-center text-slate-600">
            {jugadores.length === 0
              ? 'Nadie más busca equipo en este juego todavía.'
              : 'Ningún jugador coincide con los filtros.'}
          </p>
        )}
      </div>
    </section>
  )
}

function Filtro({ id, etiqueta, valor, onCambio, opciones }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-medium">{etiqueta}</label>
      <select
        id={id}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        className="block w-full rounded-md border border-slate-300 bg-white p-2"
      >
        <option value="">Todos</option>
        {opciones.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
      </select>
    </div>
  )
}

// Si yo no tengo este juego en mi lista, invito a agregarlo para que otros me encuentren
function AvisoMiLista({ juego }) {
  const usuario = useSesion((state) => state.usuario)
  const enMiLista = useMisJuegos((state) => state.juegos.some((j) => j.rawg_id === juego.id))
  const cargado = useMisJuegos((state) => state.cargado)
  const agregar = useMisJuegos((state) => state.agregar)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState(null)

  if (!cargado || enMiLista) return null

  async function agregarJuego() {
    setProcesando(true)
    setError(null)
    try {
      await agregar(usuario.id, juego)
    } catch (error) {
      setError(error.message)
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p>Tú todavía no buscas equipo en este juego. Agrégalo para que otros jugadores te encuentren.</p>
      <button
        type="button"
        onClick={agregarJuego}
        disabled={procesando}
        className="flex items-center gap-1 rounded-md bg-violet-700 px-4 py-2 text-white hover:bg-violet-800 disabled:opacity-60"
      >
        <Plus aria-hidden="true" className="h-4 w-4" /> Buscar equipo
      </button>
      {error && <p role="alert" className="w-full text-red-700">{error}</p>}
    </div>
  )
}
