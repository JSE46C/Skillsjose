// Logotipo para la placa de la viga. Coordenadas locales de la cara: origen en el centro,
// x hacia la derecha, y hacia abajo, en unidades de mundo (1 u = 5 cm).
//
// PROVISIONAL: marca tipográfica con los colores corporativos (#001F3F, #E8720A).
// Para usar el logotipo oficial, sustituir el cuerpo de LOGO por el contenido de LogoAzul.svg
// escalado a w × h, p. ej.:
//   const VB = [ancho, alto]; // viewBox del SVG original
//   const k = Math.min(w / VB[0], h / VB[1]);
//   return `<g transform="scale(${k}) translate(${-VB[0] / 2} ${-VB[1] / 2})">…paths…</g>`;
export function LOGO({ w, h }) {
  const size = h * 0.62;
  return [
    `<text x="${-w / 2 + 2}" y="${size * 0.36}" font-family="Roboto, Arial, Helvetica, sans-serif" font-weight="800" font-size="${size}" letter-spacing="${size * 0.04}" fill="#001F3F">MAINSA</text>`,
    `<rect x="${w / 2 - h * 1.05}" y="${-h * 0.36}" width="${h * 0.72}" height="${h * 0.72}" rx="${h * 0.16}" fill="#E8720A"/>`,
    `<path d="M${w / 2 - h * 0.94} ${h * 0.2} L${w / 2 - h * 0.69} ${-h * 0.2} L${w / 2 - h * 0.44} ${h * 0.2}" fill="none" stroke="#fff" stroke-width="${h * 0.09}" stroke-linejoin="round"/>`,
  ].join("");
}
