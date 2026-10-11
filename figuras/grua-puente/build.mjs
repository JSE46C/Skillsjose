// Grúa puente birraíl 10 t en prueba de carga. Figura isométrica interactiva (skill anatomy).
// node build.mjs            -> grua-puente.html (tema claro)
// node build.mjs --dark     -> grua-puente-dark.html
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../../.claude/skills/anatomy/kit/lathe.mjs";
import { tubePieces, tubeSvg } from "../../.claude/skills/anatomy/kit/tube.mjs";
import { kitScript } from "../../.claude/skills/anatomy/scripts/inline-kit.mjs";
import { LOGO } from "./logo.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--dark") ? "dark" : "light";

// ── Modelo real (1 unidad = 5 cm) ────────────────────────────────────────────
const U = 20; // unidades por metro
const SWL = 10; // t, carga nominal
const TRIP = 1.1; // el limitador corta al 110 %
const BLOCK_T = 2; // t por pesa de prueba
const MAX_BLOCKS = 6;
const SPEED = 8; // animación acelerada ×8
const V_HOIST = (4 / 60) * U * SPEED; // 4 m/min
const V_TROLLEY = (20 / 60) * U * SPEED; // 20 m/min
const V_BRIDGE = (32 / 60) * U * SPEED; // 32 m/min

// ── Geometría (mundo: x a lo largo del camino de rodadura, y a lo largo de las vigas, z arriba) ──
const W = 640;
const H = 470;
const AZIMUTH = 36;
const FLOOR = { x: -204, y: -154, w: 408, d: 306, r: 6 };
const RUN_Y = 140; // ejes de carril a ±RUN_Y (luz 14 m)
const BEAM_BOT = 128;
const BEAM_TOP = 140;
const RAIL_TOP = 142.4;
const COLS = [-180, 0, 180];
const CAR = { x0: -34, x1: 34, z0: 143, z1: 157, half: 6 }; // testero
const GIR = { z0: 157, z1: 181, xs: [-20, 20], half: 5 }; // vigas cajón
const T_RAIL_TOP = 182.2;
const TRO = { z0: 183, z1: 190 }; // bastidor del carro
const DRUM = { z: 196, r: 5, y0: -13, y1: 13 };
const FALL_X = [5, -5]; // ramal al tambor (delante) y ramal al anclaje con célula (detrás)
const FALL_Y = [-10, 10];
const ANCHOR_Z = 182;
const X_LIMIT = 140;
const Y_LIMIT = [-80, 100];
const FEST = { x: 27.5, track: [186, 187.6], carrier: [184, 186], clamp: -124.5, n: 6, loop: 30, gap: 2.6 };

// carga: gancho, barra de izado y pesas. Todo relativo al asiento del gancho zs.
const HOOK_R = 2;
const BOWL = 4.4;
const EYE = { x: 4.4, hole: 2.6 };
const HOLE_DZ = HOOK_R - EYE.hole; // centro del ojo respecto a zs
const PLATE_BOT = HOLE_DZ - 6.4;
const ROD = 45;
const BASE_TOP = PLATE_BOT - ROD;
const BASE_H = 2;
const FOOT_H = 1.5;
const LOAD_BOT = BASE_TOP - BASE_H - FOOT_H; // fondo de las patas respecto a zs
const BLOCK = { w: 22, d: 16, h: 5.8 };
const PAD_H = 0.8;
const PADS = [
  { x: -100, y: -44 },
  { x: 92, y: 56 },
];
const Z_REST = PAD_H - LOAD_BOT; // zs con la carga apoyada en una placa
const LIFT = 40; // altura de traslación: 2 m sobre el apoyo

const P = k.fitProjection(
  [...k.boxCorners(FLOOR, -6, 0), [-194, -RUN_Y - 6, 150], [194, RUN_Y + 6, 150], [-160, -120, 202], [160, 120, 202], [-160, 120, 202], [160, -120, 202]],
  W,
  H,
  { pad: 18, azimuth: AZIMUTH },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const AX = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
const box = (x0, x1, y0, y1, z0, z1, { r = 0.5, steps = 3, bevel = 0 } = {}) => k.slabOf({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r }, z0, z1 - z0, P, steps, bevel);
const plan = (x0, x1, y0, y1, r = 0.5) => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });
const frame = (axis, o) => G.frameAlong(o, AX[axis]);
const disc = (axis, o, s0, s1, r) => G.disc(s0, s1, r, frame(axis, o), P);
const seg = (a, b) => k.segment(a, b, P);
const poly = (points, closed = false) => k.pathOf(points.map(at), closed);
const depth = (p) => k.depthOf(p, P);
const byDepth = (list, key) => [...list].sort((a, b) => depth(key(a)) - depth(key(b)));

// ── Suelo ────────────────────────────────────────────────────────────────────
function floor() {
  const out = [`<path class="iso-halo" d="${k.haloOf(FLOOR, -6, 6, P)}"/>`];
  out.push(S(k.slabOf(FLOOR, -6, 6, P, 6, 1.2), { tone: "lo" }));
  // juntas de dilatación de la solera, de borde a borde
  for (const x of [-90, 90]) out.push(Ln(seg([x, FLOOR.y, 0], [x, FLOOR.y + FLOOR.d, 0]), { tone: "faint" }));
  out.push(Ln(seg([FLOOR.x, 0, 0], [FLOOR.x + FLOOR.w, 0, 0]), { tone: "faint" }));
  // placas de apoyo para las pesas
  for (const pad of PADS) {
    const p = plan(pad.x - 17, pad.x + 17, pad.y - 14, pad.y + 14, 1);
    out.push(S(k.slabOf(p, 0, PAD_H, P, 3, 0.4), { tone: "lo", crease: "none" }));
    out.push(Ln(k.planOutline(k.insetPlan(p, 2.4), PAD_H, P, 3), { tone: "faint" }));
    out.push(Dots(k.corners(p, 1.4).map(([x, y]) => at([x, y, PAD_H])), { size: 0.45, tone: "mid" }));
  }
  // placas base de pilares con pernos de anclaje
  for (const yc of [-RUN_Y, RUN_Y]) {
    for (const xc of COLS) {
      const p = plan(xc - 7, xc + 7, yc - 7, yc + 7, 0.6);
      out.push(S(k.slabOf(p, 0, 1.2, P, 2, 0.3), { tone: "mid" }));
      const bolts = k.corners(p, 1.8);
      out.push(Ln(bolts.map(([x, y]) => k.ring(x, y, 0.9, 1.2, P, 12)).join(""), { tone: "lo" }));
      out.push(Dots(bolts.map(([x, y]) => at([x, y, 1.2])), { size: 0.45, tone: "mid" }));
    }
  }
  return out.join("");
}

// sombra de la carga sobre el suelo (se mueve con el carro)
function shadow() {
  return `<path class="iso-halo" d="${k.haloOf(plan(-12, 12, -9, 9, 4), 0, 0.1, P)}" style="filter:blur(6px)"/>`;
}

// ── Camino de rodadura ───────────────────────────────────────────────────────
function column(xc, yc) {
  const out = [];
  out.push(S(box(xc - 4, xc - 2.8, yc - 4, yc + 4, 1.2, BEAM_BOT), { tone: "mid" }));
  out.push(S(box(xc - 2.8, xc + 2.8, yc - 0.5, yc + 0.5, 1.2, BEAM_BOT, { r: 0.2 }), { tone: "mid", crease: "none" }));
  out.push(S(box(xc + 2.8, xc + 4, yc - 4, yc + 4, 1.2, BEAM_BOT), { tone: "mid" }));
  // cartelas de la placa base
  out.push(S(box(xc + 4, xc + 6, yc - 0.4, yc + 0.4, 1.2, 6, { r: 0.1, steps: 2 }), { tone: "mid", crease: "none" }));
  return out.join("");
}

function runwayBeam(yc, far) {
  const out = [];
  out.push(S(box(-194, 194, yc - 4, yc + 4, BEAM_BOT, BEAM_BOT + 1.2, { r: 0.3 }), { tone: "mid" }));
  out.push(S(box(-194, 194, yc - 0.5, yc + 0.5, BEAM_BOT + 1.2, BEAM_TOP - 1.2, { r: 0.2 }), { tone: "mid", crease: "none" }));
  // rigidizadores sobre cada pilar
  for (const xc of COLS) out.push(S(box(xc - 0.5, xc + 0.5, yc + 0.5, yc + 3.7, BEAM_BOT + 1.2, BEAM_TOP - 1.2, { r: 0.1, steps: 2 }), { tone: "mid", crease: "none" }));
  if (far) out.push(busbar(yc));
  out.push(S(box(-194, 194, yc - 4, yc + 4, BEAM_TOP - 1.2, BEAM_TOP, { r: 0.3 }), { tone: "mid", crease: "faint" }));
  // carril y grapas
  out.push(S(box(-192, 192, yc - 1.5, yc + 1.5, BEAM_TOP, RAIL_TOP, { r: 0.4, bevel: 0.4 }), { tone: "mid" }));
  const clips = [];
  for (let x = -180; x <= 180; x += 24) {
    for (const side of [-1, 1]) {
      const y0 = side < 0 ? yc - 3.6 : yc + 1.5;
      out.push(S(box(x - 1.2, x + 1.2, y0, y0 + 2.1, BEAM_TOP, BEAM_TOP + 0.8, { r: 0.3, steps: 2 }), { tone: "mid", crease: "none" }));
      clips.push(at([x, y0 + 1.05, BEAM_TOP + 0.8]));
    }
  }
  out.push(Dots(clips, { size: 0.4, tone: "mid" }));
  // topes de fin de vía con amortiguador
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? -194 : 188;
    out.push(S(box(x0, x0 + 6, yc - 5, yc + 5, BEAM_TOP, BEAM_TOP + 11, { r: 0.6, bevel: 0.5 }), { tone: "mid" }));
    out.push(Dots([at([x0 + 3, yc - 3, BEAM_TOP + 11]), at([x0 + 3, yc + 3, BEAM_TOP + 11])], { size: 0.45 }));
    const face = side < 0 ? -188 : 188;
    out.push(S(disc("x", [face - side * 2.5, yc, BEAM_TOP + 6.5], -2.5, 2.5, 2.6), { tone: "mid" }));
  }
  return out.join("");
}

// línea eléctrica blindada en la cara interior de la viga del fondo
function busbar(yc) {
  const out = [];
  const y0 = yc + 4;
  for (let x = -176; x <= 176; x += 44) out.push(S(box(x - 0.9, x + 0.9, y0 - 1, y0 + 2, 134, BEAM_TOP - 1.2, { r: 0.2, steps: 2 }), { tone: "mid", crease: "none" }));
  out.push(S(box(-190, 190, y0, y0 + 2.4, 130.6, 134, { r: 0.5, bevel: 0.3 }), { tone: "mid", inner: Ln(k.sideSeam(plan(-190, 190, y0, y0 + 2.4, 0.5), 132.3, P, 3), { tone: "faint" }) }));
  for (const x of [-192, 190]) out.push(S(box(x, x + 2, y0 - 0.3, y0 + 2.7, 130.2, 134.4, { r: 0.4, steps: 2 }), { tone: "mid" }));
  return out.join("");
}

// ── Testeros ─────────────────────────────────────────────────────────────────
function gearmotor(yFace, out_) {
  // reductor en la cara del testero y motor horizontal con aletas
  const out = [];
  const y0 = yFace;
  const y1 = yFace + out_ * 6;
  const [ya, yb] = y0 < y1 ? [y0, y1] : [y1, y0];
  const ym = (ya + yb) / 2;
  out.push(S(box(20, 32, ya, yb, 144, 155, { r: 1, bevel: 0.5 }), { tone: "mid", inner: Ln(k.sideSeam(plan(20, 32, ya, yb, 1), 149.5, P, 3), { tone: "faint" }) }));
  const F = frame("x", [32, ym, 149.6]);
  const ribs = G.ribsOf(F, 0.4, 11.2, 3.7, 18, P, { fade: [0.1, 0.55], seams: true });
  out.push(S(G.disc(0, 11.6, 3.6, F, P), { tone: "mid", inner: k.fadedSvg(ribs, { tone: "lo" }) }));
  out.push(S(G.disc(11.6, 13.6, 3.9, F, P), { tone: "mid" }));
  out.push(Dots(G.dotsOf(F, 13.6, 2.4, 8, P, { all: true }), { size: 0.4, tone: "lo" }));
  out.push(S(box(35, 40, ym - 2, ym + 2, 152.6, 155.4, { r: 0.4, steps: 2 }), { tone: "mid" }));
  return out.join("");
}

function carriage(yc, far) {
  const out = [];
  const y0 = yc - CAR.half;
  const y1 = yc + CAR.half;
  // ruedas: solo asoman por debajo del cajón, apoyadas en el carril
  for (const x of [-26, 26]) out.push(S(disc("y", [x, yc, RAIL_TOP + 4.6], -2.4, 2.4, 4.6), { tone: "mid" }));
  const cp = plan(CAR.x0, CAR.x1, y0, y1, 2);
  out.push(S(k.slabOf(cp, CAR.z0, CAR.z1 - CAR.z0, P, 4, 0.8), { tone: "hi", inner: Ln(k.sideSeam(cp, CAR.z0 + 1.6, P, 4) + k.sideSeam(cp, CAR.z1 - 1.6, P, 4), { tone: "lo" }) }));
  // tornillería de unión viga–testero
  const bolts = [];
  for (const gx of GIR.xs) for (const dx of [-6.6, 6.6]) for (const dy of [-3.6, 0, 3.6]) bolts.push(at([gx + dx, yc + dy, CAR.z1]));
  out.push(Dots(bolts, { size: 0.42, tone: "lo" }));
  // tapas de rodamiento en la cara visible
  const face = far ? y1 : y1;
  const capX = far ? [-26] : [-26];
  for (const x of capX) {
    const F = frame("y", [x, face, RAIL_TOP + 4.6]);
    out.push(S(G.disc(0, 1.2, 3.1, F, P), { tone: "hi" }));
    out.push(Dots(G.dotsOf(F, 1.2, 2.2, 6, P, { all: true }), { size: 0.38, tone: "lo" }));
  }
  out.push(gearmotor(face, 1));
  // topes elásticos
  for (const side of [-1, 1]) {
    const F = frame("x", [side * CAR.x1, yc, 150]);
    out.push(S(G.disc(0, side * 1.2, 2.8, F, P), { tone: "hi" }));
    out.push(S(G.disc(side * 1.2, side * 5.2, 2.2, F, P), { tone: "mid" }));
  }
  if (far) {
    // toma de corriente: brazo y patín sobre la línea blindada
    out.push(S(box(-8, -5, y1, y1 + 1.6, 134.6, 150, { r: 0.3, steps: 2 }), { tone: "mid" }));
    out.push(S(box(-10, -3, y1 - 1.4, y1 + 2.6, 134, 136.4, { r: 0.6, steps: 2 }), { tone: "mid" }));
    out.push(Dots([at([-9, y1 + 1, 136.4]), at([-4, y1 + 1, 136.4])], { size: 0.4 }));
  } else {
    // placa de características del puente
    out.push(S(box(-16, -4, y1, y1 + 0.4, 146.5, 153.5, { r: 0.2, steps: 2 }), { tone: "mid", crease: "none" }));
    const rule = (y, len) => Ln(seg([-14.6, y1 + 0.4, y], [-14.6 + len, y1 + 0.4, y]), { tone: "lo", free: true });
    out.push(rule(151.6, 8.4), rule(150, 6), rule(148.4, 7.2));
  }
  return out.join("");
}

// ── Vigas principales ────────────────────────────────────────────────────────
function girder(xc, near, [ya, yb] = [-RUN_Y - CAR.half, RUN_Y + CAR.half]) {
  const out = [];
  const x0 = xc - GIR.half;
  const x1 = xc + GIR.half;
  const gp = plan(x0, x1, ya, yb, 0.4);
  const seams = k.sideSeam(gp, GIR.z0 + 1.2, P, 2) + k.sideSeam(gp, GIR.z1 - 1.2, P, 2);
  // diafragmas: soldaduras verticales de ala a ala en la cara exterior
  const ribs = [];
  if (near) for (let y = -124; y <= 124; y += 16) ribs.push(seg([x1, y, GIR.z0 + 1.2], [x1, y, GIR.z1 - 1.2]));
  out.push(S(k.slabOf(gp, GIR.z0, GIR.z1 - GIR.z0, P, 2, 0.6), { tone: "hi", inner: Ln(seams, { tone: "lo" }) + Ln(ribs.join(""), { tone: "faint" }) }));
  if (yb < RUN_Y) {
    // unión atornillada con el tramo que apoya en el testero cercano
    out.push(Dots([GIR.z0 + 4, GIR.z1 - 4].flatMap((z) => [at([x1, yb - 1.4, z])]).concat([at([xc - 2.6, yb - 1.4, GIR.z1]), at([xc + 2.6, yb - 1.4, GIR.z1])]), { size: 0.42 }));
  }
  if (yb - ya < 40) return out.join("");
  // carril del carro con grapas y topes
  out.push(S(box(xc - 0.9, xc + 0.9, -128, 128, GIR.z1, T_RAIL_TOP, { r: 0.3 }), { tone: "mid" }));
  const clips = [];
  for (let y = -120; y <= 120; y += 20) clips.push(at([xc + 2.2, y, GIR.z1]));
  out.push(Dots(clips, { size: 0.38, tone: "lo" }));
  for (const s of [-1, 1]) {
    const y0 = s < 0 ? -133 : 128;
    out.push(S(box(xc - 2.4, xc + 2.4, y0, y0 + 5, GIR.z1, GIR.z1 + 4.4, { r: 0.5, bevel: 0.3 }), { tone: "mid" }));
  }
  if (near) out.push(logoPlate(x1));
  return out.join("");
}

function panel(face) {
  const out = [];
  const y0 = -123;
  const y1 = -101;
  out.push(S(box(face, face + 4, y0, y1, 159.6, 175, { r: 0.6, bevel: 0.4 }), { tone: "mid" }));
  const f = face + 4;
  out.push(Ln(poly([[f, y0 + 1.4, 161], [f, y1 - 1.4, 161], [f, y1 - 1.4, 173.6], [f, y0 + 1.4, 173.6]], true), { tone: "lo" }));
  // rejilla de ventilación: ranuras cerradas
  for (const z of [163.4, 165, 166.6]) out.push(Ln(poly([[f, y0 + 4, z], [f, y0 + 10, z], [f, y0 + 10, z + 0.6], [f, y0 + 4, z + 0.6]], true), { tone: "faint" }));
  out.push(S(box(f, f + 1, y1 - 4, y1 - 3, 166, 172, { r: 0.3, steps: 2 }), { tone: "mid" }));
  out.push(Dots([at([f, y0 + 2.6, 172.4]), at([f, y1 - 2.6, 172.4])], { size: 0.4 }));
  // manguera de alimentación hasta el amarre fijo de la guirnalda
  out.push(k.wireSvg(at([face + 2.6, y0 + 1.6, 175]), at([FEST.x, FEST.clamp, FEST.carrier[0]]), { via: [at([face + 2.6, y0 + 1.6, 178.6]), at([FEST.x, y0 + 1.6, 181.4])], tone: "mid", size: 0.9 }));
  out.push(S(k.cylinder(face + 2, y0 + 6, 0.9, 158.2, 1.4, P, 12), { tone: "mid" }));
  return out.join("");
}

// placa con el logotipo, en el plano de la cara exterior de la viga
function logoPlate(face) {
  const yc = -20;
  const zc = 166.6;
  const len = 84;
  const tall = 13.4;
  const out = [];
  out.push(`<g class="mainsa-plate">${S(box(face, face + 0.5, yc - len / 2, yc + len / 2, zc - tall / 2, zc + tall / 2, { r: 0.6, steps: 3 }), { tone: "mid", crease: "none" })}</g>`);
  out.push(Dots([[yc - len / 2 + 2, zc + tall / 2 - 2], [yc + len / 2 - 2, zc + tall / 2 - 2], [yc - len / 2 + 2, zc - tall / 2 + 2], [yc + len / 2 - 2, zc - tall / 2 + 2]].map(([y, z]) => at([face + 0.5, y, z])), { size: 0.4, tone: "lo" }));
  // grupo en coordenadas de la cara: x local = −y del mundo, y local = −z
  out.push(`<g class="mainsa-logo" transform="${k.sideMatrix([face + 0.5, yc], zc, P, "right")}">${LOGO({ w: len - 8, h: tall - 4 })}</g>`);
  return out.join("");
}

// ── Guirnalda de alimentación del carro (en la cara exterior de la viga cercana) ──
function festoonTrack() {
  const out = [];
  const [t0, t1] = FEST.track;
  for (let y = -126; y <= 126; y += 36) {
    out.push(S(box(25, 26.4, y - 0.8, y + 0.8, 176, t1 + 1.4, { r: 0.2, steps: 2 }), { tone: "mid", crease: "none" }));
    out.push(S(box(26.4, FEST.x + 0.9, y - 0.8, y + 0.8, t1, t1 + 1.4, { r: 0.2, steps: 2 }), { tone: "mid", crease: "none" }));
    out.push(Dots([at([26.4, y, 178]), at([26.4, y, 181])], { size: 0.38, tone: "lo" }));
  }
  out.push(S(box(FEST.x - 0.9, FEST.x + 0.9, -128, 128, t0, t1, { r: 0.3 }), { tone: "mid", inner: Ln(k.sideSeam(plan(FEST.x - 0.9, FEST.x + 0.9, -128, 128, 0.3), t0 + 0.8, P, 3), { tone: "faint" }) }));
  // amarre fijo
  out.push(S(box(FEST.x - 1.3, FEST.x + 1.3, FEST.clamp - 1.6, FEST.clamp + 1.6, FEST.carrier[0] - 0.6, t0, { r: 0.4, steps: 2 }), { tone: "mid" }));
  return out.join("");
}
function festoonCarrier() {
  const [c0, c1] = FEST.carrier;
  return S(box(FEST.x - 1.3, FEST.x + 1.3, -1.2, 1.2, c0, c1, { r: 0.4, steps: 2 }), { tone: "mid" }) + Dots([at([FEST.x + 1.3, 0, c1 - 0.6])], { size: 0.36, tone: "lo" });
}
// carro remolcador: brazo del bastidor del carro al último carrito (relativo al carro)
function festoonTow() {
  const out = [];
  const [c0, c1] = FEST.carrier;
  out.push(S(box(FEST.x - 1.3, FEST.x + 1.3, -24.4, -21.6, c0, c1, { r: 0.4, steps: 2 }), { tone: "mid" }));
  out.push(S(box(FEST.x + 1.3, FEST.x + 2.5, -24, -22, c0, TRO.z1 + 1.4, { r: 0.2, steps: 2 }), { tone: "mid", crease: "none" }));
  out.push(S(box(18, FEST.x + 2.5, -24, -22, TRO.z1, TRO.z1 + 1.4, { r: 0.2, steps: 2 }), { tone: "mid", crease: "none" }));
  out.push(S(box(18, 21, -22, -20, TRO.z0 + 2, TRO.z1 + 1.4, { r: 0.2, steps: 2 }), { tone: "mid", crease: "none" }));
  return out.join("");
}

// ── Carro y polipasto (coordenadas relativas al puente y al carro) ───────────
function trolley() {
  const out = [];
  const Z0 = TRO.z0;
  const Z1 = TRO.z1;
  // ruedas sobre los carriles de las vigas
  for (const x of GIR.xs) for (const y of [-14, 14]) out.push(S(disc("x", [x, y, T_RAIL_TOP + 3.6], -1.5, 1.5, 3.6), { tone: "mid" }));
  const side = (x0, x1) => S(box(x0, x1, -20, 20, Z0, Z1, { r: 1, bevel: 0.5 }), { tone: "hi", inner: Ln(k.sideSeam(plan(x0, x1, -20, 20, 1), Z0 + 1.4, P, 3), { tone: "faint" }) });
  const cross = (y0, y1) => S(box(-14, 14, y0, y1, Z0 + 1, Z1, { r: 0.6, bevel: 0.4 }), { tone: "hi" });
  out.push(S(box(-30, -26, -18, -10, 184, 190, { r: 0.6, bevel: 0.3 }), { tone: "mid" }));
  out.push(side(-25, -14));
  out.push(cross(-20, -14));
  // viga del anclaje con la célula de carga (limitador)
  out.push(S(box(-8, -2, -14, 14, 184, 187, { r: 0.4 }), { tone: "mid" }));
  for (const y of FALL_Y) out.push(S(k.cylinder(-5, y, 1.1, ANCHOR_Z, 2, P, 16), { tone: "mid" }));
  const pin = frame("x", [-5, 12, 185.5]);
  out.push(S(G.disc(-3.6, 3.6, 1.3, pin, P), { tone: "hi", lit: true }));
  out.push(cross(14, 20));
  out.push(side(14, 25));
  // tambor sobre soportes: rodamiento en −y, reductor en +y
  out.push(S(box(-3, 3, -17, -14, Z1, DRUM.z + 1, { r: 0.4, steps: 2 }), { tone: "mid" }));
  out.push(S(disc("y", [0, -14, DRUM.z], -1, 0, 2.6), { tone: "mid" }));
  const FD = frame("y", [0, 0, DRUM.z]);
  const grooves = [];
  for (let s = DRUM.y0 + 1.6; s < DRUM.y1 - 1; s += 1.3) grooves.push(G.arcOf(FD, s, DRUM.r, P));
  out.push(S(G.disc(DRUM.y0, DRUM.y1, DRUM.r, FD, P), { tone: "hi", inner: Ln(grooves.join(""), { tone: "faint" }) }));
  for (const s of [DRUM.y0, DRUM.y1 - 0.8]) out.push(S(G.disc(s, s + 0.8, DRUM.r + 1.1, FD, P), { tone: "hi" }));
  out.push(S(G.disc(DRUM.y1, 14, 1.6, FD, P), { tone: "mid" }));
  // ramales superiores: del tambor al bastidor (delante) y al anclaje (detrás)
  for (const y of FALL_Y) out.push(Ln(seg([FALL_X[0], y, DRUM.z], [FALL_X[0], y, Z1]), { tone: "hi" }));
  // limitador de final de carrera de elevación
  out.push(S(box(-4, 2, -21, -17.6, Z1, Z1 + 5, { r: 0.6, bevel: 0.3 }), { tone: "mid" }));
  out.push(S(disc("y", [0, -17.6, DRUM.z], 0, 0.6, 0.8), { tone: "mid" }));
  // motor de elevación (detrás del tambor) con freno y reductor
  const FM = frame("y", [-10, 0, 194]);
  const ribs = G.ribsOf(FM, -9.4, 13.4, 3.9, 22, P, { fade: [0.1, 0.55], seams: true });
  out.push(S(G.disc(-12.4, -9.6, 4.3, FM, P), { tone: "mid" }));
  out.push(Dots(G.dotsOf(FM, -12.4, 3, 8, P, { fade: [0.04, 0.42] }), { size: 0.38, tone: "lo" }));
  out.push(S(G.disc(-9.6, 14, 3.8, FM, P), { tone: "mid", inner: k.fadedSvg(ribs, { tone: "lo" }) }));
  out.push(S(box(-12.4, -7.6, -3, 2, 197.4, 199.8, { r: 0.4, steps: 2 }), { tone: "mid" }));
  out.push(S(box(-14, 7, 14, 21, Z1, 201, { r: 1.2, bevel: 0.6 }), { tone: "mid", inner: Ln(k.sideSeam(plan(-14, 7, 14, 21, 1.2), 195.4, P, 4), { tone: "faint" }) }));
  out.push(Dots([at([-12, 21, 199]), at([5, 21, 199]), at([-12, 21, 192]), at([5, 21, 192])], { size: 0.4, tone: "lo" }));
  // armario del limitador con piloto
  out.push(S(box(8, 13.6, 14.4, 19.6, Z1, Z1 + 5, { r: 0.5, bevel: 0.3 }), { tone: "mid" }));
  out.push(`<g class="lamp">${S(k.cylinder(10.8, 17, 1.8, Z1 + 5, 2, P, 20), { tone: "mid" })}</g>`);
  out.push(k.wireSvg(at([-1.4, 12, 185.5]), at([9.5, 14.4, 192.6]), { via: [at([-1.4, 13.3, 186.6]), at([9.5, 13.3, 186.6])], tone: "lo", size: 0.9 }));
  // topes del carro
  for (const x of GIR.xs) for (const s of [-1, 1]) out.push(S(disc("y", [x, s * 20, 187], 0, s * 3, 1.6), { tone: "mid" }));
  return out.join("");
}

// ── Gancho, motón y pesas de prueba (relativo a zs = Z_REST) ────────────────
function hookRoute(zs) {
  const pts = [[0, 0, zs + 13]];
  for (let i = 0; i <= 24; i++) {
    const t = Math.PI + (i / 24) * Math.PI;
    pts.push([BOWL + BOWL * Math.cos(t), 0, zs + BOWL + BOWL * Math.sin(t)]);
  }
  pts.push([2 * BOWL + 0.2, 0, zs + BOWL + 2.4], [2 * BOWL + 0.9, 0, zs + BOWL + 5]);
  return pts.filter((p, i) => i === 0 || p[2] !== zs + BOWL || p[0] !== 0);
}

function hookAndLoad(zs) {
  const out = [];
  const lx = EYE.x;
  const base = zs + BASE_TOP;
  // patas y bandeja
  const bp = plan(lx - 13, lx + 13, -10, 10, 1.4);
  for (const [x, y] of byDepth(k.corners(bp, 2.6), (p) => [p[0], p[1], 0])) out.push(S(k.cylinder(x, y, 1.5, base - BASE_H - FOOT_H, FOOT_H, P, 14), { tone: "mid" }));
  out.push(S(k.slabOf(bp, base - BASE_H, BASE_H, P, 3, 0.5), { tone: "hi", lit: true }));
  out.push(Dots(k.corners(bp, 1.4).map(([x, y]) => at([x, y, base])), { size: 0.42, tone: "mid" }));
  // barra de izado (las pesas la tapan)
  out.push(S(k.cylinder(lx, 0, 1.4, base, ROD, P, 18), { tone: "hi", lit: true, crease: "none" }));
  // pesas de 2 t apiladas
  for (let i = 0; i < MAX_BLOCKS; i++) {
    const z0 = base + i * BLOCK.h;
    const p = plan(lx - BLOCK.w / 2, lx + BLOCK.w / 2, -BLOCK.d / 2, BLOCK.d / 2, 1.2);
    const lip = k.sideSeam(p, z0 + 1.2, P, 3);
    const pocket = (y) => poly([[p.x + p.w, y - 2.4, z0 + 2.2], [p.x + p.w, y + 2.4, z0 + 2.2], [p.x + p.w, y + 2.4, z0 + 3.8], [p.x + p.w, y - 2.4, z0 + 3.8]], true);
    out.push(
      `<g data-block="${i}">${S(k.slabOf(p, z0, BLOCK.h, P, 3, 0.5), { tone: "hi", lit: true, inner: Ln(lip, { tone: "faint" }) })}${Ln(pocket(-4) + pocket(4), { tone: "lo" })}${Ln(k.ring(lx, 0, 2.2, z0 + BLOCK.h, P, 18), { tone: "lo" })}${Dots([at([p.x + 2, -6, z0 + BLOCK.h]), at([p.x + p.w - 2, 6, z0 + BLOCK.h])], { size: 0.4, tone: "lo" })}</g>`,
    );
  }
  // gancho: tubo en el plano x–z que atraviesa el ojo de la barra
  const route = hookRoute(zs);
  const radius = (t) => (t < 0.32 ? HOOK_R : t < 0.82 ? HOOK_R + 0.25 * Math.sin(((t - 0.32) / 0.5) * Math.PI) : HOOK_R - (HOOK_R - 0.9) * ((t - 0.82) / 0.18));
  const lengths = [0];
  for (let i = 1; i < route.length; i++) lengths.push(lengths[i - 1] + Math.hypot(...route[i].map((v, j) => v - route[i - 1][j])));
  const crossAt = (xw) => {
    for (let i = 1; i < route.length; i++) {
      const [a, b] = [route[i - 1], route[i]];
      if ((a[0] - xw) * (b[0] - xw) <= 0 && a[2] < zs + BOWL && b[2] < zs + BOWL + 0.01) return lengths[i - 1] + ((xw - a[0]) / (b[0] - a[0])) * (lengths[i] - lengths[i - 1]);
    }
    return 0;
  };
  const gap = [crossAt(lx - 0.8), crossAt(lx + 0.8)];
  const pieces = tubePieces(route, radius, P, { maxLength: 5, gaps: [gap] });
  const back = pieces.filter((piece) => piece.mid[0] < lx);
  const front = pieces.filter((piece) => piece.mid[0] >= lx);
  out.push(`<g class="hook-part">${back.map((piece) => tubeSvg(piece, { tone: "hi" })).join("")}</g>`);
  // ojo de la barra
  const holeZ = zs + HOLE_DZ;
  const FE = G.frameOf([lx, 0, holeZ], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const eye = [];
  for (let i = 0; i <= 16; i++) eye.push([3.9 * Math.cos((i / 16) * Math.PI), 3.9 * Math.sin((i / 16) * Math.PI)]);
  eye.push([-2.6, -6.4], [2.6, -6.4]);
  out.push(S(G.prismOf(FE, eye, -0.8, 0.8, P), { tone: "hi", lit: true }));
  out.push(`<path class="iso-shade" data-shade="0" d="${G.circleOf(FE, 0.8, EYE.hole, P)}"/>`);
  out.push(Ln(G.circleOf(FE, 0.8, EYE.hole, P), { tone: "lo" }));
  const hook = [];
  hook.push(front.map((piece) => tubeSvg(piece, { tone: "hi" })).join(""));
  // pestillo de seguridad
  hook.push(Ln(seg([HOOK_R - 0.2, 0, zs + 10.4], [2 * BOWL + 0.9, 0, zs + BOWL + 4.6]), { tone: "mid" }));
  // tuerca de la caña y motón
  const hex = [];
  for (let i = 0; i < 6; i++) hex.push([3.2 * Math.cos((i * Math.PI) / 3 + Math.PI / 6), 3.2 * Math.sin((i * Math.PI) / 3 + Math.PI / 6)]);
  hook.push(S(k.extrude(hex, zs + 13, 2.4, P, { bevel: 0.3 }), { tone: "hi", lit: true }));
  const hp = plan(-6.5, 6.5, -15, 15, 3);
  hook.push(S(k.slabOf(hp, zs + 15.4, 12, P, 6, 0.8), { tone: "hi", lit: true, inner: Ln(k.sideSeam(hp, zs + 17, P, 6), { tone: "lo" }) }));
  const axle = frame("y", [0, 15, zs + 22]);
  hook.push(S(G.disc(0, 1, 2.6, axle, P), { tone: "hi", lit: true }));
  hook.push(Dots(G.dotsOf(axle, 1, 1.7, 6, P, { all: true }), { size: 0.36, tone: "mid" }));
  hook.push(Ln(FALL_X.flatMap((x) => FALL_Y.map((y) => k.ring(x, y, 1.1, zs + 27.4, P, 12))).join(""), { tone: "lo" }));
  hook.push(k.faceTextSvg(k.sideMatrix([6.5, 0], zs + 20.6, P, "right"), "10 t", { size: 4.2, tone: "mid", anchor: "middle" }));
  out.push(`<g class="hook-part">${hook.join("")}</g>`);
  return out.join("");
}

// ── Montaje ──────────────────────────────────────────────────────────────────
const g = (name, body, extra = "") => `<g data-part="${name}"${extra}>${body}</g>`;
const farCols = byDepth(COLS.map((x) => [x, -RUN_Y, 0]), (p) => p).map(([x, y]) => column(x, y)).join("");
const nearCols = byDepth(COLS.map((x) => [x, RUN_Y, 0]), (p) => p).map(([x, y]) => column(x, y)).join("");
const ropeIds = FALL_X.flatMap((x, i) => FALL_Y.map((y, j) => `<path class="iso-line" data-tone="hi" data-rope="${i}-${j}" d=""/>`)).join("");

const svg = k.figureSvg({
  width: W,
  height: H,
  label:
    "Grúa puente birraíl de 10 toneladas sobre su camino de rodadura, en una prueba de carga. El puente, con dos vigas cajón naranjas y dos testeros, recorre los carriles; el carro con el polipasto se desplaza sobre las vigas; el gancho levanta una barra con pesas de prueba de 2 toneladas. Un limitador en el anclaje del cable corta la elevación al pasar del 110 por ciento de la carga nominal.",
  body: [
    floor(),
    g("shadow", shadow()),
    farCols,
    runwayBeam(-RUN_Y, true),
    g("bridge-far", `<g class="mainsa">${carriage(-RUN_Y, true)}${girder(GIR.xs[0], false, [-RUN_Y - CAR.half, RUN_Y - CAR.half])}</g>`),
    g("ropes", ropeIds),
    g("load", hookAndLoad(Z_REST)),
    nearCols,
    runwayBeam(RUN_Y, false),
    g("bridge-near", `<g class="mainsa">${carriage(RUN_Y, false)}${girder(GIR.xs[0], false, [RUN_Y - CAR.half, RUN_Y + CAR.half])}${girder(GIR.xs[1], true)}</g>`),
    g("trolley", trolley()),
    g("festoon", `${festoonTrack()}<g data-loops>${Array.from({ length: (FEST.n + 1) * 2 }, () => `<path class="iso-line" data-tone="mid" d=""/>`).join("")}</g>${Array.from({ length: FEST.n }, (_, i) => `<g data-carrier="${i}">${festoonCarrier()}</g>`).join("")}<g data-tow>${festoonTow()}</g>`),
    g("panel", `<g class="mainsa">${panel(GIR.xs[1] + GIR.half)}</g>`),
  ],
});

const CSS = `
.mainsa{--anatomy-shade-0:#d0640a;--anatomy-shade-1:#dc6c0b;--anatomy-shade-2:#e8760f;--anatomy-shade-3:#f0821c;--anatomy-top:#f7a55e;--anatomy-face:#e8720a;--anatomy-hi:#5a2a00;--anatomy-lo:#a24c03;--anatomy-faint:#d06208;--anatomy-mid:#7a3a00}
.mainsa .mainsa-plate{--anatomy-shade-0:#e4e6ea;--anatomy-shade-1:#eceef1;--anatomy-shade-2:#f2f3f5;--anatomy-shade-3:#f7f8f9;--anatomy-top:#ffffff;--anatomy-mid:#9aa3ad}
.mainsa .iso-dots circle{fill:#3a1c00}
.lamp .iso-top,.lamp .iso-shade{fill:var(--anatomy-green)}
.lamp[data-state="trip"] .iso-top,.lamp[data-state="trip"] .iso-shade{fill:var(--anatomy-red)}
.iso-stage{outline:none;touch-action:pan-y;cursor:crosshair}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
[data-readout][data-trip]{color:var(--anatomy-red)}
.blocks{position:absolute;left:20px;bottom:40px;display:flex;gap:8px;align-items:center;font:12px/1 var(--anatomy-mono);color:var(--anatomy-muted)}
.blocks button{font:inherit;color:var(--anatomy-text);background:var(--anatomy-card);border:1px solid var(--anatomy-lo);padding:3px 9px;cursor:pointer;line-height:1.2}
.blocks button:hover{color:var(--anatomy-strong)}
@media (max-width:560px){.iso-plate{padding-bottom:124px!important}.blocks{left:12px;bottom:64px}}
`;

const live = `
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ U, SWL, TRIP, BLOCK_T, MAX_BLOCKS, V_HOIST, V_TROLLEY, V_BRIDGE, FEST, Z_REST, LIFT, PAD_H, LOAD_BOT, X_LIMIT, Y_LIMIT, PADS, FALL_X, FALL_Y, ANCHOR_Z, TRO_Z1: TRO.z1, EYE_X: EYE.x })};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const festoonEl = part("festoon"), panelEl = part("panel");
const loops = [...festoonEl.querySelectorAll("[data-loops] path")], carriers = [...festoonEl.querySelectorAll("[data-carrier]")], tow = festoonEl.querySelector("[data-tow]");
const bridgeFar = part("bridge-far"), bridgeNear = part("bridge-near"), trolleyEl = part("trolley"), loadEl = part("load"), shadowEl = part("shadow");
const ropes = [...svg.querySelectorAll("[data-rope]")];
const blocks = [...svg.querySelectorAll("[data-block]")];
const lamp = svg.querySelector(".lamp");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const fmt = (v, d = 1) => v.toFixed(d).replace(".", ",");

// estado del modelo
const s = { x: C.PADS[0].x - C.EYE_X, y: C.PADS[0].y, z: C.Z_REST, vx: 0, vy: 0, vz: 0, n: 2, tension: 0, trip: false, drop: 0 };
const want = { x: s.x, y: s.y, n: 2, hoist: "down" };
let user = false, lastMove = 0, idleTimer = 0, visible = false, frame = 0, last = 0, clock = 0;

const groundAt = (lx, ly) => C.PADS.some((p) => Math.abs(lx - p.x) < 17 && Math.abs(ly - p.y) < 14) ? C.PAD_H : 0;
const restZ = () => groundAt(s.x + C.EYE_X, s.y) - C.LOAD_BOT;
const weight = () => s.n * C.BLOCK_T;
const STRETCH = 1.2; // tiro creciente mientras se tensa el cable (unidades)

// eje con rampa de variador: acelera, crucero, frena sin pasarse
function axis(pos, vel, target, vmax, acc, dt) {
  const d = target - pos;
  if (Math.abs(d) < 0.02 && Math.abs(vel) < 0.5) return [target, 0];
  const goal = Math.sign(d) * Math.min(vmax, Math.sqrt(2 * acc * Math.abs(d)));
  const dv = clamp(goal - vel, -acc * dt, acc * dt);
  vel += dv;
  pos += vel * dt;
  if ((target - pos) * d < 0) { pos = target; vel = 0; }
  return [pos, vel];
}

// ── visita guiada ──
const tour = { step: 0, wait: 0, at: 0 };
function tourTick(dt) {
  const pad = C.PADS[tour.at];
  const other = C.PADS[1 - tour.at];
  tour.wait -= dt;
  if (tour.wait > 0) return;
  switch (tour.step) {
    case 0: // en el apoyo: ajustar pesas
      want.hoist = "down";
      if (s.n !== want.n || s.drop > 0.01 || s.z > restZ()) return;
      want.hoist = "up"; tour.step = 1; return;
    case 1: // izar
      if (s.trip) { tour.step = 10; tour.wait = 2.6; return; }
      if (s.z >= restZ() + STRETCH + C.LIFT - 0.1) { want.x = other.x - C.EYE_X; want.y = other.y; tour.step = 2; }
      return;
    case 2: // trasladar
      if (Math.abs(s.x - want.x) < 0.05 && Math.abs(s.y - want.y) < 0.05) { want.hoist = "down"; tour.step = 3; tour.wait = 0.4; }
      return;
    case 3: // bajar y soltar
      if (s.z <= restZ() - 0.55) { tour.at = 1 - tour.at; want.n = Math.min(C.MAX_BLOCKS, s.n + 2); tour.step = 0; tour.wait = 0.9; }
      return;
    case 10: // limitador disparado: bajar y quitar pesas
      want.hoist = "down";
      if (s.z > restZ() - 0.55) return;
      want.n = 2; tour.step = 0; tour.wait = 0.8; return;
  }
}

const grounded = () => s.tension < weight() - 1e-6;
const loadAt = () => Math.max(restZ(), s.z - STRETCH);
const hookAt = () => (s.z < restZ() ? s.z : loadAt());

function step(dt) {
  const calm = still.matches;
  if (!user) tourTick(dt);
  // pesas: se añaden o retiran solo con la carga apoyada y el cable flojo
  const slack = s.z <= restZ() + 0.01;
  if (slack && s.drop <= 0.01 && want.n !== s.n) {
    if (want.n > s.n) { s.n += 1; s.drop = 1; } else { s.n -= 1; }
    s.trip = false;
  }
  s.drop = calm ? 0 : Math.max(0, s.drop - dt * 2.2);
  // elevación: con orden de bajar, el gancho afloja 0,6 dentro del ojo
  const rest = restZ();
  if (s.trip && want.hoist === "down" && s.z <= rest) s.trip = false;
  let zTarget = want.hoist === "up" ? rest + STRETCH + C.LIFT : rest - 0.6;
  if (s.trip && zTarget > s.z) zTarget = s.z;
  [s.z, s.vz] = calm ? [zTarget, 0] : axis(s.z, s.vz, zTarget, C.V_HOIST, C.V_HOIST * 2.5, dt);
  // tiro en el cable: crece mientras el cable se tensa; la carga despega al igualar su peso
  s.tension = weight() * clamp((s.z - rest) / STRETCH, 0, 1);
  if (!s.trip && s.vz > 0 && s.tension >= C.SWL * C.TRIP) {
    s.trip = true; s.vz = 0;
    s.z = rest + STRETCH * (C.SWL * C.TRIP) / weight();
    s.tension = C.SWL * C.TRIP;
  }
  // traslación: solo con la carga suspendida
  const lifted = s.z >= rest + STRETCH + C.LIFT * 0.9;
  if (lifted) {
    [s.x, s.vx] = calm ? [want.x, 0] : axis(s.x, s.vx, want.x, C.V_BRIDGE, C.V_BRIDGE * 1.6, dt);
    [s.y, s.vy] = calm ? [want.y, 0] : axis(s.y, s.vy, want.y, C.V_TROLLEY, C.V_TROLLEY * 1.6, dt);
  } else { s.vx = 0; s.vy = 0; }
  if (user) {
    const moving = Math.abs(s.x - want.x) > 0.5 || Math.abs(s.y - want.y) > 0.5;
    if (s.n !== want.n) want.hoist = "down";
    else if (moving) want.hoist = "up";
    else if (performance.now() - lastMove > 700) want.hoist = "down";
  }
}

function draw() {
  const lift = s.z - C.Z_REST;
  const tb = translateAlong(P, [s.x, 0, 0]);
  bridgeFar.setAttribute("transform", tb);
  bridgeNear.setAttribute("transform", tb);
  trolleyEl.setAttribute("transform", translateAlong(P, [s.x, s.y, 0]));
  // la carga sube con el gancho solo cuando el cable ya la sostiene
  const loadZ = loadAt() - C.Z_REST;
  const hookZ = hookAt();
  loadEl.setAttribute("transform", translateAlong(P, [s.x, s.y, loadZ]));
  loadEl.querySelectorAll(".hook-part").forEach((el) => el.setAttribute("transform", translateAlong(P, [0, 0, hookZ - C.Z_REST - loadZ])));
  shadowEl.setAttribute("transform", translateAlong(P, [s.x + C.EYE_X, s.y, 0]));
  shadowEl.style.opacity = String(clamp(1 - (loadZ + C.Z_REST - restZ()) / 70, 0.25, 1));
  blocks.forEach((el, i) => {
    el.style.display = i < s.n ? "" : "none";
    el.setAttribute("transform", i === s.n - 1 && s.drop > 0 ? translateAlong(P, [0, 0, 9 * s.drop * s.drop]) : "");
  });
  ropes.forEach((el, i) => {
    const x = C.FALL_X[Math.floor(i / 2)], y = C.FALL_Y[i % 2];
    const top = i < 2 ? C.TRO_Z1 : C.ANCHOR_Z;
    el.setAttribute("d", segment([s.x + x, s.y + y, hookZ + 27.4], [s.x + x, s.y + y, top], P));
  });
  // guirnalda: carritos repartidos entre el amarre fijo y el remolcador; los bucles cuelgan más cuanto más juntos
  festoonEl.setAttribute("transform", tb);
  panelEl.setAttribute("transform", tb);
  tow.setAttribute("transform", translateAlong(P, [0, s.y, 0]));
  const F = C.FEST, y0 = F.clamp, yT = s.y - 23, n = F.n;
  const ys = [y0];
  for (let i = 1; i <= n; i++) ys.push(y0 + (yT - y0) * i / (n + 1));
  ys.push(yT);
  carriers.forEach((el, i) => el.setAttribute("transform", translateAlong(P, [0, ys[i + 1], 0])));
  for (let i = 0; i <= n; i++) {
    const a = ys[i], b = ys[i + 1], d = Math.abs(b - a);
    [[F.x - 0.5, F.loop], [F.x + 0.5, F.loop * 0.86]].forEach(([x, L], j) => {
      const sag = 0.5 * Math.sqrt(Math.max(0, L * L - d * d));
      const pts = [];
      for (let t = 0; t <= 1.0001; t += 1 / 12) pts.push(iso([x, a + (b - a) * t, F.carrier[0] - 4 * sag * t * (1 - t)], P));
      loops[i * 2 + j].setAttribute("d", pathOf(pts));
    });
  }
  lamp.dataset.state = s.trip ? "trip" : "ok";
  const pct = Math.round((s.tension / C.SWL) * 100);
  const hook = fmt(hookZ / C.U);
  const text = s.trip
    ? "LIMITADOR " + fmt(s.tension) + " t · " + pct + " % · elevación bloqueada"
    : fmt(s.tension) + " t en el cable · " + pct + " % · gancho " + hook + " m";
  if (readout.textContent !== text) readout.textContent = text;
  if (s.trip) readout.dataset.trip = ""; else delete readout.dataset.trip;
  counter.textContent = s.n + " × 2 t = " + weight() + " t";
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  step(dt);
  draw();
  frame = visible ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);

// ── entrada: el puntero indica dónde dejar la carga ──
const O = iso([0, 0, 0], P), AXX = axisVector(P, [1, 0, 0]), AXY = axisVector(P, [0, 1, 0]);
function floorPoint(event) {
  const m = svg.getScreenCTM().inverse();
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m);
  const dx = pt.x - O[0], dy = pt.y - O[1];
  const det = AXX[0] * AXY[1] - AXX[1] * AXY[0];
  return [(dx * AXY[1] - dy * AXY[0]) / det, (AXX[0] * dy - AXX[1] * dx) / det];
}
function takeOver() {
  user = true;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { user = false; tour.step = s.z > restZ() + 1 ? 3 : 0; want.hoist = "down"; tour.wait = 0.4; tour.at = nearestPad(); }, 6000);
}
const nearestPad = () => { const lx = s.x + C.EYE_X; return Math.abs(lx - C.PADS[0].x) + Math.abs(s.y - C.PADS[0].y) < Math.abs(lx - C.PADS[1].x) + Math.abs(s.y - C.PADS[1].y) ? 0 : 1; };
function aim(lx, ly) {
  takeOver();
  want.x = clamp(lx - C.EYE_X, -C.X_LIMIT, C.X_LIMIT);
  want.y = clamp(ly, C.Y_LIMIT[0], C.Y_LIMIT[1]);
  lastMove = performance.now();
}
stage.addEventListener("pointermove", (event) => { const [x, y] = floorPoint(event); aim(x, y); });
stage.addEventListener("pointerdown", (event) => { const [x, y] = floorPoint(event); aim(x, y); });
function setBlocks(n) { takeOver(); want.n = clamp(n, 1, C.MAX_BLOCKS); if (s.z > restZ() + 0.5) want.hoist = "down"; lastMove = 0; }
stage.addEventListener("keydown", (event) => {
  const stepU = event.shiftKey ? 60 : 20;
  const keys = { ArrowLeft: [-stepU, 0], ArrowRight: [stepU, 0], ArrowUp: [0, -stepU], ArrowDown: [0, stepU] };
  if (keys[event.key]) { event.preventDefault(); aim(s.x + C.EYE_X + keys[event.key][0], s.y + keys[event.key][1]); return; }
  if (event.key === "+" || event.key === "=") { event.preventDefault(); setBlocks(want.n + 1); }
  if (event.key === "-") { event.preventDefault(); setBlocks(want.n - 1); }
  if (/^[1-6]$/.test(event.key)) { event.preventDefault(); setBlocks(Number(event.key)); }
});
const counter = document.querySelector("[data-blocks]");
document.querySelector("[data-less]").addEventListener("click", () => setBlocks(want.n - 1));
document.querySelector("[data-more]").addEventListener("click", () => setBlocks(want.n + 1));
if (still.matches) { s.z = restZ(); }
draw();
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "Grúa puente birraíl · 10 t",
  hint: "Mueve el puntero · ± pesas",
  readout: "4,0 t en el cable · 40 % · gancho 2,9 m",
  keys: [
    { mark: "lit", label: "Gancho, motón y pesas de prueba de 2 t" },
    { mark: "raised", label: "Puente: vigas cajón y testeros" },
    { mark: "red", label: "Piloto del limitador: corta la elevación al 110 % (11 t)" },
  ],
  caption:
    "Grúa puente birraíl de 10 t y 14 m de luz en una prueba de carga. El limitador mide el tiro en el anclaje del cable (célula de carga junto al tambor): por encima de 11 t corta la elevación antes de que la carga despegue y solo deja bajar. Velocidades de un polipasto típico con variador (elevación 4 m/min, carro 20 m/min, puente 32 m/min), animadas ×8.",
  body: `<div class="iso-stage" tabindex="0" role="group" aria-label="Grúa puente: mueve el puntero o usa las flechas para llevar la carga; teclas + y − o 1 a 6 para cambiar el número de pesas">${svg}</div><div class="blocks"><button type="button" data-less aria-label="Quitar una pesa">−</button><span data-blocks>2 × 2 t = 4 t</span><button type="button" data-more aria-label="Añadir una pesa">+</button></div>`,
});

const out = THEME === "dark" ? "grua-puente-dark.html" : "grua-puente.html";
writeFileSync(join(HERE, out), k.pageHtml({ title: "Grúa puente", theme: THEME, body: body.replace("</figure>", `</figure><style>${CSS}</style>`), script: kitScript() + live, width: 760 }));
console.log("wrote", out);
