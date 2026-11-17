import { supabase } from './supabase'

export async function obtenerPerfil(id) {
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)
    throw new Error('No se pudo cargar el perfil.')
  }
  return data
}

export async function actualizarPerfil(id, cambios) {
  const { data, error } = await supabase
    .from('perfiles')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error('No se pudo guardar el perfil.')
  }
  return data
}
