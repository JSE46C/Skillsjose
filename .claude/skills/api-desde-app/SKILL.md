---
name: api-desde-app
description: Genera un cliente API (Python/TypeScript/etc.) a partir del tráfico de red de una aplicación web propia del grupo (ERP, portal de alquiler, app de partes de trabajo, telemetría de maquinaria) usando Reverse API Engineer. Usar cuando haya que extraer datos o automatizar una app web que no tiene API documentada o exportación, p. ej. para alimentar Power BI, Make o un proceso automático.
---

# API desde app web (Reverse API Engineer)

Herramienta: [kalil0321/reverse-api-engineer](https://github.com/kalil0321/reverse-api-engineer) (MIT, CLI Python).
Abre un navegador, captura el tráfico (HAR) mientras se usa la app y genera un cliente tipado de los endpoints reales.

## Antes de empezar (obligatorio)

1. **Permiso**: solo apps propias del grupo, o de proveedores cuyo contrato/ToS permita acceso automatizado. Si es de un proveedor y no está claro, pide confirmación al usuario y sugiere preguntar primero si existe API oficial o exportación.
2. **Credenciales**: nunca escribas usuarios/contraseñas/tokens en prompts, código ni commits. El cliente generado debe leerlos de variables de entorno.
3. **Datos personales**: si la app maneja datos de clientes o empleados, guarda los HAR fuera del repo y bórralos al terminar (contienen cookies y respuestas completas).
4. **Solo lectura por defecto**: genera primero endpoints GET/consulta. Endpoints que escriben (crear parte, modificar pedido) solo si el usuario lo pide explícitamente.

## Instalación (una vez)

```bash
uv tool install "reverse-api-engineer[manual]"   # o: pip install "reverse-api-engineer[manual]"
playwright install chromium                      # solo para modo manual
```

Necesita `ANTHROPIC_API_KEY` en el entorno (usa Claude por debajo). Ojo: el repo oficial es `kalil0321/reverse-api-engineer`; existen forks con descargas `.zip` sospechosas, no usarlos.

## Flujo

1. **Concretar el objetivo de negocio** con el usuario: qué dato, de qué pantalla, con qué frecuencia y para qué destino (Power BI, Excel, Make, otra app). Ej.: "listado de máquinas en alquiler con cliente, obra y fecha de fin".
2. **Validar sin abrir navegador**:
   ```bash
   reverse-api-engineer agent -p "<objetivo>" -u <url-app> --dry-run
   ```
3. **Capturar**:
   - App con login (lo normal en apps internas) → modo **manual**: ejecuta `reverse-api-engineer` (REPL), cambia a `manual` con Shift+Tab; el usuario inicia sesión y navega las pantallas; al cerrar el navegador se genera el cliente.
   - App pública o sesión ya abierta → modo **agent** guiado por IA:
     ```bash
     reverse-api-engineer agent -p "<objetivo>" -u <url-app> --headless --json
     ```
     Sin servidor gráfico (sesión en la nube) siempre `--headless`.
4. **Revisar el código generado** (`./scripts/<nombre>/api_client.py`, `README.md`, `example_usage.py`) antes de ejecutarlo: endpoints, autenticación, paginación, que no haya secretos incrustados.
5. **Iterar** sobre la misma captura sin volver a navegar:
   ```bash
   reverse-api-engineer engineer <run_id> -p "añadir paginación y filtro por fecha"
   ```
6. **Probar**: `reverse-api-engineer run <run_id> --file api_client.py --no-interactive`.

## Entregable

Deja en el repo del proyecto destino:
- `api_client.<ext>` con credenciales vía variables de entorno.
- `README.md` corto: endpoints descubiertos (método, ruta, parámetros, campos clave), cómo autenticar, límites conocidos.
- Si el destino es Power BI: un script que vuelque a CSV/Parquet o a una tabla SQL, con columnas tipadas y fecha de extracción, listo para programar.

## Riesgos que hay que comunicar

- La API no es oficial: puede romperse con cualquier actualización de la app. Recomendar un test de humo programado.
- Los tokens de sesión caducan: documentar cómo se renuevan.
- Si existe API oficial o exportación nativa, es preferible a esto.
