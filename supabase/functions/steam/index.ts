// Día 9: estadísticas públicas de Steam. Corre en el servidor para no exponer STEAM_API_KEY.
// Publicar en Supabase: Edge Functions > Deploy a new function > Via Editor, con el nombre "steam".

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const responder = (datos, status = 200) =>
  new Response(JSON.stringify(datos), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const horas = (minutos) => Math.round(minutos / 60)

// shortcut: RAWG y Steam no comparten ids, se compara por nombre; si un juego se llama distinto no muestra sus horas
const normalizar = (nombre) => nombre.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

async function consultarSteam(ruta, parametros) {
  const consulta = new URLSearchParams({ key: Deno.env.get('STEAM_API_KEY'), format: 'json', ...parametros })
  const respuesta = await fetch(`https://api.steampowered.com/${ruta}?${consulta}`)
  if (!respuesta.ok) throw new Error(`Steam respondió ${respuesta.status}`)
  return respuesta.json()
}

async function haySesion(req) {
  const authorization = req.headers.get('Authorization')
  const apikey = req.headers.get('apikey')
  if (!authorization || !apikey) return false
  const respuesta = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, {
    headers: { Authorization: authorization, apikey },
  })
  return respuesta.ok
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return responder({ error: 'Método no permitido' }, 405)

  try {
    if (!(await haySesion(req))) return responder({ error: 'Inicia sesión' }, 401)

    const { steamId, juego } = await req.json().catch(() => ({}))
    if (typeof steamId !== 'string' || !/^7656119\d{10}$/.test(steamId)) {
      return responder({ error: 'Steam ID inválido' }, 400)
    }

    const [resumen, biblioteca] = await Promise.all([
      consultarSteam('ISteamUser/GetPlayerSummaries/v2/', { steamids: steamId }),
      consultarSteam('IPlayerService/GetOwnedGames/v1/', {
        steamid: steamId,
        include_appinfo: '1',
        include_played_free_games: '1',
      }),
    ])

    const jugador = resumen.response?.players?.[0]
    if (!jugador) return responder({ error: 'Cuenta de Steam no encontrada' }, 404)

    // Steam no devuelve game_count si los detalles de juegos son privados
    if (biblioteca.response?.game_count === undefined) {
      return responder({ nombre: jugador.personaname, privado: true })
    }

    const juegos = biblioteca.response.games ?? []
    const buscado = typeof juego === 'string' ? normalizar(juego) : ''
    const encontrado = buscado && juegos.find((j) => normalizar(j.name ?? '') === buscado)

    return responder({
      nombre: jugador.personaname,
      privado: false,
      totalJuegos: biblioteca.response.game_count,
      horasTotales: horas(juegos.reduce((total, j) => total + j.playtime_forever, 0)),
      topJuegos: [...juegos]
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .slice(0, 5)
        .map((j) => ({ nombre: j.name, horas: horas(j.playtime_forever) })),
      horasJuego: encontrado ? horas(encontrado.playtime_forever) : null,
    })
  } catch (error) {
    console.error(error.message)
    return responder({ error: 'No se pudo consultar Steam' }, 502)
  }
})
