# Grúa puente birraíl 10 t — figura interactiva

Figura isométrica (skill `anatomy`) de una grúa puente en prueba de carga, con los colores de Mainsa.

- `grua-puente.html` (tema claro) y `grua-puente-dark.html`: páginas autónomas, se abren con doble clic.
- Interacción: mover el puntero lleva la carga a ese punto (iza, traslada y deposita); `+`/`−` o `1`–`6` cambian las pesas de 2 t; flechas para mover con teclado. Sin interacción, visita guiada 4 → 8 → 12 t (salta el limitador al 110 %).
- Regenerar: `node build.mjs` y `node build.mjs --dark`.
- Logotipo: `logo.mjs` lleva una marca **provisional**. Para el oficial, pegar los paths de `LogoAzul.svg` en `LOGO()` (instrucciones en el archivo) y regenerar.
