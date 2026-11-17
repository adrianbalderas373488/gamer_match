import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { X } from 'lucide-react'
import { buscarJuegos } from '@/api/rawg'
import { useSesion } from '@/store/sesion'
import { useMisJuegos } from '@/store/misJuegos'
import JuegoCard from './JuegoCard'

export default function BuscadorJuegos() {
  const [busqueda, setBusqueda] = useState('')
  const [juegos, setJuegos] = useState([])
  const [respaldo, setRespaldo] = useState(false)
  const [cargando, setCargando] = useState(true)

  const usuario = useSesion((state) => state.usuario)
  const misJuegos = useMisJuegos((state) => state.juegos)
  const misJuegosCargados = useMisJuegos((state) => state.cargado)
  const errorCarga = useMisJuegos((state) => state.errorCarga)
  const quitar = useMisJuegos((state) => state.quitar)
  const [errorLista, setErrorLista] = useState(null)

  // Buscar en RAWG: espera 400 ms después de que el usuario deja de escribir
  useEffect(() => {
    let activo = true

    const temporizador = setTimeout(async () => {
      setCargando(true)
      const resultado = await buscarJuegos(busqueda.trim())
      if (activo) {
        setJuegos(resultado.juegos)
        setRespaldo(resultado.respaldo)
        setCargando(false)
      }
    }, 400)

    return () => {
      activo = false
      clearTimeout(temporizador)
    }
  }, [busqueda])

  async function quitarDeLista(rawgId) {
    setErrorLista(null)
    try {
      await quitar(usuario.id, rawgId)
    } catch (error) {
      setErrorLista(error.message)
    }
  }

  return (
    <>
      <section aria-labelledby="titulo-mis-juegos" className="mb-6 rounded-xl border border-violet-200 bg-white p-4">
        <h2 id="titulo-mis-juegos" className="mb-3 font-bold">Buscando equipo en</h2>
        {(errorCarga || errorLista) && (
          <p role="alert" className="mb-2 text-red-700">{errorLista ?? errorCarga}</p>
        )}
        {misJuegosCargados && misJuegos.length === 0 && (
          <p className="text-slate-600">Todavía no agregas juegos. Busca uno abajo y presiona "Buscando equipo".</p>
        )}
        <ul className="flex flex-wrap gap-2">
          {misJuegos.map((juego) => (
            <li key={juego.rawg_id} className="flex items-center gap-1 rounded-full bg-violet-100 py-1 pr-1 pl-3">
              <Link to={`/jugadores/${juego.rawg_id}`} className="text-violet-800 hover:underline">
                {juego.nombre}
              </Link>
              <button
                type="button"
                onClick={() => quitarDeLista(juego.rawg_id)}
                aria-label={`Quitar ${juego.nombre} de mi lista`}
                className="rounded-full p-1 hover:bg-violet-200"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto mb-6 max-w-md rounded-xl border border-violet-200 bg-white p-4">
        <label htmlFor="buscador-juegos" className="mb-2 block font-medium">Buscar juego por nombre</label>
        <input
          id="buscador-juegos"
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Ej. Valorant, Minecraft..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-violet-600"
        />
        <p className="mt-2 text-sm text-slate-600" role="status">
          {cargando ? 'Buscando...' : `Resultados: ${juegos.length}`}
        </p>
        {respaldo && !cargando && (
          <p className="mt-1 text-sm text-amber-700">
            RAWG no respondió; se muestran juegos guardados localmente.
          </p>
        )}
      </div>

      <section aria-label="Juegos" className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {juegos.map((juego) => (
          <JuegoCard juego={juego} key={juego.id} />
        ))}
        {!cargando && juegos.length === 0 && (
          <p className="col-span-full text-center">No se encontraron juegos.</p>
        )}
      </section>

      <p className="mt-8 text-center text-sm text-slate-500">
        Datos de juegos proporcionados por{' '}
        <a href="https://rawg.io" target="_blank" rel="noreferrer" className="underline">RAWG</a>.
      </p>
    </>
  )
}
