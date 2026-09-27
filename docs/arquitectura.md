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

> **Estado: diseñado, todavía no desplegado.** Nada de lo que sigue existe aún
> en la consola de AWS. El procedimiento paso a paso está en
> [estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md#1-desplegar-el-sitio-en-aws).

Build estático a `dist/` (14 páginas, 387 fotos WebP, índice de Pagefind: ~31 MB
en 441 archivos). No hay servidor ni funciones de renderizado: todo el HTML se
genera en `pnpm build`.

### Los cinco servicios del núcleo

| Servicio | Rol |
| --- | --- |
| **S3** | Bucket **privado** con el contenido de `dist/`. Sin hosting estático, sin acceso público |
| **CloudFront** | CDN y única puerta de entrada. Lee de S3 vía OAC. HTTPS forzado |
| **ACM** | Certificado TLS gratuito. **Obligatoriamente en `us-east-1`** |
| **Route 53** | Zona alojada y registros alias hacia CloudFront |
| **IAM** | Rol de despliegue con permisos mínimos, sin claves de larga vida |

```
Visitante → CloudFront ──(OAC, petición firmada)──→ S3 (bucket privado)
                │
                └── CloudFront Function (viewer request): reescribe la URI
```

Todo en **us-east-1**. No es preferencia: ACM solo emite certificados válidos
para CloudFront en esa región, y repartir los recursos entre regiones multiplica
la confusión al depurar. La latencia no entra en la ecuación porque CloudFront
sirve desde ubicaciones de borde.

### Las tres piezas que fallan en silencio

1. **La política del bucket.** Tras crear el OAC hay que pegarla en S3 o todo
   devuelve `AccessDenied` — ver [D-15](decisiones.md#d-15).
2. **Las rutas limpias.** Sin la CloudFront Function que reescribe la URI, solo
   carga la portada — ver [D-16](decisiones.md#d-16).
3. **La región del certificado.** Emitido fuera de `us-east-1`, CloudFront ni
   siquiera lo lista — ver [D-18](decisiones.md#d-18).

### Invalidación

Cada despliegue necesita invalidar `/*` en CloudFront, o los visitantes siguen
viendo la versión anterior. AWS regala 1.000 rutas al mes y `/*` cuenta como
una, así que se puede desplegar a diario sin coste.

### Servicios complementarios

| Servicio | Para qué | Estado |
| --- | --- | --- |
| **Budgets** + **Cost Anomaly Detection** | Alarma de gasto. Con los créditos **excluidos** del cálculo — ver [D-17](decisiones.md#d-17) | Pendiente |
| **S3 Glacier Instant Retrieval** | Archivar los originales de `Eventos/`, hoy en un solo disco duro | Pendiente |
| **API Gateway + Lambda + DynamoDB + SES** | Formulario de inscripción a eventos. Añadiría el primer backend del sitio | Pendiente, opcional |

### Costo

Con capa gratuita y tráfico de club, la infraestructura sale **≈ $0.50/mes** (la
zona de Route 53) y queda cubierta por los créditos. La excepción es el dominio:
**los créditos no pagan el registro** — ver [D-18](decisiones.md#d-18).
