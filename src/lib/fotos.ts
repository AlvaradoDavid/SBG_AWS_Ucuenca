import type { ImageMetadata } from 'astro';

/**
 * Todas las fotos de eventos, cargadas en tiempo de build para que Astro
 * pueda optimizarlas. Las generó `pnpm fotos` a partir de la carpeta Eventos/.
 */
const todas = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/eventos/**/*.webp',
  { eager: true }
);

export interface FotoEvento {
  completa: ImageMetadata;
  miniatura: ImageMetadata;
}

/** Devuelve las fotos de un evento, emparejando cada imagen con su miniatura. */
export function fotosDeEvento(carpeta: string): FotoEvento[] {
  const prefijo = `/src/assets/eventos/${carpeta}/`;

  return Object.keys(todas)
    .filter((ruta) => ruta.startsWith(prefijo) && !ruta.endsWith('-mini.webp'))
    .sort()
    .map((ruta) => ({
      completa: todas[ruta].default,
      miniatura: (todas[ruta.replace('.webp', '-mini.webp')] ?? todas[ruta]).default,
    }));
}

/**
 * La foto que representa al evento: la que indica `portada` (su número en la
 * galería, empezando en 1) o, si no hay, la primera. Un número que no existe
 * rompe el build en vez de dejar al evento sin portada.
 */
export function portadaDeEvento(carpeta: string, portada?: number): FotoEvento | undefined {
  const fotos = fotosDeEvento(carpeta);
  if (portada === undefined) return fotos[0];

  const foto = fotos[portada - 1];
  if (!foto) {
    throw new Error(
      `[portada] ${carpeta} tiene ${fotos.length} fotos; no existe la foto ${portada}.`
    );
  }
  return foto;
}

/**
 * Imagen por defecto al compartir un enlace del sitio: el stand de inicio de
 * ciclo, con gente real y el banner del club. Ya es apaisada, así que las redes
 * apenas la recortan.
 */
export const fotoParaCompartir = fotosDeEvento('2026-03-23-stand-de-inicio-de-ciclo')[0]?.completa;
