/**
 * Formateo de fechas del sitio.
 *
 * Las fechas del frontmatter ("2026-05-16") se parsean como medianoche UTC.
 * Si se formatean en la zona local de Ecuador (UTC-5), el día retrocede uno.
 * Por eso todo el formateo se hace explícitamente en UTC.
 */
const ZONA = 'UTC';
const LOCALE = 'es-EC';

/** "16 de mayo de 2026" */
export function fechaLarga(fecha: Date): string {
  return fecha.toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: ZONA,
  });
}

/** "mayo de 2026" */
export function mesYAnio(fecha: Date): string {
  return fecha.toLocaleDateString(LOCALE, {
    month: 'long',
    year: 'numeric',
    timeZone: ZONA,
  });
}
