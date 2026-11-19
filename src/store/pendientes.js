import { create } from 'zustand'
import { contarSolicitudesPendientes } from '../api/solicitudes'

// Número de solicitudes recibidas sin responder, para el contador del menú
export const usePendientes = create((set) => ({
  total: 0,

  // Se llama desde Layout al cambiar de página y desde Solicitudes al responder
  actualizar: async (perfilId) => {
    try {
      set({ total: await contarSolicitudesPendientes(perfilId) })
    } catch {
      // El contador es solo un aviso: si falla se deja el número anterior
    }
  },

  limpiar: () => set({ total: 0 }),
}))
