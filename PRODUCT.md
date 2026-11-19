# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Jugadores de videojuegos, tanto casuales como competitivos, que quieren dejar de depender del emparejamiento aleatorio. Los casuales buscan con quién jugar seguido en horarios que les acomoden; los competitivos buscan equipo de su nivel y les importan las horas verificadas. El nivel y la disponibilidad son lo que separa a unos de otros dentro de la misma app.

## Product Purpose

Red social web para encontrar compañeros de equipo según los juegos que cada quien busca, su nivel de habilidad y su disponibilidad. El éxito es que dos jugadores compatibles se encuentren, se manden una solicitud, hagan match y pasen a hablar por Discord.

## Positioning

El emparejamiento no es al azar: se basa en el juego exacto (catálogo de RAWG), el nivel declarado, los días y horarios en común y las horas reales jugadas en Steam, que validan el nivel y reducen los perfiles falsos. El contacto directo se abre solo cuando ambos aceptan el match.

## Operating Context

- Proyecto integral de Aplicaciones Web (UABC, FIAD), individual. Se califica en clase (laptop o proyector) y además debe funcionar como app real en celular y PC.
- Flujo: iniciar sesión con Discord → completar perfil (nivel, días, horarios, Steam ID opcional) → buscar un juego y agregarlo a "Buscando equipo" → ver jugadores de ese juego ordenados por coincidencia de horario, con filtros → enviar solicitud → el otro acepta o rechaza → match con enlace a Discord.
- Rutas: `/login`, `/juegos`, `/jugadores/:rawgId`, `/perfil`, `/solicitudes`.

## Capabilities and Constraints

- Stack existente: React 19 + Vite (JSX, no TypeScript), Tailwind CSS v4, shadcn/base-ui, react-router, zustand, Supabase (Auth con Discord, Postgres con RLS, Edge Function de Steam). Deploy en Vercel.
- Terminología fija: "Buscando equipo", "solicitud", "match", "nivel" (Principiante, Intermedio, Avanzado), "disponibilidad" (días y horarios).
- Las horas de Steam solo aparecen si el perfil de Steam del usuario tiene públicos los detalles de juegos; el Steam ID es público y no prueba que la cuenta sea de quien lo escribe.
- Las portadas de juegos vienen de RAWG; si RAWG falla, se usa `src/data/juegos.json`.

## Brand Commitments

- El nombre es GamerMatch y no cambia.
- Toda la interfaz está en español.
- Todo lo visual (colores, tipografía, logo) se puede cambiar mientras la funcionalidad siga igual.
- Preferencia confirmada (2026-11-19): el estilo estándar de las apps de juego, oscuro con acento morado, ejecutado sin ironía. La barra de calidad son Discord, Steam y el cliente de Riot/Valorant.

## Evidence on Hand

- Idea del proyecto: `../Proyecto Integral_Idea de proyecto.pdf`.
- Sin testimonios, usuarios reales, métricas ni prensa: no se deben inventar.

## Product Principles

- Compatibilidad antes que cantidad: mostrar primero a quien coincide en juego, horario y nivel.
- Datos verificables: lo que se puede comprobar (horas de Steam, cuenta de Discord) pesa más que lo declarado.
- Contacto con consentimiento: los datos de contacto solo se muestran después de un match aceptado por ambos.
- Funciona igual en celular que en PC.
