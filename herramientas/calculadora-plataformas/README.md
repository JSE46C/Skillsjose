# Calculadora inteligente de plataformas (rediseño visual)

Página única (`index.html`), sin dependencias: se abre en el navegador o se incrusta en la web con un `<iframe>`.

- **Entradas**: altura de trabajo H, distancia D (desde el eje de giro), anchura de paso A, energía y hasta 2 obstáculos.
- **Diagrama de alcance a escala**: envolvente de la máquina elegida y la máquina articulada en la postura que llega al objetivo salvando obstáculos (margen 0,5 m). Si no llega, muestra la postura más cercana y lo que falta. Se puede arrastrar el objetivo.
- **Planta**: paso disponible frente al ancho de la máquina.
- **Flota**: tarjeta por máquina con miniatura de su envolvente (misma escala para comparar) y estado: IDEAL / Válida / No llega / Obstáculo / No cabe.
- **IDEAL** = la de menor altura que resuelve el trabajo y cabe; a igual altura, ruedas antes que oruga o camión y la más estrecha.

Modelo: la envolvente se estima con un modelo cinemático (pluma inferior, pluma telescópica, plumín, cesta) ajustado a la altura y el alcance de catálogo. Es orientativa: para precisión, sustituir `envelopeOf()` por los diagramas de alcance de cada fabricante (lista de puntos por máquina en `FLEET`).
