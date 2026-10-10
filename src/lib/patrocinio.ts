import { club } from './categorias';
import { estaVigente, type Proximo } from './proximos';

/**
 * La página de patrocinio de un próximo evento (D-32). Todo el contacto son
 * enlaces: el mensaje ya va escrito y la empresa solo completa su nombre.
 */
export type Patrocinio = NonNullable<Proximo['data']['patrocinio']>;
export type Nivel = Patrocinio['niveles'][number];

export function rutaDePatrocinio(evento: Proximo): string {
  return `/${evento.id}/patrocinio/`;
}

/** Las páginas del evento y la portada invitan a patrocinar mientras el evento no termina. */
export function buscaPatrocinio(evento: Proximo): boolean {
  return Boolean(evento.data.patrocinio) && estaVigente(evento);
}

/** "$500": como lo escribe el brochure. */
export function precioDeNivel(nivel: Nivel): string {
  return `$${nivel.precio}`;
}

/** "+593984230758" → "+593 98 423 0758", como se escribe un celular del Ecuador. */
export function telefonoLegible(numero: string): string {
  const partes = numero.match(/^\+593(\d{2})(\d{3})(\d{4})$/);
  return partes ? `+593 ${partes[1]} ${partes[2]} ${partes[3]}` : numero;
}

/**
 * Lo que llega por WhatsApp o por correo: de dónde viene y qué nivel le interesa,
 * para que el club lo sepa sin preguntar. Termina en «Mi empresa es:» para que
 * la empresa sepa qué escribir.
 */
export function mensajeDePatrocinio(evento: Proximo, nivel?: Nivel): string {
  const interes = nivel
    ? `Me interesa el nivel ${nivel.nombre} (${precioDeNivel(nivel)}).`
    : 'Me gustaría agendar una reunión para conocer las opciones de patrocinio.';
  return `Hola, les escribo desde la página de patrocinio del ${evento.data.titulo}. ${interes} Mi empresa es: `;
}

/** En el celular abre la app con el mensaje escrito; en la computadora, WhatsApp Web. */
export function enlaceWhatsApp(numero: string, mensaje: string): string {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
}

/** mailto quiere %20 y no +, así que no sirve URLSearchParams. */
export function enlaceCorreo(correo: string, asunto: string, cuerpo: string): string {
  return `mailto:${correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}

/** "aws.ucuenca", sacado de la URL del perfil. */
export const usuarioInstagram = new URL(club.instagram).pathname.replaceAll('/', '');

/** ig.me abre directamente el chat privado con la cuenta, no su perfil. */
export const instagramDirecto = `https://ig.me/m/${usuarioInstagram}`;

/**
 * Lo que trae un nivel además del anterior, sacado de la comparativa para que las
 * tarjetas y la tabla no se contradigan nunca. Un valor de texto se muestra con
 * su beneficio: «Espacio de stand: Preferencial». El espacio duro evita que un
 * «1» quede solo en el renglón siguiente.
 */
export function novedadesDeNivel(patrocinio: Patrocinio, indice: number): string[] {
  return patrocinio.beneficios
    .flatMap((grupo) => grupo.filas)
    .filter(({ valores }) => valores[indice] && (indice === 0 || valores[indice] !== valores[indice - 1]))
    .map(({ beneficio, valores }) =>
      valores[indice] === true ? beneficio : `${beneficio}: ${valores[indice]}`
    );
}
