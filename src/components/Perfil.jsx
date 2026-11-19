import { useEffect, useState } from 'react'
import { obtenerPerfil, actualizarPerfil } from '@/api/perfiles'
import { obtenerEstadisticasSteam } from '@/api/steam'
import { ChevronDown } from 'lucide-react'
import { useSesion } from '@/store/sesion'
import { NIVELES, DIAS, HORARIOS } from '@/data/opciones'

export default function Perfil() {
  const usuario = useSesion((state) => state.usuario)
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true

    async function cargarPerfil() {
      try {
        const datos = await obtenerPerfil(usuario.id)
        if (activo) setPerfil(datos)
      } catch (error) {
        if (activo) setError(error.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarPerfil()
    return () => { activo = false }
  }, [usuario.id])

  return (
    <section aria-labelledby="titulo-perfil" className="max-w-2xl">
      <h1 id="titulo-perfil" className="mb-6 font-display text-4xl font-bold uppercase">Mi perfil</h1>

      {cargando && <p role="status" className="text-muted-foreground">Cargando perfil...</p>}
      {error && <p role="alert" className="text-destructive">Error: {error}</p>}
      {perfil && (
        <>
          <div className="mb-4 flex items-center gap-4 rounded-lg bg-card p-5 ring-1 ring-border">
            {perfil.avatar_url ? (
              <img src={perfil.avatar_url} alt="" className="h-16 w-16 rounded-full" />
            ) : (
              <span className="h-16 w-16 rounded-full bg-secondary" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold">{perfil.usuario}</p>
              <p className="text-sm text-muted-foreground">Cuenta vinculada con Discord</p>
            </div>
          </div>
          {perfil.steam_id && <EstadisticasSteam key={perfil.steam_id} steamId={perfil.steam_id} />}
          <FormularioPerfil perfil={perfil} onGuardado={setPerfil} />
        </>
      )}
    </section>
  )
}

function EstadisticasSteam({ steamId }) {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true

    async function cargarEstadisticas() {
      try {
        const respuesta = await obtenerEstadisticasSteam(steamId)
        if (activo) setDatos(respuesta)
      } catch (error) {
        if (activo) setError(error.message)
      }
    }

    cargarEstadisticas()
    return () => { activo = false }
  }, [steamId])

  return (
    <div className="mb-4 rounded-lg bg-card p-5 ring-1 ring-border">
      <h2 className="text-lg font-semibold">Estadísticas de Steam</h2>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      {!error && !datos && <p role="status" className="text-muted-foreground">Cargando estadísticas...</p>}
      {datos?.privado && (
        <p className="text-muted-foreground">
          La cuenta {datos.nombre} tiene privados los detalles de sus juegos. Hazlos públicos en Steam para ver tus horas.
        </p>
      )}
      {datos && !datos.privado && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">Cuenta: {datos.nombre}</p>
          <dl className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-md bg-secondary px-4 py-3">
              <dt className="text-xs text-muted-foreground">Juegos</dt>
              <dd className="font-display text-3xl font-bold">{datos.totalJuegos.toLocaleString('es-MX')}</dd>
            </div>
            <div className="rounded-md bg-secondary px-4 py-3">
              <dt className="text-xs text-muted-foreground">Horas jugadas</dt>
              <dd className="font-display text-3xl font-bold">{datos.horasTotales.toLocaleString('es-MX')}</dd>
            </div>
          </dl>
          {datos.topJuegos.length > 0 && (
            <ul className="divide-y divide-border text-sm">
              {datos.topJuegos.map((juego) => (
                <li key={juego.nombre} className="flex justify-between gap-4 py-2">
                  <span>{juego.nombre}</span>
                  <span className="shrink-0 text-muted-foreground">{juego.horas.toLocaleString('es-MX')} h</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

const etiqueta = 'mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase'
// Casilla dentro de una pastilla: se ilumina cuando está marcada
const chip = 'flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-input px-3 hover:bg-secondary has-[:checked]:border-primary has-[:checked]:bg-primary/15'

function FormularioPerfil({ perfil, onGuardado }) {
  const [nivel, setNivel] = useState(perfil.nivel ?? '')
  const [dias, setDias] = useState(perfil.disponibilidad?.dias ?? [])
  const [horarios, setHorarios] = useState(perfil.disponibilidad?.horarios ?? [])
  const [steamId, setSteamId] = useState(perfil.steam_id ?? '')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  function alternar(lista, setLista, valor) {
    setLista(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor])
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    try {
      const actualizado = await actualizarPerfil(perfil.id, {
        nivel: nivel || null,
        disponibilidad: { dias, horarios },
        steam_id: steamId.trim() || null,
      })
      onGuardado(actualizado)
      setMensaje({ tipo: 'exito', texto: 'Perfil guardado.' })
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-6 rounded-lg bg-card p-5 ring-1 ring-border">
      <div>
        <label htmlFor="nivel" className={etiqueta}>Nivel</label>
        <div className="relative">
          <select
            id="nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="block min-h-11 w-full appearance-none rounded-md border border-input bg-secondary pr-9 pl-3"
          >
            <option value="">Selecciona tu nivel</option>
            {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <fieldset>
        <legend className={etiqueta}>Días disponibles</legend>
        <div className="flex flex-wrap gap-2">
          {DIAS.map((dia) => (
            <label key={dia} className={chip}>
              <input
                type="checkbox"
                checked={dias.includes(dia)}
                onChange={() => alternar(dias, setDias, dia)}
                className="accent-primary"
              />
              {dia}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={etiqueta}>Horario</legend>
        <div className="flex flex-wrap gap-2">
          {HORARIOS.map((horario) => (
            <label key={horario} className={chip}>
              <input
                type="checkbox"
                checked={horarios.includes(horario)}
                onChange={() => alternar(horarios, setHorarios, horario)}
                className="accent-primary"
              />
              {horario}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="steam-id" className={etiqueta}>Steam ID (opcional)</label>
        <input
          id="steam-id"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
          inputMode="numeric"
          pattern="\s*7656119[0-9]{10}\s*"
          title="Tu Steam ID de 17 dígitos, empieza con 7656119"
          aria-describedby="ayuda-steam"
          className="block min-h-11 w-full rounded-md border border-input bg-secondary px-3 user-invalid:border-destructive"
        />
        <p id="ayuda-steam" className="mt-1.5 text-sm text-muted-foreground">
          Son 17 dígitos. Lo encuentras en Steam, en Detalles de la cuenta. Para mostrar tus horas, los detalles de tus juegos deben ser públicos.
        </p>
      </div>

      <button
        type="submit"
        disabled={guardando}
        className="min-h-11 rounded-md bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {guardando ? 'Guardando...' : 'Guardar perfil'}
      </button>
      {mensaje && (
        <p role="status" className={mensaje.tipo === 'error' ? 'text-destructive' : 'text-acento'}>
          {mensaje.texto}
        </p>
      )}
    </form>
  )
}
