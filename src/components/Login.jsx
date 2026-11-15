import { Gamepad2 } from 'lucide-react'

// Día 2: el botón llamará a supabase.auth.signInWithOAuth({ provider: 'discord' })
export default function Login() {
  return (
    <div className="gamermatch flex min-h-screen items-center justify-center bg-violet-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-violet-200 bg-white p-6 text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-violet-700">
          <Gamepad2 aria-hidden="true" /> GamerMatch
        </h1>
        <p className="mb-6 text-slate-600">Encuentra compañeros de equipo para tus juegos.</p>
        <button
          type="button"
          disabled
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
        >
          Iniciar sesión con Discord (próximamente)
        </button>
      </div>
    </div>
  )
}
