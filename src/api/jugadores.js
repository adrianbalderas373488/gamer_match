import { supabase } from './supabase'

// Perfiles de otros usuarios que buscan equipo para un juego (sin incluirme a mí)
export async function buscarJugadoresPorJuego(rawgId, miId) {
  const { data, error } = await supabase
    .from('juegos_buscando')
    .select('perfiles (id, usuario, avatar_url, nivel, disponibilidad, steam_id)')
    .eq('rawg_id', rawgId)
    .neq('perfil_id', miId)

  if (error) {
    console.error(error)
    throw new Error('No se pudo cargar la lista de jugadores.')
  }
  return data.map((fila) => fila.perfiles).filter(Boolean)
}
