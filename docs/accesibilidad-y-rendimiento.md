# Accesibilidad y rendimiento

## Accesibilidad

### Contraste

El color de marca nunca es color de texto. La razón está en
[sistema-de-diseno.md](sistema-de-diseno.md#la-regla-del-color): los cinco
colores vibrantes no llegan a 4.5:1 sobre blanco.

| Combinación | Ratio | Nivel |
| --- | --- | --- |
| `tinta-900` sobre blanco | 14.8:1 | AAA |
| `tinta-600` sobre blanco | 8.6:1 | AAA |
| `tinta-500` sobre blanco | 6.3:1 | AA |
| Blanco sobre `marca-grey` | 15.2:1 | AAA |
| Blanco sobre `morado-950` (hero, pie) | 19:1 | AAA |
| `tinta-300` sobre `morado-950` | 9.95:1 | AAA |
| Blanco sobre `afiche` (cartel del próximo evento) | 17.9:1 | AAA |
| `tinta-300` sobre `afiche` | 9.35:1 | AAA |
| `tinta-400` sobre `morado-950` (texto pequeño del pie) | 5.24:1 | AA |
| Blanco sobre `morado-700` (botón principal, filtro activo) | 7.6:1 | AAA |
| `tinta-500` sobre `morado-50` (etiquetas en secciones lavanda) | 5.95:1 | AA |

Sobre los halos de los fondos de marca, el peor punto de cada uno está medido
en [sistema-de-diseno.md](sistema-de-diseno.md#contraste-en-el-peor-punto).
Ningún texto baja de 4.5:1.

### Teclado

- Enlace **«Saltar al contenido»** como primer elemento enfocable
- `:focus-visible` global en `marca-purple` de 2 px con `outline-offset` (3.65:1 sobre blanco)
- El visor de fotos atrapa el foco mientras está abierto y lo devuelve al cerrar
- El menú móvil se cierra con `Escape` y devuelve el foco al botón
- Nada depende de hover para ser accesible

### Objetivos táctiles

Mínimo 44×44 px, según WCAG 2.5.5.

| Control | Tamaño |
| --- | --- |
| Botón del menú móvil | 44 × 44 |
| Enlaces del menú móvil | alto 44 |
| Cerrar el visor | 44 × 44 |
| Flechas del visor | 48 × 48 |
| Botones de filtro | alto mínimo 40 |

### Semántica

- Jerarquía de encabezados sin saltos: un solo `<h1>` por página
- `aria-current="page"` en el enlace de la sección actual
- `aria-pressed` en los filtros, que son botones de alternancia
- `aria-live="polite"` en el contador de resultados y en el del visor
- `role="dialog"` con `aria-modal="true"` en el visor
- Los elementos decorativos llevan `aria-hidden="true"` o `alt=""`

### Movimiento

Toda animación respeta `prefers-reduced-motion: reduce`:

| Elemento | Con la preferencia activa |
| --- | --- |
| Reveals al hacer scroll | Aparecen sin animación |
| Contadores del hero | Muestran el valor final de inmediato |
| Elevación de tarjetas | Sin `transform` |
| `scroll-behavior` | Vuelve a `auto` |

Además hay una regla general que reduce cualquier transición a 0.01 ms.

### Sin JavaScript

El sitio es legible y navegable con JavaScript desactivado. Lo que se pierde es
opcional: los reveals no se disparan (y el contenido queda visible, porque
`opacity: 0` solo se aplica cuando el script arranca), los contadores muestran
el número real, y la galería abre las fotos con el enlace de siempre.

---

## Rendimiento

### Presupuesto de JavaScript

Medido sobre `dist/` después de `pnpm build`:

| Página | JS en línea | HTML |
| --- | --- | --- |
| Portada | 4.6 KB | 47.7 KB |
| Página de evento | 1.0 KB | 43.3 KB |
| Página de un próximo evento (`/student-community-day/`) | 1.0 KB | 30.1 KB |
| Ficha de servicio | 1.0 KB | 24.3 KB |
| **Catálogo de servicios** | **52.4 KB** | **503.5 KB** |

De los 4.6 KB de la portada, 3.0 KB son el campo de partículas del hero. El
cartel del próximo evento no suma JavaScript, solo HTML: 8.4 KB de los 47.7 KB de
la portada. El resto del aumento desde los 38.7 KB del 2026-09-30 vino de los
eventos que se agregaron después.

### El catálogo es la excepción, y hay que mirarla de frente

De los 52.4 KB del catálogo, **solo 1.0 KB es código**: el resto son los 51.4 KB
del índice de búsqueda que la página incrusta con `define:vars`. Con 6 fichas
eran unos pocos KB; con las 251 del catálogo completo, esto.

Con gzip la cosa se modera —14.7 KB el índice, 42.5 KB la página entera— pero
sigue siendo un orden de magnitud por encima del resto del sitio, que es
justamente el umbral que la tercera regla del proyecto manda discutir.

El índice duplica texto que ya está en el DOM de cada tarjeta: nombre, nombre
completo, resumen y categoría. Construirlo en el cliente a partir de las propias
tarjetas eliminaría los 51.4 KB sin cambiar el comportamiento. **Está sin
hacer**, y es la decisión pendiente número 4 de
[estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md).

**Cero archivos `.js` externos y cero orígenes de terceros.** Los scripts son lo
bastante pequeños como para que Astro los incruste, así que no hay peticiones
adicionales.

Como referencia: el componente React equivalente que se evaluó rondaba los
200 KB comprimidos entre React y cuatro CDNs — unas 43 veces más. Ver
[D-10](decisiones.md#d-10).

### Imágenes

- Todas en WebP, generadas en el build
- Dos tamaños: 1600 px para el visor, 600 px para miniaturas
- `<Image>` de Astro genera `srcset` y `sizes` automáticamente
- `loading="lazy"` salvo en el collage del hero y las primeras 8 de cada galería
- El material original (HEIC, MOV) nunca llega al repositorio ni al build

### Fuentes

Amazon Ember se sirve desde el propio dominio con `font-display: swap`. No hay
peticiones a CDN externos, lo que evita una conexión extra y el riesgo de que un
tercero registre a los visitantes.

### Caché

Las cabeceras viven en `customHttp.yml` ([D-25](decisiones.md#d-25)):

| Qué | `Cache-Control` | Por qué |
| --- | --- | --- |
| `/_astro/*` (CSS, imágenes) | `public, max-age=31536000, immutable` | El nombre lleva un hash: una versión nueva tiene otra URL |
| HTML, fuentes, Pagefind | `max-age=0` (lo que pone Amplify) | No llevan hash; el navegador revalida y cada push se ve al momento |

Cada publicación de Amplify vacía la caché de su CDN, así que no hay que
invalidar nada a mano.

### Búsqueda

Dos mecanismos distintos:

- **Catálogo de servicios:** índice JSON incrustado, filtra en memoria sin red.
  Es rapidísimo y no hace ni una petición, pero se paga entero en la carga
  inicial: ver el presupuesto de arriba
- **Sitio completo:** Pagefind genera un índice fragmentado en el build, pensado
  para descargarse por partes solo cuando alguien busca. **Todavía ninguna página
  lo carga:** el índice existe, pero falta el buscador que lo use

### Cómo medir

```bash
pnpm build
```

Para revisar el peso del JavaScript en línea de una página:

```bash
python -c "import re; h=open('dist/index.html',encoding='utf-8').read(); print(sum(len(m) for m in re.findall(r'<script type=\"module\">(.*?)</script>',h,re.S))/1024, 'KB')"
```

**Ese comando miente en el catálogo.** Solo cuenta los `<script type="module">`,
y los datos que Astro incrusta con `define:vars` van en un `<script>` sin ese
atributo: por eso la página del catálogo «mide» 1.0 KB cuando en realidad lleva
52.4 KB. Para contarlo todo:

```bash
python -c "import re; h=open('dist/servicios/index.html',encoding='utf-8').read(); print(sum(len(s.encode()) for s in re.findall(r'<script[^>]*>(.*?)</script>',h,re.S))/1024, 'KB')"
```
