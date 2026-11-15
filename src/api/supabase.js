import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const llaveAnonima = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigurado = Boolean(url && llaveAnonima)

if (!supabaseConfigurado) {
  console.warn('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env')
}

// Si no hay llaves todavía, la app carga igual (para poder desplegar desde el día 1).
export const supabase = supabaseConfigurado ? createClient(url, llaveAnonima) : null
