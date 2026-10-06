# Componentes

Todos son `.astro`. Ninguno necesita un framework en el cliente; los que llevan
comportamiento usan un `<script>` de JavaScript plano que Astro incrusta en la
página.

---

## `Layout.astro`

Envoltura de todas las páginas.

```astro
<Layout title="Eventos" description="...">
  <!-- contenido -->
</Layout>
```

| Prop | Tipo | Notas |
| --- | --- | --- |
| `title` | string | Se muestra como `{title} · AWS SBG UCuenca` |
| `description` | string? | Por defecto, la descripción del club |

Aporta:

- Meta tags de SEO y Open Graph
- Enlace **«Saltar al contenido»** que apunta a `<main id="contenido">`
- Nav y Footer
- El **script de reveals**: activa `.reveal-activo` y observa los `[data-reveal]`
  con un `IntersectionObserver`. No hace nada si el usuario pidió menos movimiento.

Para que un bloque nuevo entre con animación basta con marcarlo:

```astro
<div data-reveal>…</div>
```

---

## `Nav.astro`

Barra fija superior.

- Desde 768 px (`md`), lista de enlaces horizontal
- En móvil, **menú hamburguesa** con botón de 44×44 px
- Mientras hay un evento de `proximos` vigente, su página va entre «Inicio» y
  «Servicios AWS», con el `nombreCorto` del evento, y **«Quiénes somos» sale de
  la barra** para dejarle sitio. Las dos cosas se deshacen solas en el primer
  build después del evento, como el cartel de la portada ([D-31](decisiones.md#d-31))
- Marca la página actual con `aria-current="page"`, negrita y subrayado morado
- Una `linea-marca` de 2 px reemplaza al borde gris inferior: es lo que lleva el
  morado a todas las páginas
- El menú se cierra con `Escape` (y devuelve el foco al botón) o al tocar un enlace
- `aria-expanded` se mantiene sincronizado con el estado real

La detección de página activa es exacta en `/` y por prefijo en el resto, para
que `/eventos/flisol-2026/` también marque «Eventos». El prefijo lleva la barra
final (`/eventos/`), como todos los enlaces internos. «Quiénes somos»
(`/#nosotros`) es una sección de la portada y no se marca nunca.

**Por qué sale «Quiénes somos» durante el evento.** Con cinco enlaces la barra
necesita unos 830 px para ir en una línea, y entre 768 y 830 se partía en dos
renglones. Con cuatro, a 768 px sobran unos 40, contando la negrita del enlace
activo. La sección no queda escondida: la enlazan «Conocer al grupo», en el hero,
y el pie de todas las páginas. Por eso `nombreCorto` tiene un tope de 25
caracteres en el esquema: uno más largo volvería a partir la barra sin que el
build avise.

---

## `Footer.astro`

Pie sobre `morado-950`, con una `linea-marca` en el borde superior. Sin halos:
su texto pequeño va en `tinta-400`, que necesita el fondo liso para pasar AA.
Tres columnas: descripción del club, mapa del sitio y
redes (LinkedIn e Instagram, con SVG en línea, sin librería de iconos). Debajo,
el año, el nombre del club y «Construido con Astro y desplegado en AWS Amplify».

Al pasar el cursor, el texto de los enlaces se aclara y el morado aparece como
subrayado, nunca como color del texto. En los enlaces con icono, el subrayado va
solo bajo el texto. Ver [Enlaces sobre fondo oscuro](sistema-de-diseno.md#enlaces-sobre-fondo-oscuro).

---

## `GaleriaEvento.astro`

Rejilla de miniaturas más un **visor modal accesible**.

```astro
<GaleriaEvento fotos={fotos} titulo={evento.data.titulo} />
```

| Prop | Tipo |
| --- | --- |
| `fotos` | `FotoEvento[]` — de `fotosDeEvento(carpeta)` |
| `titulo` | string — para los textos alternativos |

### Cómo funciona

Cada miniatura es un `<a href>` que apunta a la imagen de 1600 px. **Sin
JavaScript ese enlace funciona igual** y abre la foto directamente. Con
JavaScript, el clic se intercepta y abre el visor.

Al DOM solo llegan las miniaturas de 600 px. Las versiones grandes viajan como
un array de datos y se cargan bajo demanda, precargando la anterior y la
siguiente para que las flechas se sientan instantáneas.

### Comportamiento del visor

| Interacción | Resultado |
| --- | --- |
| Clic en miniatura | Abre en esa foto, foco al botón cerrar, bloquea el scroll |
| `←` / `→` | Navega; da la vuelta al llegar a los extremos |
| `Escape` | Cierra y **devuelve el foco a la miniatura de origen** |
| `Tab` / `Shift+Tab` | Queda atrapado dentro del diálogo |
| Clic en el fondo | Cierra |

Es un `role="dialog"` con `aria-modal="true"`, y el contador (`3 / 28`) es
`aria-live="polite"`.

En móvil las flechas flotan **sobre** la foto con su propio fondo translúcido,
en vez de robarle ancho con padding. En una pantalla de 375 px eso da 351 px
útiles en lugar de 247 px.

---

## `TarjetaServicio.astro`

Tarjeta de una ficha del catálogo.

```astro
<TarjetaServicio servicio={servicio} />
```

El color de la categoría entra como variable CSS en línea:

```astro
style={`--color-cat: ${color}`}
```

Eso permite usarlo en la barra superior, el punto, el borde al pasar el cursor y
un halo difuminado, sin generar una clase por categoría. Al hacer hover la
tarjeta se eleva 3 px y proyecta una sombra teñida con `color-mix()`. El
`transform` se anula bajo `prefers-reduced-motion`.

Los atributos `data-id`, `data-categoria` y `data-nivel` son los que lee el
filtro del catálogo. El buscador usa `data-id` para cruzar cada tarjeta con el
índice; antes lo sacaba del `href`, y eso lo ataba al formato de la URL.

---

## `FondoParticulas.astro`

Campo de partículas animado para usar como fondo de una sección.

```astro
<section class="relative overflow-hidden">
  <FondoParticulas />
  <div class="relative">…contenido…</div>
</section>
```

La sección contenedora **necesita `relative` y `overflow-hidden`**, y el
contenido debe ir en un elemento posicionado para quedar por encima.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `class` | string? | Clases extra para el `<canvas>` |
| `tono` | `'claro'` \| `'oscuro'` | Por defecto `'claro'`. Con `'oscuro'` los nodos pasan de `tinta-500` a `tinta-400`, para fondos como `fondo-noche` |

### Qué dibuja

Nodos con glifos monoespaciados que caen lentamente, líneas entre los que están
a menos de 110 px, haces ascendentes en el morado de marca, y conexiones al puntero cuando
se acerca a menos de 150 px.

Los colores se leen de dos variables del propio lienzo, `--particula-acento` y
`--particula-neutro`, que apuntan a los tokens (`--color-marca-purple` y
`--color-tinta-500` o `--color-tinta-400` según el tono). Siguen a la marca sin
duplicar valores, y un tono nuevo se define en CSS sin tocar el script.

### Decisiones que lo hacen barato y accesible

- **Densidad por área:** un nodo cada ~14.000 px², entre 14 y 70. En escritorio
  salen ~62; en un móvil de 375 px, ~30.
- **Se detiene cuando nadie lo mira.** Un `IntersectionObserver` lo pausa al
  salir de pantalla y `visibilitychange` lo pausa con la pestaña en segundo
  plano. Un fondo decorativo no debería gastar batería a ciegas.
- **`prefers-reduced-motion`:** dibuja un solo fotograma y se queda quieto. El
  efecto se ve, pero no se mueve.
- **Sin interacción en táctil:** la conexión al puntero solo se activa con
  `(pointer: fine)`.
- **Máscara CSS** que desvanece el campo donde vive el texto: horizontal en
  escritorio, vertical en móvil, siguiendo el cambio de layout.
- **DPR limitado a 2** para no inflar el búfer en pantallas muy densas.

### Contraste

El píxel más oscuro que llega a pintar es `rgb(174, 180, 189)`. Un titular en
`tinta-900` sobre ese peor caso mide **8.13:1**, por encima del 7:1 de AAA.
Medido sobre el canvas real, no estimado.

Con `tono="oscuro"` el riesgo se invierte: un glifo aclara el fondo. Sobre
`morado-950`, un glifo en `tinta-400` al 44 % deja el titular blanco en 9.5:1 y
las etiquetas en `tinta-300` en 5:1.

---

## `DiagramaAWS.astro`

Diagrama de arquitectura declarativo. Recibe nodos y flujos, calcula el layout y
emite SVG **en tiempo de build**: cero JavaScript en el cliente.

```astro
<DiagramaAWS
  titulo="Redimensionar imágenes al subirlas"
  descripcion="Un visitante sube una foto a un bucket de S3. Ese objeto nuevo
    dispara una función Lambda, que redimensiona la imagen y guarda la versión
    optimizada en un segundo bucket."
  nodos={[
    { id: 'usuario', etiqueta: 'Usuario', tipo: 'externo' },
    { id: 'origen',  etiqueta: 'Amazon S3',  sub: 'bucket de fotos', categoria: 'almacenamiento' },
    { id: 'lambda',  etiqueta: 'AWS Lambda', sub: 'redimensiona',    categoria: 'computo' },
    { id: 'destino', etiqueta: 'Amazon S3',  sub: 'bucket optimizado', categoria: 'almacenamiento' },
  ]}
  flujos={[
    { de: 'usuario', a: 'origen',  etiqueta: 'sube foto' },
    { de: 'origen',  a: 'lambda',  etiqueta: 'ObjectCreated' },
    { de: 'lambda',  a: 'destino', etiqueta: 'guarda' },
  ]}
/>
```

Para usarlo dentro de un `.mdx` hay que importarlo después del frontmatter:

```mdx
import DiagramaAWS from '../../../components/DiagramaAWS.astro';
```

### Props

| Prop | Tipo | Notas |
| --- | --- | --- |
| `titulo` | string | Nombre accesible de la imagen (`<title>` del SVG) |
| `descripcion` | string | Narración del flujo. Obligatoria — ver más abajo |
| `nodos` | `NodoDiagrama[]` | `id`, `etiqueta`, `sub?`, `categoria?`, `tipo?`, `fila?` |
| `flujos` | `FlujoDiagrama[]` | `de`, `a`, `etiqueta?` |

`tipo: 'externo'` dibuja un actor (usuario, navegador) con borde punteado y en
gris. El resto toma el color de su `categoria`, el mismo del catálogo.

### Layout

Las columnas se calculan solas: cada nodo cae en la longitud del camino más
largo que llega hasta él. `fila` solo hace falta para ordenar ramas paralelas.
Las flechas entre nodos de la misma fila son rectas; entre filas distintas,
curvas suaves.

### Las etiquetas de flujo tienen un máximo de 12 caracteres

El hueco entre columnas mide 88 px y cada carácter ocupa ~6.45 px a 10 px. Una
etiqueta más larga se sale del hueco y pisa las cajas vecinas.

El componente **avisa en el build** cuando se pasa:

```
[DiagramaAWS] "Redimensionar imágenes al subirlas": la etiqueta "ObjectCreated"
tiene 13 caracteres y el máximo que cabe entre columnas es 12.
```

Cuando el término preciso no cabe, va en la `descripcion` —que además es lo
único buscable— y en la flecha queda la versión corta. Por ejemplo, la flecha
dice «objeto nuevo» y la descripción nombra el evento `ObjectCreated`.

### Dos cosas que hay que saber

**1. La `descripcion` es la que se puede buscar, no el diagrama.**
Pagefind **no indexa el texto dentro de un SVG**. Comprobado sobre el índice
generado: `ObjectCreated` y `bucket optimizado`, que solo existen en el dibujo,
no aparecen en el índice; todo lo que está en el `<figcaption>` sí. Por eso la
descripción debe **nombrar todos los servicios que salen en el diagrama**.

**2. La `descripcion` es también la alternativa textual.**
Un diagrama es una imagen vacía para un lector de pantalla. El `<figcaption>`
narra el flujo en prosa y el SVG lo referencia con `aria-describedby`, así que
el `<title>` da el nombre y el pie da el contenido, sin duplicarse.

### Responsive

El ancho mínimo no es un número fijo: se deriva de un **suelo de legibilidad**.
Las etiquetas van a 14 px en el `viewBox` y no se dejan bajar de 11 px, así que
`min-width = ancho × (11 / 14)`.

| Contexto | Ancho útil | Render | Etiqueta | Scroll |
| --- | --- | --- | --- | --- |
| Ficha en escritorio | 686 px | 686 px | 11.7 px | No |
| Móvil de 375 px | 327 px | 644 px | 11.0 px | Sí, interno |

Así el diagrama se encoge lo justo para caber en la columna de una ficha
(`max-w-3xl`) y solo desplaza donde encogerlo más lo volvería ilegible. La
página nunca desplaza en horizontal.

El contenedor lleva `tabindex="0"`: una región con scroll debe poder recorrerse
solo con el teclado.

---

## `ProximoEvento.astro`

El próximo evento que organiza el club, en la portada: va entre el hero y los
pilares mientras no haya terminado ([D-31](decisiones.md#d-31)).

```astro
{proximo && <ProximoEvento evento={proximo} />}
```

`proximo` sale de `proximoEvento()` en `src/lib/proximos.ts`: el evento de la
colección `proximos` cuyo `fin` es posterior al build y que empieza antes. Si no
hay ninguno, la portada queda como antes.

Es una tarjeta `bg-afiche` con la composición del afiche: el texto de
`CartelEvento` a la izquierda y la foto a la derecha, que se funde con el fondo
con una máscara CSS (desde arriba en móvil, desde la izquierda en escritorio).
La foto lleva `alt=""`: todo lo que dice el afiche está en el texto. Debajo de la
tarjeta, sobre blanco, los logos de los patrocinadores, sin título: el club lo
pidió así. La lista lleva `aria-label="Patrocinadores"`, para que un lector de
pantalla no lea tres logos sueltos. Sin JavaScript.

En móvil la sección usa `px-4` en vez de `px-6`, y el texto `px-5`: con los 24 px
habituales, «Community Day» no cabía en una línea a 375 px.

---

## `CartelEvento.astro`

El texto del cartel, compartido por la portada y la página del evento.

```astro
<CartelEvento evento={evento} nivel="h2" idTitulo="proximo-evento" conDetalles />
```

| Prop | Tipo | Notas |
| --- | --- | --- |
| `evento` | `Proximo` | Una entrada de la colección `proximos` |
| `nivel` | `'h1'` \| `'h2'` | `h1` en la página del evento, `h2` en la portada |
| `idTitulo` | string | Para el `aria-labelledby` de la sección que lo contiene |
| `conDetalles` | boolean? | Añade «Ver todos los detalles →» hacia la página del evento |

De arriba abajo: el logo de AWS y el del grupo, la píldora «Próximo evento» con
«Somos los anfitriones», el nombre partido como en el afiche (`cartel` en el
frontmatter), el lema, fecha y lugar con sus íconos, el acceso, el botón de
entrada y los enlaces de calendario. El título es un único `h1` o
`h2`: los renglones son `span` con un espacio entre ellos, así que un lector de
pantalla lee «Primer Student Community Day Ecuador».

Va siempre sobre `bg-afiche`. Ningún texto va en color de marca: el morado y el
magenta están en los íconos y en los píxeles (el de la esquina, el escalonado
junto a «Ecuador» y los separadores del lema). Después del evento, la píldora
dice «Ya se realizó» con la fecha, y los botones y el calendario desaparecen.

**Calendario.** «Google» abre Google Calendar con el evento ya lleno (un enlace,
sin API). «Apple u Outlook» descarga `/<evento>.ics`, que genera
`pages/[proximo].ics.ts`.

---

## `Patrocinadores.astro`

Los logos de los patrocinadores, todos a la misma altura y cada uno con su ancho
natural.

```astro
<Patrocinadores patrocinadores={evento.data.patrocinadores} compacto />
```

| Prop | Tipo | Notas |
| --- | --- | --- |
| `patrocinadores` | `{ nombre, logo, sobreBlanco }[]` | Del frontmatter de `proximos` |
| `compacto` | boolean? | Tarjetas de 56 px para la franja de la portada; sin él, 96 px |

Un logo que trae su propio fondo (TicketIn en amarillo, Ambross en azul) ocupa la
tarjeta entera. Uno transparente (`sobreBlanco: true`, el de Deuna) va sobre
blanco, con relleno. El `alt` es el nombre del patrocinador. Las imágenes se
generan al doble de su alto en pantalla, sin pasar del original.

---

## `ImagenPlaceholder.astro`

Marco punteado para huecos de imagen pendientes.

```astro
<ImagenPlaceholder etiqueta="Foto del equipo" class="h-48" />
```

---

## Páginas con lógica

### `pages/servicios/index.astro`

Filtrado en el cliente, sin recargar. Combina buscador de texto, categoría y
nivel. El índice de búsqueda se genera en el build y se incrusta como JSON con
`define:vars`.

**Ese índice ya no pesa «pocos KB».** Con las 251 fichas del catálogo completo
son 51.4 KB sin comprimir (14.7 KB con gzip), y la página entera 503 KB (42.5 KB
con gzip). El script propio sigue en 1.0 KB: lo que creció son los datos. El
índice duplica texto que ya está en el DOM de cada tarjeta —nombre, nombre
completo, resumen y categoría—, así que se podría construir desde las propias
tarjetas y ahorrarlo entero. Decisión pendiente, anotada en
[estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md).

Los 20 botones de categoría (19 más «Todas») ocupan varias líneas en el `flex
wrap`. Es consecuencia directa de tener 19 categorías; si algún día molesta,
hay que agruparlos o colapsarlos.

Los botones de filtro llevan `aria-pressed`, van agrupados en un `role="group"`
con etiqueta, y el contador de resultados es `aria-live="polite"` para que un
lector de pantalla anuncie cuántos servicios quedaron.

### `pages/[proximo].astro` y `pages/[proximo].ics.ts`

Una página y un archivo de calendario por cada entrada de `proximos`, en la raíz:
`student-community-day.mdx` da `/student-community-day/` y
`/student-community-day.ics`. `rutaDeProximo()` arma la misma ruta para los
enlaces.

La página tiene, en orden: el cartel a todo el ancho, con la foto hasta el borde
derecho en escritorio; «El evento», con el cuerpo del `.mdx` y «Qué incluye»;
«Cómo participar», con la entrada y cómo llegar; las comunidades
participantes; «Agenda y ponentes», que por ahora dice «Muy pronto» y lleva a
Instagram y LinkedIn; y al final, los patrocinadores. Su `og:image` es el afiche
completo. Después del evento se quedan el cartel, «El evento», las comunidades y
los patrocinadores.

El `.ics` sigue el RFC 5545: líneas terminadas en CRLF y partidas a 75 bytes
(bytes, no letras: «Más» ocupa 4), con comas y saltos de línea escapados. Las
horas van en UTC (`20261114T140000Z` son las 09h00 en Ecuador).

### `pages/index.astro`

Además del contenido, tiene el **contador animado** de las cifras del hero.
Cuenta de 0 al valor real con una curva `easeOutCubic` cuando la cifra entra en
pantalla.

Detalle importante: el valor real ya está escrito en el HTML, y hay un
`setTimeout` de respaldo que lo restaura. Los navegadores congelan
`requestAnimationFrame` en pestañas de fondo, y una cifra clavada en `0` sería
un dato falso. Ver [decisiones.md](decisiones.md#d-06).
