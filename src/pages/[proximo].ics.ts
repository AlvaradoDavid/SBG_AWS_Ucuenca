import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { archivoCalendario, rutaDeProximo, type Proximo } from '../lib/proximos';

/**
 * El archivo de calendario de cada próximo evento: /student-community-day.ics.
 * Se genera en el build, como el resto del sitio. Amplify lo sirve como
 * text/calendar por la regla de customHttp.yml, y así el iPhone ofrece
 * agregarlo al Calendario en vez de descargarlo.
 */
export const getStaticPaths = (async () => {
  const proximos = await getCollection('proximos');
  return proximos.map((evento) => ({ params: { proximo: evento.id }, props: { evento } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) => {
  const evento = props.evento as Proximo;
  const pagina = new URL(rutaDeProximo(evento), site).href;
  return new Response(archivoCalendario(evento, pagina), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
