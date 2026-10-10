/**
 * Sirve dist/ con las cabeceras de customHttp.yml, como lo hace Amplify.
 *
 * Por qué existe este script:
 *  - `pnpm build` no sabe nada de la CSP. Un recurso de otro origen pasa el
 *    build y el navegador lo bloquea en producción, en silencio (D-25). Servido
 *    así, el bloqueo aparece en la consola antes del push.
 *  - El servidor de desarrollo no sirve en la PC del club: usa el compilador de
 *    Markdown que Smart App Control bloquea. Este solo lee archivos.
 *  - Los .ics salen como binarios por defecto, para comprobar que la regla de
 *    customHttp.yml los corrige a text/calendar.
 *
 * Uso:  pnpm build && pnpm servir          (http://localhost:4322)
 *       pnpm servir 4400                   (otro puerto)
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const PUERTO = Number(process.argv[2] ?? 4322);

// Lector mínimo de customHttp.yml: cada `pattern` con sus pares `key` / `value`.
const reglas = [];
for (const linea of readFileSync('customHttp.yml', 'utf8').split(/\r?\n/)) {
  const patron = linea.match(/^\s*- pattern: '(.+)'/);
  const clave = linea.match(/^\s*- key: '(.+)'/);
  const valor = linea.match(/^\s*value: ['"](.+)['"]\s*$/);
  if (patron) reglas.push({ patron: patron[1], cabeceras: [] });
  else if (clave) reglas.at(-1).cabeceras.push([clave[1], '']);
  else if (valor) reglas.at(-1).cabeceras.at(-1)[1] = valor[1];
}

/** '**' vale para todo; en los demás, '*' es cualquier cosa. */
const coincide = (patron, ruta) =>
  patron === '**' ||
  new RegExp(`^${patron.replace(/[.]/g, '\\.').replace(/\*/g, '.*')}$`).test(ruta);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

createServer((peticion, respuesta) => {
  const ruta = decodeURIComponent(new URL(peticion.url, 'http://x').pathname);
  let archivo = path.join(DIST, ruta);
  if (existsSync(archivo) && statSync(archivo).isDirectory()) archivo = path.join(archivo, 'index.html');

  // Como la regla 404-200 de Amplify: la página de error propia, con código 404.
  let estado = 200;
  if (!existsSync(archivo)) {
    archivo = path.join(DIST, '404.html');
    estado = 404;
  }

  const cabeceras = { 'Content-Type': TIPOS[path.extname(archivo)] ?? 'application/octet-stream' };
  for (const { patron, cabeceras: lista } of reglas) {
    if (coincide(patron, ruta)) for (const [clave, valor] of lista) cabeceras[clave] = valor;
  }
  respuesta.writeHead(estado, cabeceras);
  respuesta.end(readFileSync(archivo));
}).listen(PUERTO, () => console.log(`dist/ con las cabeceras de customHttp.yml en http://localhost:${PUERTO}`));
