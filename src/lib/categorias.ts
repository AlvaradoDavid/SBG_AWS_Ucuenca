/**
 * Categorías del catálogo. Cada una tiene asignado un color del kit de marca
 * oficial, que se usa solo como marcador visual (punto, borde) — nunca como
 * color de texto, para no comprometer el contraste.
 */
export const categorias = [
  { slug: 'computo', etiqueta: 'Cómputo', color: '#FF9900' },
  { slug: 'almacenamiento', etiqueta: 'Almacenamiento', color: '#42B4FF' },
  { slug: 'bases-de-datos', etiqueta: 'Bases de datos', color: '#AD5CFF' },
  { slug: 'redes-y-entrega-de-contenido', etiqueta: 'Redes y entrega de contenido', color: '#00E582' },
  { slug: 'seguridad-identidad', etiqueta: 'Seguridad e identidad', color: '#FF57E9' },
  { slug: 'contenedores', etiqueta: 'Contenedores', color: '#42B4FF' },
  { slug: 'integracion-y-mensajeria', etiqueta: 'Integración y mensajería', color: '#AD5CFF' },
  { slug: 'analitica', etiqueta: 'Analítica', color: '#00E582' },
  { slug: 'machine-learning', etiqueta: 'Machine learning', color: '#FF57E9' },
  { slug: 'herramientas-de-desarrollador', etiqueta: 'Herramientas de desarrollador', color: '#FF9900' },
  { slug: 'administracion-y-gobernanza', etiqueta: 'Administración y gobernanza', color: '#42B4FF' },
  { slug: 'front-end-web-y-movil', etiqueta: 'Front-end web y móvil', color: '#AD5CFF' },
  { slug: 'internet-de-las-cosas', etiqueta: 'Internet de las cosas', color: '#00E582' },
  { slug: 'medios', etiqueta: 'Medios', color: '#FF57E9' },
  { slug: 'migracion', etiqueta: 'Migración', color: '#FF9900' },
  { slug: 'aplicaciones-de-negocio', etiqueta: 'Aplicaciones de negocio', color: '#42B4FF' },
  { slug: 'gestion-financiera', etiqueta: 'Gestión financiera', color: '#AD5CFF' },
  { slug: 'computo-de-usuario-final', etiqueta: 'Cómputo de usuario final', color: '#00E582' },
  { slug: 'tecnologias-emergentes', etiqueta: 'Tecnologías emergentes', color: '#FF57E9' },
] as const;

export type CategoriaSlug = (typeof categorias)[number]['slug'];

export function etiquetaDeCategoria(slug: string): string {
  return categorias.find((c) => c.slug === slug)?.etiqueta ?? slug;
}

export function colorDeCategoria(slug: string): string {
  return categorias.find((c) => c.slug === slug)?.color ?? '#161D26';
}

/** Niveles de dificultad, para orientar a quien recién empieza. */
export const niveles = [
  { slug: 'fundamental', etiqueta: 'Fundamental' },
  { slug: 'intermedio', etiqueta: 'Intermedio' },
  { slug: 'avanzado', etiqueta: 'Avanzado' },
] as const;

export function etiquetaDeNivel(slug: string): string {
  return niveles.find((n) => n.slug === slug)?.etiqueta ?? slug;
}

/** Datos del club, en un solo lugar para no repetirlos por todo el sitio. */
export const club = {
  nombre: 'AWS Student Builder Group',
  universidad: 'Universidad de Cuenca',
  nombreCorto: 'AWS SBG UCuenca',
  linkedin: 'https://www.linkedin.com/company/aws-student-builder-group-universidad-de-cuenca',
  instagram: 'https://www.instagram.com/aws.ucuenca/',
} as const;
