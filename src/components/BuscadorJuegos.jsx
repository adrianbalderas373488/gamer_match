import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Search, X } from 'lucide-react'
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
      <h1 className="mb-6 font-display text-4xl font-bold uppercase">Juegos</h1>

      <section aria-labelledby="titulo-mis-juegos" className="mb-8">
        <h2 id="titulo-mis-juegos" className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Buscando equipo en
        </h2>
        {(errorCarga || errorLista) && (
          <p role="alert" className="mb-2 text-destructive">{errorLista ?? errorCarga}</p>
        )}
        {misJuegosCargados && misJuegos.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-4 py-5 text-muted-foreground">
            Todavía no agregas juegos. Busca uno abajo y presiona «Buscar equipo».
          </p>
        )}
        <ul className="flex flex-wrap gap-2">
          {misJuegos.map((juego) => (
            <li key={juego.rawg_id} className="flex items-center overflow-hidden rounded-lg border border-border bg-card">
              <Link
                to={`/jugadores/${juego.rawg_id}`}
                className="flex min-h-11 items-center gap-2.5 pr-2 font-medium hover:text-acento"
              >
                {juego.imagen ? (
                  <img src={juego.imagen} alt="" className="h-11 w-16 object-cover" />
                ) : (
                  <span className="h-11 w-16 bg-secondary" aria-hidden="true" />
                )}
                {juego.nombre}
              </Link>
              <button
                type="button"
                onClick={() => quitarDeLista(juego.rawg_id)}
                aria-label={`Quitar ${juego.nombre} de mi lista`}
                className="grid min-h-11 min-w-11 place-items-center text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mb-6">
        <label htmlFor="buscador-juegos" className="sr-only">Buscar juego por nombre</label>
        <div className="relative max-w-xl">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="buscador-juegos"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar juego por nombre: Valorant, Minecraft..."
            className="min-h-12 w-full rounded-lg border border-input bg-card pr-4 pl-11 placeholder:text-muted-foreground"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground" role="status">
          {cargando ? 'Buscando...' : `${juegos.length} resultados`}
        </p>
        {respaldo && !cargando && (
          <p className="mt-1 text-sm text-amber-300">
            RAWG no respondió; se muestran juegos guardados localmente.
          </p>
        )}
      </div>

      <section aria-label="Resultados" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {juegos.map((juego) => (
          <JuegoCard juego={juego} key={juego.id} />
        ))}
        {!cargando && juegos.length === 0 && (
          <p className="col-span-full py-10 text-center text-muted-foreground">No se encontraron juegos con ese nombre.</p>
        )}
      </section>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Datos de juegos proporcionados por{' '}
        <a href="https://rawg.io" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">RAWG</a>.
      </p>
    </>
  )
}
