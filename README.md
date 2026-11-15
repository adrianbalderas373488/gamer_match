# GamerMatch

Red social para encontrar compañeros de equipo según tus juegos, nivel y disponibilidad.
Proyecto integral de Aplicaciones Web (UABC, FIAD).

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

## Rutas

| Ruta | Vista |
|---|---|
| `/login` | Inicio de sesión con Discord |
| `/juegos` | Buscador de juegos (RAWG) |
| `/jugadores/:rawgId` | Jugadores que buscan equipo para un juego |
| `/perfil` | Mi perfil (nivel, disponibilidad, Steam) |
| `/solicitudes` | Solicitudes y matches |
