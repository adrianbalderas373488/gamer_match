import { useState } from 'react'
import { Navigate } from 'react-router'
import { Gamepad2 } from 'lucide-react'
import { iniciarSesionConDiscord } from '@/api/auth'
import { useSesion } from '@/store/sesion'

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
    <div className="gamermatch flex min-h-screen items-center justify-center bg-violet-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-violet-200 bg-white p-6 text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-violet-700">
          <Gamepad2 aria-hidden="true" /> GamerMatch
        </h1>
        <p className="mb-6 text-slate-600">Encuentra compañeros de equipo para tus juegos.</p>
        <button
          type="button"
          onClick={entrar}
          disabled={redirigiendo}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {redirigiendo ? 'Redirigiendo a Discord...' : 'Iniciar sesión con Discord'}
        </button>
        {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      </div>
    </div>
  )
}
