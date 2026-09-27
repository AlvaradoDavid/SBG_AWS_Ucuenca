# Documentación del sitio

Sitio del **AWS Student Builder Group – Universidad de Cuenca**. Construido con
Astro como sitio estático.

> **Todavía no está en línea.** La infraestructura de despliegue —S3 + CloudFront
> con bucket privado— está diseñada y documentada, pero no ejecutada. El
> procedimiento está en
> [estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md#1-desplegar-el-sitio-en-aws).

## Índice

| Documento | Qué contiene |
| --- | --- |
| [arquitectura.md](arquitectura.md) | Stack, estructura de carpetas, colecciones de contenido, pipeline de fotos |
| [sistema-de-diseno.md](sistema-de-diseno.md) | Paleta, tipografía, tokens y las reglas de uso del color |
| [componentes.md](componentes.md) | Qué hace cada componente y cómo se usa |
| [accesibilidad-y-rendimiento.md](accesibilidad-y-rendimiento.md) | Reglas de a11y y presupuesto de JavaScript |
| [decisiones.md](decisiones.md) | Registro de decisiones técnicas, con su porqué |
| [registro-de-cambios.md](registro-de-cambios.md) | Historial de lo que se ha ido construyendo |
| **[estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md)** | **Empieza por aquí si retomas el proyecto:** qué falta y cómo hacerlo |

## Arranque rápido

```bash
pnpm install
pnpm dev
```

El sitio queda en `http://localhost:4321`.

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Compila a `dist/` y genera el índice de búsqueda con Pagefind |
| `pnpm preview` | Sirve el build de producción |
| `pnpm fotos` | Convierte las fotos de `Eventos/` a WebP en `src/assets/eventos/` |

## Las tres reglas que no se rompen

Están explicadas a fondo en los documentos, pero se resumen así:

1. **El color de marca nunca es color de texto.** Vive en puntos, bordes,
   halos y degradados. El texto siempre va en la escala `tinta`.
2. **Toda animación respeta `prefers-reduced-motion`,** y el contenido debe
   quedar legible si el JavaScript no corre.
3. **El presupuesto de JavaScript se mide.** Hoy la portada carga 4.6 KB, sin
   dependencias ni orígenes de terceros. Cualquier cosa que lo suba en un orden
   de magnitud se discute antes.

> **Hay una de esas discusiones abierta.** El catálogo pasó de 6 a 251 fichas y
> su índice de búsqueda incrustado subió de unos pocos KB a 51.4 KB. El código no
> creció; los datos sí. Ver
> [estado-y-siguientes-pasos.md](estado-y-siguientes-pasos.md) y
> [accesibilidad-y-rendimiento.md](accesibilidad-y-rendimiento.md).
