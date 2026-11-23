# Bitácora de GamerMatch

Proyecto integral de Aplicaciones Web (UABC, FIAD). Trabajo individual. Herramienta de IA: Claude Code.

Cómo uso la IA: le pido una parte a la vez, reviso lo que cambia, lo pruebo en `pnpm dev` y hago commit solo cuando funciona.

---

## 15 de noviembre: estructura, login con Discord y perfil

**Qué hice**
- Creé el proyecto con Vite + React, siguiendo el estilo del proyecto de Pokémon de clase (Tailwind, shadcn, react-router, zustand y `src/api/*.js`).
- Elegí Supabase como backend: el login con Discord, la base de datos Postgres y una función en el servidor para Steam.
- Login con Discord y tabla `perfiles` con nivel y disponibilidad (migración `001`).
- Commits: `Día 1: estructura base`, `Usar publishable key de Supabase`, `Día 2: login con Discord y perfil`.

**Decisiones**
- Usé Supabase en lugar de hacer un backend propio, porque tenía menos de 2 semanas y trabajo solo.
- Escogí Discord para el login porque casi todos los jugadores ya lo usan. Así no tienen que crear otra cuenta, tomo su foto de perfil automáticamente y, cuando dos jugadores hacen match, pueden hablar directo por ahí. Eso ya lo había planteado en mi propuesta del proyecto.

**Uso de IA y errores detectados**
- Antes de empezar le pedí a la IA que no inventara datos y que me preguntara lo que no supiera. También le pedí que siguiera el estilo del proyecto de Pokémon, sin TypeScript ni otro framework, para poder entender y explicar todo el código.
- La IA agregó a los commits una línea `Co-Authored-By: Claude` y apareció como contribuidor en GitHub. Lo vi en el repo y le pedí que nunca volviera a ponerla. Desde entonces reviso el autor con `git log` antes de cada push.

---

## 16 de noviembre: buscador de juegos y jugadores

**Qué hice**
- Buscador con la API de RAWG y mi lista "Buscando equipo" (migración `002`).
- Si RAWG falla, la app usa juegos guardados en `src/data/juegos.json` y lo avisa.
- Página de jugadores por juego con filtros de nivel, día y horario, ordenados por coincidencia de horario (`src/lib/compatibilidad.js`).
- Commits: `Día 3`, `Día 5`.

**Uso de IA**
- Le pedí a la IA que me dijera dónde poner la key de la API de RAWG, y realizó un JSON con juegos guardados por si la API falla. En lugar de inventarlos, bajó 40 juegos reales de RAWG, igual que el `pokemones.json` del proyecto de clase.
- Al sacar la key, la página de RAWG me daba error 502. Le pregunté a la IA si la habían tumbado: revisó y me dijo que fallaba el sitio de RAWG, pero que la API sí respondía. Cuando conseguí la key, la probó y confirmó que funcionaba.
- Al agregar la key en Vercel me salió un aviso de que las variables con `VITE_` se ven en el navegador. La IA me explicó que no debía quitar el prefijo, porque sin él la app no puede leer la key, y que la llave publishable de Supabase está hecha para verse: los datos los protegen las reglas RLS de la base de datos.
- Al picar «Buscar equipo» me salía "No se pudo agregar el juego". La IA revisó Supabase y encontró que no existía la tabla `juegos_buscando`, porque no había corrido la migración `002`. La corrí y funcionó.

---

## 17 y 18 de noviembre: solicitudes y matches

**Qué hice**
- Tabla `solicitudes` con permisos en la base de datos (migración `003`): solo puedes enviar solicitudes a quien busca equipo en ese juego, solo quien la recibe puede responder y cada pareja tiene una sola solicitud por juego.
- Página de Solicitudes con Matches, Recibidas y Enviadas. Al hacer match aparece el botón para abrir Discord, como decía mi propuesta.
- Commit: `Día 7: solicitudes de equipo y matches`.

**Uso de IA**
- Empecé una sesión nueva y le pregunté a la IA si tenía el contexto de la anterior. Me dijo que no tenía la conversación, solo sus notas y el repo. Revisó los commits y me dijo qué faltaba: las solicitudes, Steam y el deploy. Le pedí seguir con las solicitudes.
- Antes de escribir código leyó las migraciones y los componentes que ya tenía, para hacer las solicitudes sobre lo que ya existía.
- Me propuso que la base de datos se encargara de las reglas (quién envía, quién responde y que no haya duplicados) y no solo la app. Así nadie puede saltárselas desde el navegador.
- Antes de que yo corriera la migración, probó los permisos en una base de datos temporal. Luego la corrí yo en el SQL Editor de Supabase.
- Probé el flujo completo con dos cuentas de Discord: enviar, aceptar y ver el match. Hasta que me funcionó le pedí el commit.
- La IA me dijo qué había dejado fuera a propósito (cancelar una solicitud, un contador de pendientes) para que yo decidiera. Los dos los agregué después.

---

## 19 de noviembre: deploy, Steam y seguridad

**Qué hice**
- Revisé el deploy en Vercel (https://gamer-match-three.vercel.app) y configuré en Supabase las direcciones permitidas para el login.
- Estadísticas de Steam con una Edge Function, para que la llave no quede en el navegador. Muestra horas por juego en las tarjetas y en mi perfil.
- Migración `004`: ahora cada usuario solo puede editar su nivel, su horario y su Steam ID, no su `discord_id` ni su nombre.
- README con los pasos de configuración, contador de solicitudes pendientes y avatar que lleva a Mi perfil.
- Commits: `Día 9`, `Día 10`, `Actualizar README`, `Contador de solicitudes pendientes`.

**Uso de IA**
- Le pedí que me guiara con el deploy. Revisó que el sitio publicado respondiera y tuviera sus variables, pero me dijo que no podía comprobar si Supabase tenía permitida la dirección de Vercel. Esa parte la revisé yo en Supabase y probé el login en el sitio.
- Para Steam, la IA escribió la función y la probó con respuestas simuladas, porque todavía no había llave. Yo saqué la llave, la guardé en Supabase como secreto y publiqué la función. Luego la IA comprobó que respondiera, y yo confirmé que me salían mis horas reales.
- No entendía el paso de "New query > Run" en Supabase, así que le pedí que me lo explicara paso a paso.

**Decisiones**
- Acepté que la llave de RAWG se vea en el navegador: es de solo lectura y, si se agota, la app usa los juegos locales. La de Steam sí la protegí, porque es secreta.
- Lo del avatar que lleva al perfil fue idea mía, para que fuera más intuitivo.

**Errores y cómo los detecté**
- Al publicar la función de Steam, el editor de Supabase traía un código de ejemplo. No sabía cuál era el código correcto, pregunté y reemplacé el ejemplo completo.
- La IA encontró que cualquier usuario podía cambiar su `discord_id` y falsificar el botón de Discord. Lo corregimos con la migración `004`.
- Al correr esa migración me salió un error de sintaxis, porque pegué mi Steam ID por accidente al final del SQL. Lo borré y volví a correrla.
- La IA dijo que haría 3 commits, pero hizo 2, porque dos cambios tocaban el mismo archivo. Me lo explicó.

---

## 19 de noviembre: rediseño visual

**Qué hice**
- La app se veía genérica, como hecha por IA. Usé la skill de diseño Impeccable para rediseñarla.
- Ajusté el encabezado para celular: antes se rompía en pantallas chicas.
- La skill propuso estilos: una ronda con tazos y álbum de estampas, y otra con el Metro de la CDMX y carteles de lucha libre. Rechacé ambas y elegí el estilo estándar de apps de juego (oscuro con morado), tomando como referencia Discord, Steam y Riot.
- Un revisor automático encontró 7 problemas en el diseño que hizo la IA, por ejemplo colores usados sin un significado claro, y se corrigieron.
- Commits: `Rediseño oscuro de la interfaz`, `Documentar producto y sistema visual` (PRODUCT.md y DESIGN.md).

**Cómo usé la IA y por qué rechacé las propuestas**
- Antes de diseñar, la IA me hizo preguntas sobre el producto: para quién es (casuales y competitivos por igual), dónde se usa (en clase y como app real en celular y PC) y qué no se podía cambiar (el nombre y que todo esté en español).
- Me mostró bocetos de cada estilo en una página para elegir. La primera ronda (tazos, álbum de estampas, mosaicos tipo Xbox) no me convenció y pedí otra.
- En la segunda ronda (Metro de la CDMX, cartel de lucha libre, catálogo de convención) elegí el estilo estándar oscuro. Quería que se sintiera como las apps que ya uso como jugador (Discord, Steam y el cliente de Riot) y no como un experimento visual. La IA me advirtió que ese estilo es el más común, pero era lo que yo buscaba, solo que bien hecho.
- Le di esas tres apps como referencia del nivel de calidad que quería.

**Errores detectados**
- El detector de diseño marcó un borde de color a la izquierda que la IA había puesto, un patrón típico de interfaces hechas con IA, y se quitó.

---

## 19 de noviembre: cancelar solicitudes

**Qué hice**
- Botón para cancelar una solicitud enviada mientras sigue pendiente (migración `005`). Después de cancelar se puede volver a enviar.
- Quité el color ámbar de dos avisos, porque estaba fuera del sistema de colores.
- Commit: `Día 11: cancelar solicitudes enviadas y ajustar colores de avisos`.

**Uso de IA**
- Le pedí las dos cosas juntas. Primero escribió la migración y la probó en una base temporal: solo quien envía puede cancelar, solo mientras está pendiente, y luego se puede volver a enviar.
- Me avisó que el botón no funcionaría hasta que yo corriera la migración. La corrí en Supabase, me salió "Success" y hasta entonces pedí el commit.
- También me recordó actualizar el README, que todavía decía que había migraciones solo hasta la `004`.

---

## 21 de noviembre: casos límite y perfil de otros jugadores

**Qué hice**
- Intenté romper mi app antes de la presentación: buscar un juego que no existe, doble clic en los botones, texto en el Steam ID, guardar con campos vacíos, un nombre de 200 letras, listas vacías, RAWG y Supabase caídos, servidor lento, recargar a mitad de un envío y una ruta que no existe.
- Página de perfil de otros jugadores (`/jugador/:id`): foto, nivel, horario, en qué coincide conmigo, los juegos en los que busca equipo y sus horas de Steam. El botón de Discord solo aparece si ya hicimos match.
- Si abres un juego que no existe, ya no salen los filtros, solo el aviso y un enlace para volver.
- Commit: `Día 12: perfil de otros jugadores y ocultar filtros si el juego no existe`.

**Uso de IA**
- Le pedí a la IA que probara los casos límite. Los probó en el navegador con datos simulados, porque así puede provocar caídas y lentitud que en el sitio real no se pueden forzar. Todos pasaron; solo un caso marcó falla, y era un error de la prueba: la página sí decía "Juego no encontrado", pero en mayúsculas.
- De esa prueba salió una mejora: con un juego inexistente seguían apareciendo los filtros, que ahí no sirven. Le pedí quitarlos.
- La IA me advirtió que los mensajes rojos en la consola cuando falla el servidor son a propósito: se registran para depurar, mientras la pantalla muestra un mensaje claro.

**Decisiones**
- Le pregunté a la IA si podía entrar al perfil de mis amigos y me dijo que esa página no existía. Me recomendó no hacerla tan cerca de la presentación, pero decidí hacerla porque sin eso la app se veía muy básica.
- El contacto de Discord solo se ve en el perfil si ya hicimos match, igual que en Solicitudes, para que nadie vea tu Discord sin que aceptes.

**Errores detectados**
- Al principio solo el nombre llevaba al perfil y no se notaba que se podía picar. Yo intenté picar la foto y no pasaba nada. Le pedí que toda la parte de arriba de la tarjeta (foto, nombre y nivel) fuera el enlace, con una flecha para que se note.
- Probé el perfil de otros jugadores en el sitio publicado con mis dos cuentas de Discord y funciona.
