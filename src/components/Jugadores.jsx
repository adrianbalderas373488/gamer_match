import { useParams } from 'react-router'

// Día 5-6: lista de jugadores que buscan equipo para este juego, con filtros
export default function Jugadores() {
  const { rawgId } = useParams()

  return (
    <section aria-labelledby="titulo-jugadores">
      <h2 id="titulo-jugadores" className="mb-4 text-xl font-bold">Jugadores buscando equipo</h2>
      <p className="text-slate-600">Juego seleccionado (RAWG id): {rawgId}</p>
    </section>
  )
}
