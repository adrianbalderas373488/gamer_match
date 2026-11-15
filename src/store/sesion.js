import { create } from 'zustand'

// Usuario actual. Se llena en el día 2 con el login de Discord (Supabase Auth).
// No usamos persist: Supabase ya guarda la sesión por su cuenta.
export const useSesion = create((set) => ({
  usuario: null,
  cargando: true,
  setUsuario: (usuario) => set({ usuario, cargando: false }),
  cerrarSesion: () => set({ usuario: null }),
}))
