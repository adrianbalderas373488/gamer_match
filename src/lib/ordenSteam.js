// Comparación exacta por nombre: RAWG y Steam no comparten identificadores.
export function normalizarNombre(nombre) {
  const normalizado = nombre.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
  // Steam renombró CS:GO a Counter-Strike 2; RAWG conserva ambos nombres.
  return normalizado === 'counterstrikeglobaloffensive' ? 'counterstrike2' : normalizado
}

export function minutosEnSteam(nombre, biblioteca) {
  const clave = normalizarNombre(nombre)
  return biblioteca.reduce((mayor, juego) =>
    normalizarNombre(juego.nombre) === clave ? Math.max(mayor, juego.minutos) : mayor, 0)
}

export function ordenarPorSteam(juegos, biblioteca) {
  return [...juegos].sort((a, b) =>
    minutosEnSteam(b.nombre, biblioteca) - minutosEnSteam(a.nombre, biblioteca))
}
