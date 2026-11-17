import { supabase } from './supabase'

// Lista "Buscando equipo" del usuario
export async function obtenerMisJuegos(perfilId) {
  const { data, error } = await supabase
    .from('juegos_buscando')
    .select('*')
    .eq('perfil_id', perfilId)
    .order('creado_en', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error('No se pudo cargar tu lista de juegos.')
  }
  return data
}

export async function agregarJuego(perfilId, juego) {
  const { data, error } = await supabase
    .from('juegos_buscando')
    .insert({ perfil_id: perfilId, rawg_id: juego.id, nombre: juego.nombre, imagen: juego.imagen })
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error('No se pudo agregar el juego.')
  }
  return data
}

export async function quitarJuego(perfilId, rawgId) {
  const { error } = await supabase
    .from('juegos_buscando')
    .delete()
    .eq('perfil_id', perfilId)
    .eq('rawg_id', rawgId)

  if (error) {
    console.error(error)
    throw new Error('No se pudo quitar el juego.')
  }
}
