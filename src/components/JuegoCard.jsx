import { useState } from 'react'
import { Link } from 'react-router'
import { Check, Plus, Users } from 'lucide-react'
import { Card } from './ui/card'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'
import { useSesion } from '@/store/sesion'
import { useMisJuegos } from '@/store/misJuegos'

export default function JuegoCard({ juego }) {
  const usuario = useSesion((state) => state.usuario)
  const agregado = useMisJuegos((state) => state.juegos.some((j) => j.rawg_id === juego.id))
  const agregar = useMisJuegos((state) => state.agregar)
  const quitar = useMisJuegos((state) => state.quitar)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState(null)

  const anio = juego.lanzamiento?.slice(0, 4)

  async function alternarLista() {
    setProcesando(true)
    setError(null)
    try {
      if (agregado) await quitar(usuario.id, juego.id)
      else await agregar(usuario.id, juego)
    } catch (error) {
      setError(error.message)
    } finally {
      setProcesando(false)
    }
  }

  return (
    <Card className="gap-3 overflow-hidden border border-violet-200 bg-white pt-0 pb-4 text-center">
      {juego.imagen ? (
        <img src={juego.imagen} alt="" loading="lazy" className="aspect-video w-full object-cover" />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-violet-100 text-sm text-slate-500">
          Sin portada
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 px-4">
        <h3 className="text-lg font-bold">{juego.nombre}</h3>
        <p className="text-sm text-slate-600">
          {[anio, juego.generos.slice(0, 2).join(', ')].filter(Boolean).join(' · ')}
        </p>

        <div className="mt-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={alternarLista}
            disabled={procesando}
            aria-pressed={agregado}
            className={`flex items-center justify-center gap-1 rounded-md px-4 py-2 disabled:opacity-60 ${
              agregado
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-violet-700 text-white hover:bg-violet-800'
            }`}
          >
            {agregado ? <Check aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}
            {agregado ? 'Buscando equipo' : 'Buscar equipo'}
          </button>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger className="flex-1 rounded-md border border-violet-300 px-3 py-2 text-violet-800 hover:bg-violet-50">
                Detalles
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{juego.nombre}</DialogTitle>
                  <DialogDescription>Información del juego (RAWG)</DialogDescription>
                </DialogHeader>
                {juego.imagen && <img src={juego.imagen} alt="" className="w-full rounded-md" />}
                <p>Lanzamiento: {juego.lanzamiento ?? 'Sin fecha'}</p>
                <p>Calificación: {juego.calificacion ? `${juego.calificacion} / 5` : 'Sin calificación'}</p>
                <p>Géneros: {juego.generos.join(', ') || 'Sin datos'}</p>
                <p>Plataformas: {juego.plataformas.join(', ') || 'Sin datos'}</p>
              </DialogContent>
            </Dialog>

            <Link
              to={`/jugadores/${juego.id}`}
              className="flex flex-1 items-center justify-center gap-1 rounded-md border border-violet-300 px-3 py-2 text-violet-800 hover:bg-violet-50"
            >
              <Users aria-hidden="true" className="h-4 w-4" /> Jugadores
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
