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

/** Solo la primera foto, para usarla como portada del evento. */
export function portadaDeEvento(carpeta: string): ImageMetadata | undefined {
  return fotosDeEvento(carpeta)[0]?.miniatura;
}

/**
 * Imagen por defecto al compartir un enlace del sitio: el stand de inicio de
 * ciclo, con gente real y el banner del club. Ya es apaisada, así que las redes
 * apenas la recortan.
 */
export const fotoParaCompartir = fotosDeEvento('2026-03-23-stand-de-inicio-de-ciclo')[0]?.completa;
