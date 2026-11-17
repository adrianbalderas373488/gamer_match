import juegosLocales from '../data/juegos.json'

const LLAVE = import.meta.env.VITE_RAWG_KEY

// Deja solo los datos que usa la app (mismo formato que data/juegos.json)
function simplificarJuego(juego) {
  return {
    id: juego.id,
    nombre: juego.name,
    imagen: juego.background_image,
    lanzamiento: juego.released,
    calificacion: juego.rating,
    generos: (juego.genres ?? []).map((genero) => genero.name),
    plataformas: (juego.platforms ?? []).map(({ platform }) => platform.name),
  }
}

// Con texto busca por nombre; sin texto trae los juegos más populares.
// Devuelve { juegos, respaldo } donde respaldo = true si se usaron los datos locales.
export async function buscarJuegos(texto = '') {
  try {
    if (!LLAVE) throw new Error('Falta VITE_RAWG_KEY')

    const url = new URL('https://api.rawg.io/api/games')
    url.searchParams.set('key', LLAVE)
    url.searchParams.set('page_size', '20')
    if (texto) {
      url.searchParams.set('search', texto)
      url.searchParams.set('search_precise', 'true')
    } else {
      url.searchParams.set('ordering', '-added')
    }

    const respuesta = await fetch(url)
    if (!respuesta.ok) throw new Error('No se pudo cargar la lista de juegos.')
    const datos = await respuesta.json()
    return { juegos: datos.results.map(simplificarJuego), respaldo: false }
  } catch {
    // Respaldo con datos guardados de RAWG si la API falla.
    const juegos = juegosLocales.filter((juego) =>
      juego.nombre.toLowerCase().includes(texto.toLowerCase())
    )
    return { juegos, respaldo: true }
  }
}
