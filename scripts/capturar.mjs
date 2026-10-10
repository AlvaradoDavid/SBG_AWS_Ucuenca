/**
 * Captura una página entera con Edge sin ventana, por CDP, emulando el ancho
 * de un celular o de un escritorio, y avisa si algo desborda en horizontal.
 *
 * Por qué existe este script:
 *  - El panel del navegador de Claude no dibuja mientras está oculto: sus
 *    capturas se quedan en blanco o a medias.
 *  - `msedge --headless=new --window-size=390,…` no respeta anchos menores de
 *    ~500 px: la página se arma más ancha y la captura sale cortada. Aquí el
 *    ancho se emula por CDP (`mobile: true` por debajo de 768 px), como un
 *    celular de verdad.
 *  - Con la emulación móvil, un elemento que se sale de la pantalla ensancha
 *    `innerWidth`. Así se encontró que los `sr-only` de la comparativa de
 *    patrocinio ensanchaban la página a 544 px en un celular de 390.
 *  - Los reveals salen en su estado final: se emula `prefers-reduced-motion`.
 *
 * Uso:  pnpm capturar <url> <salida.png> [ancho] [js a evaluar antes]
 *       pnpm capturar http://localhost:4322/ portada.png 390
 *       pnpm capturar http://localhost:4322/x/ x.png 390 "document.querySelector('details').open=true"
 *
 * Imprime el ancho, el alto y los primeros elementos que pasan del borde
 * derecho. Si `ancho` sale mayor que el pedido, la página desborda.
 * El navegador se toma de NAVEGADOR o, si no, del Edge de Windows.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const [url, salida, ancho = '390', guion = ''] = process.argv.slice(2);
if (!url || !salida) {
  console.error('Uso: pnpm capturar <url> <salida.png> [ancho] [js]');
  process.exit(1);
}

const NAVEGADOR = process.env.NAVEGADOR ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const movil = Number(ancho) < 768;
const puerto = 9300 + Math.floor(Math.random() * 600);
const espera = (ms) => new Promise((listo) => setTimeout(listo, ms));

const navegador = spawn(NAVEGADOR, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${puerto}`,
  `--user-data-dir=${mkdtempSync(path.join(tmpdir(), 'captura-'))}`,
  'about:blank',
]);

let pestana;
for (let i = 0; i < 50 && !pestana; i++) {
  await espera(200);
  try {
    const lista = await (await fetch(`http://127.0.0.1:${puerto}/json`)).json();
    pestana = lista.find((t) => t.type === 'page');
  } catch {}
}
if (!pestana) {
  console.error('El navegador no abrió el puerto de depuración.');
  navegador.kill();
  process.exit(1);
}

const ws = new WebSocket(pestana.webSocketDebuggerUrl);
await new Promise((listo) => ws.addEventListener('open', listo));
let id = 0;
const pendientes = new Map();
ws.addEventListener('message', (evento) => {
  const mensaje = JSON.parse(evento.data);
  if (mensaje.id && pendientes.has(mensaje.id)) {
    pendientes.get(mensaje.id)(mensaje);
    pendientes.delete(mensaje.id);
  }
});
const cdp = (method, params = {}) =>
  new Promise((listo) => {
    pendientes.set(++id, listo);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluar = async (expression) =>
  (await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;

await cdp('Emulation.setDeviceMetricsOverride', {
  width: Number(ancho),
  height: movil ? 844 : 900,
  deviceScaleFactor: 1,
  mobile: movil,
});
await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await cdp('Page.enable');
await cdp('Page.navigate', { url });
await espera(2500);

// Las imágenes diferidas solo cargan cerca de la pantalla: se recorre la página.
await evaluar(`(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
  scrollTo(0, 0);
})()`);
if (guion) await evaluar(guion);
await espera(800);

const medidas = JSON.parse(
  await evaluar(`JSON.stringify({
    ancho: innerWidth,
    alto: document.documentElement.scrollHeight,
    desbordan: [...document.querySelectorAll('body *')]
      .filter((e) => e.getBoundingClientRect().right > ${Number(ancho)} + 1 && !e.closest('[role=region]'))
      .filter((e) => !e.closest('.overflow-hidden'))
      .slice(0, 5)
      .map((e) => e.tagName + '.' + String(e.className.baseVal ?? e.className).slice(0, 60)),
  })`)
);
console.log(JSON.stringify(medidas));

const foto = await cdp('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width: Number(ancho), height: medidas.alto, scale: 1 },
});
writeFileSync(salida, Buffer.from(foto.result.data, 'base64'));
console.log(`captura: ${salida}`);

ws.close();
navegador.kill();
process.exit(medidas.ancho > Number(ancho) ? 1 : 0);
