# GamerMatch

Red social para encontrar compañeros de equipo según tus juegos, nivel y disponibilidad.
Proyecto integral de Aplicaciones Web (UABC, FIAD).

**Sitio publicado:** https://gamer-match-three.vercel.app

## Tecnologías

- React 19 + Vite, Tailwind CSS v4, shadcn (base-ui), react-router, zustand
- Supabase: autenticación con Discord, base de datos Postgres y Edge Functions
- APIs externas: RAWG (catálogo de juegos), Discord (OAuth2) y Steam Web API (horas jugadas)

## Cómo correrlo

```bash
pnpm install
cp .env.example .env   # y llena las llaves
pnpm dev
```

Variables de `.env`:

| Variable | Dónde se obtiene |
|---|---|
| `VITE_SUPABASE_URL` | Supabase > Project Settings > API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase > Project Settings > API Keys (publishable) |
| `VITE_RAWG_KEY` | https://rawg.io/apidocs |

Sin llave de RAWG la app usa los juegos guardados en `src/data/juegos.json`.

En Juegos se usa el Steam ID guardado en Mi perfil para ordenar el catálogo y la lista «Buscando equipo» por minutos jugados. Sin búsqueda se agregan hasta diez de tus juegos más jugados que tengan coincidencia por nombre en RAWG; al buscar se ordenan los resultados encontrados. Sin Steam ID, con biblioteca privada o si Steam falla, se conserva el orden habitual. Las diferencias de nombre entre catálogos pueden impedir reconocer algunos juegos.

Para usar toda la biblioteca hay que volver a publicar `supabase/functions/steam/index.ts` en la Edge Function `steam`. Mientras siga publicada la versión anterior, se priorizan únicamente los cinco juegos que esa versión devuelve.

## Configurar Supabase

1. **Base de datos:** en SQL Editor > New query, pegar y correr (Run) cada archivo de `supabase/migrations/` en orden, del `001` al `005`.
2. **Login con Discord:** crear una aplicación en https://discord.com/developers/applications y, en OAuth2, agregar como Redirect la URL `https://<tu-proyecto>.supabase.co/auth/v1/callback`. Después, en Supabase > Authentication > Sign In / Providers > Discord, pegar el Client ID y el Client Secret.
3. **URLs permitidas:** en Authentication > URL Configuration, poner como Site URL la del sitio publicado y en Redirect URLs agregar `https://gamer-match-three.vercel.app/**` y `http://localhost:5173/**`.
4. **Función de Steam:**
   - Sacar una llave en https://steamcommunity.com/dev/apikey.
   - En Edge Functions > Secrets, crear `STEAM_API_KEY` con esa llave.
   - En Edge Functions > Deploy a new function > Via Editor, crear la función `steam`, borrar el código de ejemplo y pegar el de `supabase/functions/steam/index.ts`.
   - En los ajustes de la función, desactivar **Verify JWT** (la función ya revisa la sesión).

## Deploy en Vercel

El repositorio está conectado a Vercel: cada push a `main` publica una nueva versión. En Vercel > Settings > Environment Variables van las mismas tres variables del `.env`. El archivo `vercel.json` hace que las rutas como `/solicitudes` funcionen al recargar la página.

## Rutas

| Ruta | Vista |
|---|---|
| `/login` | Inicio de sesión con Discord |
| `/juegos` | Buscador de juegos (RAWG) |
| `/jugadores/:rawgId` | Jugadores que buscan equipo para un juego |
| `/perfil` | Mi perfil (nivel, disponibilidad, Steam) |
| `/jugador/:id` | Perfil de otro jugador (sus juegos, horario, Steam y contacto si hay match) |
| `/solicitudes` | Solicitudes y matches (contacto por Discord al hacer match) |
