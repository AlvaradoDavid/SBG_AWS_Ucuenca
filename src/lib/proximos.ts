import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Los próximos eventos que organiza el club (colección `proximos`, ver D-31).
 * Todo se decide al compilar: el sitio es estático, así que un evento deja de
 * anunciarse en el primer build después de que termina.
 */
export type Proximo = CollectionEntry<'proximos'>;

/** Sigue vigente hasta que termina, para que el cartel no se caiga a mitad de la jornada. */
export function estaVigente(evento: Proximo, ahora = new Date()): boolean {
  return evento.data.fin.getTime() > ahora.getTime();
}

/** El evento vigente más cercano, o ninguno. Es el que sale en la portada. */
export async function proximoEvento(): Promise<Proximo | undefined> {
  return (await getCollection('proximos'))
    .filter((evento) => estaVigente(evento))
    .sort((a, b) => a.data.inicio.getTime() - b.data.inicio.getTime())[0];
}

/** Cada próximo evento tiene su página en la raíz, con el nombre de su archivo. */
export function rutaDeProximo(evento: Proximo): string {
  return `/${evento.id}/`;
}

export function lugarEnUnaLinea(evento: Proximo): string {
  return evento.data.lugar.join(', ');
}

/** "20261114T140000Z": el formato de iCalendar y de Google Calendar, siempre en UTC. */
function instanteCompacto(instante: Date): string {
  return instante.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Lo que el calendario muestra al abrir el evento. `pagina` es la URL absoluta. */
function notaDeCalendario(evento: Proximo, pagina: string): string {
  const { resumen, acceso, entradas } = evento.data;
  return [
    resumen,
    '',
    `${acceso}.`,
    `Entrada (${entradas.sitio}): ${entradas.url}`,
    `Más información: ${pagina}`,
  ].join('\n');
}

export function enlaceGoogleCalendar(evento: Proximo, pagina: string): string {
  const parametros = new URLSearchParams({
    action: 'TEMPLATE',
    text: evento.data.titulo,
    dates: `${instanteCompacto(evento.data.inicio)}/${instanteCompacto(evento.data.fin)}`,
    location: lugarEnUnaLinea(evento),
    details: notaDeCalendario(evento, pagina),
  });
  return `https://calendar.google.com/calendar/render?${parametros}`;
}

/** Comas, puntos y comas y saltos de línea van escapados en los textos de iCalendar. */
function escaparTexto(texto: string): string {
  return texto
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * iCalendar no admite líneas de más de 75 bytes: las parte y cada continuación
 * empieza con un espacio. Cuenta bytes y no letras, porque «Más» ocupa 4 en UTF-8.
 */
function plegar(linea: string): string {
  const codificador = new TextEncoder();
  const tramos: string[] = [];
  let actual = '';
  let bytes = 0;
  for (const caracter of linea) {
    const tamano = codificador.encode(caracter).length;
    const limite = tramos.length === 0 ? 75 : 74;
    if (bytes + tamano > limite) {
      tramos.push(actual);
      actual = '';
      bytes = 0;
    }
    actual += caracter;
    bytes += tamano;
  }
  tramos.push(actual);
  return tramos.join('\r\n ');
}

/** El archivo .ics: lo abren el Calendario de Apple, Outlook y casi cualquier otro. */
export function archivoCalendario(evento: Proximo, pagina: string, ahora = new Date()): string {
  const { titulo, inicio, fin } = evento.data;
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AWS SBG UCuenca//Sitio web//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${evento.id}@aws-sbg-ucuenca`,
    `DTSTAMP:${instanteCompacto(ahora)}`,
    `DTSTART:${instanteCompacto(inicio)}`,
    `DTEND:${instanteCompacto(fin)}`,
    `SUMMARY:${escaparTexto(titulo)}`,
    `LOCATION:${escaparTexto(lugarEnUnaLinea(evento))}`,
    `DESCRIPTION:${escaparTexto(notaDeCalendario(evento, pagina))}`,
    `URL:${pagina}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lineas.map(plegar).join('\r\n') + '\r\n';
}

export type Agenda = NonNullable<Proximo['data']['agenda']>;
export type Sesion = Agenda['sesiones'][number];

/** Las sesiones que empiezan y terminan a la misma hora: las que van a la vez. */
export interface Bloque {
  desde: string;
  hasta: string;
  sesiones: Sesion[];
}

export function tieneAgenda(evento: Proximo): boolean {
  return Boolean(evento.data.agenda);
}

/**
 * La agenda en bloques, por hora de inicio. Dentro de cada bloque, las sesiones
 * van en el orden de `salas`, para que cada sala quede siempre en la misma columna
 * aunque la hoja del club las liste en otro orden.
 */
export function bloquesDeAgenda(agenda: Agenda): Bloque[] {
  const columna = (sesion: Sesion) => (sesion.sala ? agenda.salas.indexOf(sesion.sala) : -1);
  const bloques = new Map<string, Bloque>();
  for (const sesion of agenda.sesiones) {
    const clave = `${sesion.desde}-${sesion.hasta}`;
    const bloque = bloques.get(clave) ?? { desde: sesion.desde, hasta: sesion.hasta, sesiones: [] };
    bloque.sesiones.push(sesion);
    bloques.set(clave, bloque);
  }
  return [...bloques.values()]
    .map((bloque) => ({ ...bloque, sesiones: bloque.sesiones.sort((a, b) => columna(a) - columna(b)) }))
    .sort((a, b) => a.desde.localeCompare(b.desde) || a.hasta.localeCompare(b.hasta));
}
