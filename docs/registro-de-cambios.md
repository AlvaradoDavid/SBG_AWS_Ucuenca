# Registro de cambios

---

## Serverless en AWS

El 2026-10-01. Séptimo evento del sitio: la charla en línea «Despliega como
Senior, paga como estudiante: Serverless en AWS», del 28 de mayo de 2026, con
Hernán Villavicencio S. y 51 participantes. El texto sale de la invitación del
club y del afiche: los tres servicios de la charla, que enlazan a las fichas de
Lambda, API Gateway y DynamoDB, el demo en vivo dentro de la capa gratuita y las
muchas preguntas del público, que contó el club.

- **Sin fotos, con el afiche.** El club no tiene fotos de la charla, solo el
  afiche (`highres_534328035.avif`), que quedó como `foto-01` y portada. Se
  descartó fusionarla con el webinar de infraestructura: el esquema admite una
  sola fecha y una sola cifra de asistentes, y la charla de mayo habría quedado
  dentro de un evento de marzo.
- **`enInicio: false`,** como el webinar, cuya portada también es un afiche. Sin
  él, el afiche habría entrado como segunda imagen del collage del hero.
- **`pnpm fotos` lee AVIF y WebP.** Antes solo HEIC, JPG y PNG, así que el afiche
  se habría ignorado sin avisar. `sharp` ya los decodifica.
- **Singular con una sola foto.** La tarjeta de `/eventos/` decía «Ver las 1
  fotos» y la página del evento «1 fotos»; ahora dicen «Ver la foto» y «1 foto».

**Efecto en la portada.** Ninguno en las fotos: el collage, «Quiénes somos» y la
galería siguen igual. Las cifras del hero pasan a 7 eventos y 169 fotos.

**Verificado** sobre un build desde cero:

- `pnpm build`: 262 páginas, 258 indexadas, sin avisos. `pnpm enlaces` da ✓ con
  433 destinos. El JavaScript de la portada sigue en 4.6 KB.
- **La CSP no bloquea nada.** `dist/` se sirvió con las cabeceras de
  `customHttp.yml`: sin errores en la consola en `/eventos/`, la página del
  evento y la portada, y el afiche responde 200.
- **Visor con una sola foto:** abre en `1 / 1` con la versión de 1600 px, sin
  flechas y con el foco en «Cerrar galería»; `Escape` devuelve el foco a la
  miniatura.
- En móvil (375 px) no hay scroll horizontal en `/eventos/` ni en la página del
  evento.
- Una segunda corrida de `pnpm fotos` no convierte nada en ningún evento.

---

## AWS Community Day Ecuador

El 2026-10-01. Sexto evento del sitio: el AWS Community Day Ecuador, el 5 de
septiembre de 2026 en la Universidad Politécnica Salesiana de Cuenca, con más de
400 asistentes y 11 Student Builder Groups. El texto sale de lo que contó el club
y de lo que se ve en las fotos: su papel en la organización, el juego para
adivinar servicios con su premiación final, y dos de las charlas, que enlazan a
las fichas de Control Tower y CloudFormation. Lleva `hito: true`, así que entra
en la trayectoria.

- **41 fotos** en `src/assets/eventos/2026-09-05-aws-community-day/`, de las 89
  que trajo el club. A pedido suyo se apartaron 48 tomas repetidas: la misma
  foto posada desde otro ángulo o con otro zoom, y las ráfagas de una charla
  tomadas desde el mismo sitio. De cada serie quedó la más nítida o la de
  mejores caras. No se borraron: están en `repetidas/`, dentro de la carpeta del
  evento en `Eventos/`, y el script no entra en subcarpetas. Los 14 videos se
  ignoran, como en los demás eventos.
- **Portada:** la que eligió el club, `46.jpeg`, que quedó como `foto-09`.
- **Fecha:** las fotos no traen EXIF y la carpeta se llamaba `2026-8-5`, pero el
  club confirmó el 5 de septiembre, que fue sábado. La carpeta se renombró a
  `2026-9-5 AWS Community Day` antes de generar las fotos, así que `carpetaFotos`
  lleva la fecha buena.
- **Lugar:** Cuenca, confirmado por el club. Ya lo sugerían las fotos: el
  auditorio es el mismo de FLISol, con la bandera de Cuenca junto a la del
  Ecuador y la de la UPS.
- **`pnpm fotos` numera en orden natural** (`2.jpeg` antes que `10.jpeg`). Las
  fotos llegaron como `1.jpeg`…`103.jpeg`, y con el orden alfabético la galería
  habría salido 1, 10, 100, 101… Solo afecta a originales nuevos: los números ya
  asignados no cambian, y la reconstrucción sin manifiesto sigue usando el orden
  alfabético. Ver [arquitectura.md](arquitectura.md#números-que-no-cambian).

**Efecto en la portada.** El Community Day pasa a ser el evento más reciente:
encabeza el collage del hero, junto a FLISol y el stand, y entra en «Quiénes
somos» y en la galería. Yachana Day sale de las dos y queda en la trayectoria y
en `/eventos/`. Las cifras del hero pasan a 6 eventos y 168 fotos.

**Verificado** sobre un build desde cero (borrando `dist/` y `node_modules/.astro`):

- `pnpm build`: 261 páginas, 257 indexadas, sin avisos. `pnpm enlaces` da ✓ con
  431 destinos. El JavaScript de la portada sigue en 4.6 KB.
- **La CSP no bloquea nada.** `dist/` se sirvió con las cabeceras de
  `customHttp.yml`: ninguna violación ni error en la portada, `/eventos/` y la
  página del evento, cuyos 125 recursos de `/_astro/` responden 200. Ninguna de
  las tres carga nada de otro origen.
- **Visor:** la foto 9 abre en `9 / 41` con `foto-09.webp` y el foco en «Cerrar
  galería»; la flecha izquierda pasa a `8 / 41` y `Escape` devuelve el foco a la
  miniatura.
- En móvil (375 px) no hay scroll horizontal.
- Una segunda corrida de `pnpm fotos` no convierte nada en ningún evento.

**Una primera versión no llegó a publicarse.** Llevaba las 89 fotos y la fecha
del nombre de la carpeta, el 5 de agosto. Se deshizo el commit local antes de
corregirla, para que las fotos descartadas no quedaran en el historial.

**Publicado el 2026-10-01 en `2a27505`.** Amplify terminó unos 150 segundos
después del push. Comprobado con `curl`:

- La página del evento da 200 con la fecha, las 41 fotos y los 400 asistentes.
  Su `og:image` apunta al dominio público y responde 200.
- `/eventos/` termina con el Community Day, y la portada lo pone primero en el
  collage, con las cifras en 6 eventos y 168 fotos.
- La CSP y HSTS siguen, `/no-existe/` da 404, la ruta del evento sin barra
  redirige con un 301 y la foto de portada lleva la caché de un año.
- La portada, `/eventos/` y la página del evento son idénticas al build local.

---

## Eventos en orden cronológico

El 2026-09-30. `/eventos/` listaba los eventos del más reciente al más antiguo y
al club no le parecía un orden cronológico. Ahora van del más antiguo al más
reciente: Yachana Day primero y FLISol al final, en el mismo sentido que la
trayectoria de la portada. El porqué está en [D-29](decisiones.md#d-29).

Antes de cambiar nada se comprobaron las fechas. Las de captura de los
originales de `Eventos/` coinciden con el frontmatter de los cinco eventos; el
webinar no trae EXIF, pero sus archivos de WhatsApp llevan la fecha en el
nombre. Los datos estaban bien: lo que cambió es la dirección.

La portada no cambia: sigue tomando las fotos de los eventos más recientes.

De paso quedó anotado como pendiente, en el
[punto 3 del estado](estado-y-siguientes-pasos.md#3-presentar-al-core-team-en-quiénes-somos),
presentar a cada integrante del CORE Team en «Quiénes somos».

**Publicado el 2026-10-01 en `1f0ffc8`.** Amplify terminó unos 150 segundos
después del push. Comprobado con `curl`: `/eventos/` ya va de Yachana Day a
FLISol; la portada da 200 con la CSP y HSTS; `/no-existe/` da 404 sin
`Location`; `/eventos` redirige con un 301, y los archivos de `/_astro/` llevan
la caché de un año.

---

## Más presencia del morado

El 2026-09-30. El club pidió que el morado tuviera más protagonismo y que el
fondo dejara de ser casi todo blanco, con celeste y amber como secundarios. El
porqué y el detalle están en [D-28](decisiones.md#d-28).

- **Hero de la portada en morado profundo** (`fondo-noche`), como los afiches del
  club, con halos morado, celeste y amber. Texto en blanco y `tinta` clara;
  partículas aclaradas con `FondoParticulas tono="oscuro"`.
- **Secciones alternas en lavanda** (`fondo-aurora`) y cabeceras de las páginas
  interiores con el mismo aire (`fondo-aurora-superior`).
- **Línea de marca** amber → morado → celeste bajo la barra y sobre el pie; la
  página actual se subraya en morado.
- **Pilares como tarjetas**, con los íconos oficiales del kit en morado, celeste
  y amber (`icono-teams-blue.svg` e `icono-trophy-amber.svg`, copiados sin
  modificar de `Branding/`).
- **Botón principal y filtro activo** en `morado-700`; **pie** en `morado-950`.
- Escala `morado-50` a `morado-950` en `@theme`.
- **Contraste corregido en el pie:** el texto pequeño estaba en 2.67:1 y ahora
  queda en 5.24:1.

Cada halo se midió en su punto más intenso contra el texto que puede caer
encima; ninguno baja de 4.5:1. El club vio las capturas de antes y después y dio
el visto bueno.

Verificado antes del push sobre un build desde cero de `f4125b2` (borrando
`dist/` y `node_modules/.astro`):

- `pnpm build`: 260 páginas, 256 indexadas, sin avisos. `pnpm enlaces` da ✓. El
  JavaScript de la portada sigue en 4.6 KB; su HTML pasa de 34.9 a 38.7 KB por
  el marcado de las tarjetas de pilares.
- **La CSP no bloquea nada.** `dist/` se sirvió en local con las cabeceras de
  `customHttp.yml` y no apareció ningún `Refused` en la portada, el catálogo, la
  ficha de EC2, los eventos, FLISol ni la 404.
- **Interacciones:** el filtro del catálogo marca el botón activo en
  `morado-700` (10 servicios en «Bases de datos»), el visor de fotos abre en
  `1 / 42` con el foco en «Cerrar galería» y el menú móvil abre y se cierra con
  `Escape`. Las partículas del hero leen `tinta-400`, el tono oscuro.
- En móvil (375 px) no hay scroll horizontal.

**Publicado el 2026-09-30 en `f4125b2`.** Amplify terminó unos 2 minutos y
medio después del push. Comprobado con `curl`:

- Producción es idéntica al build verificado en ocho páginas: portada,
  catálogo, eventos, las fichas de Lambda y EC2, FLISol, Yachana Day y la 404.
- La CSS publicada define `--color-morado-950: #13092d` y la utilidad
  `fondo-noche`, con la caché de un año.
- `icono-teams-blue.svg` responde 200 con `#42B4FF` e `icono-trophy-amber.svg`
  con `#FF9900`. Las versiones moradas siguen ahí: se conservan a propósito.
- Las cabeceras siguen igual: la portada da 200 con la CSP y HSTS, `/no-existe/`
  da 404 sin `Location` y `/eventos` redirige con un 301.

**Nota sobre el servidor de desarrollo:** al empezar, la portada salía sin
fotos. La caché de contenido (`.astro/data-store.json`) era anterior al campo
`enInicio` y no lo tenía, así que ningún evento entraba en la portada. Ni
reiniciar ni `astro sync --force` la regeneraron, porque los archivos de
eventos no habían cambiado. Lo arregló borrar `.astro/data-store.json` y
`node_modules/.astro/data-store.json` con el servidor parado. El build no se
veía afectado.

---

## El morado pasa a ser el color principal

El 2026-09-30. El club se identifica más con el morado, así que `marca-purple`
(`#ad5cff`, el morado oficial del kit) reemplaza al amber como color principal.
El porqué y el detalle están en [D-27](decisiones.md#d-27).

- Foco, hito de fundación, halo del hero, partículas y subrayado del pie en morado.
- El segundo halo del hero pasa a blue; la trayectoria va de purple a blue.
- Ícono del programa e íconos del kit en su versión «Purple» oficial.
- El recuadro de costo de las fichas sigue en amber: ahí es una advertencia.
- El anillo de foco sube de 2.14:1 a 3.65:1 sobre blanco.

Verificado antes del push sobre el build de `daf4623`, el mismo que se publicó.
`pnpm build` termina sin avisos y `pnpm enlaces` da ✓. `dist/` se sirvió con las
cabeceras de `customHttp.yml` y se recorrió en el navegador:

- **La CSP no bloquea nada.** No hay ningún `Refused` en la consola. Se probaron
  la portada, el visor de la galería de FLISol (abrir y pasar de foto), el
  buscador del catálogo, la ficha de EC2 con su diagrama y la 404.
- **En morado:** el ícono de la barra, el halo superior del hero, el hito de
  fundación, el degradado de la trayectoria y el anillo de foco con teclado.
- **Sigue en amber** el recuadro «Costo y capa gratuita» de las fichas.
- En móvil (375 px) no hay scroll horizontal. El JavaScript de la portada sigue
  en 4.6 KB.

**Publicado el 2026-09-30 en `daf4623`**, junto con la fusión de lo que ya estaba
en producción. Comprobado con `curl` cuando Amplify terminó, unos 2 minutos y
medio después del push:

- Producción es idéntica al build verificado en las diez páginas de
  [la comparación](estado-y-siguientes-pasos.md#después-de-cada-push).
- `program-icon-purple.svg` y los íconos del kit responden 200 con `#AD5CFF`.
  `program-icon-amber.svg` ya da 404, y la portada no tiene ninguna clase
  `marca-amber`.
- La CSS publicada define `--color-marca-purple: #ad5cff` y lleva la caché de un año.
- Las cabeceras siguen igual: la portada da 200 con la CSP y HSTS, `/no-existe/`
  da 404 sin `Location` y `/eventos` redirige con un 301.

---

## Números de foto que no cambian al agregar fotos

El 2026-09-30. `pnpm fotos` numeraba las fotos de cada evento por el orden
alfabético de sus originales y se saltaba toda salida que ya existiera. Si a un
evento ya procesado se le agregaba una foto cuyo nombre no quedaba al final, los
números se corrían: las salidas existentes se saltaban, la foto nueva nunca se
convertía y el último original salía repetido con un número nuevo. Desde que
`portada` elige la foto por su número, además habría cambiado la portada sin
avisar.

| | Antes | Ahora |
| --- | --- | --- |
| Número de cada foto | Posición del original en orden alfabético | El que le asigna `fuentes` en el manifiesto |
| Foto nueva | Desplaza a las que van después | Toma el siguiente número libre |
| Original que desaparece | Las siguientes bajan un número | Su número queda reservado y su foto se conserva |
| Evento sin originales en esta máquina | Desaparece del manifiesto | Conserva su entrada |

- **`manifiesto.json` gana un campo `fuentes`** por evento
  (`"IMG_0365.HEIC": "foto-04"`). El resto del manifiesto no cambia. Ahora es el
  que mantiene fijos los números, así que va en el mismo commit que las fotos.
- **El script dice qué número recibe cada foto nueva** (`+ IMG_0407.HEIC → foto-43`)
  y avisa de los originales que ya no están.
- **Una conversión que falla no reserva número**, para que la foto, cuando se
  arregle, no aparezca en medio de la galería.
- **Un evento sin `fuentes`** se reconstruye con la regla alfabética de antes,
  pero solo si el número de originales coincide con el de fotos generadas. Si no,
  el script no lo toca y termina con error.

La regla completa está en [arquitectura.md](arquitectura.md#números-que-no-cambian).

Verificado sobre una copia de los originales en una carpeta temporal; `Eventos/`
no se tocó.

- **Con las carpetas actuales no cambia nada:** 0 convertidas y 127 ya
  existentes en los cinco eventos, las 254 WebP idénticas byte a byte y el
  manifiesto solo gana `fuentes`. Una segunda corrida lo deja igual.
- **Cada `foto-NN` sale del original que `fuentes` le atribuye.** El script
  anterior, corrido desde cero, reproduce byte a byte las 254 WebP publicadas. El
  nuevo, también desde cero, da las mismas 254 y el mismo manifiesto.
- **Una foto nueva que por nombre va primera**, en el webinar de
  infraestructura (6 fotos): con el script anterior, `foto-07` salía como copia
  exacta de `foto-06` y la nueva no aparecía. Con el nuevo, `foto-07` es la
  nueva y `foto-01` a `foto-06` no cambian.
- **Un original borrado, un archivo corrupto y su arreglo:** la `foto-03`
  borrada se conserva y su número no se reutiliza; el archivo corrupto da `✗`
  sin reservar número y, una vez arreglado, entra como `foto-09`, después de las
  que llegaron antes que él.
- `pnpm build` sin avisos, con 260 páginas y 256 indexadas, y `pnpm enlaces`
  en ✓.

**Publicado el 2026-09-30 en `f9c4f33`**, encima de los eventos ya publicados
(`3e363ba`). El morado (`1b1b0ac`) sigue sin publicar. El cambio no toca nada de
lo que sirve el sitio: el script, el manifiesto y `docs/` no llegan a `dist/`.
Comprobado con `curl` cuando Amplify terminó de publicar, unos 3 minutos después
del push:

- **Producción es idéntica al build local** en diez páginas: la portada,
  `/eventos/`, los cinco eventos, `/servicios/`, la ficha de EC2 y la 404. Antes
  de comparar se quitan los `\r` y el id aleatorio de cada diagrama (ver
  [cómo comprobarlo](estado-y-siguientes-pasos.md#después-de-cada-push)).
- La portada da 200 con la CSP y HSTS, `/no-existe/` da 404 sin `Location`,
  `/eventos` redirige con un 301 a `/eventos/` y las fotos de `/_astro/` llevan la
  caché de un año.
- El `og:image` de cada evento es su portada elegida (27, 23, 1, 20 y 9) y
  responde 200.
- El manifiesto no se publica (`/src/assets/eventos/manifiesto.json` da 404), y
  `program-icon-purple.svg` tampoco: el morado no entró.

---

## Eventos publicados y comprobados en producción

El 2026-09-30, en `df92410`. Lleva los cuatro commits de los eventos: texto,
campo `portada`, portadas elegidas y `enInicio`. El cambio de color a morado
(`1b1b0ac`, otra sesión) seguía solo en local y **no** entró en este push: se
publicó desde un worktree que partía del último commit propio.

Comprobado con `curl` contra el sitio real, unos 2 minutos y medio después del push:

- La portada, `/eventos/` y los cinco eventos responden 200. `/no-existe/` da
  404 y `/eventos` redirige con un 301 a `/eventos/`. La CSP y HSTS siguen en su sitio.
- Cada evento muestra su texto, su lugar corregido y sus `asistentes`, y su
  `og:image` es la portada elegida, en el dominio real. La de Yachana Day
  responde 200.
- En la portada del sitio no queda ninguna foto del webinar. Yachana Day sale con
  su foto 27 en «Quiénes somos» y en la galería.
- Ninguna página tiene `[Placeholder]`, y el icono sigue en amber: el morado no
  se publicó.

---

## Yachana Day en la portada en lugar del webinar

El 2026-09-30. La portada del sitio muestra fotos de los eventos más recientes, y
el webinar de infraestructura aparecía en el collage, en «Quiénes somos» y en la
galería con el afiche como foto. A pedido del club, su lugar lo ocupa Yachana Day.

- Campo nuevo `enInicio` en eventos, `true` por defecto. Con `false`, el evento
  no entra en esas tres secciones y el siguiente sube un puesto. Sigue en
  `/eventos/`, en la trayectoria (si es hito) y en los totales de eventos y fotos.
- `infraestructura-cloud.mdx` lleva `enInicio: false`.

| Sección de la portada | Antes | Ahora |
| --- | --- | --- |
| Collage del hero | FLISol, Stand, webinar | FLISol, Stand, Los 4 Fantásticos |
| «Quiénes somos» | FLISol, Stand, webinar, Los 4 Fantásticos | FLISol, Stand, Los 4 Fantásticos, Yachana Day |
| Galería | Dos fotos de esos mismos cuatro | Dos fotos de los cuatro nuevos |

Verificado en `dist/index.html`: ninguna foto del webinar en la portada, Yachana
Day con su foto 27 en «Quiénes somos» y en la galería, y «5 eventos · 127 fotos»
sin cambios. `pnpm build` sin avisos y `pnpm enlaces` en ✓.

---

## Portada elegible para cada evento

El 2026-09-30. La foto que representa a cada evento era siempre la primera de su
carpeta. Ahora el campo opcional `portada` del frontmatter la elige por su
número, el mismo que muestra el contador del visor (`7 / 28`) y que lleva el
archivo (`foto-07.webp`).

| Dónde se ve la portada | Archivo |
| --- | --- |
| Tarjeta del evento en `/eventos/` | `eventos/index.astro` |
| `og:image` al compartir la página del evento | `eventos/[...slug].astro` |
| Collage del hero, «Quiénes somos» y galería de la portada del sitio | `index.astro` |

- `portadaDeEvento(carpeta, portada)` en `src/lib/fotos.ts` reemplaza a la versión
  anterior, que nadie usaba y solo devolvía la primera miniatura.
- La galería de la página de cada evento no se reordena: si lo hiciera, los
  números del visor cambiarían y dejarían de servir para elegir.
- La galería de la portada del sitio muestra dos fotos por evento. Ahora empieza
  por la portada y sigue con la primera foto que no lo sea.
- Un número fuera de rango rompe el build:
  `[portada] … tiene 42 fotos; no existe la foto 99.`
- **Portadas elegidas por el club:** Yachana Day 27, Los 4 Fantásticos 23,
  Infraestructura Cloud 1 (el afiche del webinar), Stand de Inicio de Ciclo 20 y
  FLISol 9. Las cinco son horizontales, así que la tarjeta y la vista previa al
  compartir apenas las recortan.

Verificado: sin ningún `portada`, el HTML de `dist/` es idéntico al del build
anterior (lo único que cambia es el lugar de Yachana Day, corregido a Campus
Balzay en el mismo cambio). Con `portada: 5` en FLISol, la tarjeta, el `og:image`,
«Quiénes somos» y la galería de la portada toman la foto 5, y la galería no la
repite. Con `portada: 99` el build falla con el mensaje de arriba.

---

## Contenido de los cinco eventos

El 2026-09-30. Los cinco `.mdx` de `src/content/eventos/` tenían `[Placeholder]`
como cuerpo. Ahora cada uno tiene dos o tres párrafos, escritos con lo que contó
el club y con lo que se ve en las fotos: afiches, diapositivas y el propio stand.

Las fotos contradecían parte de lo ya publicado, así que se corrigió también el
frontmatter:

| Evento | Antes | Ahora |
| --- | --- | --- |
| Yachana Day | Resumen: «una introducción a la computación en la nube». Lugar: Universidad de Cuenca | Un stand en la jornada de proyectos y emprendimientos; no hubo charla. Lugar: Campus Balzay |
| Los 4 Fantásticos | Resumen: «una sesión… con ejemplos prácticos». Lugar: Universidad de Cuenca | Un stand con trivia y premios, sin charla. Lugar: Campus Balzay (sale en el afiche) |
| Infraestructura Cloud | Resumen: «taller» sobre regiones y zonas de disponibilidad. Lugar: Universidad de Cuenca | Webinar sobre data centers con Miguel González, de AWS Alemania. Lugar: En línea |
| Stand de inicio de ciclo | Lugar: Campus de la Universidad de Cuenca | Bloque A, Campus Balzay |
| FLISol | Lugar: FLISol Cuenca | Universidad Politécnica Salesiana, Cuenca |

- **`asistentes`** en tres eventos: 200 en «Los 4 Fantásticos» y en el stand, 25
  en el webinar. Las dos primeras cifras son aproximadas.
- **Enlaces a fichas:** «Los 4 Fantásticos» enlaza a EC2, S3, Lambda y RDS, y el
  webinar a Local Zones.
- **La portada de `/eventos/`** decía «Talleres, stands y participaciones»,
  pero ninguno de los cinco fue un taller. Ahora dice «Stands, charlas y
  webinars», también en la meta descripción.
- Los nombres de los miembros del club no aparecen; solo se nombra al ponente
  invitado, que figura en el afiche público del webinar.

Verificado: `pnpm build` sin avisos, con 260 páginas y 256 indexadas. `pnpm
enlaces` da ✓ con 5 enlaces internos más, y el HTML de `dist/` ya no contiene
`[Placeholder]`. El JavaScript de la portada sigue en 4.6 KB. Revisado en el
servidor de desarrollo: las cinco páginas, la lista de eventos y la trayectoria
de la portada.

---

## Pie: enlaces sin texto en amber y despliegue con Amplify

El 2026-09-30.

- **Los enlaces del pie ya no usan el amber como color de texto.** Al pasar el
  cursor el texto se volvía `marca-amber`, contra la regla de [D-01](decisiones.md#d-01).
  Además el contraste bajaba, de 8.9:1 en reposo a 7.9:1. Ahora el texto sube a
  `tinta-50` (15.8:1) y el amber aparece como subrayado de 2 px. Aplica a los
  cinco enlaces del mapa del sitio y a LinkedIn e Instagram. El patrón quedó en
  [sistema-de-diseno.md](sistema-de-diseno.md#enlaces-sobre-fondo-oscuro).
- **El pie decía «desplegado en AWS (S3 + CloudFront)».** Ahora dice «desplegado
  en AWS Amplify», que es donde se aloja el sitio desde el 2026-09-29
  ([D-23](decisiones.md#d-23)).

Verificado en el servidor de desarrollo, con el cursor sobre un enlace de texto y
sobre uno con icono. `pnpm build` sin avisos y `pnpm enlaces` en ✓. El HTML ya no
contiene ninguna clase `text-marca-amber`. En reposo el pie no cambia. Se
publicó en el mismo push que los enlaces con barra final; la comprobación en
producción está en la entrada siguiente.

---

## Enlaces internos con barra final

El 2026-09-29. Los enlaces internos apuntaban a rutas sin barra final
(`/servicios`, `/eventos/flisol-2026`, `/servicios/computo/ec2`). Astro genera
`dist/servicios/index.html` y Amplify responde a la URL sin barra con un 301
hacia la versión con barra, así que cada clic interno costaba un viaje de ida y
vuelta extra. En el build había **258 destinos distintos** enlazados así,
repartidos por las 260 páginas. Ver [D-26](decisiones.md#d-26).

| Cambio | Archivo |
| --- | --- |
| Barra final en todas las plantillas de enlaces internos a página | `Nav.astro`, `Footer.astro`, `TarjetaServicio.astro`, `404.astro`, `index.astro`, `eventos/`, `servicios/[...slug].astro` |
| `trailingSlash: 'always'`: el servidor de desarrollo avisa si un enlace olvida la barra | `astro.config.mjs` |
| El buscador del catálogo lee el id de la tarjeta de `data-id`, no del `href` | `TarjetaServicio.astro`, `servicios/index.astro` |
| `pnpm enlaces`: revisa en `dist/` la barra final, que el destino exista y las anclas | `scripts/comprobar-enlaces.mjs` |

### Dos fallos que aparecieron por el camino

- **El buscador del catálogo se habría roto en silencio.** Sacaba el id de cada
  tarjeta quitándole `/servicios/` al `href`. Con la barra final, el id pasaba a
  ser `computo/ec2/`, no coincidía con el índice y ninguna búsqueda encontraba
  nada. Ahora usa `data-id`.
- **«Quiénes somos» salía marcado como página actual en todo el sitio.** La
  navegación comparaba por prefijo la parte del enlace anterior a `#`; para
  `/#nosotros` eso es `/`, y toda ruta empieza por `/`. En cada página había dos
  enlaces con `aria-current="page"` y en negrita. Ahora las anclas no se marcan
  nunca.

### Verificado

- `pnpm build` sin avisos: 260 páginas y 256 indexadas por Pagefind, como antes.
- `pnpm enlaces`: 5346 enlaces internos hacia 389 destinos distintos, todos con
  barra y todos existentes. Antes del cambio, el mismo script contaba los 258
  destinos sin barra.
- Navegación: cada página marca una sola sección (la de la portada, «Inicio»), y
  la 404 ninguna.
- En el servidor de desarrollo, `/servicios` muestra el aviso de Astro, y los
  clics a una ficha y a un evento cargan directo con 200.
- Buscador: «lambda» encuentra 5 fichas, el filtro Cómputo deja 17 y con la
  búsqueda vacía vuelven las 251.
- JavaScript sin cambios: 4.6 KB en la portada, 52.4 KB en el catálogo y 1.0 KB
  en fichas y eventos.

### En producción

Publicado el 2026-09-30, junto con el cambio del pie, en el commit `d276b68`.
Antes del push hubo que fusionar `5e561a4`, un commit de otra sesión que solo
tocaba documentación. El build se repitió desde cero, sin `dist/` ni caché de
Astro, y ninguna página carga recursos de otro origen.

| Comprobación | Resultado |
| --- | --- |
| Los 389 destinos internos de `dist/`, pedidos sin seguir redirecciones | Todos 200: 259 páginas y 130 archivos. Ningún 301 |
| Clic del catálogo a la ficha de EC2, en el navegador | Una sola petición, 200, `redirectCount` 0 |
| Ruta sin barra que llegue de fuera (`/servicios`) | Sigue en 301 hacia `/servicios/`, como debe |
| Pie | «desplegado en AWS Amplify»; ninguna clase `text-marca-amber` |
| CSP | La consola no registra ningún bloqueo en la portada, el catálogo (con el buscador), una ficha y un evento (con el visor) |
| Navegación | Una sola sección marcada en cada página |
| Cabeceras, 404 y caché de `/_astro/` | Sin cambios |

---

## Cierre del despliegue: cabeceras, README y ficha de Amplify

El 2026-09-29, el mismo día de la publicación, se cerró todo lo que quedaba del
despliegue salvo el subdominio de la Universidad.

- **404 real.** La regla pasó a `404-200` en la consola. Una URL inexistente
  responde ahora 404, sin redirección y con la página de error propia.
- **Budgets y Cost Anomaly Detection** confirmados en la consola.
- **`customHttp.yml`.** Caché de un año para `/_astro/*` —antes todo se servía
  con `max-age=0`— y cabeceras de seguridad: HSTS, una CSP sin orígenes externos,
  `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`. Ver
  [D-25](decisiones.md#d-25).
- **Ficha de Amplify completa**, con la sección «Así lo usa este sitio» y el
  diagrama del push al visitante. Las fichas de S3, CloudFront y Route 53 decían
  que este sitio se sirve con S3 + CloudFront; ahora cuentan ese montaje como
  ejemplo y enlazan a la de Amplify.
- **`README.md` de la raíz**, que seguía siendo la plantilla de Astro.

Al auditar lo que carga el sitio para escribir la CSP apareció algo que la
documentación daba por hecho: **Pagefind genera su índice, pero ninguna página lo
carga.** No hay buscador de todo el sitio. Quedó anotado en los siguientes pasos.

### Comprobado antes del push

- Build desde cero, borrando `dist/` y la caché de Astro: 260 páginas, 256
  indexadas, sin avisos. La portada sigue en 4.6 KB de JavaScript.
- Las 6.312 referencias internas del HTML generado —páginas, imágenes, fuentes y
  anclas— apuntan a archivos que existen.
- Las 251 fichas: sin slugs rotos, cada una en la carpeta de su categoría,
  ningún `resumenCorto` de más de 160 caracteres.
- `dist/` servido en local con las cabeceras de `customHttp.yml`: la CSP no
  bloqueó nada en la portada, el catálogo, las fichas editadas y los cinco
  eventos. Funcionan el visor de fotos, el filtro del catálogo y el menú móvil.

### En producción

Publicado a los ~2 minutos del push (commit `2bc2154`). Comprobado con `curl`:

| Comprobación | Resultado |
| --- | --- |
| Las seis cabeceras de seguridad | En todas las respuestas, también en la 404 |
| Archivos de `/_astro/` | `max-age=31536000, immutable` |
| Un archivo de `/_astro/` que no existe | 404, sin la caché larga |
| HTML y fuentes | `max-age=0`, como antes |
| URL inexistente | 404 sin `Location` |
| Ruta sin barra final | 301 hacia la versión con barra |
| `og:image` de un evento | 200 |

### Anclas de las decisiones

Los enlaces del tipo `decisiones.md#d-17` no funcionaban en GitHub, que genera el
ancla a partir del título completo. Cada decisión lleva ahora un `<a id="d-NN">`
explícito, y los 68 enlaces relativos de la documentación resuelven.

### Encontrado de paso

Unos 258 destinos se enlazan sin barra final (`/servicios` en vez de
`/servicios/`), así que Amplify responde a cada clic interno con un 301 antes de
servir la página. Ya pasaba antes; se corrige en una tarea aparte.

---

## Sitio en línea en Amplify

El 2026-09-29 el sitio quedó publicado en <https://aws-sbg-ucuenca.d2jrpw2uglkitl.amplifyapp.com/>. La app de Amplify se creó en
`us-east-1`, conectada a la rama `aws-sbg-ucuenca`. El primer build funcionó con
el `amplify.yml` del repositorio, sin tocar nada en la consola.

### Verificado contra el sitio publicado

| Comprobación | Resultado |
| --- | --- |
| Portada, catálogo, eventos, búsqueda | 200 |
| `/servicios/almacenamiento/s3` sin barra | 301 hacia la versión con barra |
| `og:image` | Apunta al dominio de Amplify: las variables `AWS_APP_ID` y `AWS_BRANCH` llegaron al build, así que no hizo falta `SITE_URL` |
| Vista previa en WhatsApp | Muestra la foto |
| URL inexistente | ⚠️ 302 → `/404.html` → 200. Ver abajo |

### Un error en las instrucciones de la 404

Las instrucciones del despliegue decían que el estado de la regla fuese `404` y
que se evitara `404-200`. Era al revés. Según la referencia de AWS, **`404` es una
redirección y `404-200` una reescritura**. Con `404`, Amplify responde 302 hacia
`/404.html`, la URL cambia y la respuesta final es un 200. A la vista funciona,
así que no se nota, pero un buscador trata la página como existente. Hay que
cambiar el estado a `404-200` en la consola; la documentación ya está corregida.

De paso, la nota interna de `src/pages/404.astro` pasó de un comentario `<!-- -->`
al frontmatter: Astro publica los comentarios HTML, así que la nota se estaba
sirviendo en el HTML público.

### Dos decisiones más

- **Sin firewall (WAF).** Amplify lo ofrece al crear la app por 15 USD al mes por
  app, más el uso de WAF, y para un sitio estático no protege casi nada — ver
  [D-24](decisiones.md#d-24).
- **[D-17](decisiones.md#d-17) actualizada.** La casilla `Credits` de Budgets ya no
  existe; los créditos se excluyen con el filtro *Charge type*.

---

## Repositorio en GitHub y preparación para Amplify

El despliegue cambió de plan: **Amplify Hosting en lugar de S3 + CloudFront**.
Pagar un dominio propio no resultó viable, y Amplify permite que el nombre del
club aparezca en la URL pública a través del nombre de la rama. El porqué
completo, y lo que se pierde, está en [D-23](decisiones.md#d-23).

### Repositorio

El proyecto pasó a ser un repositorio git, publicado en
<https://github.com/AlvaradoDavid/SBG_AWS_Ucuenca> con una sola rama,
`aws-sbg-ucuenca`.

**Un hallazgo antes del primer commit.** La regla `Eventos/` de `.gitignore`, pensada
para excluir los originales (2.3 GB), no estaba anclada a la raíz. Como Windows
no distingue mayúsculas de minúsculas, también excluía `src/assets/eventos/` (las 255 fotos),
`src/content/eventos/` y `src/pages/eventos/`. El repositorio habría salido sin
eventos y el build en Amplify habría fallado. Se ancló como `/Eventos/` (y
`/Branding/*.pptx`), y se comprobó construyendo desde un clon limpio: salió
idéntico al build local.

### Preparación para Amplify

| Cambio | Archivo |
| --- | --- |
| Receta de build con Node 24, pnpm del `packageManager` y caché del store | `amplify.yml` |
| pnpm fijado en 11.20.0 | `package.json` |
| `site` calculado a partir de `AWS_BRANCH` y `AWS_APP_ID`, con `SITE_URL` como prioridad | `astro.config.mjs` |
| Página 404 propia, fuera del índice de búsqueda | `src/pages/404.astro` |
| `og:image` en todas las páginas; cada evento usa su primera foto | `Layout.astro`, `fotos.ts`, `eventos/[...slug].astro` |

Las imágenes para compartir **no se recortan** a 1200×630: dos de las fotos de
portada de los eventos son carteles y el recorte les cortaría el título. Se
redimensionan a 1200 px de ancho, manteniendo la proporción.

El presupuesto de JavaScript no cambió: 4.6 KB en la portada.

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

> Obsoleto desde el paso a Amplify ([D-23](decisiones.md#d-23)); se conserva como
> referencia del plan con CloudFront.

---

## Pendiente

- **Desplegar el sitio.** Hecho: ver la entrada «Sitio en línea en Amplify» —
  ver [estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md#1-cerrar-el-despliegue).
- **Contenido de los eventos.** Hecho: ver la entrada «Contenido de los cinco
  eventos».
- **Catálogo de servicios.** Cobertura completa con 251 fichas; lo que falta es
  profundidad: 211 son breves y esperan su frontmatter completo y su diagrama.
- **Iniciar git.** El proyecto todavía no es un repositorio, así que no hay
  historial ni forma de automatizar el despliegue.
