# Estado del proyecto y siguientes pasos

Documento de traspaso: dónde está el sitio hoy, qué falta, y cómo hacer las
tareas que quedan pendientes sin tener que redescubrir nada.

---

## Dónde está el sitio hoy

| Área | Estado |
| --- | --- |
| Diseño y sistema de tokens | Completo y documentado. El morado ocupa superficies: hero, pie y fondos aurora ([D-28](decisiones.md#d-28)) |
| Navegación (escritorio y móvil) | Completa |
| Portada | Completa: hero en morado profundo con collage, cifras y partículas; cartel del Student Community Day; pilares, trayectoria, galería |
| Próximo evento | **AWS Student Community Day Ecuador, 14 de noviembre de 2026**: cartel bajo el hero y página en `/student-community-day/`. Faltan agenda, ponentes y el arte original: ver más abajo |
| Galería de eventos | Completa, con visor accesible |
| Catálogo de servicios | **251 fichas: el catálogo completo de AWS.** 41 completas con diagrama, 210 breves |
| Contenido de eventos | Completo: los 7 con texto; 5 con cifra de asistentes |
| Accesibilidad | AA en todo; AAA en los contrastes principales |
| Presupuesto de JS | 4.6 KB en portada, 1.0 KB en el resto. **Ojo con los datos del catálogo:** ver el punto 5 |
| Infraestructura AWS | ✅ **En línea en Amplify:** <https://aws-sbg-ucuenca.d2jrpw2uglkitl.amplifyapp.com/>, con 404 real, cabeceras de seguridad y alarmas de costo. Solo queda el subdominio: ver el punto 1 |

### Las dos profundidades de ficha

El catálogo cubre los 251 servicios que AWS lista hoy en su directorio de
productos, repartidos en 19 categorías y en dos niveles de detalle:

| Tipo | Cuántas | Qué lleva |
| --- | --- | --- |
| **Completa** | 41 | Frontmatter entero —analogía, vocabulario, costos, alternativas, servicios relacionados, certificaciones— y cuerpo con `## Descripción`, `## Cómo funciona`, `## Manos a la obra` y `## Ejemplo visual` con su diagrama |
| **Breve** | 210 | Campos obligatorios, `cuandoAplicarlo`, enlaces oficiales y un `## Descripción` de dos o tres párrafos. Sin diagrama |

Las completas son las que aparecen en Cloud Practitioner, Solutions Architect
Associate y Developer Associate, más las que el club usa de verdad: las 40 del
primer lote, más Amplify, que se amplió al publicar el sitio con él. Las seis
primeras (EC2, Lambda, S3, DynamoDB, CloudFront e IAM) siguen siendo las de
referencia para el estilo.

**Ampliar una ficha breve a completa es el trabajo incremental natural del
catálogo:** se le añaden los campos que faltan y su diagrama, sin tocar nada más.

Las fichas de servicios que AWS ya retiró llevan una línea **Nota:** al final del
cuerpo, con la fecha de fin de soporte y la alternativa vigente. Se conservan
porque aparecen en material de estudio antiguo y en arquitecturas heredadas.

---

## Lo urgente: el AWS Student Community Day (14 de noviembre)

El primer AWS Student Community Day del Ecuador: sábado 14 de noviembre de 2026,
de 09h00 a 14h00, en el Campus Balzay. **El club es el anfitrión** y pidió que
fuera lo más visible del sitio. Construido el 2026-10-05 y **publicado el
2026-10-06** ([D-31](decisiones.md#d-31)):

- **Un cartel en la portada,** justo debajo del hero y antes de los pilares, con
  la composición del afiche, los botones de entrada (TicketIn) y registro
  (Meetup), el calendario y los patrocinadores.
- **Una página propia,** `/student-community-day/`, para Instagram, los QR y
  WhatsApp: el evento, cómo participar, las 8 comunidades participantes, la
  agenda («Muy pronto») y los patrocinadores al final. Al compartirla sale el
  afiche.
- **Un archivo de calendario,** `/student-community-day.ics`, y un enlace a
  Google Calendar.
- **Un enlace en la barra de navegación,** entre «Inicio» y «Servicios AWS», en
  todas las páginas. Para que la barra siga cabiendo en una línea en tableta,
  **«Quiénes somos» sale de ella mientras dure el evento** y vuelve sola después
  (ver más abajo).

Todo vive en `src/content/proximos/student-community-day.mdx`: para cambiar un
enlace, el horario, los participantes o los patrocinadores se edita ese archivo,
sin tocar componentes.

**Lo que decidió el club** (2026-10-05 y 06), para no volver a preguntarlo:

- **Dónde va:** debajo del hero del club, no en su lugar. Se le propuso
  reemplazar el hero hasta el 14 y prefirió conservarlo.
- **«Community» en blanco,** no en el morado del afiche (regla 1).
- **Los dos pasos son obligatorios:** la entrada gratuita en TicketIn y el
  registro en Meetup. Así lo dicen el sitio y las dos plataformas.
- **Los patrocinadores salen en los dos lugares:** debajo del cartel de la
  portada, solo los logos (el club pidió quitar el título «Patrocinan»), y al
  final de la página, con «Con el apoyo de».
- **Contacto:** el Instagram y el LinkedIn del club, sin correo.
- **Participantes:** los 8 Student Builder Groups de
  <https://www.awsugecuador.com/comunidades/>. Los User Groups de esa página no
  cuentan.
- **La barra de navegación:** el evento va entre «Inicio» y «Servicios AWS», y
  «Quiénes somos» se quita **solo mientras dure el evento**. Se le propuso
  mostrar la barra horizontal desde 1024 px, dejando las tabletas con el menú
  hamburguesa, y prefirió esto. No es un retiro definitivo.

**Pendiente del club:**

- **Agenda y ponentes.** Cuando lleguen, la sección «Agenda y ponentes» de la
  página deja de decir «Muy pronto». Hace falta un campo nuevo en el esquema
  (`agenda`, con hora, título y ponente) y, por ponente, nombre, tema y foto con
  su permiso, como con el CORE Team.
- **Otros participantes,** además de los 8 Student Builder Groups.
- **El arte original.** La foto del cartel es un recorte del afiche horizontal
  (682 × 901 px) y se ve algo blanda en pantallas de alta densidad. Con la foto de
  la catedral sin texto, o el diseño de Canva, se cambia
  `src/assets/proximos/student-community-day/catedral.jpg` por la nueva y no hay
  que tocar nada más.
- **El logo de Ambross** mide 200 × 200 px: justo el doble de su tarjeta. Si hay
  uno más grande, se ve más nítido.
- **«Más información» en TicketIn y Meetup** apunta hoy a la portada. Conviene
  cambiarlo a `/student-community-day/`, que ya está publicada.

**Después del 14:**

1. El cartel de la portada y el enlace de la barra se retiran solos, y
   «Quiénes somos» vuelve a la barra, en el primer build después de las 14h00
   del 14: el push de las fotos, o un *Redeploy* desde la consola de Amplify si
   no hay nada que publicar. No hay que tocar código; conviene abrir el sitio
   después y comprobar que la barra tiene sus cuatro enlaces de siempre.
2. Las fotos van como las de cualquier evento: en
   `Eventos/2026-11-14 AWS Student Community Day/`, sueltas, y `pnpm fotos`. La
   carpeta ya tiene la fecha en el nombre y el arte está aparte, en `arte/`, para
   que las fotos del día se numeren desde la 1.
3. El `.mdx` del evento va en `src/content/eventos/`, con `hito: true` y los
   asistentes: es el hito de la trayectoria en el que el club pasa de participar a
   organizar.
4. La página `/student-community-day/` sigue en línea, ya sin inscripción. Si se
   quiere, puede enlazar a la galería del evento.

---

## Lo que queda pendiente

### 1. Cerrar el despliegue

El sitio está **en línea desde el 2026-09-29** en <https://aws-sbg-ucuenca.d2jrpw2uglkitl.amplifyapp.com/>, alojado en AWS
Amplify Hosting ([D-23](decisiones.md#d-23)) y conectado a la rama
`aws-sbg-ucuenca` de <https://github.com/AlvaradoDavid/SBG_AWS_Ucuenca>.

> **Cada push a `aws-sbg-ucuenca` se publica en producción.** No hay rama de
> pruebas: se verifica con `pnpm build` antes de hacer push.

**Verificado contra el sitio publicado** (con `curl` y a mano en el navegador):

- La portada, el catálogo, los eventos y la búsqueda cargan.
- `/servicios/almacenamiento/s3` (sin barra) responde 301 hacia la versión con barra.
- El `og:image` apunta a `https://aws-sbg-ucuenca.d2jrpw2uglkitl.amplifyapp.com/_astro/…`, la imagen responde 200 y cada evento
  comparte su propia foto: Amplify inyectó `AWS_APP_ID` y `AWS_BRANCH` sin tocar
  nada, así que **no hace falta definir `SITE_URL`**.
- La vista previa de los enlaces en WhatsApp muestra la foto.

**Hecho después de publicar** (2026-09-29):

- ✅ **Regla de la 404 en `404-200`.** `curl -I` a una URL inexistente responde
  404 sin `Location`, con la página de error propia.
- ✅ **Budgets y Cost Anomaly Detection** creados, con los créditos excluidos por
  el filtro *Charge type* ([D-17](decisiones.md#d-17)).
- ✅ **Ficha de Amplify completa**, con una sección «Así lo usa este sitio» y su
  diagrama. De paso, las fichas de S3, CloudFront y Route 53 dejaron de decir que
  este sitio se sirve con S3 + CloudFront.
- ✅ **`README.md` de la raíz** reescrito: presenta el sitio y enlaza a `docs/`.
- ✅ **Cabeceras HTTP** en `customHttp.yml`: caché de un año para `/_astro/*` y
  cabeceras de seguridad, con una CSP que no admite orígenes externos
  ([D-25](decisiones.md#d-25)).

Todo lo anterior está publicado y comprobado con `curl` contra el sitio real. El
detalle está en el [registro de cambios](registro-de-cambios.md).

**Publicado el 2026-09-30** y comprobado en producción:

- ✅ **Enlaces internos con barra final** ([D-26](decisiones.md#d-26)). Los 389
  destinos internos responden 200 sin pasar por un 301. `pnpm enlaces` lo
  comprueba en `dist/` antes de cada push.
- ✅ **Pie:** los enlaces ya no ponen el texto en amber, y la última línea dice
  «desplegado en AWS Amplify».
- ✅ **Contenido de los cinco eventos, portadas elegidas y `enInicio`** (`df92410`):
  ver el punto 2.
- ✅ **Números de foto fijos en `pnpm fotos`** (`f9c4f33`): agregar fotos a un
  evento ya no cambia el número de las demás ni su `portada`. Ver el punto 2 y
  [arquitectura.md](arquitectura.md#números-que-no-cambian).
- ✅ **El morado de marca es el color principal** (`daf4623`): foco, hero,
  trayectoria, pie e íconos. El amber sigue como advertencia en el recuadro de
  costo de las fichas y entre los acentos de las categorías del catálogo. Ver
  [D-27](decisiones.md#d-27).
- ✅ **Más presencia del morado** (`f4125b2`): hero y pie en morado profundo,
  secciones alternas en lavanda, cabeceras interiores con halos, línea de marca
  bajo la barra y pilares en morado, celeste y amber. Ver
  [D-28](decisiones.md#d-28) y, para reutilizar los fondos en páginas nuevas,
  [sistema-de-diseno.md](sistema-de-diseno.md#fondos-de-marca).

**Publicado el 2026-10-01** y comprobado en producción:

- ✅ **`/eventos/` en orden cronológico** (`1f0ffc8`): del más antiguo al más
  reciente, como la trayectoria. Ver [D-29](decisiones.md#d-29).
- ✅ **Sexto evento: AWS Community Day Ecuador** (`2a27505`), con 41 fotos (48
  repetidas apartadas sin borrar), y `pnpm fotos` numerando en orden natural
  (`2.jpeg` antes que `10.jpeg`). Ver el punto 2.
- ✅ **Séptimo evento: la charla «Serverless en AWS»** (`af542ed`), con el
  afiche como única foto y `pnpm fotos` aceptando AVIF y WebP. Ver el punto 2.
- ✅ **Tomas repetidas fuera de los demás eventos** (`c59be34`): salen 42 fotos de
  Yachana Day, «Los 4 Fantásticos», el stand y FLISol, y el sitio queda con 127.
  Las portadas son las mismas imágenes con otro número. Ver el punto 2 y
  [D-30](decisiones.md#d-30).

**Publicado el 2026-10-06** y comprobado en producción:

- ✅ **AWS Student Community Day** (`2b4d4b5` y `5121fd6`): el cartel bajo el
  hero, la página `/student-community-day/` y su `.ics`, que Amplify sirve como
  `text/calendar`. Ver [lo urgente](#lo-urgente-el-aws-student-community-day-14-de-noviembre)
  y [D-31](decisiones.md#d-31).

**Pendiente:**

- **Subdominio de la Universidad.** Aplazado. Cuando llegue, se añade como
  dominio en Amplify y se define `SITE_URL`.

**Lo que no se hace:** activar el firewall (WAF) que ofrece Amplify — ver
[D-24](decisiones.md#d-24).

### 2. Contenido de los eventos

✅ **Hecho el 2026-09-30.** Los cinco eventos tienen su texto, escrito con lo
que contó el club y lo que se ve en las fotos. De paso se corrigieron tres datos
que las fotos contradecían: el taller de infraestructura fue un webinar en
línea, «Los 4 Fantásticos» fue un stand con trivia y no una charla, y los lugares
de los cinco ganaron precisión. El detalle está en el
[registro de cambios](registro-de-cambios.md).

Cinco llevan `asistentes`: 400 en el Community Day, 200 en «Los 4 Fantásticos»
y en el stand de inicio de ciclo, 51 en la charla de Serverless y 25 en el webinar. Las tres primeras cifras
son aproximadas y la etiqueta no lo indica; la del Community Day se queda corta,
porque fueron más de 400. Yachana Day y FLISol no tienen cifra: si aparece, basta
con añadir el campo.

**Para un evento nuevo:** poner las fotos en `Eventos/<fecha> <nombre>/`, correr
`pnpm fotos` y crear el `.mdx` con los campos de `src/content.config.ts`;
`carpetaFotos` es el nombre de carpeta que el script crea en `src/assets/eventos/`. El texto
va en primera persona del plural y no repite el `resumen`, que ya aparece justo
encima. Con `hito: true` sale también en la trayectoria de la portada.

Las fotos van sueltas dentro de esa carpeta: el script no entra en subcarpetas y
lee HEIC, JPG, PNG, AVIF y WebP; los dos últimos son el formato en que llegan los
afiches descargados de Meetup. Los videos se ignoran, y el sitio hoy no publica
ninguno.

- **Si las fotos no traen EXIF, confirmar la fecha con el club.** El nombre de
  la carpeta puede estar mal: el del Community Day decía `2026-8-5` y el evento
  fue el 5 de septiembre. Se corrige renombrando la carpeta antes de la primera
  corrida, porque de ese nombre sale `carpetaFotos`.
- **Para dejar fotos fuera sin borrarlas,** moverlas a una subcarpeta de su
  evento (por ejemplo `repetidas/`) antes de la primera corrida de `pnpm fotos`.
  Después de publicar no basta con moverlas: la foto ya generada se conserva.
  Ver «Para quitar fotos de un evento ya publicado», más abajo.

**El sexto evento, el AWS Community Day Ecuador, se agregó el 2026-10-01** con
estos pasos. De sus 89 fotos se apartaron 48 tomas repetidas en `repetidas/`, y
quedaron 41. Llegaron sin EXIF y numeradas `1.jpeg`…`103.jpeg`, con 14 videos
intercalados; por esos nombres `pnpm fotos` numera ahora en orden natural, y con
el alfabético la galería habría salido 1, 10, 100… La portada que eligió el club,
`46.jpeg`, quedó como `foto-09`, porque ni los videos ni las apartadas cuentan.

**El séptimo, la charla «Serverless en AWS», se agregó el mismo día** sin más
imagen que su afiche, un AVIF descargado de Meetup. Por él `pnpm fotos` acepta
ahora AVIF y WebP. Es el patrón para un evento sin fotos: el afiche como única
foto, `portada: 1` y `enInicio: false`, para que no entre en el collage. La
tarjeta y la galería dicen «Ver la foto» y «1 foto» cuando hay una sola.

**Para agregar fotos a un evento ya publicado:** ponerlas en su carpeta de
`Eventos/` y correr `pnpm fotos`. Las nuevas van al final con los números
siguientes, sin importar su nombre, y las demás conservan el suyo, así que
`portada` sigue apuntando a la misma foto. El manifiesto cambia: va en el mismo
commit que las fotos.

**Para quitar fotos de un evento ya publicado:** apartar los originales en
`repetidas/`, borrar sus WebP, renumerar las que quedan sin huecos, reescribir
el manifiesto y corregir `portada`, todo en el mismo commit. Los pasos están en
[arquitectura.md](arquitectura.md#números-que-no-cambian) y el porqué en
[D-30](decisiones.md#d-30).

**Tomas repetidas fuera de los demás eventos (2026-10-01).** A pedido del club,
el criterio del Community Day se aplicó a los cuatro eventos con varias fotos:
Yachana Day pasa de 28 a 18, «Los 4 Fantásticos» de 27 a 18, el stand de 24 a
15 y FLISol de 42 a 28, y el sitio queda con 127 fotos. El webinar y la charla
de Serverless no tenían repetidas. Las portadas siguen siendo las mismas
imágenes con otro número: 17, 16, 5 y 7. El detalle está en el
[registro de cambios](registro-de-cambios.md).

**Para cambiar la foto de portada de un evento:** abrir la galería del evento,
hacer clic en la foto y leer el contador del visor (`7 / 28`). Ese número va en
`portada: 7`. Es el mismo que el del archivo, `foto-07.webp`.

**Para que un evento no salga en la portada del sitio:** `enInicio: false`. Lo
llevan el webinar de infraestructura y la charla de Serverless, cuyas portadas
son afiches: en su lugar entra Yachana Day. Sigue en `/eventos/`, y en la trayectoria si es hito.

**Decisión abierta:** la portada del sitio toma siempre los eventos más
recientes: tres para el collage, cuatro para «Quiénes somos» y ocho fotos, de dos
en dos, para la galería. Con el Community Day, el collage muestra el Community
Day, FLISol y el stand, y Yachana Day ya no sale en ninguna de las tres: solo en
la trayectoria y en `/eventos/`. Si el club quiere elegir qué eventos salen ahí,
hace falta un campo para ello. Se le preguntó el 2026-09-30 y quedó sin
respuesta; el 2026-10-01 se le avisó de este efecto antes de agregar el evento.

### 3. Presentar al CORE Team en «Quiénes somos»

**Pedido por el club el 2026-09-30. Sin empezar: falta el contenido.** Una
presentación breve de cada integrante del CORE Team dentro de «Quiénes somos»
(`/#nosotros`), para que quien visita el sitio conozca a las personas que llevan
el club y no solo al club.

**Lo que tiene que dar el club**, porque nada de esto se puede inventar:

- Por persona: el nombre como quiere que aparezca, su rol en el club, su carrera
  y dos o tres líneas en primera persona: qué estudia, qué le interesa de la
  nube y qué hace en el grupo.
- Una foto de cada una, de frente y con buena luz, idealmente todas con un
  encuadre parecido. Sirven las del celular.
- Opcional: LinkedIn o GitHub, y las certificaciones de AWS que ya tenga.
- **El visto bueno de cada persona** sobre su texto, su foto y sus enlaces antes
  del push: son datos personales y quedan públicos.

**Cómo construirlo sin romper las reglas del proyecto:**

- **Una colección `equipo`** en `src/content.config.ts`, con un archivo por
  persona en `src/content/equipo/` y el mismo patrón que `eventos`: `nombre`,
  `rol`, `carrera`, `orden`, `foto`, `presentacion` y `enlaces` opcionales. Un
  `.max()` en `presentacion` mantiene las tarjetas parejas, y el helper `image()`
  en `foto` hace que una foto que falta rompa el build, como hoy una `portada`
  inexistente.
- **Las fotos en `src/assets/equipo/`**, no en `public/`, para que Astro las
  optimice y genere los `srcset` como con las de eventos. Si llegan en HEIC hay
  que convertirlas antes: `pnpm fotos` solo procesa `Eventos/`.
- **Fotos siempre locales.** La CSP solo admite imágenes del propio dominio
  (`img-src 'self'`), así que una foto enlazada desde LinkedIn o Gravatar se
  bloquearía en producción sin que el build se queje. Los enlaces a los perfiles
  sí funcionan: la CSP no limita la navegación.
- **Sin JavaScript:** tarjetas estáticas. Si alguna presentación necesita más
  espacio, un `<details>` nativo antes que un modal. El JavaScript de la portada
  no debería moverse de 4.6 KB.
- **Texto en la escala `tinta`;** el morado va en el marco o el halo de la foto.
  El `alt` de cada foto es el nombre de la persona.
- **Dónde:** bajo el bloque actual de «Quiénes somos», con su propio subtítulo.
  Si el equipo pasa de ocho personas, la portada se alarga demasiado: entonces
  conviene una página `/equipo/` enlazada desde ahí.

### 4. Profundizar fichas breves (prioridad media)

El catálogo ya está completo en cobertura; lo que queda es profundidad. Hay 210
fichas breves esperando su frontmatter completo y su diagrama. El orden sensato
es por uso real: primero lo que el club enseña en talleres, después lo que entra
en certificación, y el resto según haga falta.

Las 19 categorías de `src/lib/categorias.ts` están todas en uso, así que ampliar
una ficha no exige tocar ese archivo.

### 5. El peso del catálogo (decisión pendiente)

`src/pages/servicios/index.astro` embebe un índice de búsqueda con `define:vars`.
Con 6 fichas pesaba unos pocos KB; con 251 pesa **51.4 KB sin comprimir, 14.7 KB
con gzip**, y la página completa pasa de 503 KB (42.5 KB con gzip). El script
propio sigue siendo de 1.0 KB: lo que creció son los datos, no el código.

Ese índice duplica texto que ya está en el DOM de cada tarjeta —nombre, nombre
completo, resumen y categoría—, así que se podría construir en el cliente a
partir de las propias tarjetas y ahorrar los 51 KB sin cambiar el comportamiento.
**No se ha hecho:** toca el script del catálogo, y la tercera regla del proyecto
pide discutir antes cualquier cosa que mueva el presupuesto en un orden de
magnitud.

### 6. Ideas que quedaron sobre la mesa

**Para el Student Community Day.** El 2026-10-05 se le propusieron al club
varias ideas para darle más visibilidad, y eligió solo el cartel en la portada y
la página propia. Las demás siguen disponibles si las pide:

- **Barra de anuncio en todas las páginas,** sobre la navegación: quien llega
  desde Google a una de las 251 fichas no pasa por la portada.
- **Cuenta regresiva** («Faltan N días»), solo en días y con la fecha escrita en
  el HTML. Es la única idea con JavaScript: menos de medio KB.
- **El afiche como `og:image` de la portada** mientras dure la campaña. Hoy la
  portada comparte la foto del stand.
- **Datos estructurados de evento** (schema.org `Event`), para que Google pueda
  mostrarlo con fecha y lugar. Es un `<script type="application/ld+json">`, que
  la CSP no bloquea porque no se ejecuta.
- **Un enlace destacado en la navegación** y un **bloque «Próximo evento»** arriba
  de `/eventos/`.
- **El evento como próximo hito de la trayectoria,** con un tramo punteado hacia
  el futuro.

**Del resto del sitio:**

- **Buscador de todo el sitio.** `pnpm build` genera el índice de Pagefind en
  `dist/pagefind/`, pero **ninguna página lo carga**: la única búsqueda que existe
  hoy es el filtro del catálogo. Falta decidir dónde va el buscador y medir su
  peso contra el presupuesto de JS. Si se añade, la CSP necesita
  `'wasm-unsafe-eval'` ([D-25](decisiones.md#d-25)).
- **Iconos oficiales de AWS.** AWS publica un set de *AWS Architecture Icons*
  (~750 SVG) que no está en `Branding/`. Si se descarga, los nodos de los
  diagramas podrían llevar el icono real de cada servicio en vez de solo texto.
- **Modo oscuro.** El kit de marca ya trae `brandmark-white.svg`, así que la
  parte de identidad estaría resuelta. Habría que definir la escala `tinta`
  invertida y revisar los contrastes del canvas de partículas.

---

## Cómo añadir una ficha de servicio nueva

El catálogo ya cubre los 251 servicios, así que lo habitual no será crear una
ficha sino **ampliar una breve a completa**. Los dos casos:

1. Crear `src/content/servicios/<categoria>/<slug>.mdx`. La carpeta debe
   coincidir con el campo `categoria`.
2. Copiar el frontmatter de una ficha existente como plantilla — el esquema
   completo está en `src/content.config.ts` y **el build falla si algo no cuadra**,
   que es justo lo que se busca.
3. Si la ficha lleva diagrama, importar el componente **después** del frontmatter:

```mdx
import DiagramaAWS from '../../../components/DiagramaAWS.astro';
```

La ruta tiene tres niveles porque las fichas viven en
`src/content/servicios/<categoria>/`.

### La forma de una ficha breve

Es el mínimo que exige el esquema, más enlaces oficiales y una descripción corta.
Sirve de plantilla para las 210 que están así:

```mdx
---
nombre: 'AWS Elemental MediaConvert'
categoria: 'medios'
nivel: 'intermedio'
resumenCorto: 'Transcodificación de archivos de video a los formatos y calidades necesarios para su distribución.'
cuandoAplicarlo: 'Cuando un archivo maestro debe convertirse a varias resoluciones y formatos para reproducirse en cualquier dispositivo.'

enlaces:
  - titulo: 'Página oficial de AWS Elemental MediaConvert'
    url: 'https://aws.amazon.com/mediaconvert/'
  - titulo: 'Precios de AWS Elemental MediaConvert'
    url: 'https://aws.amazon.com/mediaconvert/pricing/'

actualizado: 2026-09-03
autor: 'AWS SBG UCuenca'
---

## Descripción

Dos o tres párrafos: qué hace, en qué se diferencia de su vecino más parecido y
qué conviene saber antes de usarlo.
```

### Ampliar una breve a completa

Trabajo puramente aditivo, sin migración ni cambio de esquema:

1. Añadir al frontmatter `analogia`, `casosDeUso`, `conceptosClave`,
   `modeloDePrecios`, `capaGratuita`, `trampasDeCosto`, `alternativas`,
   `serviciosRelacionados` y `certificaciones`.
2. Completar el cuerpo con las cuatro secciones del patrón: `## Descripción`,
   `## Cómo funciona`, `## Manos a la obra` y `## Ejemplo visual`.
3. Añadir el diagrama y su `import`.
4. Actualizar `actualizado`.

Las seis fichas de referencia para el estilo son EC2, Lambda, S3, DynamoDB,
CloudFront e IAM.

### Comprobaciones que conviene correr

`resumenCorto` tiene un máximo de 160 caracteres, los slugs de `alternativas` y
`serviciosRelacionados` deben existir, y la carpeta debe coincidir con
`categoria`. Nada de eso lo verifica el build, así que:

```bash
python -c "import glob,os,re,collections; R=r'src/content/servicios'; F={f'{os.path.basename(os.path.dirname(p))}/{os.path.basename(p)[:-4]}':open(p,encoding='utf-8').read() for p in glob.glob(os.path.join(R,'*','*.mdx'))}; print(len(F),'fichas'); print('rotos:',[(k,r) for k,t in F.items() for r in re.findall(r"^\s*(?:-|slug:)\s*'([a-z0-9-]+/[a-z0-9.-]+)'", t.split('---')[1], re.M) if r not in F])"
```

---

## Cómo añadir un diagrama

Ver [componentes.md](componentes.md#diagramaawsastro) para la referencia
completa. El resumen práctico:

```astro
<DiagramaAWS
  titulo="Frase corta que nombra el patrón"
  descripcion="Narración del flujo en prosa, nombrando TODOS los servicios."
  nodos={[
    { id: 'actor', etiqueta: 'Visitante', tipo: 'externo' },
    { id: 'svc',   etiqueta: 'Amazon S3', sub: 'bucket privado', categoria: 'almacenamiento' },
  ]}
  flujos={[{ de: 'actor', a: 'svc', etiqueta: 'sube' }]}
/>
```

### Reglas aprendidas construyendo los seis

1. **Etiquetas de flujo: 12 caracteres como máximo.** El build avisa si te
   pasas. Si el término preciso no cabe, ponlo en la `descripcion`.
2. **La `descripcion` debe nombrar todos los servicios del dibujo.** Pagefind
   **no** indexa el texto de un SVG; solo el pie de figura. Es también la
   alternativa textual para lectores de pantalla, así que es obligatoria.
3. **Las columnas se calculan solas.** `fila` solo hace falta para ordenar
   ramas paralelas (ver EC2 e IAM).
4. **`tipo: 'externo'`** para actores que no son servicios de AWS: usuarios,
   navegadores, GitHub Actions. Salen con borde punteado y en gris.
5. **Usa una `categoria` válida** de `src/lib/categorias.ts`. Si el slug no
   existe, el nodo sale en gris oscuro por defecto y pierde el código de color.

### Un tropiezo que cuesta 10 minutos si no se sabe

Dentro de una expresión de Astro, `{/* comentario */}` **no es un comentario**:
el compilador lo lee como un objeto literal y falla con
`CompilerError: Expected ',' or ')' but found 'Identifier'`. Los comentarios en
la plantilla van como `<!-- -->` fuera de la expresión.

---

## Comandos

```bash
pnpm dev      # servidor de desarrollo en localhost:4321
pnpm build    # compila a dist/ y genera el índice de Pagefind
pnpm fotos    # convierte Eventos/ a WebP en src/assets/eventos/
pnpm enlaces  # revisa los enlaces internos de dist/ (después de pnpm build)
```

### Cómo comprobar que no se rompió nada

```bash
pnpm build
pnpm enlaces
```

Vigila tres cosas en la salida: que no aparezca ningún aviso `[DiagramaAWS]`,
que el número de páginas siga cuadrando (hoy: 259 indexadas por Pagefind, de las
cuales 251 son fichas de servicio) y que `pnpm enlaces` termine con ✓. Este
último detecta enlaces internos sin barra final, destinos que no existen —por
ejemplo un `slug` mal escrito en `alternativas`— y anclas rotas.

Para medir el JavaScript de una página:

```bash
python -c "import re; h=open('dist/index.html',encoding='utf-8').read(); print(sum(len(m) for m in re.findall(r'<script type=\"module\">(.*?)</script>',h,re.S))/1024, 'KB')"
```

### El build local en esta máquina

Desde el 2026-10-05, **Smart App Control de Windows bloquea binarios nativos del
build**. El mensaje dice *An Application Control policy has blocked this file*,
aunque Astro lo presenta como `Cannot find native binding`. Son dos:

| Binario | Para qué sirve | Bloqueado |
| --- | --- | --- |
| `satteri_napi.win32-x64-msvc.node` | Compilador de Markdown y MDX por defecto de Astro 7 | Siempre, desde el 2026-10-05 |
| `astro.win32-x64-msvc.node` | Compilador de los `.astro` | A ratos: el 2026-10-06, con la red a ~50 KB/s |

Smart App Control decide consultando la reputación de cada archivo en la nube,
así que con la red lenta bloquea más. No se desactiva: es configuración de
seguridad y, una vez apagado, Windows no deja volver a encenderlo sin reinstalar.
El registro de Windows lo confirma (`Microsoft-Windows-CodeIntegrity/Operational`,
eventos 3077 y 3118).

**Para el de Markdown hay salida sin descargar nada.** Astro trae también
`unified`, un compilador escrito en JavaScript. Se usa con una configuración
aparte, `astro.config.verificacion.mjs`, que está en `.gitignore` porque solo
sirve en esta máquina:

```js
import base from './astro.config.mjs';
import { unified } from './node_modules/.pnpm/@astrojs+markdown-remark@7.2.2/node_modules/@astrojs/markdown-remark/dist/index.js';

export default { ...base, markdown: { ...base.markdown, processor: unified() } };
```

```bash
pnpm exec astro build --config astro.config.verificacion.mjs && pnpm exec pagefind --site dist
```

La ruta del `import` lleva la versión: si Astro se actualiza, hay que corregirla.
El HTML puede diferir en detalles del de satteri, como las comillas tipográficas o
los identificadores de los títulos. Para verificar un cambio basta, pero lo que se
publica sale de Amplify, que compila en Linux con satteri.

**Para el compilador de Astro no hay salida sin descargar algo:** su versión en
WebAssembly (`@astrojs/compiler-binding-wasm32-wasi`) no viene instalada. Si el
bloqueo se vuelve permanente, lo más limpio es compilar en un contenedor Linux
con Docker Desktop, como hace Amplify.

### Lo que el build no comprueba: la CSP

`pnpm build` no sabe nada de `customHttp.yml`. Si un cambio añade un recurso de
otro origen —un video embebido, analítica, una fuente de un CDN, una API—, el
build pasa y el navegador lo **bloquea en producción**, con un error en la consola
y nada más. Antes de hacer push de algo así, hay que declararlo en la CSP
([D-25](decisiones.md#d-25)).

Para probarlo sin publicar: servir `dist/` con un servidor estático propio que
añada las cabeceras de `customHttp.yml`, recorrer las páginas afectadas y buscar
errores `Refused to…` en la consola del navegador.

Así se probó el Student Community Day el 2026-10-05. El servidor fue un script
de Node de unas 60 líneas que lee las reglas de `customHttp.yml`, y le daba a los
`.ics` un tipo binario por defecto para comprobar que la regla los corregía. La
consola y las capturas salieron de Edge sin ventana (`--headless=new`, por CDP,
con `prefers-reduced-motion: reduce` para que los reveals salgan en su estado
final). El panel del navegador de Claude no dibuja mientras está oculto, y sus
capturas se quedan en blanco o a medias.

### Después de cada push

Amplify tarda unos 2 minutos en publicar. Para confirmar que el sitio responde
como debe:

```bash
curl -sI https://aws-sbg-ucuenca.d2jrpw2uglkitl.amplifyapp.com/ | grep -iE "^HTTP|content-security|strict-transport|cache-control"
```

Debe dar 200 con la CSP y HSTS. Una URL inexistente
(`…/no-existe/`) debe dar **404 sin `Location`**, y un archivo de `/_astro/`,
`Cache-Control: public, max-age=31536000, immutable`.

**Cuándo terminó de publicar.** El `Last-Modified` de la portada cambia con cada
despliegue, aunque el HTML sea el mismo. Si otra sesión empujó poco antes, hay
dos builds en cola: el propio es el segundo cambio. Si el push crea una página
nueva, es más directo esperar a que esa URL deje de dar 404, y el
`Last-Modified` puede tardar unos segundos más en cambiar.

**Si el cambio no se ve en el sitio** (scripts, `docs/`, el manifiesto), lo que
se comprueba es que producción sea idéntica al `dist/` local. Hay que normalizar
tres cosas: los `\r`, porque en Windows los `.mdx` tienen CRLF y Amplify compila
con LF; el id que `DiagramaAWS` sortea en cada build, y la URL del sitio, que
aparece tal cual y también codificada (`https%3A%2F%2F…`) dentro del enlace de
Google Calendar del Student Community Day. Sin esa última, la portada y
`/student-community-day/` parecen distintas aunque no lo sean:

```bash
U=https://aws-sbg-ucuenca.d2jrpw2uglkitl.amplifyapp.com
norm() { sed -e "s#$U#http://localhost:4321#g" -e "s#https%3A%2F%2Faws-sbg-ucuenca.d2jrpw2uglkitl.amplifyapp.com#http%3A%2F%2Flocalhost%3A4321#g" | tr -d '\r' | sed -E 's/(pie|punta)-[a-z0-9]+/\1-ID/g'; }
cmp <(curl -s "$U/eventos/" | norm) <(norm < dist/eventos/index.html) && echo idénticas
```
