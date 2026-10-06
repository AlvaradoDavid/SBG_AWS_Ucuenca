# Sistema de diseño

Todo vive en `src/styles/global.css`, dentro del bloque `@theme` de Tailwind 4.
Eso convierte cada token en una utilidad (`bg-marca-purple`) y en una variable
CSS (`var(--color-marca-purple)`) al mismo tiempo.

## La regla del color

> **El color de marca nunca es color de texto.**

Los cinco colores vibrantes del kit son saturados y brillantes. Sobre blanco
ninguno alcanza el contraste 4.5:1 que exige WCAG AA para texto normal. Así que
se usan solo como **marcador visual**: puntos, bordes, barras, halos y degradados.

El texto siempre sale de la escala `tinta`, derivada del Grey 850 de la marca.

**Sobre fondos oscuros** (los morados profundos del hero y el pie), el texto va
en blanco o en la escala `tinta` clara: `tinta-200`, `tinta-300` o `tinta-400`.
Esos fondos no son el morado de marca sino tonos derivados mucho más oscuros, y
la regla sigue igual: nada de texto en un color vibrante. Ver [D-28](decisiones.md#d-28).

### Colores de marca

| Token | Hex | Dónde se usa |
| --- | --- | --- |
| `marca-purple` | `#ad5cff` | **Color principal** ([D-27](decisiones.md#d-27)). Foco, halo principal de los fondos de marca, centro de la línea de marca, partículas del hero, subrayado de la barra y del pie, hito de fundación, íconos del kit, categorías |
| `marca-amber` | `#ff9900` | Secundario: tercer halo de los fondos, extremo de la línea de marca, pilar «Camino a la certificación», final de la trayectoria. Además, recuadro de costo del catálogo (advertencia) y categorías |
| `marca-blue` | `#42b4ff` | Secundario: segundo halo de los fondos, extremo de la línea de marca, pilar «Comunidad abierta», tramo medio de la trayectoria, categorías |
| `marca-mint` | `#00e582` | Categorías |
| `marca-magenta` | `#ff57e9` | Categorías |
| `marca-grey` | `#161d26` | Visor de fotos, enlace «Saltar al contenido». El pie y los botones pasaron a morado ([D-28](decisiones.md#d-28)) |

### Escala morada

Derivada de `marca-purple` en OKLCH ([D-28](decisiones.md#d-28)): mismo tono,
otra luminosidad. Es para fondos y bordes. No hay `morado-500`: ese es
`marca-purple`.

| Token | Hex | Uso | Texto encima |
| --- | --- | --- | --- |
| `morado-50` | `#f9f6ff` | Base de `fondo-aurora` y de las cabeceras interiores | `tinta-500` 5.95:1 · `tinta-600` 8.8:1 |
| `morado-100` | `#f2ebfe` | Bordes de secciones y tarjetas de pilares, etiqueta de asistentes | `tinta-700` |
| `morado-200` | `#e7d7ff` | Selección de texto, borde de la etiqueta de asistentes | `tinta-900` 12.6:1 |
| `morado-300` | `#d4b7fe` | Borde al pasar el cursor (filtros, tarjetas de eventos) | — |
| `morado-700` | `#6d2cbe` | Botón principal, filtro activo, borde del buscador con foco | blanco 7.6:1 |
| `morado-800` | `#4a1d8d` | Botón principal al pasar el cursor | blanco 11.3:1 |
| `morado-900` | `#281253` | Tramo central del degradado de `fondo-noche` | blanco 16.1:1 · `tinta-300` 8.4:1 |
| `morado-950` | `#13092d` | Base de `fondo-noche` y fondo del pie | blanco 19:1 · `tinta-300` 9.95:1 · `tinta-400` 5.24:1 |

### El fondo del afiche

Un solo token fuera de la paleta del kit, y solo para el cartel del próximo
evento ([D-31](decisiones.md#d-31)):

| Token | Hex | Uso | Texto encima |
| --- | --- | --- | --- |
| `afiche` | `#0b1828` | Fondo del cartel del Student Community Day, en la portada y en su página | blanco 17.9:1 · `tinta-200` 13:1 · `tinta-300` 9.35:1 · `tinta-400` 4.93:1 |

Es el azul marino del afiche oficial, medido sobre el arte. Separa el cartel del
hero morado que tiene encima, y la catedral recortada del afiche, que trae ese
mismo fondo, se funde con él en lugar de quedar en un recuadro. El foco morado
mide 4.89:1 encima, y la píldora «Próximo evento» (blanco al 10 %) deja su texto
`tinta-100` en 11.7:1.

### Escala neutra

De `tinta-50` a `tinta-900`, derivada del Grey 850 oficial.

| Token | Hex | Uso típico |
| --- | --- | --- |
| `tinta-50` | `#f6f7f9` | Fondo de secciones alternas |
| `tinta-100` | `#eceef2` | Fondos de etiquetas, placeholder de imagen |
| `tinta-200` | `#d8dce4` | Bordes |
| `tinta-300` | `#b4bcca` | Bordes de botones secundarios |
| `tinta-400` | `#7d8798` | Texto terciario |
| `tinta-500` | `#556072` | Texto secundario, etiquetas mono |
| `tinta-600` | `#3d4756` | Texto de párrafo |
| `tinta-700` | `#2a3340` | Texto enfatizado |
| `tinta-800` | `#1e2630` | |
| `tinta-900` | `#161d26` | Títulos y texto principal |

Combinaciones verificadas sobre blanco: `tinta-600` da 8.6:1 y `tinta-900`
da 14.8:1. Ambas superan AA con holgura.

## Fondos de marca

Cuatro utilidades en `global.css`, declaradas con `@utility` para que acepten
variantes de Tailwind. Son degradados de CSS: sin imágenes, sin `filter: blur`
y sin JavaScript.

| Utilidad | Dónde | Qué pinta |
| --- | --- | --- |
| `fondo-noche` | Hero de la portada | `morado-950` → `morado-900` → `morado-950`, con halos morado (arriba a la derecha), celeste (abajo a la izquierda) y amber (abajo) |
| `fondo-aurora` | «Del catálogo» y «Trayectoria» | `morado-50` con halos morado, celeste y amber |
| `fondo-aurora-superior` | Cabecera de catálogo, eventos, fichas y 404 | Lo mismo, confinado a los primeros 26 rem y fundido con el blanco |
| `linea-marca` | Bajo la barra, sobre el pie, halo de «Quiénes somos» | Amber → morado → celeste, con el morado ocupando el centro |

`linea-marca` declara el degradado dos veces: la segunda interpola en OKLCH, que
pasa de amber a morado por el magenta y de morado a celeste por el índigo, sin
grises. Un navegador que no entienda `in oklch` se queda con la primera.

### Contraste en el peor punto

Cada halo es más intenso en su centro. La tabla mide el texto que puede caer
encima contra ese punto, el más desfavorable, no contra el fondo promedio:

| Halo | Alfa | Color en el centro | Texto más débil encima |
| --- | --- | --- | --- |
| Morado de `fondo-noche` sobre `morado-900` | 40 % | `#5d3098` | `tinta-300` 4.69:1 · `tinta-200` 6.5:1 · blanco 9:1 |
| Celeste de `fondo-noche` | 26 % | `#2f3c80` | `tinta-300` 5.28:1 |
| Amber de `fondo-noche` | 16 % | `#392026` | `tinta-300` 7.8:1 |
| Morado de `fondo-aurora` | 20 % | `#ead7ff` | `tinta-500` 4.74:1 · `tinta-600` 7:1 |
| Celeste de `fondo-aurora` | 16 % | `#dcebff` | `tinta-500` 5.26:1 |
| Amber de `fondo-aurora` | 12 % | `#faebe0` | `tinta-500` 5.46:1 |
| Morado de `fondo-aurora-superior` | 22 % | `#e8d4ff` | `tinta-500` 4.63:1 |

**Subir un alfa puede bajar a alguno de estos por debajo de 4.5:1.** El morado
de `fondo-noche` estuvo en 45 % y dejaba el `tinta-300` en 4.35:1; por eso
quedó en 40 %. El pie no lleva halos por la misma razón: su texto pequeño va en
`tinta-400`, que solo pasa sobre `morado-950` liso.

## Tipografía

Amazon Ember, del kit oficial. Los `.ttf` se sirven desde `public/fonts/` — no
hay llamadas a Google Fonts ni a ningún CDN.

| Familia | Token | Peso | Uso |
| --- | --- | --- | --- |
| Amazon Ember | `font-sans` | 400 / 700 | Cuerpo de texto |
| Amazon Ember Display | `font-display` | 700 | Títulos |
| Amazon Ember Mono | `font-mono` | 700 | Etiquetas en versalitas |

Todas se declaran con `font-display: swap` para que el texto sea legible
mientras la fuente carga.

### El patrón de etiqueta

Se repite en todo el sitio como antetítulo de sección:

```html
<p class="font-mono text-xs uppercase tracking-widest text-tinta-500">Trayectoria</p>
<h2 class="mt-3 font-display text-3xl font-bold text-tinta-900">Nuestros hitos</h2>
```

## Categorías del catálogo

Diecinueve categorías en `src/lib/categorias.ts`, cada una con un color
asignado. Los colores se repiten entre categorías a propósito: son cinco colores
y diecinueve categorías, y el color acompaña a la etiqueta de texto, nunca la
reemplaza.

Las once primeras cubren el núcleo del catálogo; las ocho añadidas al publicar
el catálogo completo —front-end web y móvil, internet de las cosas, medios,
migración, aplicaciones de negocio, gestión financiera, cómputo de usuario final
y tecnologías emergentes— siguen la misma rotación de los cinco acentos de marca,
sin ampliar la paleta.

```ts
{ slug: 'computo', etiqueta: 'Cómputo', color: '#FF9900' }
```

Niveles: `fundamental`, `intermedio`, `avanzado`.

## Utilidades propias

### `.punto-categoria`

Punto de 8 px que marca la categoría. El color va por `style` en línea porque
viene del dato, no de una clase.

### Foco visible

```css
:focus-visible {
  outline: 2px solid var(--color-marca-purple);
  outline-offset: 2px;
}
```

Global y en el morado de marca, para que sea consistente y visible en fondos
claros y oscuros: 3.65:1 sobre blanco, 4.65:1 sobre `marca-grey` y 5.21:1 sobre
`morado-950`, todos por encima del 3:1 que WCAG pide a los indicadores de foco. El amber anterior se
quedaba en 2.14:1 sobre blanco.

### Enlaces sobre fondo oscuro

En el pie, sobre `morado-950`, el enlace en reposo va en `tinta-300`. Al pasar el
cursor, el texto sube a `tinta-50` y el morado aparece como subrayado:

```html
<a class="transition underline decoration-transparent decoration-2 underline-offset-4
          hover:text-tinta-50 hover:decoration-marca-purple">Eventos</a>
```

El subrayado existe siempre, pero transparente, para que `transition` funda su
color en lugar de hacerlo aparecer de golpe. El contraste sube de 9.95:1 en
reposo a 17.7:1 en hover. Con el texto en amber, como estaba antes, *bajaba*.

La barra superior usa el mismo patrón sobre blanco: el enlace pasa de
`tinta-600` a `tinta-900` y aparece el subrayado morado. En la página actual el
subrayado se queda fijo, junto con la negrita.

### Reveals al hacer scroll

```css
[data-reveal]                          { transition: opacity 350ms, transform 350ms }
.reveal-activo [data-reveal]           { opacity: 0; transform: translateY(12px) }
.reveal-activo [data-reveal].es-visible{ opacity: 1; transform: none }
```

La clase `.reveal-activo` la pone JavaScript en `<html>`. Esto importa: **sin
JavaScript nunca se aplica `opacity: 0`**, así que el contenido siempre es
visible. La animación es una mejora progresiva, no un requisito.

Bajo `prefers-reduced-motion: reduce`, un `@media` anula el `opacity: 0` y
neutraliza todas las transiciones del sitio.

## Espaciado y contenedores

- Ancho máximo de contenido: `max-w-6xl` (72 rem) con `px-6`
- Artículos de texto largo: `max-w-3xl`, para no pasar de ~75 caracteres por línea
- Secciones: `py-16` a `py-20`; alternan fondo blanco y `fondo-aurora`, con un
  borde `morado-100`
- Radios: `rounded-lg` en controles, `rounded-xl` en tarjetas, `rounded-2xl` en el collage
