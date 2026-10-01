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

### Colores de marca

| Token | Hex | Dónde se usa |
| --- | --- | --- |
| `marca-purple` | `#ad5cff` | **Color principal** ([D-27](decisiones.md#d-27)). Foco, hito de fundación, halo del hero, partículas del hero, subrayado de los enlaces del pie, íconos del kit, categorías |
| `marca-amber` | `#ff9900` | Categorías y recuadro de costo del catálogo (advertencia) |
| `marca-blue` | `#42b4ff` | Categorías, segundo halo del hero, fin del degradado de trayectoria |
| `marca-mint` | `#00e582` | Categorías |
| `marca-magenta` | `#ff57e9` | Categorías |
| `marca-grey` | `#161d26` | Fondos oscuros: footer, botones, visor de fotos |

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
claros y oscuros: 3.65:1 sobre blanco y 4.65:1 sobre `marca-grey`, ambos por
encima del 3:1 que WCAG pide a los indicadores de foco. El amber anterior se
quedaba en 2.14:1 sobre blanco.

### Enlaces sobre fondo oscuro

En el pie, sobre `marca-grey`, el enlace en reposo va en `tinta-300`. Al pasar el
cursor, el texto sube a `tinta-50` y el morado aparece como subrayado:

```html
<a class="transition underline decoration-transparent decoration-2 underline-offset-4
          hover:text-tinta-50 hover:decoration-marca-purple">Eventos</a>
```

El subrayado existe siempre, pero transparente, para que `transition` funda su
color en lugar de hacerlo aparecer de golpe. El contraste sube de 8.9:1 en reposo
a 15.8:1 en hover. Con el texto en amber, como estaba antes, *bajaba* a 7.9:1.

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
- Secciones: `py-16` a `py-20`; alternan fondo blanco y `bg-tinta-50`
- Radios: `rounded-lg` en controles, `rounded-xl` en tarjetas, `rounded-2xl` en el collage
