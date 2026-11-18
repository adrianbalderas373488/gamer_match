import { supabase } from './supabase'

const DATOS_PERFIL = 'id, usuario, avatar_url, discord_id'

// Enviadas y recibidas: las políticas de la base solo devuelven las mías
export async function obtenerSolicitudes() {
  const { data, error } = await supabase
    .from('solicitudes')
    .select(`*, de:perfiles!solicitudes_de_id_fkey (${DATOS_PERFIL}), para:perfiles!solicitudes_para_id_fkey (${DATOS_PERFIL})`)
    .order('creado_en', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error('No se pudieron cargar las solicitudes.')
  }
  return data
}

export async function enviarSolicitud(paraId, juego) {
  const { data, error } = await supabase
    .from('solicitudes')
    .insert({ para_id: paraId, rawg_id: juego.id, juego_nombre: juego.nombre })
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error(error.code === '23505'
      ? 'Ya existe una solicitud entre ustedes para este juego.'
      : 'No se pudo enviar la solicitud.')
  }
  return data
}

// estado: 'aceptada' o 'rechazada'
export async function responderSolicitud(id, estado) {
  const { data, error } = await supabase
    .from('solicitudes')
    .update({ estado })
    .eq('id', id)
    .eq('estado', 'pendiente')
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error('No se pudo responder la solicitud.')
  }
  return data
}
