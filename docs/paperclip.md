# Paperclip — ficha de evaluación (futuro)

Repo: [paperclipai/paperclip](https://github.com/paperclipai/paperclip) · Licencia MIT · Revisado: 2026-10-11 (commit `de9ab8e`)

## Qué es

Servidor Node.js + interfaz web para gestionar agentes de IA como si fueran plantilla: organigrama, tareas tipo ticket, objetivos, presupuestos de gasto por agente/proyecto, aprobaciones y rutinas programadas. Los agentes pueden ser Claude Code, Codex, scripts o bots HTTP.

No es una skill: es una aplicación que hay que desplegar y operar.

## Encaje en el grupo

| Caso | Encaje | Comentario |
|---|---|---|
| Rutinas recurrentes (informes semanales de rentabilidad por línea, revisión de stock, seguimiento de cobros) | Alto | Cada ejecución queda como tarea con responsable, histórico y coste. |
| Control de gasto en IA | Alto | Presupuestos con alertas y parada automática por agente/proyecto. |
| Varios agentes trabajando en paralelo sobre proyectos distintos (BI, automatización, documentación) | Medio | Aporta valor cuando hay más de 3–4 flujos de agentes vivos a la vez. |
| "Empresa autónoma" sin humanos | Bajo | No aplica a un grupo industrial; los agentes apoyan a personas, no las sustituyen. |

## Condiciones para activarlo

Pasar de "futuro" a "piloto" cuando se cumplan al menos dos:

1. Hay **3 o más procesos con agentes** funcionando de forma recurrente (no puntual).
2. El **gasto mensual en API de IA** justifica control por presupuesto.
3. Hay alguien (interno o proveedor) que **mantenga el servidor**: actualizaciones, copias, accesos.

## Coste y riesgos

- **Infraestructura**: servidor propio (Docker), base de datos y copias. Coste bajo en máquina, el coste real es el mantenimiento.
- **Coste variable**: tokens de los agentes; mitigado por los presupuestos de la propia herramienta.
- **Riesgo**: agentes autónomos con acceso a sistemas reales. Exigir aprobación humana para cualquier acción que escriba en ERP, facturación o comunique con clientes.
- **Madurez**: proyecto muy activo y cambiante; fijar versión y probar actualizaciones antes de aplicarlas.

## Prueba rápida (sin compromiso)

```bash
ANTHROPIC_API_KEY=... npx paperclipai test-drive
```

Levanta una instancia temporal de prueba en local. No conectar a sistemas de producción en esta fase.
