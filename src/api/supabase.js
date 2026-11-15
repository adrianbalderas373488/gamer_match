import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const llavePublica = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigurado = Boolean(url && llavePublica)

if (!supabaseConfigurado) {
  console.warn('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en el archivo .env')
}

// Si no hay llaves todavía, la app carga igual (para poder desplegar desde el día 1).
export const supabase = supabaseConfigurado ? createClient(url, llavePublica) : null
