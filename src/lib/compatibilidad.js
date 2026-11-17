// Días y horarios que dos perfiles tienen en común
export function calcularCoincidencias(perfil, miPerfil) {
  const misDias = miPerfil?.disponibilidad?.dias ?? []
  const misHorarios = miPerfil?.disponibilidad?.horarios ?? []

  const dias = (perfil.disponibilidad?.dias ?? []).filter((dia) => misDias.includes(dia))
  const horarios = (perfil.disponibilidad?.horarios ?? []).filter((h) => misHorarios.includes(h))

  return { dias, horarios, total: dias.length + horarios.length }
}
