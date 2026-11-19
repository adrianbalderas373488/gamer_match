import { useEffect, useState } from 'react'
import { obtenerPerfil, actualizarPerfil } from '@/api/perfiles'
import { obtenerEstadisticasSteam } from '@/api/steam'
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
    <section aria-labelledby="titulo-perfil" className="mx-auto max-w-2xl">
      <h2 id="titulo-perfil" className="mb-4 text-xl font-bold">Mi perfil</h2>

      {cargando && <p role="status">Cargando perfil...</p>}
      {error && <p role="alert" className="text-red-700">Error: {error}</p>}
      {perfil && (
        <>
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-violet-200 bg-white p-4">
            {perfil.avatar_url && (
              <img src={perfil.avatar_url} alt="" className="h-16 w-16 rounded-full" />
            )}
            <div>
              <p className="text-lg font-bold">{perfil.usuario}</p>
              <p className="text-sm text-slate-600">Cuenta vinculada con Discord</p>
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
    <div className="mb-6 rounded-xl border border-violet-200 bg-white p-4">
      <h3 className="mb-2 font-bold">Estadísticas de Steam</h3>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!error && !datos && <p role="status">Cargando estadísticas...</p>}
      {datos?.privado && (
        <p className="text-slate-600">
          La cuenta {datos.nombre} tiene privados los detalles de sus juegos. Hazlos públicos en Steam para ver tus horas.
        </p>
      )}
      {datos && !datos.privado && (
        <>
          <p>
            <span className="font-medium">{datos.nombre}</span>: {datos.totalJuegos} juegos, {datos.horasTotales.toLocaleString('es-MX')} horas jugadas
          </p>
          {datos.topJuegos.length > 0 && (
            <ul className="mt-2 text-sm text-slate-700">
              {datos.topJuegos.map((juego) => (
                <li key={juego.nombre} className="flex justify-between gap-4 py-0.5">
                  <span>{juego.nombre}</span>
                  <span className="shrink-0">{juego.horas.toLocaleString('es-MX')} h</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

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
    <form onSubmit={guardar} className="space-y-6 rounded-xl border border-violet-200 bg-white p-4">
      <div>
        <label htmlFor="nivel" className="mb-2 block font-medium">Nivel</label>
        <select
          id="nivel"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          className="block w-full rounded-md border border-slate-300 bg-white p-2"
        >
          <option value="">Selecciona tu nivel</option>
          {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <fieldset>
        <legend className="mb-2 font-medium">Días disponibles</legend>
        <div className="flex flex-wrap gap-3">
          {DIAS.map((dia) => (
            <label key={dia} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={dias.includes(dia)}
                onChange={() => alternar(dias, setDias, dia)}
              />
              {dia}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-medium">Horario</legend>
        <div className="flex flex-wrap gap-3">
          {HORARIOS.map((horario) => (
            <label key={horario} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={horarios.includes(horario)}
                onChange={() => alternar(horarios, setHorarios, horario)}
              />
              {horario}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="steam-id" className="mb-2 block font-medium">Steam ID (opcional)</label>
        <input
          id="steam-id"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
          inputMode="numeric"
          pattern="\s*7656119[0-9]{10}\s*"
          title="Tu Steam ID de 17 dígitos, empieza con 7656119"
          aria-describedby="ayuda-steam"
          className="block w-full rounded-md border border-slate-300 bg-white p-2"
        />
        <p id="ayuda-steam" className="mt-1 text-sm text-slate-600">
          Son 17 dígitos. Lo encuentras en Steam, en Detalles de la cuenta. Para mostrar tus horas, los detalles de tus juegos deben ser públicos.
        </p>
      </div>

      <button
        type="submit"
        disabled={guardando}
        className="rounded-md bg-violet-700 px-4 py-2 text-white hover:bg-violet-800 disabled:opacity-60"
      >
        {guardando ? 'Guardando...' : 'Guardar perfil'}
      </button>
      {mensaje && (
        <p role="status" className={mensaje.tipo === 'error' ? 'text-red-700' : 'text-green-700'}>
          {mensaje.texto}
        </p>
      )}
    </form>
  )
}
