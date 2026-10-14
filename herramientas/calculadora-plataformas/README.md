# Calculadora inteligente de plataformas (rediseño visual)

Página única (`index.html`), sin dependencias: se abre en el navegador o se incrusta en la web con un `<iframe>`.

## Qué hace
- **Entradas**: altura H, distancia D (desde el centro de la máquina), paso disponible A, carga en plataforma, ubicación (interior/exterior), terreno, tipo de máquina y hasta 2 obstáculos.
- **Diagrama de alcance a escala** de la máquina elegida (tijera, mástil, articulada, telescópica o camión) en la postura que llega al objetivo salvando obstáculos (margen 0,5 m).
- **Comparativa por tipo**: la mejor máquina de cada tipo o el motivo por el que ninguna vale, con comprobación de alcance, obstáculo, paso, carga, terreno y ubicación.
- **Flota completa (43 máquinas)** con miniatura de su zona de trabajo a la misma escala y estado: IDEAL / Válida / Muy cerca / No llega / Obstáculo / Terreno / Carga / No cabe / Interior.

## Criterio de recomendación
La solución más sencilla que cumple todo: tijera → mástil → brazo (articulada si hay obstáculos, telescópica si no) → camión. Dentro de cada tipo, menor altura, chasis de ruedas y ancho más estrecho.

## Datos
- Alturas: catálogo web. Alcance y ancho de articuladas y camiones articulados: calculadora actual.
- Marcadas `est: true` en `FLEET`: tijeras (plataforma, extensión, ancho, carga), mástiles, telescópicas y camiones telescópicos usan **valores típicos del mercado pendientes de confirmar** con la ficha de cada modelo.
- Las zonas de trabajo se estiman con un modelo cinemático por tipo ajustado a altura y alcance. Para precisión, sustituir por los diagramas de alcance del fabricante.
