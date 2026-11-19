import { useState } from 'react'
import { Navigate } from 'react-router'
import { Gamepad2 } from 'lucide-react'
import { iniciarSesionConDiscord } from '@/api/auth'
import { useSesion } from '@/store/sesion'
import juegosLocales from '@/data/juegos.json'

const pasos = [
  'Agrega los juegos en los que buscas equipo.',
  'Encuentra jugadores de tu nivel que juegan a tu hora.',
  'Manda una solicitud y, si aceptan, hablen por Discord.',
]

// Portadas reales de RAWG guardadas en el proyecto
const portadas = juegosLocales.filter((juego) => juego.imagen).slice(0, 9)

export default function Login() {
  const usuario = useSesion((state) => state.usuario)
  const [redirigiendo, setRedirigiendo] = useState(false)
  const [error, setError] = useState(null)

  if (usuario) return <Navigate to="/juegos" replace />

  async function entrar() {
    setError(null)
    setRedirigiendo(true)
    try {
      await iniciarSesionConDiscord()
    } catch (error) {
      setError(error.message)
      setRedirigiendo(false)
    }
  }

  return (
    <div className="gamermatch grid min-h-screen bg-background text-foreground md:grid-cols-[minmax(0,30rem)_1fr]">
      <main className="flex flex-col justify-center border-border bg-panel px-6 py-12 sm:px-12 md:border-r">
        <p className="mb-10 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Gamepad2 aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-bold tracking-wide uppercase">GamerMatch</span>
        </p>

        <h1 className="font-display text-5xl leading-none font-bold uppercase">Encuentra con quién jugar</h1>
        <p className="mt-4 text-muted-foreground">
          Deja el emparejamiento al azar. Busca compañeros por juego, nivel y horario.
        </p>

        <ol className="mt-8 space-y-3">
          {pasos.map((paso, i) => (
            <li key={paso} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-acento">{i + 1}</span>
              <span>{paso}</span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={entrar}
          disabled={redirigiendo}
          className="mt-10 min-h-12 w-full rounded-md bg-primary px-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {redirigiendo ? 'Redirigiendo a Discord...' : 'Iniciar sesión con Discord'}
        </button>
        {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
      </main>

      <div aria-hidden="true" className="relative hidden overflow-hidden md:block">
        <div className="grid h-full grid-cols-3 gap-2 p-2 opacity-60">
          {portadas.map((juego) => (
            <img key={juego.id} src={juego.imagen} alt="" className="h-full min-h-0 w-full rounded-md object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-background/10" />
      </div>
    </div>
  )
}
