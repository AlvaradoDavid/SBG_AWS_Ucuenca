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
  }),
});

export const collections = { servicios, eventos };
