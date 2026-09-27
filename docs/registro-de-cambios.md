# Registro de cambios

---

## Catálogo completo de servicios de AWS

El catálogo pasó de 6 fichas a **251: todos los servicios que AWS lista hoy en su
directorio de productos**, verificados contra ese directorio y no contra la
memoria de nadie.

### Cómo se decidió el alcance

251 fichas con la profundidad de las seis originales serían unas 26.000 líneas de
prosa; escribirlas de golpe habría significado rellenar plantillas. Se optó por
dos profundidades:

- **40 completas** con diagrama: las 6 anteriores más 34 nuevas, elegidas por su
  peso en Cloud Practitioner, Solutions Architect Associate y Developer Associate.
- **211 breves**: campos obligatorios, `cuandoAplicarlo`, enlaces oficiales y una
  descripción de dos o tres párrafos. Se amplían una a una cuando haga falta.

### Categorías

`src/lib/categorias.ts` pasó de 11 a 19 categorías. Las 8 nuevas —front-end web y
móvil, internet de las cosas, medios, migración, aplicaciones de negocio, gestión
financiera, cómputo de usuario final y tecnologías emergentes— cubren los 71
servicios que no encajaban en ninguna de las anteriores sin forzarlos. **No se
amplió la paleta:** siguen siendo los cinco acentos de marca en rotación.

La taxonomía de AWS se respetó salvo en un caso: API Gateway vive en
`integracion-y-mensajeria` y no en front-end, siguiendo lo que ya proponía la
documentación del proyecto.

### Servicios retirados

El directorio de AWS incluye servicios que ya no están disponibles. En vez de
omitirlos —aparecen en material de estudio antiguo— cada uno lleva una línea
**Nota:** con su fecha de fin de soporte y su alternativa vigente, contrastada
con la lista oficial de servicios en apagado. Son 32 fichas, entre ellas Elastic
Transcoder, QLDB, RoboMaker, IoT Analytics, IoT Events, MediaStore, WorkDocs,
Chime, OpsWorks, CodeStar, Nimble Studio, Private 5G y SimSpace Weaver. La nota
también marca los que siguen en pie pero ya no aceptan clientes nuevos, como
Cloud9, CodeCommit y Data Pipeline.

### Lo que no cambió

Ni el diseño, ni los componentes, ni el esquema de la colección, ni las páginas.
Las fichas nuevas usan exactamente el mismo frontmatter y el mismo vocabulario de
secciones que las seis originales. El único archivo de código tocado es
`categorias.ts`, y solo para añadir filas.

### Efecto medido

| | Antes | Ahora |
| --- | --- | --- |
| Fichas | 6 | 251 |
| Páginas indexadas por Pagefind | 11 | 256 |
| JS de la portada | 4.6 KB | 4.6 KB |
| Script del catálogo | 1.0 KB | 1.0 KB |
| Índice embebido del catálogo | pocos KB | 51.4 KB (14.7 KB con gzip) |

El script no creció, pero los datos que embebe sí, y en un orden de magnitud. La
decisión sobre qué hacer con ellos quedó anotada como pendiente en
[estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md).

---

## Rediseño visual y de accesibilidad

Punto de partida: un sitio ya bien construido —tokens de marca, tipografía
oficial, colecciones de contenido con esquema— pero estático, sin fotos en la
portada y con un defecto de navegación en móvil.

### Portada

- **Hero con collage de fotos reales.** Reemplaza el logo estático por tres
  fotos de eventos distintos: una grande con el título superpuesto y dos
  apiladas. Cada una enlaza a su evento.
- **Fila de cifras** (eventos, fichas, fotos) con conteo animado.
- **Halos de marca** en amber y purple detrás del hero, muy difuminados y a baja
  opacidad.
- **Línea de trayectoria** con degradado amber → purple → blue.
- **Reveals al hacer scroll** en pilares, tarjetas, hitos y galería.

### Navegación

- **Menú hamburguesa en móvil.** Antes *Eventos* y *Quiénes somos* no eran
  alcanzables desde el teléfono.
- Enlace **«Saltar al contenido»**.
- `aria-current="page"` en la sección activa.
- `scroll-padding-top` para que los anclajes no queden bajo la barra fija.

### Galería

- **Visor modal accesible** en lugar de abrir la foto cruda en otra pestaña:
  flechas, `Escape`, foco atrapado y devuelto, clic en el fondo, contador en vivo
  y precarga de las fotos vecinas.

### Catálogo

- `aria-pressed` en los filtros y `aria-live` en el contador de resultados.
- Altura mínima de 40 px en los botones de filtro.

### Tarjetas de servicio

- Elevación de 3 px y halo del color de la categoría al pasar el cursor,
  con `color-mix()`. Sin `transform` bajo `prefers-reduced-motion`.

### Transversal

- `:focus-visible` global en amber.
- Meta tags Open Graph.
- Toda animación respeta `prefers-reduced-motion`.

### Dos errores encontrados al medir

Ninguno era visible a simple vista:

1. **El contador podía mostrar un dato falso.** `requestAnimationFrame` se
   congela en pestañas de fondo; la cifra se quedaba en `0`. Resuelto con un
   `setTimeout` de respaldo — ver [D-06](decisiones.md#d-06).
2. **El visor desperdiciaba la mitad del ancho en móvil.** 247 px de foto en una
   pantalla de 375 px. Resuelto flotando las flechas — ver
   [D-07](decisiones.md#d-07).

### Coste

1.6 KB de JavaScript en la portada, 1.0 KB en las páginas de evento. Sin
archivos `.js` externos y sin dependencias nuevas.

---

## Fondo de partículas en el hero

Se evaluó `particle-drift`, un componente React de terceros, y se optó por
portar el efecto en lugar de instalarlo — ver [D-10](decisiones.md#d-10).

- Nuevo componente [`FondoParticulas.astro`](../src/components/FondoParticulas.astro):
  nodos a la deriva, líneas de proximidad, haces ascendentes y reacción al puntero.
- Colocado detrás del hero de la portada, sobre los halos de gradiente.
- Densidad según el área: ~62 nodos en escritorio, ~30 en móvil.
- Se pausa fuera de pantalla y con la pestaña oculta.
- Con `prefers-reduced-motion` dibuja un fotograma y se detiene.
- Contraste del titular sobre el peor píxel del canvas: **8.13:1**, medido.

**Coste:** 3.0 KB. La portada pasó de 1.6 KB a 4.6 KB de JavaScript, sin
dependencias ni orígenes de terceros.

---

## Diagramas de arquitectura

- Nuevo componente [`DiagramaAWS.astro`](../src/components/DiagramaAWS.astro):
  recibe nodos y flujos, calcula las columnas solo y emite SVG en el build.
- Aplicado a **las seis fichas publicadas**, todas en su sección «Ejemplo
  visual», que hasta entonces describían un flujo en prosa sin ningún visual.

| Ficha | Diagrama | Forma |
| --- | --- | --- |
| Lambda | Redimensionar imágenes al subirlas | Lineal, 4 nodos |
| S3 | Cómo se publica este sitio | Lineal, 4 nodos |
| DynamoDB | Registro de asistencia a un evento | Lineal, 4 nodos |
| EC2 | Instancias detrás de un balanceador | Abanico a 3 instancias |
| CloudFront | La capa de entrega de este sitio | Rama: Route 53 fuera del camino |
| IAM | Despliegue sin claves guardadas | Abanico a 2 recursos |

- Los nodos toman el color de su categoría, el mismo del catálogo.
- Pie de figura obligatorio: es la alternativa textual **y** lo único que entra
  al buscador — ver [D-12](decisiones.md#d-12).

**Coste:** 0 KB de JavaScript. El SVG se genera en el build.

Tres problemas encontrados al montar los seis, todos midiendo y no mirando:

1. Dos etiquetas se salían del hueco entre columnas y pisaban las cajas. Ahora
   el componente **avisa en el build** cuando una etiqueta pasa de 12 caracteres
   — ver [D-13](decisiones.md#d-13).
2. `{/* comentario */}` dentro de una expresión de Astro rompe la compilación
   — ver [D-14](decisiones.md#d-14).
3. El diagrama de Lambda llamaba «Usuario» a quien el pie llamaba «visitante».
   Unificado como «Visitante» en los tres diagramas que tienen actor humano.

### Corrección sobre el fondo de partículas

El efecto no se veía. La máscara horizontal lo concentraba detrás del collage de
fotos, que es opaco, y lo dejaba al 14 % de alfa en la zona visible. Se quitó el
degradado horizontal y se subió el alfa a 0.44, el máximo con el que el titular
sigue en 7.35:1 (AAA). Ver [D-11](decisiones.md#d-11).

---

## Documentación

Se creó `docs/` con seis documentos: arquitectura, sistema de diseño,
componentes, accesibilidad y rendimiento, decisiones y este registro. `CLAUDE.md`
apunta a ellos.

---

## Infraestructura

- Se añadió `.claude/launch.json` para levantar el servidor de desarrollo.
- Se configuró el MCP de 21st.dev en `.mcp.json`, con la variante HTTP alojada
  en lugar del paquete `npx` — ver [D-08](decisiones.md#d-08).
- `.mcp.json` entró al `.gitignore` porque contiene la API key en texto plano.

---

## Infraestructura AWS: arquitectura decidida

Sesión de diseño, **sin ejecución en la consola**: al cerrarla no existe ningún
recurso en AWS y el sitio sigue sin estar en línea. Lo que quedó resuelto es
*qué* desplegar, *en qué orden* y *por qué*.

### Arquitectura elegida

Cinco servicios en el núcleo —S3, CloudFront, ACM, Route 53, IAM— todos en
`us-east-1`, con el bucket **privado** y CloudFront como única puerta de entrada
vía OAC. Detallada en [arquitectura.md](arquitectura.md#despliegue).

Se descartaron tres alternativas y conviene que quede escrito:

| Descartado | Por qué |
| --- | --- |
| Bucket público con «Static website hosting» | Deja los archivos accesibles saltándose CloudFront: sin HTTPS forzado ni caché — ver [D-15](decisiones.md#d-15) |
| Lambda@Edge para las rutas limpias | Sobredimensionado para reescribir una cadena; una CloudFront Function cuesta una fracción — ver [D-16](decisiones.md#d-16) |
| AWS Amplify Hosting | Más simple, pero opaco: para un club de AWS, montar S3 + CloudFront a mano *es* parte del valor |
| WAF | ~$5/mes de base sin una amenaza que lo justifique |

### Tres hallazgos que cambiaron el plan

1. **Los créditos de AWS no pagan dominios.** El registro y la renovación en
   Route 53 están explícitamente excluidos de los programas de créditos. Por eso
   el despliegue arranca contra el dominio de CloudFront y el dominio propio
   llega después — ver [D-18](decisiones.md#d-18). Alternativas gratuitas
   evaluadas: GitHub Student Pack y subdominio de la Universidad.
2. **Un presupuesto que incluye los créditos no avisa nunca.** Marca $0.00 todos
   los meses hasta que los créditos se agotan — ver [D-17](decisiones.md#d-17).
3. **Las clases de precio 100 y 200 de CloudFront excluyen Sudamérica.**
   Restringirlas «para ahorrar» empeora la latencia del público de Cuenca sin
   bajar una factura que ya es cero — ver [D-19](decisiones.md#d-19).

### Lo que el despliegue destapó en el código

Revisando el repositorio para preparar el despliegue aparecieron tres huecos que
no se notan en local y sí en producción:

- `astro.config.mjs` **no define `site`**: sin él no hay URLs absolutas ni
  sitemap correcto.
- **No existe `src/pages/404.astro`**: una URL equivocada mostraría el XML de
  error de S3.
- `Layout.astro` define `og:title`, `og:description` y `twitter:card` pero
  **no `og:image`**: los enlaces se comparten sin previsualización, justo por
  donde se difunden los eventos.

### Entregable

Un runbook de consola con las rutas de clics exactas, los avisos de cada fallo
silencioso y la tabla de costos:
<https://claude.ai/code/artifact/28e62119-bc1f-4f6c-9cb3-03a6590ab896>

---

## Pendiente

- **Desplegar el sitio.** La infraestructura está diseñada y documentada, pero
  no ejecutada: el sitio no está en línea. Es hoy la prioridad más alta —
  ver [estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md#1-desplegar-el-sitio-en-aws).
- **Contenido de los eventos.** Los cinco `.mdx` de `src/content/eventos/` tienen
  `[Placeholder]` como cuerpo. El diseño ya está listo para recibir el texto.
- **Catálogo de servicios.** Cobertura completa con 251 fichas; lo que falta es
  profundidad: 211 son breves y esperan su frontmatter completo y su diagrama.
- **Iniciar git.** El proyecto todavía no es un repositorio, así que no hay
  historial ni forma de automatizar el despliegue.
