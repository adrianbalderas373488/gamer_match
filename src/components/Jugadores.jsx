import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, ChevronDown, Plus } from 'lucide-react'
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

  if (cargando) return <p role="status" className="py-10 text-center text-muted-foreground">Cargando jugadores...</p>
  if (error) return <p role="alert" className="py-10 text-center text-destructive">Error: {error}</p>

  return (
    <section aria-labelledby="titulo-jugadores">
      {/* Banda de portada que se funde con el fondo */}
      <div className="relative -mx-4 -mt-6 mb-6 overflow-hidden sm:-mx-6 md:-mx-10 md:-mt-8">
        {juego?.imagen && (
          <img
            src={juego.imagen}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-50 duration-300 ease-out animate-in fade-in motion-reduce:animate-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="relative flex min-h-52 flex-col justify-between px-4 pt-4 pb-6 sm:px-6 md:min-h-64 md:px-10 md:pt-6">
          <Link
            to="/juegos"
            className="inline-flex min-h-11 items-center gap-1.5 self-start rounded-md bg-background/60 px-3 text-sm font-medium backdrop-blur hover:bg-background/80"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Juegos
          </Link>
          <div>
            <h1 id="titulo-jugadores" className="font-display text-4xl leading-none font-bold uppercase md:text-6xl">
              {juego?.nombre ?? 'Juego no encontrado'}
            </h1>
            <p className="mt-2 text-muted-foreground">Jugadores buscando equipo</p>
          </div>
        </div>
      </div>

      {juego && <AvisoMiLista juego={juego} />}

      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
        <Filtro id="filtro-nivel" etiqueta="Nivel" valor={nivel} onCambio={setNivel} opciones={NIVELES} />
        <Filtro id="filtro-dia" etiqueta="Día" valor={dia} onCambio={setDia} opciones={DIAS} />
        <Filtro id="filtro-horario" etiqueta="Horario" valor={horario} onCambio={setHorario} opciones={HORARIOS} />
      </div>
      <p className="mb-4 text-sm text-muted-foreground" role="status">
        {filtrados.length} {filtrados.length === 1 ? 'jugador' : 'jugadores'} · los que más coinciden contigo primero
      </p>

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
          <p className="col-span-full rounded-lg border border-dashed border-border py-10 text-center text-muted-foreground">
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
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">{etiqueta}</label>
      <div className="relative">
        <select
          id={id}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          className="block min-h-11 w-full appearance-none rounded-md border border-input bg-secondary pr-8 pl-2 text-sm sm:pl-3 sm:text-base"
        >
          <option value="">Todos</option>
          {opciones.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
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
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4">
      <p className="text-amber-100">Tú todavía no buscas equipo en este juego. Agrégalo para que otros jugadores te encuentren.</p>
      <button
        type="button"
        onClick={agregarJuego}
        disabled={procesando}
        className="flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
      >
        <Plus aria-hidden="true" className="h-4 w-4" /> Buscar equipo
      </button>
      {error && <p role="alert" className="w-full text-destructive">{error}</p>}
    </div>
  )
}
