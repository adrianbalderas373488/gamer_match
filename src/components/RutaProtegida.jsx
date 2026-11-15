import { Navigate, Outlet } from 'react-router'
import { useSesion } from '@/store/sesion'

export default function RutaProtegida() {
  const usuario = useSesion((state) => state.usuario)
  const cargando = useSesion((state) => state.cargando)

  if (cargando) {
    return <p role="status" className="p-6 text-center">Cargando sesión...</p>
  }

  if (!usuario) return <Navigate to="/login" replace />

  return <Outlet />
}
