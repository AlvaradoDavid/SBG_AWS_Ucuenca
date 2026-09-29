# Estado del proyecto y siguientes pasos

Documento de traspaso: dónde está el sitio hoy, qué falta, y cómo hacer las
tareas que quedan pendientes sin tener que redescubrir nada.

---

## Dónde está el sitio hoy

| Área | Estado |
| --- | --- |
| Diseño y sistema de tokens | Completo y documentado |
| Navegación (escritorio y móvil) | Completa |
| Portada | Completa: hero con collage, cifras, partículas, trayectoria, galería |
| Galería de eventos | Completa, con visor accesible |
| Catálogo de servicios | **251 fichas: el catálogo completo de AWS.** 41 completas con diagrama, 210 breves |
| Contenido de eventos | ⚠️ **Los 5 son `[Placeholder]`** |
| Accesibilidad | AA en todo; AAA en los contrastes principales |
| Presupuesto de JS | 4.6 KB en portada, 1.0 KB en el resto. **Ojo con los datos del catálogo:** ver el punto 4 |
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

**Pendiente:**

- **Subdominio de la Universidad.** Aplazado. Cuando llegue, se añade como
  dominio en Amplify y se define `SITE_URL`.

**Lo que no se hace:** activar el firewall (WAF) que ofrece Amplify — ver
[D-24](decisiones.md#d-24).

### 2. Contenido de los eventos (prioridad alta)

Los cinco `.mdx` de `src/content/eventos/` tienen `[Placeholder]` como cuerpo:

- `yachana-day-2026.mdx`
- `cuatro-fantasticos-aws.mdx`
- `infraestructura-cloud.mdx`
- `stand-inicio-de-ciclo.mdx`
- `flisol-2026.mdx`

El diseño ya está listo para recibir el texto; solo falta escribirlo. Las fotos
de cada evento pueden servir de guion para recordar qué pasó.

Ninguno tiene `asistentes` en el frontmatter. Si alguien llevó el registro, ese
campo ya está soportado y se muestra como una etiqueta en la página del evento.

### 3. Profundizar fichas breves (prioridad media)

El catálogo ya está completo en cobertura; lo que queda es profundidad. Hay 210
fichas breves esperando su frontmatter completo y su diagrama. El orden sensato
es por uso real: primero lo que el club enseña en talleres, después lo que entra
en certificación, y el resto según haga falta.

Las 19 categorías de `src/lib/categorias.ts` están todas en uso, así que ampliar
una ficha no exige tocar ese archivo.

### 4. El peso del catálogo (decisión pendiente)

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

### 5. Ideas que quedaron sobre la mesa

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
```

### Cómo comprobar que no se rompió nada

```bash
pnpm build
```

Vigila dos cosas en la salida: que no aparezca ningún aviso `[DiagramaAWS]`, y
que el número de páginas siga cuadrando (hoy: 256 indexadas por Pagefind, de las
cuales 251 son fichas de servicio).

Para medir el JavaScript de una página:

```bash
python -c "import re; h=open('dist/index.html',encoding='utf-8').read(); print(sum(len(m) for m in re.findall(r'<script type=\"module\">(.*?)</script>',h,re.S))/1024, 'KB')"
```
