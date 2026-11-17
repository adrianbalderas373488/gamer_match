import { create } from 'zustand'
import { obtenerMisJuegos, agregarJuego, quitarJuego } from '../api/juegos'

// Lista "Buscando equipo" compartida entre el buscador, las tarjetas y la vista de jugadores
export const useMisJuegos = create((set, get) => ({
  juegos: [],
  cargado: false,
  errorCarga: null,

  // Se llama desde Layout al entrar a la app
  cargar: async (perfilId) => {
    try {
      const juegos = await obtenerMisJuegos(perfilId)
      set({ juegos, cargado: true, errorCarga: null })
    } catch (error) {
      set({ cargado: true, errorCarga: error.message })
    }
  },

  agregar: async (perfilId, juego) => {
    const nuevo = await agregarJuego(perfilId, juego)
    set({ juegos: [nuevo, ...get().juegos] })
  },

  quitar: async (perfilId, rawgId) => {
    await quitarJuego(perfilId, rawgId)
    set({ juegos: get().juegos.filter((juego) => juego.rawg_id !== rawgId) })
  },

  limpiar: () => set({ juegos: [], cargado: false, errorCarga: null }),
}))
