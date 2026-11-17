import { create } from 'zustand'
import { obtenerMisJuegos, agregarJuego, quitarJuego } from '../api/juegos'

// Lista "Buscando equipo" compartida entre el buscador y las tarjetas
export const useMisJuegos = create((set, get) => ({
  juegos: [],
  cargado: false,

  cargar: async (perfilId) => {
    const juegos = await obtenerMisJuegos(perfilId)
    set({ juegos, cargado: true })
  },

  agregar: async (perfilId, juego) => {
    const nuevo = await agregarJuego(perfilId, juego)
    set({ juegos: [nuevo, ...get().juegos] })
  },

  quitar: async (perfilId, rawgId) => {
    await quitarJuego(perfilId, rawgId)
    set({ juegos: get().juegos.filter((juego) => juego.rawg_id !== rawgId) })
  },

  limpiar: () => set({ juegos: [], cargado: false }),
}))
