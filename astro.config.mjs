// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// URL pública del sitio, necesaria para las URLs absolutas (og:image).
// 1. SITE_URL, si se define en la consola de Amplify: para cuando haya dominio propio.
// 2. La URL por defecto de Amplify, armada con las variables que inyecta en cada build.
//    El ID de la app no se conoce hasta crearla, por eso no se escribe a mano.
// 3. localhost, en desarrollo.
const { SITE_URL, AWS_APP_ID, AWS_BRANCH } = process.env;
const site =
  SITE_URL ||
  (AWS_APP_ID && AWS_BRANCH
    ? `https://${AWS_BRANCH}.${AWS_APP_ID}.amplifyapp.com`
    : 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
  site,

  // Cada página se genera como carpeta/index.html y Amplify redirige con un 301
  // cualquier URL sin barra final. Con 'always', el servidor de desarrollo muestra
  // un aviso en vez de la página si un enlace olvida la barra. Ver D-26.
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});
