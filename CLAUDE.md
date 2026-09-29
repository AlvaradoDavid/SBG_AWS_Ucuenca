## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Cuatro cosas que cuestan tiempo si no se saben:

- **Solo cabe un servidor de desarrollo por proyecto.** El PID y el puerto quedan
  en `.astro/dev.json`; un segundo `astro dev` no arranca aunque se le pase otro
  puerto. Si el 4321 está ocupado por otra sesión, hay que parar esa.
- **Cada push a `aws-sbg-ucuenca` publica en producción.** El sitio vive en
  Amplify (https://aws-sbg-ucuenca.d2jrpw2uglkitl.amplifyapp.com/) y esa rama es la única. Verifica con
  `pnpm build` antes de hacer push; no la renombres, porque su nombre forma la URL.
- **Tras añadir muchos archivos de contenido de golpe, reinicia el servidor.** Su
  caché de colecciones se queda a medias y sigue sirviendo un número de fichas
  viejo. `pnpm build` es la fuente de verdad; el servidor de desarrollo, no.
- **La CSP de `customHttp.yml` bloquea todo lo que venga de otro origen.** Un
  video embebido, analítica o una API nueva pasan el build y fallan en
  producción, en silencio. Hay que declararlos en la CSP antes del push (D-25).

## Documentación del proyecto

La documentación propia vive en [`docs/`](docs/README.md). Consúltala antes de
tocar diseño o componentes:

- [`docs/arquitectura.md`](docs/arquitectura.md) — stack, colecciones, pipeline de fotos, despliegue
- [`docs/sistema-de-diseno.md`](docs/sistema-de-diseno.md) — paleta, tipografía, tokens
- [`docs/componentes.md`](docs/componentes.md) — qué hace cada componente
- [`docs/accesibilidad-y-rendimiento.md`](docs/accesibilidad-y-rendimiento.md) — reglas de a11y y presupuesto de JS
- [`docs/decisiones.md`](docs/decisiones.md) — decisiones técnicas y su porqué
- [`docs/estado-y-siguientes-pasos.md`](docs/estado-y-siguientes-pasos.md) — **empieza por aquí al retomar**: qué falta y cómo hacerlo

Tres reglas que no se rompen:

1. El color de marca nunca es color de texto; el texto va en la escala `tinta`.
2. Toda animación respeta `prefers-reduced-motion`, y el contenido queda legible sin JavaScript.
3. El presupuesto de JavaScript se mide (hoy: 4.6 KB en la portada, sin dependencias).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
