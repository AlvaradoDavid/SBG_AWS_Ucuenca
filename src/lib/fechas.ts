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

/**
 * Los próximos eventos guardan un instante con hora y zona
 * ("2026-11-14T09:00:00-05:00"), no una fecha suelta. Esos sí se formatean en la
 * hora de Ecuador: en UTC, las 09h00 saldrían como las 14h00.
 */
const ZONA_ECUADOR = 'America/Guayaquil';

/** "sábado 14 de noviembre", o "sábado 14 de noviembre de 2026" con el año. */
export function diaDeEvento(instante: Date, { conAnio = false } = {}): string {
  const partes = new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: ZONA_ECUADOR,
  }).formatToParts(instante);
  const parte = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((p) => p.type === tipo)?.value ?? '';

  const dia = `${parte('weekday')} ${parte('day')} de ${parte('month')}`;
  return conAnio ? `${dia} de ${parte('year')}` : dia;
}

/** "09h00": la hora como se escribe en Ecuador. */
export function horaDeEvento(instante: Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: ZONA_ECUADOR,
  })
    .format(instante)
    .replace(':', 'h');
}
