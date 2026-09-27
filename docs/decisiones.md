# Registro de decisiones

Cada entrada anota **qué** se decidió y, sobre todo, **por qué**. Sirve para que
dentro de seis meses nadie deshaga algo sin saber qué problema resolvía.

---

## D-01 · El color de marca no se usa para texto

**Decisión.** Los cinco colores vibrantes del kit (amber, blue, mint, purple,
magenta) se usan solo como marcador visual. El texto sale siempre de la escala
`tinta`.

**Por qué.** Son colores saturados y claros. Ninguno alcanza 4.5:1 sobre blanco,
el mínimo de WCAG AA para texto normal. Usarlos como color de texto haría el
sitio bonito en la pantalla del diseñador e ilegible para buena parte de la gente.

**Consecuencia.** Cuando hace falta más presencia de marca, se resuelve con
halos, degradados, bordes y barras — no subiendo la saturación del texto.

---

## D-02 · Fuentes servidas localmente

**Decisión.** Amazon Ember se sirve desde `public/fonts/`, no desde un CDN.

**Por qué.** Son fuentes del kit oficial, no están en Google Fonts. Además evita
una conexión a un tercero y que ese tercero registre a los visitantes.

---

## D-03 · Las fechas se formatean en UTC

**Decisión.** `src/lib/fechas.ts` fuerza `timeZone: 'UTC'`.

**Por qué.** El frontmatter usa `2026-05-16`, que se parsea como medianoche UTC.
Formateado en la zona de Ecuador (UTC−5), el día retrocede y el evento aparece
como 15 de mayo. Es un error silencioso: no rompe el build, solo publica fechas
equivocadas.

---

## D-04 · Los reveals se activan desde JavaScript

**Decisión.** La regla `opacity: 0` está bajo `.reveal-activo`, y esa clase la
añade el script al cargar.

**Por qué.** Si `opacity: 0` estuviera directamente en `[data-reveal]`, cualquier
fallo de JavaScript dejaría la página en blanco. Con este orden, el peor caso es
que el contenido aparezca sin animación.

---

## D-05 · Menú móvil propio

**Decisión.** Menú hamburguesa escrito a mano en `Nav.astro`.

**Por qué.** Antes no existía: en móvil solo se veían el logo y un botón
«Servicios», así que *Eventos* y *Quiénes somos* eran inalcanzables desde el
teléfono. No era una decisión de diseño, era un defecto.

---

## D-06 · El contador tiene una red de seguridad

**Decisión.** Además de la animación con `requestAnimationFrame`, hay un
`setTimeout` que fuerza el valor final.

**Por qué.** Los navegadores congelan `requestAnimationFrame` en pestañas de
fondo. La primera versión ponía la cifra en `0` y esperaba el primer frame; si
ese frame nunca llegaba, la página se quedaba anunciando **«0 eventos»** — un
dato falso, peor que no animar. `setTimeout` sí corre en pestañas ocultas.

**Cómo se detectó.** Al intentar medir la animación en un panel de navegador
oculto, la prueba se colgó. El cuelgue era el síntoma del bug.

---

## D-07 · Las flechas del visor flotan sobre la foto

**Decisión.** En móvil, el `figure` usa `px-3`; las flechas se superponen a la
imagen con fondo translúcido propio.

**Por qué.** Con `px-16` en ambos lados, una pantalla de 375 px dejaba la foto en
247 px. Flotando las flechas se recuperan 351 px útiles, un 42 % más.

---

## D-08 · MCP de 21st.dev: revisión de seguridad

**Contexto.** Se evaluó el servidor MCP de [21st.dev](https://21st.dev/mcp) para
traer componentes de UI al proyecto.

**Hallazgo.** Es un proyecto legítimo (MIT, ~5.6k estrellas), pero tiene un
riesgo inherente documentado: el
[issue #46](https://github.com/21st-dev/magic-mcp/issues/46) describe una
inyección de prompts indirecta. El servidor trae código de un catálogo
comunitario abierto de más de 10.000 componentes; un atacante puede esconder
instrucciones en comentarios o nombres de variables, y esas instrucciones entran
al contexto del agente. Clasificado como OWASP LLM01.

**Decisión.** Se usa la variante **HTTP alojada**, no el paquete `npx`.

| | `npx @21st-dev/magic@latest` | `https://21st.dev/api/mcp` ✅ |
| --- | --- | --- |
| Ejecuta código local | Sí, paquete npm desactualizado | No, solo peticiones de red |
| Superficie de ataque | Sistema de archivos completo | Solo el contexto de la conversación |

**Mitigaciones vigentes.**

- Todo lo que devuelve el MCP se trata como **dato, nunca como instrucción**
- El código de cualquier componente se revisa antes de entrar al proyecto
- `.mcp.json` está en `.gitignore` porque contiene la API key en texto plano

---

## D-09 · Componentes React de terceros: qué hay que medir antes

**Contexto.** Se evaluó incorporar `particle-drift`, un componente React de
fondo animado con partículas.

**Hallazgo.** El componente monta un `<iframe srcDoc>` con un documento HTML
completo dentro. Ese documento carga en tiempo de ejecución:

| Recurso | Origen | Peso aprox. sin comprimir |
| --- | --- | --- |
| Tailwind JIT | `cdn.tailwindcss.com` | ~370 KB |
| GSAP | `cdnjs.cloudflare.com` | ~70 KB |
| ScrollTrigger | `cdnjs.cloudflare.com` | ~40 KB |
| Iconify | `code.iconify.design` | ~30 KB |
| Inter + Playfair Display | `fonts.googleapis.com` | 2 familias |

Más React y `react-dom` para poder montarlo en Astro. Comprimido con gzip el
total ronda los 200 KB, contra los 1.6 KB que carga hoy la portada. Son cuatro
orígenes de terceros que pueden servir código distinto en cualquier momento.

**Otros puntos medidos.**

- El bucle de dibujo es O(n²): 90 nodos son 4.005 comparaciones por fotograma,
  unas 240.000 llamadas a `Math.hypot()` por segundo, sin pausa
- No contempla `prefers-reduced-motion`
- `cdn.tailwindcss.com` está explícitamente desaconsejado para producción por el
  propio Tailwind
- El color de las partículas es `#60A5FA`, ajeno a la paleta del club
- A favor: el `sandbox="allow-scripts"` sin `allow-same-origin` está bien
  elegido y limita el alcance de cualquier código del iframe

**Criterio que queda.** Antes de traer un componente externo se comparan tres
cosas contra la versión propia: **peso real**, **orígenes de terceros** y
**soporte de `prefers-reduced-motion`**. El efecto visual casi nunca es el
problema; el envoltorio sí.

---

## D-10 · El efecto de partículas se portó, no se instaló

**Decisión.** El fondo de partículas se reescribió como
`FondoParticulas.astro`, en lugar de instalar React y el componente original.

**Por qué.** El efecto visual —nodos a la deriva, líneas de proximidad, haces
ascendentes, reacción al puntero— es un canvas de unas 150 líneas. Todo lo demás
del paquete original era envoltorio: React para montarlo, un iframe para
aislarlo, GSAP y ScrollTrigger para revelar un texto que el propio componente
después oculta, Tailwind por CDN para estilar ese texto oculto, e Iconify para
iconos que tampoco se ven.

**Resultado medido.**

| | Componente original | Port propio |
| --- | --- | --- |
| Peso | ~200 KB gzip | **3.0 KB** |
| Orígenes de terceros | 4 CDNs | **0** |
| `prefers-reduced-motion` | No lo contempla | Fotograma estático |
| Pausa fuera de pantalla | No, anima siempre | Sí |
| Color | `#60A5FA` genérico | Tokens de la marca |
| Contraste del texto encima | Sin medir | 8.13:1, medido |

La portada pasó de 1.6 KB a 4.6 KB de JavaScript. Con el componente original
habría pasado a ~200 KB.

**Lo que sí se conservó del original.** La idea de mantener el efecto como
elemento puramente decorativo (`aria-hidden`, `pointer-events: none`) y separado
del contenido. Esa parte estaba bien resuelta.

---

## D-11 · La máscara del fondo de partículas no lleva degradado horizontal

**Decisión.** `FondoParticulas.astro` solo se desvanece arriba y abajo. No hay
atenuación de izquierda a derecha.

**Por qué.** La primera versión atenuaba el lado izquierdo «para no competir con
el texto». Medido en un viewport de 1440 px:

| Zona | Máscara | Alfa efectiva | ¿Se veía? |
| --- | --- | --- | --- |
| Detrás del collage (53–100 %) | 0.86 | 0.33 | No: las fotos son opacas |
| Zona del texto | 0.37 | **0.14** | Casi invisible |
| Hueco entre columnas | 0.58 | 0.22 | Solo 48 px de ancho |

El efecto quedaba más intenso justo donde el collage lo tapaba, y al 14 % de
alfa donde sí había hueco. Resultado: prácticamente invisible.

**Lección.** Una máscara que reparte un efecto según la posición asume un
layout. Si ese layout tiene elementos opacos encima, la máscara puede estar
mandando el efecto exactamente donde no se ve.

---

## D-12 · Pagefind no indexa el texto de un SVG

**Hallazgo.** Al construir `DiagramaAWS.astro` se asumió que, por ser texto
real, las etiquetas del SVG entrarían al buscador. **No es así.** Comprobado
sobre el índice generado en `dist/pagefind/`:

| Cadena | Dónde vive | ¿Indexada? |
| --- | --- | --- |
| `ObjectCreated` | Solo en el SVG | No |
| `bucket optimizado` | Solo en el SVG | No |
| `sube foto` | Solo en el SVG | No |
| `S3`, `Lambda`, `optimizada` | En el `<figcaption>` | Sí |

**Consecuencia.** La prop `descripcion` debe nombrar todos los servicios que
aparecen en el diagrama. Ya era obligatoria por accesibilidad; ahora también lo
es para que el diagrama sea encontrable.

---

## D-13 · El límite de las etiquetas se avisa en el build, no se documenta y ya

**Decisión.** `DiagramaAWS.astro` calcula si una etiqueta de flujo cabe en el
hueco entre columnas y emite un `console.warn` durante el build si no.

**Por qué.** Al montar los seis diagramas, dos etiquetas se salieron del hueco y
pisaron las cajas vecinas: «si no hay caché» (15 caracteres) y «asume vía OIDC»
(14). El límite real son 12 caracteres, y no hay forma de intuirlo escribiendo
el `.mdx`. Una regla escrita solo en la documentación se habría vuelto a romper
la próxima vez que alguien añada una ficha.

El ancho por carácter está calibrado midiendo etiquetas ya renderizadas —
«HTTPS» (5) ocupó 32 px y «Auto Scaling Group» (18) ocupó 116 px, o sea
6.45 px por carácter — y no estimado a ojo. La primera versión usó 6.6 px y
generaba avisos falsos.

**Efecto secundario útil.** El aviso cazó `ObjectCreated` (13 caracteres), que
la comprobación visual de solapes **no** había marcado porque cabía por 2 px a
cada lado. Cabía, pero se veía apretado.

---

## D-14 · Los comentarios JSX no existen dentro de una expresión de Astro

**Hallazgo.** Escribir `{/* comentario */}` justo después de abrir una expresión
—por ejemplo dentro de `{condicion && ( … )}`— rompe la compilación con
`CompilerError: Expected ',' or ')' but found 'Identifier'`. Astro lo interpreta
como un objeto literal, no como un comentario.

**Regla.** En la plantilla, los comentarios van como `<!-- -->` y fuera de la
expresión. Dentro del frontmatter, `//` y `/* */` funcionan con normalidad.

---

## D-15 · El bucket del sitio es privado; sirve CloudFront con OAC

> **Sustituida por [D-23](#d-23).** El sitio se aloja en Amplify; esta decisión
> se conserva como registro del plan anterior.

**Decisión.** S3 mantiene el bloqueo de acceso público activado y **no** usa
«Static website hosting». CloudFront accede al bucket mediante *Origin Access
Control* (OAC), y es la única puerta de entrada al sitio.

**Por qué.** La alternativa habitual —abrir el bucket y activar el hosting
estático— funciona, pero deja los archivos accesibles por su URL de S3 saltándose
CloudFront: sin HTTPS forzado, sin caché de borde y con el bucket expuesto. Con
OAC el bucket solo responde a peticiones firmadas por la distribución.

**Consecuencia.** Tras crear el OAC hay que **pegar en el bucket la política que
CloudFront ofrece**. Si se omite, el sitio entero devuelve `AccessDenied` y el
mensaje no menciona en ningún momento que falta la política. Es el fallo más
común de este despliegue.

---

## D-16 · Las rutas limpias se resuelven con una CloudFront Function

> **Sustituida por [D-23](#d-23).** El sitio se aloja en Amplify; esta decisión
> se conserva como registro del plan anterior.

**Decisión.** Una CloudFront Function asociada al evento *viewer request*
reescribe la URI: `/servicios/` y `/servicios` pasan ambas a
`/servicios/index.html`.

**Por qué.** Astro genera `servicios/almacenamiento/s3/index.html`. CloudFront
pide a S3 exactamente la clave solicitada, y `/servicios/almacenamiento/s3/` no
existe como objeto. El ajuste `Default root object` **solo cubre la raíz**, no
las subrutas: sin la función, la portada carga y las otras 13 páginas no.

**Por qué una función y no Lambda@Edge.** Reescribir una cadena no justifica un
runtime completo. Las CloudFront Functions se ejecutan en el borde en
microsegundos, cuestan una fracción y traen 2 M de invocaciones gratis al mes.
Lambda@Edge estaría sobredimensionado.

---

## D-17 · El presupuesto de costos excluye los créditos

**Decisión.** El presupuesto de AWS Budgets se configura con la casilla
`Credits` **desmarcada** en «Include the following costs».

**Por qué.** Con los créditos incluidos, AWS los descuenta del total y el
presupuesto marca **$0.00 todos los meses** aunque haya consumo real. La alarma
no salta nunca —hasta el mes en que los créditos se agotan y llega una factura
de golpe. Desmarcándolos se mide el **gasto bruto**: lo que se pagaría sin
créditos, que es la cifra que avisa a tiempo.

**Consecuencia.** El presupuesto marcará cifras distintas de cero desde el
primer mes. Es intencional: son las que hay que vigilar.

---

## D-18 · El despliegue no espera al dominio

> **Vigente en su principio, no en sus detalles.** Con Amplify ([D-23](#d-23))
> se publica primero contra `amplifyapp.com`; lo de ACM en `us-east-1` y la
> distribución de CloudFront ya no aplica.

**Decisión.** El sitio se publica primero contra el dominio que da CloudFront
(`d1a2b3c4.cloudfront.net`). El dominio propio se añade después.

**Por qué.** Los créditos de AWS —Cloud Clubs, Activate, Educate— **no cubren el
registro ni la renovación de dominios en Route 53**. Es una exclusión explícita
de los programas de créditos: ese cargo va a la tarjeta de la cuenta. Sí cubren
la zona alojada ($0.50/mes) y todos los demás servicios.

Atar el despliegue a conseguir un dominio significaba no tener nada en línea
mientras se resuelve un trámite —Student Pack, subdominio de la Universidad o
tarjeta— que puede tardar semanas. El dominio de CloudFront ya es público y con
HTTPS.

**Consecuencia.** Añadir el dominio más tarde no rehace nada: es emitir el
certificado en ACM, declararlo en la distribución y crear dos registros DNS.

**Dos condiciones que conviene no olvidar.** El certificado de ACM **debe
emitirse en `us-east-1`** o CloudFront no lo verá siquiera en el desplegable. Y
Route 53 **no registra dominios `.ec`**: habría que comprarlo en NIC.EC y
delegar el DNS.

---

## D-19 · Price Class «All» en CloudFront

> **Sustituida por [D-23](#d-23).** El sitio se aloja en Amplify; esta decisión
> se conserva como registro del plan anterior.

**Decisión.** La distribución usa *Use all edge locations*, no las clases 100 ni
200.

**Por qué.** Las clases 100 y 200 **excluyen Sudamérica**. Elegirlas «para
ahorrar» haría que el público de Cuenca se atendiera desde Norteamérica, con
peor latencia. Con el tráfico de un club el ahorro es cero —todo cae dentro de
la capa gratuita permanente de 1 TB al mes— así que la clase restringida solo
empeora el servicio sin bajar la factura.

---

## D-20 · El catálogo cubre los 251 servicios, en dos profundidades

**Decisión.** El catálogo incluye **todos** los servicios que AWS lista en su
directorio de productos, pero no todos con el mismo detalle: 40 fichas completas
con diagrama y 211 fichas breves.

**Por qué.** Las seis fichas originales rondan las 105 líneas de prosa propia más
un diagrama. Escribir 251 así serían unas 26.000 líneas, y hacerlo de una sentada
habría significado rellenar plantillas: exactamente lo que hace mala a una ficha.
La alternativa contraria —publicar solo 40 y dejar fuera el resto— deja al
visitante sin respuesta cuando busca un servicio que existe.

Las dos profundidades resuelven las dos cosas a la vez: **cobertura completa hoy,
profundidad incremental después.** Una ficha breve responde qué hace el servicio,
cuándo aplicarlo y dónde leer más; eso ya es más de lo que ofrece no tener ficha.

**Cómo se eligieron las 40.** Peso en Cloud Practitioner, Solutions Architect
Associate y Developer Associate, más lo que el club usa de verdad.

**Consecuencia.** Ampliar una breve a completa es trabajo puramente aditivo: se
le añaden los campos opcionales y su `## Ejemplo visual`. No hay migración, no
hay cambio de esquema, y el catálogo no se rompe mientras tanto. El esquema de
`content.config.ts` ya lo permitía: solo seis campos son obligatorios.

---

## D-21 · Ocho categorías nuevas, sin ampliar la paleta

**Decisión.** `src/lib/categorias.ts` pasó de 11 a 19 categorías. Los colores
siguen siendo los cinco acentos del kit de marca, en rotación.

**Por qué.** AWS agrupa sus 251 servicios en 26 categorías. Con las 11 que había,
71 servicios no tenían casa: IoT, medios, migración, aplicaciones de negocio,
front-end móvil, gestión financiera, cómputo de usuario final y un puñado de
servicios sueltos. Meterlos a la fuerza en las existentes —IoT dentro de
integración, medios dentro de almacenamiento— habría hecho el filtro inútil justo
para quien no sabe qué busca.

Replicar las 26 de AWS tampoco: habría dejado categorías de un solo servicio.
Diecinueve es el punto donde cada categoría agrupa algo reconocible.

**La paleta no se tocó** porque [D-01](#d-01--el-color-de-marca-no-se-usa-para-texto)
sigue mandando: el color acompaña a la etiqueta de texto, nunca la sustituye, así
que repetir un color entre categorías no ambigua nada.

**Una desviación deliberada de la taxonomía de AWS.** API Gateway está en
`integracion-y-mensajeria` y no en front-end, que es donde lo pone AWS. La razón
es que ya aparecía como nodo del diagrama de DynamoDB y la documentación del
propio proyecto lo situaba ahí.

**Consecuencia visible.** El catálogo muestra 20 botones de filtro y ocupan varias
líneas. Es el precio de la cobertura completa.

---

## D-22 · Los servicios retirados se documentan, no se omiten

**Decisión.** Los servicios que AWS ya apagó tienen ficha, con una línea
**Nota:** al final del cuerpo que dice la fecha de fin de soporte y cuál es la
alternativa vigente. Son 32 fichas.

**Por qué.** Aparecen en material de estudio antiguo, en tutoriales y en
arquitecturas heredadas. Alguien que llega buscando «Elastic Transcoder» o
«QLDB» merece encontrar que existió, cuándo se apagó y qué usar en su lugar —no
un resultado vacío que le deja pensando que la búsqueda falló.

**Cómo se verificó.** Contra la
[lista oficial de servicios en apagado](https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html)
y los avisos de fin de soporte de cada servicio, no de memoria. Esa comprobación
detectó dos fichas que se habían redactado como servicios activos —AWS Private 5G
y AWS SimSpace Weaver— y ambas se corrigieron.

**Consecuencia.** Al revisar el catálogo hay que volver a esa lista: AWS sigue
apagando servicios, y una ficha que hoy está bien puede necesitar su nota mañana.

---

## D-23 · El sitio se aloja en Amplify Hosting, no en S3 + CloudFront

**Decisión.** El sitio se publica con **AWS Amplify Hosting**, conectado a la
rama `aws-sbg-ucuenca` del repositorio de GitHub. Sustituye al plan de S3 privado
+ CloudFront + OAC ([D-15](#d-15), [D-16](#d-16), [D-19](#d-19)).

**Por qué.** Pagar un dominio propio no resultó viable, y los créditos no lo
cubren ([D-18](#d-18)). Sin dominio, la URL
pública es la que da el servicio, y ahí Amplify tiene una ventaja:

| Plan | URL sin dominio propio |
| --- | --- |
| CloudFront | `d1a2b3c4.cloudfront.net` |
| Amplify | `aws-sbg-ucuenca.d1a2b3c4.amplifyapp.com` |

El primer tramo de la URL de Amplify es el nombre de la rama, así que el nombre
del club aparece en el enlace. **Resuelve el problema del nombre solo en
parte:** el ID de la app lo genera AWS y no se puede elegir.

Además, Amplify trae incluido lo que el plan anterior había que montar a mano:
build en cada push, invalidación de caché, certificado TLS y rutas limpias.

**Lo que se pierde.** El plan anterior descartaba Amplify precisamente por eso:
para un club de AWS, montar S3 + CloudFront a mano *era* parte del aprendizaje.
Esa pérdida es real. Se compensa en parte ampliando la ficha de Amplify del
catálogo con cómo lo usa el propio sitio.

**Consecuencias.**

- La rama `aws-sbg-ucuenca` **no se renombra**: su nombre forma la URL pública.
- `site` en `astro.config.mjs` se calcula con `AWS_BRANCH` y `AWS_APP_ID`, que
  Amplify inyecta en cada build, porque el ID de la app no existe hasta crearla.
  `SITE_URL` en la consola tiene prioridad sobre ellas.
- El build fija sus versiones: Node 24 en `amplify.yml` y pnpm 11.20.0 en el
  `packageManager` de `package.json`. Con «latest», una versión mayor nueva podría
  romper el build sin que nadie haya tocado el código.
- La regla de la 404 vive en la consola, no en el repositorio.

**Lo que queda abierto.** Un subdominio de la Universidad de Cuenca daría un
nombre de verdad sin costo. Se pedirá más adelante, y conectarlo no rehace nada:
se añade como dominio en Amplify y se define `SITE_URL`.
