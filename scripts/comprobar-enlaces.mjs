/**
 * Revisa los enlaces internos del sitio ya construido, en dist/.
 *
 * Por qué existe este script:
 *  - Amplify responde a /servicios con un 301 hacia /servicios/. Un enlace sin
 *    barra final le cuesta al visitante un viaje de ida y vuelta extra por clic.
 *  - Un enlace a una página que no existe no rompe el build: aparece como 404
 *    en producción.
 *  - Windows no distingue mayúsculas de minúsculas y Amplify sí: aquí se
 *    compara el nombre exacto, no se le pregunta al disco.
 *
 * Uso:  pnpm build && pnpm enlaces
 * Termina con código 1 si encuentra algún problema.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const ORIGEN = 'http://sitio.local';
const MAX_EJEMPLOS = 15;

/** Todas las rutas de dist/, con barras normales: "servicios/index.html". */
async function listarArchivos(dir, base = '') {
  const archivos = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const relativa = base ? `${base}/${entrada.name}` : entrada.name;
    if (entrada.isDirectory()) {
      archivos.push(...(await listarArchivos(path.join(dir, entrada.name), relativa)));
    } else {
      archivos.push(relativa);
    }
  }
  return archivos;
}

/** "servicios/index.html" -> "/servicios/"; "404.html" -> "/404.html" */
function urlDePagina(archivo) {
  return '/' + archivo.replace(/(^|\/)index\.html$/, '$1');
}

function decodificarEntidades(texto) {
  return texto
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

const archivos = new Set(await listarArchivos(DIST));
const paginas = [...archivos].filter((a) => a.endsWith('.html'));
const html = new Map();
for (const pagina of paginas) {
  html.set(pagina, await readFile(path.join(DIST, pagina), 'utf8'));
}

const idsPorPagina = new Map();
function idsDe(pagina) {
  if (!idsPorPagina.has(pagina)) {
    const ids = [...html.get(pagina).matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]);
    idsPorPagina.set(pagina, new Set(ids));
  }
  return idsPorPagina.get(pagina);
}

// Cada problema se agrupa por destino, con las páginas donde aparece.
const sinBarra = new Map();
const inexistentes = new Map();
const anclasRotas = new Map();
const destinos = new Set();
let totalEnlaces = 0;

function anotar(mapa, clave, pagina) {
  if (!mapa.has(clave)) mapa.set(clave, new Set());
  mapa.get(clave).add(pagina);
}

for (const pagina of paginas) {
  const base = new URL(urlDePagina(pagina), ORIGEN);

  for (const [, crudo] of html.get(pagina).matchAll(/\shref="([^"]*)"/g)) {
    const url = new URL(decodificarEntidades(crudo), base);
    if (url.origin !== ORIGEN) continue; // externo, mailto:, tel:…

    totalEnlaces++;
    const ruta = decodeURIComponent(url.pathname);
    destinos.add(ruta);
    const esArchivo = /\.[a-z0-9]+$/i.test(ruta);

    let destino;
    if (esArchivo) {
      destino = ruta.slice(1);
    } else if (ruta.endsWith('/')) {
      destino = `${ruta.slice(1)}index.html`;
    } else {
      anotar(sinBarra, ruta, pagina);
      destino = `${ruta.slice(1)}/index.html`;
    }

    if (!archivos.has(destino)) {
      anotar(inexistentes, ruta, pagina);
      continue;
    }

    const ancla = decodeURIComponent(url.hash.slice(1));
    if (ancla && destino.endsWith('.html') && !idsDe(destino).has(ancla)) {
      anotar(anclasRotas, `${ruta}#${ancla}`, pagina);
    }
  }
}

console.log(
  `${paginas.length} páginas, ${totalEnlaces} enlaces internos, ${destinos.size} destinos distintos.`
);

function informar(titulo, mapa) {
  if (mapa.size === 0) return;
  console.log(`\n✗ ${mapa.size} ${titulo}:`);
  for (const [destino, origenes] of [...mapa].slice(0, MAX_EJEMPLOS)) {
    const [primera] = origenes;
    const resto = origenes.size > 1 ? ` y ${origenes.size - 1} más` : '';
    console.log(`  ${destino}  ← ${urlDePagina(primera)}${resto}`);
  }
  if (mapa.size > MAX_EJEMPLOS) console.log(`  … y ${mapa.size - MAX_EJEMPLOS} más`);
}

informar('destinos a página sin barra final', sinBarra);
informar('destinos que no existen en dist/', inexistentes);
informar('anclas que no existen en su página', anclasRotas);

if (sinBarra.size + inexistentes.size + anclasRotas.size > 0) {
  process.exitCode = 1;
} else {
  console.log('✓ Todos con barra final y todos resuelven a un archivo de dist/.');
}
