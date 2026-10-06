import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categorias, niveles } from './lib/categorias';

const categoriaSlugs = categorias.map((c) => c.slug) as [string, ...string[]];
const nivelSlugs = niveles.map((n) => n.slug) as [string, ...string[]];

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/servicios' }),
  schema: z.object({
    // --- Identidad del servicio ---------------------------------------
    nombre: z.string(),
    /** Qué significan realmente las siglas: "Elastic Compute Cloud". */
    nombreCompleto: z.string().optional(),
    categoria: z.enum(categoriaSlugs),
    nivel: z.enum(nivelSlugs),
    resumenCorto: z.string().max(160),

    // --- Lo que orienta la decisión ------------------------------------
    /** Una frase: en qué situación este servicio es la respuesta correcta. */
    cuandoAplicarlo: z.string(),
    /** La analogía de una línea que hace clic para quien recién empieza. */
    analogia: z.string().optional(),
    casosDeUso: z.array(z.string()).optional(),
    /** Cuándo NO usarlo: qué otro servicio conviene y por qué. */
    alternativas: z
      .array(
        z.object({
          servicio: z.string(),
          /** slug interno, si esa ficha ya existe en el catálogo */
          slug: z.string().optional(),
          porque: z.string(),
        })
      )
      .optional(),

    // --- Costo: crítico cuando se trabaja con créditos ------------------
    /** Cómo se cobra: "por hora de instancia encendida", "por invocación". */
    modeloDePrecios: z.string().optional(),
    /** Qué incluye la capa gratuita para este servicio. */
    capaGratuita: z.string().optional(),
    /** Errores que queman créditos sin darse cuenta. */
    trampasDeCosto: z.array(z.string()).optional(),

    // --- Vocabulario mínimo ---------------------------------------------
    /** Los 3-5 términos que hay que conocer para hablar de este servicio. */
    conceptosClave: z
      .array(z.object({ termino: z.string(), definicion: z.string() }))
      .optional(),

    // --- Conexiones dentro del catálogo ---------------------------------
    /** Slugs de otras fichas: convierte la lista de 50+ en una red navegable. */
    serviciosRelacionados: z.array(z.string()).optional(),

    // --- Contexto de club ------------------------------------------------
    /** Certificaciones AWS donde aparece este servicio. */
    certificaciones: z.array(z.string()).optional(),
    /** Enlaces oficiales: docs, pricing, consola. */
    enlaces: z.array(z.object({ titulo: z.string(), url: z.string().url() })).optional(),

    // --- Mantenimiento del contenido -------------------------------------
    /** AWS cambia rápido: saber cuándo se revisó evita fichas obsoletas. */
    actualizado: z.coerce.date(),
    /** Quién del club escribió o revisó la ficha. */
    autor: z.string().optional(),

    destacado: z.boolean().optional().default(false),
  }),
});

const eventos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/eventos' }),
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    /** Carpeta en src/assets/eventos/ con las fotos ya convertidas a WebP. */
    carpetaFotos: z.string(),
    resumen: z.string(),
    lugar: z.string().optional(),
    /** Se muestra en la sección de trayectoria de la portada. */
    hito: z.boolean().optional().default(false),
    /** Cuántas personas asistieron, si se llevó registro. */
    asistentes: z.number().optional(),
    /**
     * Número de la foto que representa al evento, el mismo que muestra el visor
     * («7 / 28» → 7). Sin él, la portada es la primera foto.
     */
    portada: z.number().int().positive().optional(),
    /**
     * Con `false`, sus fotos no salen en la portada del sitio (collage, «Quiénes
     * somos» y galería) y su lugar lo ocupa el siguiente evento. Sigue en /eventos/.
     */
    enInicio: z.boolean().optional().default(true),
  }),
});

/**
 * Eventos que el club organiza y todavía no ocurren. Cada uno tiene su cartel en
 * la portada, bajo el hero, mientras no haya terminado, y su propia página. Cuando
 * pasa, sus fotos van a `eventos` como las de cualquier otro (ver D-31).
 */
const proximos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/proximos' }),
  schema: ({ image }) =>
    z.object({
      /** Nombre oficial: el de <title> y el de la vista previa al compartir. */
      titulo: z.string(),
      /**
       * El de la barra de navegación, que no cabe con el título entero: «Student
       * Community Day». Con sus 21 letras sobran unos 40 px a 768 px; el tope evita que uno
       * más largo parta la barra en dos renglones sin que el build avise.
       */
      nombreCorto: z.string().max(25),
      /** El nombre como lo compone el afiche, en el orden en que se lee. */
      cartel: z.object({
        /** Sobre el nombre, espaciado: «Primer». */
        antetitulo: z.string().optional(),
        /** Las líneas grandes: ["Student", "Community Day"]. */
        lineas: z.array(z.string()).min(1),
        /** La última línea, en peso regular: «Ecuador». */
        cierre: z.string().optional(),
      }),
      lema: z.array(z.string()).min(1),
      /** Descripción para buscadores y vistas previas, y entrada de la página. */
      resumen: z.string().max(220),
      /** Con hora y zona: 2026-11-14T09:00:00-05:00. */
      inicio: z.coerce.date(),
      fin: z.coerce.date(),
      /** Una línea por renglón del cartel: lugar, institución, ciudad. */
      lugar: z.array(z.string()).min(1),
      mapa: z.string().url(),
      /** Lo que cuesta entrar, en una frase: «Entrada gratuita, con cupos limitados». */
      acceso: z.string(),
      entradas: z.object({ url: z.string().url(), sitio: z.string() }),
      registro: z.object({ url: z.string().url(), sitio: z.string() }),
      /** Qué trae la jornada, en frases cortas. */
      incluye: z.array(z.string()).min(1),
      /** La foto del cartel. Va con alt vacío: todo lo que dice está en el texto. */
      imagen: image(),
      /** El afiche oficial completo: es la vista previa al compartir la página. */
      afiche: image(),
      participantes: z.array(
        z.object({
          siglas: z.string(),
          universidad: z.string(),
          ciudad: z.string(),
          anfitrion: z.boolean().optional().default(false),
        })
      ),
      patrocinadores: z.array(
        z.object({
          nombre: z.string(),
          logo: image(),
          /**
           * Para logos de fondo transparente: van sobre una tarjeta blanca con aire
           * alrededor. Los que traen su propio fondo ocupan la tarjeta entera.
           */
          sobreBlanco: z.boolean().optional().default(false),
        })
      ),
    }),
});

export const collections = { servicios, eventos, proximos };
