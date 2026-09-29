# AWS Student Builder Group · Universidad de Cuenca

Sitio web del club de estudiantes de AWS de la Universidad de Cuenca: quiénes somos, qué eventos
hemos hecho y un catálogo en español de los servicios de AWS.

**En línea:** <https://aws-sbg-ucuenca.d2jrpw2uglkitl.amplifyapp.com/>

## Qué hay en el sitio

- **Portada** con la trayectoria del club, cifras y fotos reales de los eventos.
- **Eventos**, cada uno con su galería y un visor de fotos accesible.
- **Catálogo de servicios**: los 251 servicios del directorio de AWS en 19 categorías. 41 fichas
  completas —con analogía, vocabulario, costos, trampas de gasto y un diagrama— y 210 breves.

## Stack

[Astro](https://astro.build) genera HTML estático, con Tailwind CSS, MDX para el contenido y
[Pagefind](https://pagefind.app) para el índice de búsqueda. No hay framework de JavaScript en el
cliente: la portada carga 4.6 KB de JavaScript propio y ninguna dependencia.

El sitio se aloja en **AWS Amplify Hosting**. Su ficha del catálogo cuenta
[cómo lo usa este mismo sitio](src/content/servicios/front-end-web-y-movil/amplify.mdx).

## Arranque

Requiere Node 22.12 o superior y pnpm (la versión exacta sale de `packageManager` en
`package.json`; con `corepack enable` se instala sola).

```bash
pnpm install
pnpm dev
```

El sitio queda en `http://localhost:4321`.

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Compila a `dist/` y genera el índice de Pagefind |
| `pnpm preview` | Sirve el build de producción en local |
| `pnpm fotos` | Convierte las fotos originales de `Eventos/` a WebP en `src/assets/eventos/` |

## Antes de hacer push

> **Cada push a la rama `aws-sbg-ucuenca` se publica en producción.** No hay rama de pruebas.

1. Corre `pnpm build` y revisa que termine sin errores ni avisos `[DiagramaAWS]`.
2. No renombres la rama: su nombre forma la URL pública.

## Estructura

```
src/
├── content/servicios/   Una ficha .mdx por servicio, en una carpeta por categoría
├── content/eventos/     Un .mdx por evento
├── components/          Componentes .astro
├── pages/               Rutas
└── lib/                 Categorías, fechas, fotos y datos del club
docs/                    Documentación del proyecto
amplify.yml              Receta del build en Amplify
customHttp.yml           Cabeceras HTTP: caché y seguridad
```

## Documentación

Todo el detalle está en [`docs/`](docs/README.md). Si retomas el proyecto, empieza por
[estado y siguientes pasos](docs/estado-y-siguientes-pasos.md): qué falta y cómo hacerlo.

| Documento | Qué contiene |
| --- | --- |
| [Arquitectura](docs/arquitectura.md) | Stack, colecciones de contenido, fotos y despliegue |
| [Sistema de diseño](docs/sistema-de-diseno.md) | Paleta, tipografía y tokens |
| [Componentes](docs/componentes.md) | Qué hace cada componente, incluido el de diagramas |
| [Accesibilidad y rendimiento](docs/accesibilidad-y-rendimiento.md) | Reglas de a11y y presupuesto de JavaScript |
| [Decisiones](docs/decisiones.md) | Cada decisión técnica y su porqué |

## Tres reglas que no se rompen

1. **El color de marca nunca es color de texto.** El texto va en la escala `tinta`.
2. **Toda animación respeta `prefers-reduced-motion`,** y el contenido se lee sin JavaScript.
3. **El presupuesto de JavaScript se mide.** Lo que lo suba en un orden de magnitud se discute antes.

## Cómo añadir contenido

- **Un evento:** procesa sus fotos con `pnpm fotos` y crea un `.mdx` en `src/content/eventos/`.
- **Una ficha de servicio**, o ampliar una breve a completa: sigue la
  [guía paso a paso](docs/estado-y-siguientes-pasos.md#cómo-añadir-una-ficha-de-servicio-nueva).
  El esquema de `src/content.config.ts` hace fallar el build si algo no cuadra.
