# Instrucciones: ficha técnica BYD ECB25i con el estilo de la ficha Combilift

Prompt de trabajo para Claude Code. Copiar en la carpeta de trabajo junto a los dos PDF y pedir: *"Sigue instrucciones/ficha-byd-ecb25i-estilo-combilift.md"*.

---

## 0. Objetivo y archivos

| | Archivo | Uso |
|---|---|---|
| **Origen (datos)** | `fuentes/BYD_2025_3.ECB20i_25i_27i_30i_35i_EN.pdf` (10 páginas, inglés) | Todos los datos, fotos y dibujos. **Solo el modelo ECB25i.** |
| **Referencia (estilo)** | `fuentes/C-Series_3000_Tecnico.pdf` (2 páginas, español) | Maquetación, colores, tipografías y jerarquía visual. **Ningún dato sale de aquí.** |

**Entregables** (carpeta `salida/`):
1. `ECB25i_ficha_tecnica.pdf`: A4, 3 páginas, en español.
2. `ECB25i_ficha_tecnica.html`: fuente editable de la que se genera el PDF.
3. `ecb25i.json`: todos los datos con la página de origen de cada uno.
4. `img/`: fotos recoloreadas y dibujos acotados, en SVG/PNG.
5. `informe_revision.md`: incidencias detectadas y decisiones tomadas (ver §8).

Las marcas rojas a mano (círculos rojos sobre "C-SERiES" y la celda "5.552 mm") del PDF de Combilift son anotaciones de revisión: **no forman parte del estilo y no se replican**.

---

## 1. Regla de marca (obligatoria)

Se copia el **estilo** de Combilift, **nunca su identidad**. La máquina es BYD y lo distribuye el grupo.

| Elemento en la ficha Combilift | En la ficha nueva |
|---|---|
| Logo "COMBILIFT – LiFTING INNOVATION" (cabecera, pág. 1) | Logo **BYD Forklift** (fabricante), tomado de la pág. 1 o 10 del PDF BYD |
| Título "C-SERiES / C3000E-C5000E" | **"ECB25i"** grande y **"Carretilla contrapesada eléctrica 4 ruedas"** debajo |
| "combilift.com", dirección Monaghan, teléfono, email | Datos de contacto del **distribuidor (Grupo Mainsa)**. Si no se facilitan, dejar marcador visible `[CONTACTO DISTRIBUIDOR]` |
| Bloque "Distribuido por:" | Se mantiene, con logo y datos del distribuidor (o el mismo marcador) |
| Texto de patentes Combilift | **Eliminar** |
| Aviso legal Combilift (desarrollo continuo) | **Aviso de BYD traducido** (ver §5) |
| Logo "COMBiLIFT" en la máquina de la foto | No aplica: las fotos son de BYD y conservan su logo BYD |
| Marcado CE | Mantener la línea de BYD: "Las carretillas BYD cumplen los requisitos europeos de seguridad" |

Si en algún punto el resultado pudiera confundirse con un documento oficial de Combilift, se para y se avisa.

---

## 2. Sistema visual a replicar (medido sobre el PDF Combilift)

| Elemento | Valor |
|---|---|
| Formato | A4 vertical, márgenes ~10 mm laterales |
| Verde corporativo (bandas, cabeceras de tabla, títulos) | `#086D3E` |
| Fila alterna de tabla | `#E2EAE3` (verde muy claro); la otra, blanca |
| Texto | `#383838`; secundarios `#707070` |
| Viñetas de "Incluye:" | Cuadrado/punto verde `#086D3E` |
| Llamadas de cotas en dibujos | Círculo **rojo** `#F84038` con número blanco, flecha roja |
| Títulos de modelo | **Kanit Bold Italic** (Google Fonts, gratuita): primera línea verde, segunda gris oscuro `#505058` |
| Texto y tablas | **Neris SemiBold / Black** (gratuita, Fontfabric). Si no está disponible: **Kanit Regular/SemiBold**, sin cursiva |
| Banda inferior | Barra verde a sangre (~25 mm) con contacto a la izquierda y web a la derecha, en blanco |
| Banda superior | Barra verde fina a sangre (~4 mm) |

---

## 3. Estructura de páginas

### Página 1 – Portada (calco de la pág. 1 Combilift)
- Arriba izquierda: **ECB25i** (Kanit Bold Italic verde) y debajo **Carretilla contrapesada eléctrica** (gris).
- Subtítulo en verde, 3–4 líneas, redactado a partir de la pág. 1 BYD: *"Carretilla elevadora eléctrica de 2.500 kg con batería BYD de hierro-fosfato (LFP): sin mantenimiento, carga rápida y 8 años de garantía de batería."*
- Arriba derecha: logo BYD Forklift.
- Centro: **foto principal de la ECB25i recoloreada** (ver §6). Origen: carretilla de la pág. 4 BYD (vista 3/4 lateral, la de mejor resolución).
- Icono redondo de batería/eléctrico abajo a la derecha (como el de Combilift), en verde.
- Fila de 3 fotos de aplicación: las 3 fotos de la pág. 10 BYD (almacén, exterior, palets).
- Banda verde inferior con el web del distribuidor.

### Página 2 – Ficha técnica (calco de la pág. 2 Combilift)
- Título "ECB25i" (2 líneas, como "C-SERIES / C3000E-C5000E").
- Zona de dibujos (mitad superior): **vista lateral** (izq.) y **vista en planta** (der.) de la ECB25i, redibujadas a partir de la pág. 6 BYD, con las llamadas de cotas numeradas del §4.1.
- Tabla de especificaciones con las columnas **REF. | DESCRIPCIÓN | ECB25i** (una sola columna de modelo).
- Columna derecha: **"Contrapesada eléctrica"** con la foto pequeña de la máquina (en lugar de "Multi-Direccional"), bloque **"Incluye:"** (§4.3), bloque **"Opcional:"** (§4.3, nuevo) y bloque **"Distribuido por:"**.
- Aviso legal en letra pequeña y banda verde inferior.

### Página 3 – Mástiles y capacidad (nueva; no existe en Combilift, mismo estilo)
- Tabla de mástiles **solo con columnas ECB25i** (§4.4).
- Diagrama de capacidad residual ECB25i redibujado en estilo Combilift (líneas verdes, ejes grises) a partir de la pág. 6 BYD.
- Banda verde inferior.

Si se exige que la ficha tenga **2 páginas** como Combilift: se elimina la pág. 3 y la tabla de mástiles se reduce a una fila "Mástiles disponibles: 2 etapas estándar 3.000–5.000 mm · 2 etapas FFL 3.000–4.000 mm · 3 etapas FFL 4.000–6.500 mm (consultar tabla de capacidades)".

---

## 4. Datos: qué va dónde y cómo resolver cada caso

### Reglas generales
- **Fuente única:** tabla "ECB20i/25i/27i Counterbalance Forklifts Specifications" (pág. 5 BYD), **columna central (ECB25i)**. Nunca leer la columna de al lado: ECB20i y ECB25i tienen muchos valores iguales y el error no se notaría.
- **Formato español:** separador de miles con punto, decimales con coma, espacio antes de la unidad. `4165` → `4.165 kg`, `21.6` → `21,6 kWh`, `12.5/9.5` → `12,5 / 9,5 kN`.
- **Valores "con carga / sin carga":** se mantiene el par con " / " y la descripción lo indica ("con / sin carga").
- **No inventar ni calcular datos.** Lo que no está en el PDF BYD no aparece. Si Combilift tiene una fila sin equivalente, se omite.
- **El ejemplo Combilift no marca la estructura de la tabla**, solo el estilo. Combilift es una multidireccional con filas que no aplican (modo frontal/lateral, plataforma, apertura de marco…). La tabla nueva sigue el contenido BYD agrupado como abajo.

### 4.1 Cotas (filas 1–21, numeradas en los dibujos con círculo rojo)

| REF | Descripción (ES) | ECB25i | Origen BYD | Dibujo |
|---|---|---|---|---|
| 1 | Altura de elevación (h3) | 3.000 mm | 4.4 | Lateral |
| 2 | Elevación libre (h2) | 140 mm | 4.3 | Lateral |
| 3 | Altura mástil recogido (h1) | 2.030 mm | 4.2 | Lateral |
| 4 | Altura mástil extendido (h4) | 4.040 mm | 4.5 | Lateral |
| 5 | Altura tejadillo protector (h6) | 2.195 mm | 4.7 | Lateral |
| 6 | Altura del asiento (h7) | 1.156 mm | 4.8 | Lateral |
| 7 | Altura de enganche (h10) | 333 mm | 4.12 | Lateral |
| 8 | Longitud total (l1) | 3.375 mm | 4.19 | Lateral |
| 9 | Longitud hasta cara de horquillas (l2) | 2.305 mm | 4.20 (el PDF pone "4.2") | Lateral |
| 10 | Distancia entre ejes (y) | 1.505 mm | 1.9 | Lateral |
| 11 | Distancia de carga, eje delantero a horquilla (x) | 425 mm | 1.8 | Lateral |
| 12 | Altura libre bajo mástil, con carga (m1) | 95 mm | 4.31 | Lateral |
| 13 | Altura libre centro entre ejes (m2) | 105 mm | 4.32 | Lateral |
| 14 | Inclinación mástil adelante / atrás (α/β) | 5° / 8° | 4.1 | Lateral |
| 15 | Dimensiones horquillas (s/e/l) | 40 × 120 × 1.070 mm | 4.22 | Lateral |
| 16 | Ancho total (b1) | 1.195 mm | 4.21 | Planta |
| 17 | Ancho de vía delantero (b10) | 1.000 mm | 3.6 | Planta |
| 18 | Ancho de vía trasero (b11) | 955 mm | 3.7 | Planta |
| 19 | Ancho tablero portahorquillas (b3) | 1.085 mm | 4.24 | Planta |
| 20 | Radio de giro (Wa) | 1.900 mm | 4.35 | Planta |
| 21 | Ancho de pasillo palet 1000×1200 transversal (Ast) | 3.577 mm | 4.34.1 | Planta |
| 21b | Ancho de pasillo palet 800×1200 longitudinal (Ast) | 3.736 mm | 4.34.2 | Planta |

### 4.2 Características (filas con letra, como el bloque A–K de Combilift)

| REF | Descripción (ES) | ECB25i | Origen BYD |
|---|---|---|---|
| A | Capacidad nominal (Q) | 2.500 kg | 1.5 |
| B | Centro de carga (c) | 500 mm | 1.6 |
| C | Peso en servicio | 4.165 kg | 2.1 |
| D | Carga por eje con carga, del. / tras. | 5.863 / 802 kg | 2.2 |
| E | Carga por eje sin carga, del. / tras. | 1.827 / 2.338 kg | 2.3 |
| F | Velocidad de traslación con / sin carga | 18 / 18 km/h | 5.1 |
| G | Velocidad de elevación con / sin carga | 420 / 450 mm/s | 5.2 |
| H | Velocidad de descenso con / sin carga | 500 / 400 mm/s | 5.3 |
| I | Fuerza de tracción máx. con / sin carga | 12,5 / 9,5 kN | 5.6 |
| J | Pendiente superable máx. con / sin carga | 20 / 20 % | 5.8 |
| K | Freno de servicio | Hidráulico | 5.10 (el PDF pone "5.1") |
| L | Motor de tracción (S2 60 min) | 2 × 6,6 kW | 6.1 |
| M | Motor de elevación (S3 15 %) | 16 kW | 6.2 |
| N | Batería (tensión / energía) | 80 V / 21,6 kWh, hierro-fosfato (LFP) | 6.4 + pág. 1 |
| O | Peso de batería | 350 kg | 6.5 |
| P | Control de tracción | AC | 8.1 |
| Q | Neumáticos | Superelásticos (SE) | 3.1 |
| R | Neumático delantero / trasero | 21×8-9 / 18×7-8 | 3.2 / 3.3 |
| S | Ruedas del. / tras. (x = motrices) | 2x / 2 | 3.5 |
| T | Tablero portahorquillas ISO 2328 | Clase 2A | 4.23 |
| U | Presión de trabajo para implementos | 16,8 MPa | 10.1 |
| V | Nivel sonoro en el oído del operario | ≤ 70 dB(A) | 10.7 |
| W | Puesto del operario | Sentado | 1.4 |

Fila **"Color estándar"** de Combilift: el PDF BYD no indica el color. **No se incluye.** Si las fotos se recolorean (§6), se añade al pie de la foto: *"Imagen ilustrativa. Color según configuración de pedido."*

### 4.3 Bloques "Incluye:" y "Opcional:" (de la pág. 10 BYD; solo lo que aplica a ECB25i)

**Incluye:**
- Motor de tracción dual AC 80 V
- Mástil triplex FFL de 4,8 m con elevación libre dual (ver incidencia I-1)
- Desplazador lateral integrado Cascade
- Distribuidor hidráulico de 4 vías
- Iluminación LED completa
- Batería LFP 80 V / 21,6 kWh
- Asiento MSG45 (modelo básico) / MSG65 (modelo Confort)
- Cargador IGBT 80 V / 100 A
- Horquillas de 1.070 mm
- Neumáticos macizos superelásticos
- Freno de estacionamiento eléctrico
- Desconexión automática de batería
- Garantía de batería 8 años / 15.000 h (pág. 1)

**Opcional:** variantes de mástil · implementos bajo pedido · asiento MSG65 textil/piel · cabina completa · rotativo, foco y luz de trabajo trasera · espejo panorámico · caja portaobjetos con USB · cargador IGBT 80 V / 200 A · neumáticos no marcantes · baterías de hasta 80 V / 54,4 kWh.

Excluir todo lo marcado "(ECB30i/35i)".

### 4.4 Tabla de mástiles (pág. 3): de la pág. 6 BYD, solo columnas ECB25i

Columnas: Tipo de mástil | h3 | h2 (con respaldo) | h1 | h4 | α | β | Capacidad residual @500 mm | @600 mm.
Copiar las 4 familias: **2 etapas estándar** (3.000–5.000), **2 etapas FFL** (3.000–4.000), **3 etapas dual FFL** (4.000–6.500) y **3 etapas simple FFL** (4.000–6.500). Copiar los 24 registros de la columna "ECB25i @500MM/@600MM". En ECB25i no hay guiones "—"; si aparece alguno, se ha leído la columna ECB27i.

---

## 5. Textos

- Idioma: **español de España**, terminología de carretillas (VDI 2198): *tejadillo protector*, *tablero portahorquillas*, *elevación libre*, *mástil triplex*, *desplazador lateral*, *contrapesada*.
- Aviso legal (pie, pág. 2): *"BYD se reserva el derecho a modificar el diseño, las características y los parámetros técnicos de sus productos en cualquier momento y sin previo aviso, debido a su desarrollo continuo. Las imágenes pueden incluir equipamiento opcional."*
- No traducir nombres comerciales: BYD, Cascade, MSG45, MSG65, IGBT, FFL.

---

## 6. Imágenes: recolorear la ECB25i "estilo Combilift"

**Objetivo:** el azul BYD de la carrocería pasa al verde Combilift; el negro (chasis, mástil, contrapeso) y el gris se mantienen. Así la máquina queda verde y negra como en la ficha de referencia.

**Método** (Python, Pillow/OpenCV, sin IA generativa para no deformar la máquina):
1. Extraer las imágenes a máxima resolución con PyMuPDF (`page.get_images()`), no capturas de pantalla.
2. Pasar a HSV y crear una máscara de los píxeles azules: tono ≈ 200–235°, saturación > 35 %.
3. Girar el tono de esos píxeles al del verde objetivo `#086D3E` (≈ 151°), conservando luminosidad y sombras. Ajustar la saturación para que el verde no salga fosforito.
4. Proteger: el logo BYD de la carrocería (blanco), cristales, luces, la cara de las personas y los fondos azules de las fotos de aplicación (cielo, palés pintados). Si la máscara toca el fondo, se limita a la silueta de la máquina.
5. Revisar a 200 % los bordes: sin halos azules ni verde sobre neumáticos o mástil.
6. Guardar los originales y los recoloreados por separado (`img/orig/`, `img/verde/`).

**Por caso:**

| Imagen | Qué hacer |
|---|---|
| Foto principal (pág. 4 BYD) | Recolorear |
| Foto pequeña columna derecha (pág. 1 BYD, la de dos carretillas: usar solo una) | Recolorear |
| 3 fotos de aplicación (pág. 10 BYD) | Recolorear solo la carretilla; el entorno intacto |
| Detalles técnicos (pág. 4: freno, ruedas, eje) | No se usan |
| Iconos GO SAFETY / ecológico / "Change your mind" | No se usan |
| Fotos de la ficha Combilift | **Nunca se usan** |

Si el resultado del recoloreado no es limpio en alguna foto, se usa el original azul y se anota en el informe. Es preferible una foto azul a una mal recoloreada.

---

## 7. Dibujos técnicos acotados (pág. 2) y diagrama de capacidad (pág. 3)

**Origen:** dibujos lineales de la ECB25i en la pág. 6 BYD: vista lateral (`h1…h10, l1, l2, x, y, m1, m2`) y vista en planta (`b1, b3, b10, b11, Wa, Ast`).

**Método:**
1. Extraer los dibujos como vectores (PyMuPDF `get_drawings()`) si son vectoriales; si son imagen, vectorizar a SVG.
2. Eliminar las cotas originales de BYD (letras `h1`, `l1`…).
3. Rellenar la silueta en el estilo de los dibujos Combilift: carrocería verde `#086D3E`, mástil y ruedas en gris oscuro, líneas finas.
4. Añadir cotas con flechas y **círculos rojos numerados** con el REF del §4.1. Cada número del dibujo tiene su fila en la tabla y viceversa.
5. Solo cotas que se puedan ubicar con certeza en el dibujo. Las demás (p. ej. 21b) van solo en tabla.

**Diagrama de capacidad:** redibujar la gráfica "CAPACITY CHART ECB25i" de la pág. 6 (eje X: centro de carga 500–1.000 mm; eje Y: capacidad kg; una curva por altura de elevación) con líneas en escala de verdes y etiquetas de altura, sin inventar puntos. Si las curvas no se pueden leer con precisión, insertar el gráfico original como imagen recortada y anotarlo en el informe.

---

## 8. Incidencias ya detectadas en el PDF BYD (documentar, no ocultar)

| ID | Incidencia | Decisión |
|---|---|---|
| I-1 | "Incluye" (pág. 10) dice *mástil triplex FFL 4,8 m* pero la tabla da h3 = 3.000 mm (mástil dúplex estándar) | Mantener la tabla (3.000 mm) como configuración base y poner en "Incluye" **"Mástil según configuración (ver tabla de mástiles)"**. Marcar para confirmar con BYD |
| I-2 | Fila 4.20 numerada como "4.2" (duplicada con altura mástil recogido) | Corregir a 4.20 en `ecb25i.json` |
| I-3 | Fila 5.10 (freno) numerada como "5.1" (duplicada con velocidad) | Corregir a 5.10 |
| I-4 | Cabecera "Model" pone "ECB20" en la columna de ECB20i | No afecta a ECB25i; solo anotar |
| I-5 | Altura de enganche 4.12 aparece desplazada en el texto extraído | Valor 333 mm verificado visualmente |

Cualquier incidencia nueva se añade a `informe_revision.md` con página de origen.

---

## 9. Proceso técnico

1. Instalar: `pip install pymupdf pdfplumber pillow opencv-python playwright` y `playwright install chromium`. Tipografías: Kanit (Google Fonts) y Neris (Fontfabric), embebidas en el HTML con `@font-face`.
2. Extraer datos → `ecb25i.json` con estructura `{ref, descripcion_es, valor, unidad, origen_pagina, origen_fila}`.
3. Procesar imágenes (§6) y dibujos (§7).
4. Maquetar en HTML/CSS A4 (`@page { size: A4; margin: 0 }`), con el verde y la tipografía como variables CSS para poder reutilizar la plantilla con otros modelos.
5. Exportar a PDF con Playwright (`page.pdf(format="A4", print_background=True)`).
6. Validar (§10) y generar `informe_revision.md`.

---

## 10. Validación antes de entregar

- [ ] **Datos:** script que extrae el texto del PDF final y compara cada valor con `ecb25i.json` y este con el PDF BYD. 0 diferencias.
- [ ] **Columna correcta:** 5 controles que distinguen ECB25i de ECB20i: capacidad 2.500 kg, peso 4.165 kg, carga por eje con carga 5.863 / 802, fuerza de tracción 12,5 / 9,5 kN, presión implementos 16,8 MPa.
- [ ] **Marca:** búsqueda en el PDF final de "Combilift", "combilift.com", "Monaghan", "LiFTING", "C-SERiES", "patent": 0 resultados.
- [ ] **Cotas:** cada número de los dibujos existe en la tabla y viceversa.
- [ ] **Formato:** números en formato español; ninguna celda vacía; nada se sale de la página A4.
- [ ] **Visual:** renderizar las 3 páginas a PNG y compararlas lado a lado con la ficha Combilift (márgenes, bandas, proporciones de tabla, jerarquía de títulos).
- [ ] **Fotos:** sin halos ni restos de azul en la máquina recoloreada.

Entregar el PDF, el `informe_revision.md` y la lista de puntos pendientes de confirmar con BYD o con el distribuidor.

---

## 11. Reutilización para otros modelos

La plantilla HTML y los scripts (`extraer_datos.py`, `recolorear.py`, `generar_pdf.py`, `validar.py`) deben quedar parametrizados por modelo. Para hacer **ECB20i, ECB27i, ECB30i o ECB35i** basta con cambiar la columna de origen y los dibujos. Validada la ECB25i, se convierte en skill con `skill-creator`.
