import { supabase } from './supabase'

// juego es opcional: si se manda, la respuesta incluye horasJuego
export async function obtenerEstadisticasSteam(steamId, juego, incluirBiblioteca = false) {
  const { data, error } = await supabase.functions.invoke('steam', { body: { steamId, juego, incluirBiblioteca } })

  if (error) {
    console.error(error)
    throw new Error('No se pudieron cargar las estadísticas de Steam. Revisa el Steam ID.')
  }
  return data
}
