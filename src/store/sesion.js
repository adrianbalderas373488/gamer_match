import { create } from 'zustand'
import { supabase } from '../api/supabase'
import { useMisJuegos } from './misJuegos'

// Usuario actual (viene de Supabase Auth después del login con Discord).
// No usamos persist: Supabase ya guarda la sesión por su cuenta.
export const useSesion = create((set) => ({
  usuario: null,
  cargando: true,
  setUsuario: (usuario) => set({ usuario, cargando: false }),
}))

// Se llama una sola vez en main.jsx. Supabase avisa cada vez que
// la sesión cambia (al cargar la página, al entrar y al salir).
export function escucharSesion() {
  if (!supabase) {
    useSesion.getState().setUsuario(null)
    return
  }

  supabase.auth.onAuthStateChange((_evento, sesion) => {
    const nuevoUsuario = sesion?.user ?? null
    // Si cambia de cuenta o sale, se borra la lista de juegos del usuario anterior
    if (useSesion.getState().usuario?.id !== nuevoUsuario?.id) {
      useMisJuegos.getState().limpiar()
    }
    useSesion.getState().setUsuario(nuevoUsuario)
  })
}
