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
    <Card className="gap-3 overflow-hidden rounded-lg bg-card pt-0 pb-4 ring-1 ring-border transition-shadow hover:ring-primary/60">
      {juego.imagen ? (
        <img src={juego.imagen} alt="" loading="lazy" className="aspect-video w-full object-cover" />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-secondary text-sm text-muted-foreground">
          Sin portada
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1 px-4">
        <h3 className="text-base font-semibold text-foreground">{juego.nombre}</h3>
        <p className="text-sm text-muted-foreground">
          {[anio, juego.generos.slice(0, 2).join(', ')].filter(Boolean).join(' · ')}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <button
            type="button"
            onClick={alternarLista}
            disabled={procesando}
            aria-pressed={agregado}
            className={`flex min-h-11 items-center justify-center gap-1.5 rounded-md px-4 font-semibold transition-colors disabled:opacity-60 ${
              agregado ? 'bg-primary/15 text-acento hover:bg-primary/25' : 'bg-secondary hover:bg-elevado'
            }`}
          >
            {agregado ? <Check aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4 text-acento" />}
            {agregado ? 'Buscando equipo' : 'Buscar equipo'}
          </button>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger className="min-h-11 flex-1 rounded-md px-3 text-sm font-medium text-muted-foreground ring-1 ring-border ring-inset hover:bg-secondary hover:text-foreground">
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
              className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground ring-1 ring-border ring-inset hover:bg-secondary hover:text-foreground"
            >
              <Users aria-hidden="true" className="h-4 w-4" /> Jugadores
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
