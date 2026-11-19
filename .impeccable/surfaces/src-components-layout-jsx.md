---
version: 1
slug: "src-components-layout-jsx"
primary_target: "src/components/Layout.jsx"
related_targets: ["src/components/Login.jsx","src/components/BuscadorJuegos.jsx","src/components/JuegoCard.jsx","src/components/Jugadores.jsx","src/components/JugadorCard.jsx","src/components/Perfil.jsx","src/components/Solicitudes.jsx","src/components/NoEncontrado.jsx"]
---

# App GamerMatch (todas las pantallas)

Alcance: la app completa con sesión (Layout, Juegos, Jugadores, Perfil, Solicitudes) más Login y 404. Modo: Operate. Usuarios casuales y competitivos, de noche en PC o celular con el juego y Discord abiertos; se presenta también en clase con proyector.

Tarea: encontrar compañeros por juego, nivel y horario; enviar, responder y ver solicitudes; abrir Discord al hacer match. Se conserva toda la funcionalidad, el texto en español y el nombre GamerMatch.

Barra de calidad: Discord, Steam, cliente de Riot/Valorant.

## Direction contract

THESIS: El estándar del género, ejecutado como lo harían Discord y Steam: una app oscura de trabajo, no una plantilla con brillos. Rechaza el blanco con tarjetas lila genéricas y también el neón con resplandores.

OWN-WORLD: Fondo casi negro azulado, capas de gris grafito para paneles y tarjetas, líneas de 1 px; un solo morado para la acción principal y la selección; cian solo para coincidencias de horario; rojo solo para avisos pendientes. Títulos en Barlow Condensed en mayúsculas, texto en Inter, cifras tabulares.

STORY: El jugador ve de inmediato sus juegos, quién juega a su hora y qué solicitudes esperan respuesta, y actúa con un botón morado.

FIRST VIEWPORT: Escritorio: barra lateral fija a la izquierda con logo, Juegos, Solicitudes (con contador rojo) y Mi perfil, y abajo el panel de usuario con avatar y Salir, al estilo Discord. La zona principal muestra el título de la página en mayúsculas condensadas y el contenido. En Jugadores, la portada del juego es una banda ancha que se funde con el fondo, como la tienda de Steam. Celular: barra superior con logo y avatar, pestañas fijas abajo.

FORM: canon, elegido por el usuario como salida estándar (no está en la lista ordenada); seed:f0b120e1b506b00a. Movimiento distintivo: la banda de portada del juego que se funde con el fondo, y la barra de coincidencias en cian en cada jugador.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
