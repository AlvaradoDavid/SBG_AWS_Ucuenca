# Arquitectura

## Stack

| Pieza | Versión | Por qué |
| --- | --- | --- |
| [Astro](https://docs.astro.build) | ^7.1.6 | Genera HTML estático; envía cero JavaScript salvo lo que se pida explícitamente |
| Tailwind CSS | ^4.3.3 | Vía `@tailwindcss/vite`, con tokens definidos en `@theme` |
| MDX | ^7.0.5 | Permite componentes dentro del contenido de fichas y eventos |
| Pagefind | ^1.5.2 | Índice de búsqueda generado en el build, sin servidor |
| Sharp + heic-convert | — | Solo en desarrollo, para el pipeline de fotos |

No hay React, Vue ni Svelte. El sitio no tiene ningún runtime de framework en
el cliente.

## Estructura

```
src/
├── assets/eventos/         Fotos ya optimizadas a WebP (las procesa pnpm fotos)
├── components/             Componentes .astro
├── content/
│   ├── eventos/            Un .mdx por evento
│   └── servicios/          Un .mdx por servicio de AWS, en carpetas por categoría
├── layouts/Layout.astro    Envoltura común: head, nav, footer, script de reveals
├── lib/                    Lógica compartida sin UI
├── pages/                  Rutas (el archivo define la URL)
└── styles/global.css       Tokens de diseño, fuentes y utilidades propias

public/
├── fonts/                  Amazon Ember (.ttf del kit oficial)
└── marca/                  Logos e iconos en SVG

Eventos/                    Material original pesado. NO entra al repo.
Branding/                   Kit de marca oficial de AWS.
scripts/procesar-fotos.mjs  Convierte Eventos/ → src/assets/eventos/
```

## Colecciones de contenido

Definidas con esquemas de Zod en `src/content.config.ts`. Si un `.mdx` no cumple
el esquema, **el build falla** — es intencional: evita publicar fichas a medias.

### `eventos`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `titulo` | string | |
| `fecha` | date | Se parsea como medianoche **UTC** (ver más abajo) |
| `carpetaFotos` | string | Carpeta dentro de `src/assets/eventos/` |
| `resumen` | string | |
| `lugar` | string? | |
| `hito` | boolean | Si es `true`, aparece en la trayectoria de la portada |
| `asistentes` | number? | |

### `servicios`

Esquema más amplio, agrupado por intención:

- **Identidad:** `nombre`, `nombreCompleto`, `categoria`, `nivel`, `resumenCorto` (máx. 160)
- **Decisión:** `cuandoAplicarlo`, `analogia`, `casosDeUso`, `alternativas`
- **Costo:** `modeloDePrecios`, `capaGratuita`, `trampasDeCosto`
- **Aprendizaje:** `conceptosClave`, `certificaciones`, `enlaces`
- **Red:** `serviciosRelacionados` (slugs que enlazan fichas entre sí)
- **Mantenimiento:** `actualizado`, `autor`, `destacado`

`categoria` y `nivel` son enums generados desde `src/lib/categorias.ts`, así que
la lista de categorías vive en un solo lugar. Hoy son **19 categorías**, y la
carpeta de cada ficha debe coincidir con su `categoria`.

**Solo cinco campos son obligatorios:** `nombre`, `categoria`, `nivel`,
`resumenCorto`, `cuandoAplicarlo` y `actualizado`. Eso es lo que permite las dos
profundidades de ficha que conviven en el catálogo —completa y breve— sin tocar
el esquema. Ver [estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md).

El catálogo cubre los **251 servicios** que AWS lista en su directorio de
productos, así que `src/content/servicios/` tiene 251 archivos repartidos en 19
carpetas.

## Pipeline de fotos

`Eventos/` guarda el material original: HEIC de iPhone, MOV, JPG. Pesa cientos
de megabytes y **está en `.gitignore`** — GitHub rechaza archivos de más de
100 MB y el video de Yachana Day pesa ~348 MB.

`pnpm fotos` (`scripts/procesar-fotos.mjs`) hace la conversión:

```
Eventos/2026-05-16 AWS Club en FLISol/IMG_0365.HEIC
   ↓ heic-convert → JPEG
   ↓ sharp → WebP
src/assets/eventos/2026-05-16-aws-club-en-flisol/foto-01.webp       (1600px)
src/assets/eventos/2026-05-16-aws-club-en-flisol/foto-01-mini.webp  (600px)
```

Los videos se ignoran. Se generan dos tamaños:

| Salida | Ancho | Uso |
| --- | --- | --- |
| `foto-NN.webp` | 1600 px | Lightbox |
| `foto-NN-mini.webp` | 600 px | Miniaturas de galería y portadas |

`src/lib/fotos.ts` las carga con `import.meta.glob` en tiempo de build, así que
Astro las optimiza y genera los `srcset` automáticamente. `fotosDeEvento(carpeta)`
empareja cada foto con su miniatura.

## Fechas: siempre en UTC

`src/lib/fechas.ts` formatea todo con `timeZone: 'UTC'` a propósito.

Las fechas del frontmatter (`2026-05-16`) se parsean como medianoche UTC. Si se
formatearan en la zona local de Ecuador (UTC−5), el día retrocedería uno y un
evento del 16 aparecería como 15. Por eso el formateo es explícitamente UTC.

## Despliegue

> **Estado: preparado, todavía no conectado.** El repositorio está en GitHub y el
> código listo para Amplify; falta crear la app en la consola. Los pasos están en
> [estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md#1-conectar-el-repositorio-a-amplify).

El sitio se aloja en **AWS Amplify Hosting**, conectado a la rama
`aws-sbg-ucuenca` de <https://github.com/AlvaradoDavid/SBG_AWS_Ucuenca>. Cada push
a esa rama dispara un build en Amplify y publica `dist/`. El porqué de Amplify
frente al plan original con S3 + CloudFront está en [D-23](decisiones.md#d-23).

Build estático a `dist/` (260 páginas, 387 fotos WebP, índice de Pagefind). No
hay servidor ni funciones de renderizado: todo el HTML se genera en `pnpm build`.

```
push a aws-sbg-ucuenca → Amplify: pnpm install + pnpm build → CDN de Amplify → visitante
```

### La URL pública

```
https://aws-sbg-ucuenca.<id-de-la-app>.amplifyapp.com
```

El primer tramo es el **nombre de la rama**, y por eso la rama se llama como el
club: renombrarla cambia la URL pública. El segundo tramo lo genera AWS al crear
la app y no se puede elegir.

`astro.config.mjs` arma esa URL sola a partir de `AWS_BRANCH` y `AWS_APP_ID`, dos
variables que Amplify inyecta en cada build. Si se define `SITE_URL` en la
consola, gana ella: es el mecanismo para cuando llegue un dominio propio. En
local, sin ninguna de las tres, queda `http://localhost:4321`.

### Qué vive en el repositorio y qué en la consola

| Pieza | Dónde | Para qué |
| --- | --- | --- |
| `amplify.yml` | Repositorio | Receta del build: Node 24, pnpm del `packageManager`, caché del store |
| `packageManager` en `package.json` | Repositorio | Fija pnpm 11.20.0; el build nunca usa «latest» |
| `src/pages/404.astro` | Repositorio | Genera `dist/404.html` |
| Regla `/<*>` → `/404.html` (404) | **Consola** | Sin ella Amplify no sirve la 404 propia. No se puede declarar en el repo |
| `SITE_URL` | **Consola** | Solo si hay dominio propio |

### Las dos piezas que fallan en silencio

1. **La regla de la 404.** Al crear la app, Amplify pone su propia regla por
   defecto. Hay que sustituirla por `/<*>` → `/404.html` con tipo *404*, o las URLs
   equivocadas no mostrarán la página del sitio.
2. **Renombrar la rama.** Cambia la URL pública y rompe cualquier enlace ya
   compartido. La rama `aws-sbg-ucuenca` no se renombra.

### Rutas limpias

Amplify resuelve solo `/eventos/flisol-2026/` → `/eventos/flisol-2026/index.html`,
así que no hace falta nada equivalente a la CloudFront Function del plan
anterior. A una ruta sin barra final (`/eventos/flisol-2026`), Amplify la
redirige a la versión con barra.

### Servicios complementarios

| Servicio | Para qué | Estado |
| --- | --- | --- |
| **Budgets** + **Cost Anomaly Detection** | Alarma de gasto. Con los créditos **excluidos** del cálculo — ver [D-17](decisiones.md#d-17) | Pendiente, **antes** de crear la app |
| **S3 Glacier Instant Retrieval** | Archivar los originales de `Eventos/`, hoy en un solo disco duro | Pendiente |
| **API Gateway + Lambda + DynamoDB + SES** | Formulario de inscripción a eventos. Añadiría el primer backend del sitio | Pendiente, opcional |

### Costo

Amplify cobra por minutos de build, almacenamiento y transferencia. Con el
tráfico de un club, todo queda cubierto por los créditos. Lo único que crece con
el uso son los **minutos de build**: cada push dispara un build completo, así
que conviene no hacer push de cambios a medias. El presupuesto de [D-17](decisiones.md#d-17)
avisa si algo se dispara.
