/**
 * Convierte las fotos originales de Eventos/ a WebP listo para web.
 *
 * Por qué existe este script:
 *  - 104 de las fotos son HEIC (formato de iPhone) y ni Chrome ni Firefox lo muestran.
 *  - Los originales pesan 2.3 GB; sin optimizar, el sitio sería inusable.
 *  - Los .MOV se ignoran: un video de 480 MB no va en una galería estática.
 *
 * Uso:  pnpm fotos
 * Solo procesa lo que falta, así que se puede correr de nuevo al agregar eventos.
 */
import { readdir, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const ORIGEN = 'Eventos';
const DESTINO = path.join('src', 'assets', 'eventos');

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

async function existe(ruta) {
  try {
    await access(ruta);
    return true;
  } catch {
    return false;
  }
}

/** Devuelve un buffer que sharp pueda leer, decodificando HEIC si hace falta. */
async function bufferLegible(rutaArchivo) {
  const buffer = await readFile(rutaArchivo);
  if (path.extname(rutaArchivo).toLowerCase() !== '.heic') return buffer;

  const jpeg = await heicConvert({ buffer, format: 'JPEG', quality: 0.92 });
  return Buffer.from(jpeg);
}

async function procesarEvento(nombreCarpeta) {
  const slug = slugDeEvento(nombreCarpeta);
  const carpetaOrigen = path.join(ORIGEN, nombreCarpeta);
  const carpetaDestino = path.join(DESTINO, slug);
  await mkdir(carpetaDestino, { recursive: true });

  const archivos = (await readdir(carpetaOrigen))
    .filter((f) => /\.(heic|jpe?g|png)$/i.test(f))
    .sort();

  let convertidas = 0;
  let omitidas = 0;
  const generadas = [];

  for (const [indice, archivo] of archivos.entries()) {
    const base = `foto-${String(indice + 1).padStart(2, '0')}`;
    const salidaCompleta = path.join(carpetaDestino, `${base}.webp`);
    const salidaMini = path.join(carpetaDestino, `${base}-mini.webp`);
    generadas.push(base);

    if ((await existe(salidaCompleta)) && (await existe(salidaMini))) {
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

      convertidas++;
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n  ✗ ${archivo}: ${error.message}`);
    }
  }

  console.log(`\n  ${slug}: ${convertidas} convertidas, ${omitidas} ya existían`);
  return { slug, nombreCarpeta, fotos: generadas };
}

const carpetas = (await readdir(ORIGEN, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

console.log(`Procesando ${carpetas.length} eventos…\n`);

const resumen = [];
for (const carpeta of carpetas) {
  resumen.push(await procesarEvento(carpeta));
}

// Manifiesto: qué fotos existen por evento, para que las páginas lo consuman.
await writeFile(
  path.join(DESTINO, 'manifiesto.json'),
  JSON.stringify(resumen, null, 2) + '\n'
);

console.log(`\nListo. Manifiesto en ${path.join(DESTINO, 'manifiesto.json')}`);
