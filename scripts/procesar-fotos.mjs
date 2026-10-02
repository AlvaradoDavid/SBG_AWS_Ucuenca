/**
 * Convierte las fotos originales de Eventos/ a WebP listo para web.
 *
 * Por qué existe este script:
 *  - 104 de las fotos son HEIC (formato de iPhone) y ni Chrome ni Firefox lo muestran.
 *  - Los originales pesan 2.3 GB; sin optimizar, el sitio sería inusable.
 *  - Los .MOV se ignoran: un video de 480 MB no va en una galería estática.
 *
 * Uso:  pnpm fotos
 * Solo procesa lo que falta, así que se puede correr de nuevo al agregar eventos
 * o fotos.
 *
 * El número de una foto ya generada no cambia nunca: es el del archivo
 * (foto-07.webp), el del visor («7 / 28») y el que elige la portada
 * (`portada: 7`). El manifiesto guarda qué original es cada foto-NN, y un
 * original nuevo toma el siguiente número libre aunque por nombre quede antes.
 * Los originales nuevos se numeran en orden natural: 2.jpeg antes que 10.jpeg.
 */
import { readdir, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const ORIGEN = 'Eventos';
const DESTINO = path.join('src', 'assets', 'eventos');
const MANIFIESTO = path.join(DESTINO, 'manifiesto.json');

const ANCHO_COMPLETA = 1600;
const ANCHO_MINIATURA = 600;
const CALIDAD = 78;

/** "2026-5-16 AWS Club en FLISol 🎡☁️" -> "2026-05-16-aws-club-en-flisol" */
function slugDeEvento(nombreCarpeta) {
  const [fechaCruda, ...resto] = nombreCarpeta.split(' ');
  const partes = fechaCruda.split('-');
  const fecha =
    partes.length === 3
      ? `${partes[0]}-${partes[1].padStart(2, '0')}-${partes[2].padStart(2, '0')}`
      : fechaCruda;

  const titulo = resto
    .join(' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

  return `${fecha}-${titulo}`;
}

/**
 * Orden natural de los nombres, el del explorador de archivos: 2.jpeg antes que
 * 10.jpeg. Con el alfabético, unas fotos exportadas como 1.jpeg…103.jpeg quedarían
 * 1, 10, 100, 101… y la galería saldría revuelta.
 */
const ordenNatural = new Intl.Collator('es', { numeric: true }).compare;

/** 7 -> "foto-07" */
const nombreDeFoto = (numero) => `foto-${String(numero).padStart(2, '0')}`;

/** "foto-07" -> 7 */
const numeroDeFoto = (base) => Number(base.slice('foto-'.length));

async function existe(ruta) {
  try {
    await access(ruta);
    return true;
  } catch {
    return false;
  }
}

/** Fotos con sus dos tamaños ya en la carpeta de destino, en orden: ["foto-01", …]. */
async function fotosGeneradas(carpetaDestino) {
  const nombres = new Set(await readdir(carpetaDestino));
  return [...nombres]
    .filter((f) => /^foto-\d+\.webp$/.test(f) && nombres.has(f.replace('.webp', '-mini.webp')))
    .map((f) => f.replace('.webp', ''))
    .sort((a, b) => numeroDeFoto(a) - numeroDeFoto(b));
}

/** El manifiesto de la corrida anterior, por slug. Si no existe, vacío. */
async function leerManifiesto() {
  try {
    const entradas = JSON.parse(await readFile(MANIFIESTO, 'utf8'));
    return new Map(entradas.map((entrada) => [entrada.slug, entrada]));
  } catch (error) {
    if (error.code === 'ENOENT') return new Map();
    throw error;
  }
}

/** Devuelve un buffer que sharp pueda leer, decodificando HEIC si hace falta. */
async function bufferLegible(rutaArchivo) {
  const buffer = await readFile(rutaArchivo);
  if (path.extname(rutaArchivo).toLowerCase() !== '.heic') return buffer;

  const jpeg = await heicConvert({ buffer, format: 'JPEG', quality: 0.92 });
  return Buffer.from(jpeg);
}

/**
 * Qué original es cada foto-NN ya generada. Sale del manifiesto; si el evento
 * se procesó antes de que el manifiesto lo guardara, se reconstruye con la regla
 * de entonces (orden alfabético), pero solo si el número de originales coincide
 * con el de fotos generadas. Si no coincide, devuelve null: no hay forma de
 * saber qué número le tocó a cada original.
 */
function mapeoPrevio(previo, archivos, generadas) {
  if (previo?.fuentes) return { ...previo.fuentes };
  if (generadas.length === 0) return {};

  const contiguas = generadas.every((base, i) => base === nombreDeFoto(i + 1));
  if (!contiguas || generadas.length !== archivos.length) return null;

  return Object.fromEntries(archivos.map((archivo, i) => [archivo, nombreDeFoto(i + 1)]));
}

async function procesarEvento(nombreCarpeta, previo) {
  const slug = slugDeEvento(nombreCarpeta);
  const carpetaOrigen = path.join(ORIGEN, nombreCarpeta);
  const carpetaDestino = path.join(DESTINO, slug);
  await mkdir(carpetaDestino, { recursive: true });

  const archivos = (await readdir(carpetaOrigen))
    // AVIF y WebP: los afiches que se descargan de Meetup llegan así.
    .filter((f) => /\.(heic|jpe?g|png|avif|webp)$/i.test(f))
    .sort(ordenNatural);
  const generadas = await fotosGeneradas(carpetaDestino);

  // Sin manifiesto, la reconstrucción usa la regla de entonces: orden alfabético.
  const fuentes = mapeoPrevio(previo, [...archivos].sort(), generadas);
  if (!fuentes) {
    console.error(
      `  ✗ ${slug}: hay ${generadas.length} fotos generadas y ${archivos.length} originales, ` +
        'y el manifiesto no dice cuál es cuál. No se toca el evento: deja solo los originales ' +
        'ya publicados, corre de nuevo y después agrega los nuevos.'
    );
    process.exitCode = 1;
    return null;
  }

  // El siguiente número libre: después del último asignado y de cualquier
  // foto-NN que ya esté en la carpeta, para no pisar nada.
  let siguiente =
    Math.max(0, ...Object.values(fuentes).map(numeroDeFoto), ...generadas.map(numeroDeFoto)) + 1;

  let convertidas = 0;
  let omitidas = 0;
  const nuevas = [];

  for (const archivo of archivos) {
    const asignada = fuentes[archivo];
    const base = asignada ?? nombreDeFoto(siguiente);
    const salidaCompleta = path.join(carpetaDestino, `${base}.webp`);
    const salidaMini = path.join(carpetaDestino, `${base}-mini.webp`);

    if (asignada && (await existe(salidaCompleta)) && (await existe(salidaMini))) {
      omitidas++;
      continue;
    }

    try {
      const buffer = await bufferLegible(path.join(carpetaOrigen, archivo));

      await sharp(buffer)
        .rotate() // respeta la orientación EXIF de las fotos de celular
        .resize({ width: ANCHO_COMPLETA, withoutEnlargement: true })
        .webp({ quality: CALIDAD })
        .toFile(salidaCompleta);

      await sharp(buffer)
        .rotate()
        .resize({ width: ANCHO_MINIATURA, withoutEnlargement: true })
        .webp({ quality: CALIDAD })
        .toFile(salidaMini);

      // El número se reserva solo si la conversión salió bien: si se reservara
      // antes, una foto que falla hoy y se arregla mañana aparecería en medio
      // de la galería y correría a las que llegaron después.
      if (!asignada) {
        fuentes[archivo] = base;
        nuevas.push(`${archivo} → ${base}`);
        siguiente++;
      }
      convertidas++;
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n  ✗ ${archivo}: ${error.message}`);
    }
  }

  console.log(`\n  ${slug}: ${convertidas} convertidas, ${omitidas} ya existían`);
  for (const nueva of nuevas) console.log(`    + ${nueva}`);

  // Un original que desaparece no libera su número: si se reutilizara, otra foto
  // ocuparía su lugar en la galería y en la portada.
  const presentes = new Set(archivos);
  for (const [archivo, base] of Object.entries(fuentes)) {
    if (presentes.has(archivo)) continue;
    const sigue = await existe(path.join(carpetaDestino, `${base}.webp`));
    console.log(
      sigue
        ? `    · ${base}: su original (${archivo}) ya no está en ${ORIGEN}/; la foto se conserva`
        : `    ! ${base} (${archivo}): no hay foto ni original; desde ahí el visor ya no coincide con el número del archivo`
    );
  }

  const ordenadas = Object.entries(fuentes).sort(
    ([, a], [, b]) => numeroDeFoto(a) - numeroDeFoto(b)
  );
  return {
    slug,
    nombreCarpeta,
    fotos: await fotosGeneradas(carpetaDestino),
    fuentes: Object.fromEntries(ordenadas),
  };
}

const anterior = await leerManifiesto();

const carpetas = (await readdir(ORIGEN, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

console.log(`Procesando ${carpetas.length} eventos…\n`);

// Parte del manifiesto anterior: un evento cuyos originales no están en esta
// máquina conserva su entrada, y con ella los números de sus fotos.
const resumen = new Map(anterior);
for (const carpeta of carpetas) {
  const entrada = await procesarEvento(carpeta, anterior.get(slugDeEvento(carpeta)));
  if (entrada) resumen.set(entrada.slug, entrada);
}

for (const slug of anterior.keys()) {
  if (!carpetas.some((carpeta) => slugDeEvento(carpeta) === slug)) {
    console.log(`\n  ${slug}: sin originales en ${ORIGEN}/; se conserva su entrada del manifiesto`);
  }
}

// Manifiesto: qué fotos existen por evento y de qué original sale cada una.
// Es lo que mantiene fijos los números entre corridas, así que va al repositorio.
await writeFile(
  MANIFIESTO,
  JSON.stringify(
    [...resumen.values()].sort((a, b) => (a.slug < b.slug ? -1 : 1)),
    null,
    2
  ) + '\n'
);

console.log(`\nListo. Manifiesto en ${MANIFIESTO}`);
