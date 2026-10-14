# Skillsjose — skills y herramientas de IA para el grupo

Repositorio de skills para Claude Code. Al abrir este repo (en local o en una sesión en la nube), Claude carga automáticamente las skills de `.claude/skills/` y el servidor MCP de `.mcp.json`.

## Catálogo

| Herramienta | Para qué en el grupo | Tipo | Estado en este repo | Prioridad |
|---|---|---|---|---|
| **ppt-master** ([hugohe3/ppt-master](https://github.com/hugohe3/ppt-master)) | PDF/Word/Excel → PowerPoint editable de verdad (formas nativas, gráficos, animaciones). Presentaciones para dirección, clientes y subvenciones. | Skill | ✅ Incorporada: `.claude/skills/ppt-master` | Alta |
| **diagram-design** ([cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)) | Diagramas con la marca del grupo: procesos, swimlanes, organigramas, flujos de datos, Gantt, cascadas, Sankey. 44 tipos, HTML/SVG/PNG. | Skill | ✅ Incorporada: `.claude/skills/diagram-design` | Alta |
| **api-desde-app** (skill propia sobre [kalil0321/reverse-api-engineer](https://github.com/kalil0321/reverse-api-engineer)) | Sacar una API de nuestras apps web sin API (ERP, portal de alquiler, telemetría) para alimentar Power BI, Make o automatizaciones. | Skill + CLI Python | ✅ Incorporada: `.claude/skills/api-desde-app` (el CLI se instala aparte) | Alta |
| **karpathy-guidelines** ([multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)) | 4 reglas para que Claude programe mejor: pensar antes, simplicidad, cambios quirúrgicos, objetivos verificables. Menos retrabajo en scripts, DAX y automatizaciones. | Skill | ✅ Incorporada: `.claude/skills/karpathy-guidelines` | Media |
| **REA** ([morluto/rea](https://github.com/morluto/rea)) | Entender cómo funciona por dentro una aplicación instalada (escritorio, Electron, .NET, web) sin su código. Útil con software heredado o de proveedor del que dependemos. | Skill + servidor MCP | ✅ Incorporada: `.claude/skills/reverse-engineer-anything` + `.mcp.json` | Media |
| **claude-mem** ([thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)) | Memoria entre sesiones: Claude recuerda lo que hizo en sesiones anteriores. | Plugin (worker en segundo plano) | ⚙️ Instalación manual en tu equipo (ver abajo) | Media |
| **Paperclip** ([paperclipai/paperclip](https://github.com/paperclipai/paperclip)) | "Empresa" de agentes: organigrama, tareas, presupuestos y aprobaciones para agentes autónomos. | Aplicación (servidor + web) | 🕓 Futuro. Ficha de evaluación: [`docs/paperclip.md`](docs/paperclip.md) | Baja (hoy) |

Versiones fijadas en [`skills.lock`](skills.lock). Atribuciones y licencias en [`THIRD_PARTY.md`](THIRD_PARTY.md).

## Cómo se usan

Basta con pedirlo en lenguaje natural dentro de una sesión de Claude Code sobre este repo:

- *"Hazme una presentación para el comité de dirección a partir de este PDF de resultados del Q3"* → ppt-master
- *"Dibuja el proceso de alquiler: reserva → entrega → parte de trabajo → devolución → facturación, en swimlanes por departamento"* → diagram-design
- *"Quiero sacar por API el listado de máquinas en obra de nuestro portal de alquiler para meterlo en Power BI"* → api-desde-app
- *"Explícame cómo calcula los precios la app de escritorio del proveedor X"* → REA

## Requisitos por herramienta

| Herramienta | Requisito | Comando |
|---|---|---|
| ppt-master | Python 3.10+ y sus dependencias | `pip install -r .claude/skills/ppt-master/requirements.txt` |
| diagram-design | Nada para HTML/SVG; navegador para exportar PNG | — |
| api-desde-app | CLI + `ANTHROPIC_API_KEY` | `uv tool install "reverse-api-engineer[manual]"` y `playwright install chromium` |
| REA | Node.js ≥ 22.19 (se lanza solo vía `npx`). Para binarios nativos: Ghidra, Hopper o IDA | Claude Code pedirá aprobar el servidor MCP `rea` la primera vez |
| claude-mem | Claude Code en tu equipo | En Claude Code: `/plugin marketplace add thedotmack/claude-mem` y `/plugin install claude-mem` |

### Por qué claude-mem no está incorporado en el repo

1. **Es memoria personal y transversal a todos tus proyectos**, así que su sitio es tu instalación de Claude Code (nivel usuario), no un repo concreto.
2. **No funciona en sesiones en la nube**: allí los plugins no se cargan y el contenedor se borra al terminar.
3. **Datos**: guarda en local (SQLite + Chroma) resúmenes de todo lo que hace Claude, incluidos datos de negocio. **No actives "Cloud Sync" ni la variante `claude-mem-cowork`** (envían las observaciones a cmem.ai) sin decidirlo antes. Usa etiquetas `<private>…</private>` para lo que no deba guardarse.

## Instalar en tu cuenta de claude.ai (recomendado)

Una skill activada en claude.ai está disponible en el chat, Cowork, Claude Code local y sesiones en la nube.

```bash
scripts/build-claude-ai-zips.sh   # genera dist/karpathy-guidelines.zip, diagram-design.zip, ppt-master.zip
```

Subir cada `.zip` en claude.ai → Ajustes → Capacidades → Skills → Subir skill.

- `ppt-master.zip` va **recortado** (sin `templates/icons` ni `templates/sounds`) para cumplir el límite de 30 MB: sin librería de iconos ni efectos de sonido. Para la versión completa, usar Claude Code sobre este repo.
- REA, api-desde-app y claude-mem necesitan ejecutarse en tu equipo: no se suben.

## Actualizar las skills

```bash
scripts/sync-skills.sh --update   # trae la última versión y actualiza skills.lock
git diff --stat                   # revisar qué ha cambiado antes de hacer commit
```

Sin `--update`, el script reinstala exactamente las versiones fijadas.

## Seguridad: reglas de uso

- **Origen**: instalar solo desde los repos oficiales listados arriba. Existe al menos un fork de reverse-api-engineer (`yqman34/reverse-api-engineer`) que invita a descargar `.zip` desde la carpeta de ejemplos: patrón típico de malware. No usarlo.
- **REA y api-desde-app**: solo sobre software propio o con permiso explícito (contrato/ToS). REA no es un sandbox: analiza con los permisos de tu usuario. Ingeniería inversa de software de terceros puede vulnerar licencias.
- **Credenciales y HAR**: las capturas de tráfico contienen cookies y datos completos; fuera del repo y borrar al terminar.
- **Versiones fijadas**: no se actualiza nada automáticamente; cada actualización pasa por `sync-skills.sh --update` + revisión.
