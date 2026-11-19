---
name: GamerMatch
description: Encuentra compañeros por juego, nivel y horario; app oscura de trabajo al estilo Discord y Steam.
colors:
  fondo-noche: "#0e0f13"
  panel-grafito: "#14161b"
  tarjeta-grafito: "#1a1c22"
  secundario-grafito: "#24272f"
  elevado-grafito: "#2f333d"
  linea: "#2a2e37"
  linea-campo: "#343844"
  texto: "#e9eaf0"
  texto-tenue: "#a3a9b6"
  primary: "#7c3aed"
  primary-hover: "#6d28d9"
  primary-foreground: "#ffffff"
  acento-lila: "#b49cff"
  coincide-cian: "#22d3ee"
  aviso-rojo: "#e11d48"
  error-texto: "#fb7185"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
  logo:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    letterSpacing: "0.025em"
  title:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  body-sm:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: "tnum"
  label:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  xs: "4px"
  md: "8px"
  lg: "10px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  touch: "44px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.secundario-grafito}"
    textColor: "{colors.texto}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.elevado-grafito}"
  button-ghost:
    textColor: "{colors.texto-tenue}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.secundario-grafito}"
    textColor: "{colors.texto}"
  input-search:
    backgroundColor: "{colors.tarjeta-grafito}"
    textColor: "{colors.texto}"
    rounded: "{rounded.lg}"
    padding: "0 16px 0 44px"
    height: "48px"
  select-filter:
    backgroundColor: "{colors.secundario-grafito}"
    textColor: "{colors.texto}"
    rounded: "{rounded.md}"
    height: "44px"
  card:
    backgroundColor: "{colors.tarjeta-grafito}"
    textColor: "{colors.texto}"
    rounded: "{rounded.lg}"
    padding: "16px"
  badge-nivel:
    backgroundColor: "{colors.secundario-grafito}"
    textColor: "{colors.texto}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "2px 8px"
  contador-pendientes:
    backgroundColor: "{colors.aviso-rojo}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    height: "20px"
  nav-item:
    textColor: "{colors.texto-tenue}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "44px"
  nav-item-active:
    backgroundColor: "{colors.secundario-grafito}"
    textColor: "{colors.texto}"
  sidebar:
    backgroundColor: "{colors.panel-grafito}"
    width: "240px"
---

# Design System: GamerMatch

## Overview

**Creative North Star: "La sala de noche"**

GamerMatch es una herramienta oscura de trabajo, hecha para usarse de noche frente a la PC o el celular, con el juego y Discord abiertos al lado. Sigue el estándar del género (Discord, Steam, el cliente de Riot): fondo casi negro azulado, capas de grafito para paneles y tarjetas, líneas de 1 px y un solo morado que dice "aquí se actúa". No es una plantilla con brillos: nada de neón, resplandores ni degradados decorativos.

El color es información, no decoración. El morado marca la acción principal y la selección; el cian aparece solo cuando hay coincidencia de horario; el rojo solo cuando algo espera respuesta. Todo lo demás es grafito y texto. La densidad es la de una app de uso diario: tarjetas compactas en rejilla, objetivos táctiles de 44 px y cifras tabulares para que los números no bailen.

La identidad tipográfica vive en los títulos: Barlow Condensed en mayúsculas para títulos de página y el logo, Inter para todo lo demás. El único momento cinematográfico es la portada del juego en Jugadores, una banda ancha que se funde con el fondo como en la tienda de Steam.

**Key Characteristics:**
- Oscuro por defecto (`html class="dark"`), capas de grafito en lugar de sombras.
- Un morado para actuar y seleccionar; cian y rojo con un solo significado cada uno.
- Títulos condensados en mayúsculas; cuerpo en Inter con cifras tabulares.
- Barra lateral estilo Discord en escritorio; barra superior y pestañas abajo en celular.
- Movimiento mínimo: un solo fundido de 300 ms en la portada.

## Colors

Grafito casi negro con un morado de acción y dos colores de señal de significado único.

### Primary
- **Morado de acción** (primary): botones de acción principal (Enviar solicitud, Aceptar, Abrir en Discord, Guardar, Iniciar sesión) y el cuadro del logo. Al pasar el cursor baja a **Morado profundo** (primary-hover).
- **Lila de selección** (acento-lila): texto e iconos sobre estados seleccionados (icono de la pestaña activa, "Buscando equipo" marcado, marcas de nivel encendidas), anillo de foco y cursor de texto. Es la versión legible del morado sobre fondo oscuro; los estados seleccionados usan fondo morado al 15 % con texto lila.

### Secondary
- **Cian de coincidencia** (coincide-cian): exclusivo de la barra "Coinciden: …" en la tarjeta de jugador (fondo cian al 10 %, anillo cian al 30 %, texto cyan-100).

### Tertiary
- **Rojo de aviso** (aviso-rojo): exclusivo de lo pendiente: el contador de Solicitudes y el aviso "Te envió una solicitud · Responder" (fondo rojo al 15 %, texto rose-200).

### Neutral
- **Fondo noche** (fondo-noche): fondo de la página.
- **Panel grafito** (panel-grafito): barra lateral, barra superior, pestañas inferiores, panel de Login; también `theme-color`.
- **Tarjeta grafito** (tarjeta-grafito): tarjetas, buscador, diálogos.
- **Grafito secundario** (secundario-grafito): botones secundarios, selects, insignias, ítem de navegación activo, avatar vacío.
- **Grafito elevado** (elevado-grafito): hover del secundario, marcas de nivel apagadas, barra de desplazamiento.
- **Línea** (linea) y **Línea de campo** (linea-campo): bordes de 1 px de paneles y tarjetas; bordes de campos.
- **Texto** (texto) y **Texto tenue** (texto-tenue): texto principal y secundario.
- **Texto de error** (error-texto): mensajes `role="alert"`.

### Named Rules
**The One Purple Rule.** El morado aparece solo en la acción principal y en la selección. Un botón secundario nunca es morado; si dos acciones compiten, una de ellas es grafito.

**The One Meaning Rule.** El cian significa "coincide tu horario" y el rojo significa "pendiente". Ningún otro elemento puede usarlos, ni como decoración ni como estado genérico.

**The Pips Not Hue Rule.** El nivel (Principiante, Intermedio, Avanzado) se muestra con 1 a 3 marcas lila sobre una insignia neutra, nunca con un color por nivel.

## Typography

**Display Font:** Barlow Condensed 600/700 (con Arial Narrow, sans-serif), desde Google Fonts.
**Body Font:** Inter Variable (con sans-serif), desde @fontsource-variable/inter.

**Character:** El condensado en mayúsculas da el pulso de cliente de juego; Inter mantiene la lectura tranquila en tarjetas, formularios y listas.

### Hierarchy
- **Display** (700, 36px móvil / 60px escritorio, interlineado 1, mayúsculas): título del juego en la portada de Jugadores; titular de Login (48px); "404" (96px, lila).
- **Headline** (700, 36px, mayúsculas): títulos de página (Juegos, Solicitudes, Mi perfil). También las cifras grandes de estadísticas de Steam en Perfil (30px).
- **Logo** (700, 24px, mayúsculas, tracking 0.025em): "GamerMatch" junto al cuadro morado.
- **Title** (Inter 600, 16px): nombre del jugador o juego en tarjetas.
- **Body** (Inter 400, 16px) y **Body-sm** (14px): texto, metadatos, mensajes de estado.
- **Label** (Inter 600, 12px, tracking 0.05em, mayúsculas, tenue): encabezados de grupo ("Buscando equipo en", "Matches 3") y etiquetas de filtro.

### Named Rules
**The Condensed Title Rule.** Barlow Condensed solo en mayúsculas y solo para títulos de página, el título de la portada, el logo y cifras destacadas. Nunca en párrafos, botones ni etiquetas.

**The Tabular Rule.** Todo el cuerpo usa cifras tabulares (`font-variant-numeric: tabular-nums` en `body`) y los números se formatean con `es-MX`.

## Layout

Escritorio (≥ 768px): barra lateral fija a la izquierda de 240px y altura de pantalla, al estilo Discord: logo arriba (64px de alto), navegación Juegos / Solicitudes (con contador) / Mi perfil, y el panel de usuario abajo separado por una línea, con avatar, nombre y botón Salir. El contenido ocupa el resto, centrado a un máximo de 1152px (`max-w-6xl`) con márgenes de 40px y 32px arriba.

Celular: barra superior pegajosa de 56px con logo, avatar y Salir; pestañas fijas abajo en tres columnas (56px de alto, respeta `safe-area-inset-bottom`), con fondo de panel al 95 % y desenfoque. El contenido deja 112px abajo para no quedar bajo las pestañas.

Rejillas: tarjetas en 1 / 2 / 3 columnas (juegos llegan a 4 en xl) con huecos de 16px. Los filtros de Jugadores siempre en 3 columnas. Ritmo de espaciado sobre 8px: 8, 12, 16, 24, 40.

**The 44px Rule.** Todo elemento interactivo mide al menos 44px de alto (y de ancho cuando es un icono solo). El buscador y el botón de Login miden 48px.

## Elevation & Depth

Sin sombras. La profundidad se construye con capas tonales de grafito (fondo noche → panel → tarjeta → secundario → elevado) y líneas de 1px (`ring-1 ring-border` en tarjetas, `border` en paneles). El hover sube un escalón tonal; la tarjeta de juego cambia su anillo a morado al 60 %. Las barras móviles usan fondo de panel al 95 % con `backdrop-blur`.

**The Flat Graphite Rule.** Nada flota: sin `box-shadow`, sin resplandores, sin anillos de color alrededor de tarjetas en reposo. Si algo necesita destacar, cambia de capa tonal, no de sombra.

## Shapes

Esquinas suaves y contenidas: 8px en botones, campos, ítems de navegación y barras internas; 10px en tarjetas, buscador y avisos; 4px en insignias y en las marcas de nivel (2px); círculo completo en avatares y contador. Bordes de 1px siempre en tono de línea; los vacíos se marcan con borde discontinuo. Las portadas de juego en tarjeta van a 16:9 recortadas al borde superior de la tarjeta.

## Components

### Buttons
- **Shape:** esquinas suaves (8px), alto mínimo 44px, texto semibold.
- **Primary:** fondo morado, texto blanco, 16px de padding horizontal. Una por tarjeta o grupo.
- **Hover / Focus:** hover a morado profundo con transición de color; foco con contorno lila de 2px separado 2px (`.gamermatch` en App.css). Deshabilitado al 50–60 % de opacidad.
- **Secondary:** grafito secundario con hover a grafito elevado (Rechazar, Buscar equipo sin marcar).
- **Ghost:** sin fondo, anillo interior de 1px en tono de línea, texto tenue; hover a grafito secundario y texto claro (Detalles, Jugadores).
- **Seleccionado:** fondo morado al 15 %, texto lila; hover al 25 % (Buscando equipo, ¡Hicieron match!).

### Chips
- **Mis juegos:** píldora rectangular de 10px con borde de línea sobre tarjeta, miniatura de 64×44px a la izquierda, nombre, y botón X de 44px. Hover del nombre a lila.
- **Badge de nivel:** grafito secundario, 4px, label 12px, con 1–3 marcas verticales (4×10px) lila encendidas y grafito elevado apagadas.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** tarjeta grafito.
- **Shadow Strategy:** ninguna; ver Elevation & Depth.
- **Border:** anillo de 1px en tono de línea.
- **Internal Padding:** 16px (jugador, solicitud), 20px (perfil). La acción va al pie con `mt-auto`.

### Inputs / Fields
- **Style:** buscador sobre tarjeta grafito (48px, 10px, icono a la izquierda); selects y campos sobre grafito secundario (44px, 8px) con borde de línea de campo y chevron propio.
- **Focus:** contorno lila de 2px con 2px de separación; cursor de texto lila.
- **Error / Disabled:** borde en texto de error con `user-invalid`; mensajes en texto de error con `role="alert"`.

### Navigation
- **Barra lateral:** ítems de 44px, 8px de radio, icono 20px. Reposo en texto tenue; hover a grafito secundario al 60 %; activo en grafito secundario con texto claro e icono lila. Contador rojo alineado a la derecha.
- **Pestañas móviles:** icono 24px sobre etiqueta de 12px; activa en texto claro con icono lila; contador rojo sobre la esquina del icono.

### Portada de Jugadores (signature)
Banda de ancho completo (208px móvil, 256px escritorio) que sangra hasta los bordes del contenido. La imagen del juego al 50 % de opacidad entra con un fundido único de 300ms ease-out (desactivado con `prefers-reduced-motion`), cubierta por un degradado de fondo noche desde abajo (100 % → 70 % → 20 %). Encima: botón "← Juegos" sobre fondo noche al 60 % con desenfoque y el título display en mayúsculas.

### Barra de coincidencias (signature)
Franja de 8px de radio en cada tarjeta de jugador: cian al 10 % con anillo cian al 30 % cuando hay coincidencias; grafito secundario al 60 % y texto tenue cuando no.

## Do's and Don'ts

### Do:
- **Do** usar el morado (primary, hover primary-hover) solo para la acción principal y la selección; el texto seleccionado va en lila (acento-lila).
- **Do** reservar el cian (coincide-cian) para coincidencias de horario y el rojo (aviso-rojo) para lo pendiente: contador y solicitud entrante.
- **Do** mostrar el nivel con 1–3 marcas lila sobre una insignia neutra.
- **Do** resolver acciones secundarias en grafito (secundario-grafito, hover elevado-grafito) o como botón fantasma con anillo de 1px.
- **Do** escribir títulos de página y logo en Barlow Condensed mayúsculas; todo lo demás en Inter con cifras tabulares.
- **Do** dar 44px mínimos a todo objetivo táctil.
- **Do** mantener la barra lateral estilo Discord con el panel de usuario abajo en escritorio, y barra superior más pestañas fijas abajo en celular.
- **Do** limitar el movimiento al fundido de 300ms ease-out de la portada, más transiciones de color en hover.

### Don't:
- **Don't** usar bordes de acento a la izquierda en tarjetas, avisos o filas.
- **Don't** usar resplandores, sombras de color ni neón.
- **Don't** poner etiquetas pequeñas (eyebrows) encima de los títulos.
- **Don't** asignar un color distinto a cada nivel ni usar cian o rojo como decoración.
- **Don't** volver al fondo claro con tarjetas blancas y lila genérico.
