import { supabase } from './supabase'

export async function iniciarSesionConDiscord() {
  if (!supabase) throw new Error('Supabase no está configurado.')

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo: `${window.location.origin}/juegos` },
  })
  if (error) throw new Error('No se pudo iniciar sesión con Discord.')
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('No se pudo cerrar la sesión.')
}
