import { useEffect, useRef } from "react";
import styles from "./BG.module.css";
import { BGShape, type BGShapeProps } from "./BGShape";
import { NodeLinkTemplate } from "./NodeLink";

// ─── NodeLink data ────────────────────────────────────────────────────────────


// ─── Shape lists per parallax layer ──────────────────────────────────────────
//
// Positions in rem (1rem = 16px at default font-size).
// Three depth layers with different parallax scroll speeds:
//   FAR   — slowest (0.04×)  — large ambient blobs far in the background
//   MID   — medium  (0.10×)  — geometric shapes at mid-depth
//   NEAR  — fastest (0.17×)  — small particles closest to the viewer

const FAR: BGShapeProps[] = [
  { shape: "pulse-gradient", left: -10, top: -5,   size: 48, fill: "rgba(254,133,0,0.15)", animations: [{ type: 'pulse', strength: 0.1, duration: 10 }],  opacity: 1 },
  { shape: "uhdacm", fill: 'rgba(52, 137, 255, 0.02)',    left: 70,   top: 15,  size: 10, stroke: "rgba(52, 137, 255, 0.1)",  animations: [{ type: "float", strength: 3, duration: 40 }, { type: 'wobble', duration: 25 }],      duration: 7,  delay: 0.9, strokeWidth: 1 },
  { shape: "pulse-gradient", left:  46, top: 26,   size: 42, fill: "rgba(52,136,255,0.12)", opacity: 1 },
  { shape: "pulse-gradient", left:  80, top: 55,   size: 50, fill: "rgba(254,133,0,0.12)",  opacity: 1 },
  { shape: "pulse-gradient", left:  -8, top: 80,   size: 44, fill: "rgba(52,136,255,0.13)", opacity: 1 },
  { shape: "pulse-gradient", left:  40, top: 110,  size: 52, fill: "rgba(254,133,0,0.10)",  opacity: 1 },
  { shape: "pulse-gradient", left:  70, top: 140,  size: 46, fill: "rgba(52,136,255,0.11)", opacity: 1 },
  { shape: "pulse-gradient", left: -12, top: 165,  size: 48, fill: "rgba(254,133,0,0.13)",  opacity: 1 },
  { shape: "pulse-gradient", left:  55, top: 195,  size: 54, fill: "rgba(52,136,255,0.10)", opacity: 1 },
  { shape: "pulse-gradient", left:  10, top: 230,  size: 50, fill: "rgba(254,133,0,0.12)",  opacity: 1 },
  { shape: "pulse-gradient", left:  75, top: 260,  size: 44, fill: "rgba(52,136,255,0.13)", opacity: 1 },
];

const MID: BGShapeProps[] = [
  // ── first third of viewport ───────────────────────────────────────────────
  { shape: "square", rotation: 45,   left:  4.5, top: 14,   size: 3.5, stroke: "rgba(254,133,0,0.60)", borderRadius: 10,  animations: [{ type: 'wobble', strength: 3, duration: 15 }, { type: 'drift', strength: 3, duration: 20 }], fill: "rgba(254, 131, 0, 0.08)",      duration: 6, strokeWidth: 1 },
  { shape: "square",    left: 54,   top:  3.5, size: 4,   stroke: "rgba(52,136,255,0.60)", animations: [{ type: "float" }],      duration: 8,  delay: 1.5, strokeWidth: 1 },
  { shape: "code",      left: 45,   top:  9.5, size: 1.6, stroke: "rgba(254,133,0,0.38)",  animations: [{ type: "pulse" }],      duration: 4,  delay: 0.5, strokeWidth: 1 },
  { shape: "ring",      left: 27,   top:  7,   size: 2.5, stroke: "rgba(254,133,0,0.22)",  animations: [{ type: "float" }],      duration: 10, delay: 3, strokeWidth: 1 },
  { shape: "uhdacm", fill: 'rgba(52,136,255,0.1)',    left: 67,   top: 3,  size: 4, stroke: "rgba(52,136,255,0.6)",  animations: [{ type: "float" }, { type: 'wobble' }],      duration: 7,  delay: 0.9, strokeWidth: 1 },
  { shape: "triangle",  left: 72,   top:  4.5, size: 2,   stroke: "rgba(52,136,255,0.28)", animations: [{ type: "grow-fade" }],      duration: 9,  delay: 0.7, strokeWidth: 1 },
  // ── second third ─────────────────────────────────────────────────────────
  { shape: "atom",      left: 55,   top: 27,   size: 1.8, stroke: "rgba(52,136,255,0.45)", animations: [{ type: "spin-right" }, { type: "grow-fade", strength: 2, duration: 3 }], duration: 22 },
  { shape: "code",      left:  6.5, top: 28.5, size: 0.9, stroke: "rgba(52,136,255,0.30)", animations: [{ type: "pulse" }],      duration: 7,  delay: 2 },
  { shape: "lightbulb", left: 16,   top: 22.5, size: 1.4, stroke: "rgba(52,136,255,0.32)", animations: [{ type: "pulse" }],      duration: 6,  delay: 4 },
  { shape: "cross",     left: 80,   top: 18,   size: 1.4, stroke: "rgba(254,133,0,0.25)",  animations: [{ type: "spin-right" }], duration: 18, delay: 0.5 },
  { shape: "square", rotation: 45,   left: 76,   top: 22.5, size: 2.2, stroke: "rgba(52,136,255,0.38)", animations: [{ type: "float" }],      duration: 8,  delay: 2 },
  { shape: "square",    left: 68,   top: 34,   size: 1.8, stroke: "rgba(254,133,0,0.20)",  fill: "rgba(254,133,0,0.03)", animations: [{ type: "float" }], duration: 13, delay: 1 },
  { shape: "cross",     left: 32,   top: 34,   size: 1.2, stroke: "rgba(52,136,255,0.22)", animations: [{ type: "spin-left" }],  duration: 25, delay: 3 },
  // ── lower third ──────────────────────────────────────────────────────────
  { shape: "square",    left: 20,   top: 38,   size: 2.8, stroke: "rgba(52,136,255,0.30)", animations: [{ type: "float" }],      duration: 11, delay: 3 },
  { shape: "atom",      left: 86,   top: 42,   size: 2,   stroke: "rgba(254,133,0,0.35)",  animations: [{ type: "spin-left" }],  duration: 20, delay: 1 },
  { shape: "ring",      left: 40,   top: 44,   size: 3,   stroke: "rgba(254,133,0,0.20)",  animations: [{ type: "float" }],      duration: 9,  delay: 1.5 },
  { shape: "lightbulb", left: 62,   top: 47,   size: 1.3, stroke: "rgba(254,133,0,0.30)",  animations: [{ type: "pulse" }],      duration: 5,  delay: 2 },
  { shape: "triangle",  left:  8,   top: 48,   size: 2,   stroke: "rgba(52,136,255,0.25)", animations: [{ type: "float" }],      duration: 12, delay: 2.5 },
  { shape: "square", rotation: 45,   left: 50,   top: 50,   size: 2.8, stroke: "rgba(254,133,0,0.45)",  animations: [{ type: "float" }],      duration: 7,  delay: 0.5 },

  // ── fourth section ───────────────────────────────────────────────────────
  { shape: "circle",    left: 11,   top: 57,   size: 3.2, stroke: "rgba(52,136,255,0.35)",  animations: [{ type: "float" }],      duration: 10, delay: 1.2 },
  { shape: "atom",      left: 38,   top: 60,   size: 2.2, stroke: "rgba(254,133,0,0.42)",   animations: [{ type: "spin-right" }], duration: 18, delay: 0.3 },
  { shape: "square",    left: 63,   top: 55,   size: 3,   stroke: "rgba(52,136,255,0.32)",  animations: [{ type: "float" }],      duration: 12, delay: 2.4 },
  { shape: "cross",     left: 85,   top: 62,   size: 1.6, stroke: "rgba(254,133,0,0.28)",   animations: [{ type: "spin-left" }],  duration: 20, delay: 1.1 },
  { shape: "lightbulb", left: 25,   top: 65,   size: 1.5, stroke: "rgba(52,136,255,0.38)",  animations: [{ type: "pulse" }],      duration: 5,  delay: 3.2 },
  { shape: "triangle",  left: 72,   top: 68,   size: 2.4, stroke: "rgba(254,133,0,0.30)",   animations: [{ type: "float" }],      duration: 9,  delay: 0.8 },
  { shape: "square", rotation: 45,   left: 48,   top: 72,   size: 1.8, stroke: "rgba(52,136,255,0.40)",  animations: [{ type: "float" }],      duration: 7,  delay: 1.7 },
  { shape: "code",      left:  5,   top: 70,   size: 1.4, stroke: "rgba(254,133,0,0.35)",   animations: [{ type: "pulse" }],      duration: 6,  delay: 0.5 },
  { shape: "ring",      left: 90,   top: 58,   size: 2.6, stroke: "rgba(52,136,255,0.22)",  animations: [{ type: "float" }],      duration: 11, delay: 2.9 },

  // ── fifth section ────────────────────────────────────────────────────────
  { shape: "square",    left: 18,   top: 80,   size: 2.4, stroke: "rgba(254,133,0,0.38)",   animations: [{ type: "float" }],      duration: 8,  delay: 1.4 },
  { shape: "atom",      left: 55,   top: 78,   size: 2.6, stroke: "rgba(52,136,255,0.42)",  animations: [{ type: "spin-left" }],  duration: 24, delay: 0.2 },
  { shape: "triangle",  left: 34,   top: 85,   size: 2,   stroke: "rgba(254,133,0,0.25)",   animations: [{ type: "float" }],      duration: 13, delay: 2.1 },
  { shape: "cross",     left: 78,   top: 83,   size: 1.8, stroke: "rgba(52,136,255,0.30)",  animations: [{ type: "spin-right" }], duration: 16, delay: 0.9 },
  { shape: "square", rotation: 45,   left:  7,   top: 88,   size: 3,   stroke: "rgba(52,136,255,0.45)",  animations: [{ type: "float" }],      duration: 9,  delay: 3.5 },
  { shape: "lightbulb", left: 66,   top: 90,   size: 1.6, stroke: "rgba(254,133,0,0.32)",   animations: [{ type: "pulse" }],      duration: 7,  delay: 1.0 },
  { shape: "code",      left: 42,   top: 94,   size: 1.2, stroke: "rgba(52,136,255,0.28)",  animations: [{ type: "pulse" }],      duration: 5,  delay: 4.0 },
  { shape: "circle",    left: 88,   top: 96,   size: 3.4, stroke: "rgba(254,133,0,0.28)",   animations: [{ type: "float" }],      duration: 14, delay: 0.6 },

  // ── sixth section ────────────────────────────────────────────────────────
  { shape: "ring",      left: 22,   top: 102,  size: 3,   stroke: "rgba(52,136,255,0.35)",  animations: [{ type: "float" }],      duration: 10, delay: 2.0 },
  { shape: "square",    left: 56,   top: 105,  size: 2,   stroke: "rgba(254,133,0,0.38)",   fill: "rgba(254,133,0,0.04)", animations: [{ type: "float" }], duration: 12, delay: 1.3 },
  { shape: "atom",      left:  4,   top: 108,  size: 2.4, stroke: "rgba(254,133,0,0.40)",   animations: [{ type: "spin-right" }], duration: 20, delay: 0.7 },
  { shape: "cross",     left: 70,   top: 110,  size: 1.4, stroke: "rgba(52,136,255,0.25)",  animations: [{ type: "spin-left" }],  duration: 22, delay: 2.8 },
  { shape: "triangle",  left: 38,   top: 115,  size: 2.2, stroke: "rgba(52,136,255,0.30)",  animations: [{ type: "float" }],      duration: 8,  delay: 1.6 },
  { shape: "square", rotation: 45,   left: 82,   top: 118,  size: 2.6, stroke: "rgba(254,133,0,0.35)",   animations: [{ type: "float" }],      duration: 11, delay: 3.1 },
  { shape: "lightbulb", left: 48,   top: 122,  size: 1.8, stroke: "rgba(254,133,0,0.28)",   animations: [{ type: "pulse" }],      duration: 6,  delay: 0.4 },
  { shape: "code",      left: 15,   top: 126,  size: 1.0, stroke: "rgba(52,136,255,0.32)",  animations: [{ type: "pulse" }],      duration: 8,  delay: 2.5 },

  // ── seventh section ──────────────────────────────────────────────────────
  { shape: "circle",    left: 60,   top: 132,  size: 3.6, stroke: "rgba(52,136,255,0.38)",  animations: [{ type: "float" }],      duration: 9,  delay: 1.8 },
  { shape: "square",    left:  9,   top: 135,  size: 2.8, stroke: "rgba(254,133,0,0.30)",   animations: [{ type: "float" }],      duration: 15, delay: 0.1 },
  { shape: "atom",      left: 76,   top: 138,  size: 2,   stroke: "rgba(254,133,0,0.45)",   animations: [{ type: "spin-left" }],  duration: 19, delay: 3.3 },
  { shape: "square", rotation: 45,   left: 30,   top: 142,  size: 3.2, stroke: "rgba(52,136,255,0.32)",  animations: [{ type: "float" }],      duration: 10, delay: 2.2 },
  { shape: "cross",     left: 52,   top: 148,  size: 1.6, stroke: "rgba(254,133,0,0.22)",   animations: [{ type: "spin-right" }], duration: 17, delay: 1.5 },
  { shape: "triangle",  left: 88,   top: 145,  size: 2.4, stroke: "rgba(52,136,255,0.28)",  animations: [{ type: "float" }],      duration: 7,  delay: 0.9 },
  { shape: "lightbulb", left: 20,   top: 152,  size: 2,   stroke: "rgba(52,136,255,0.35)",  animations: [{ type: "pulse" }],      duration: 9,  delay: 3.8 },
  { shape: "ring",      left: 64,   top: 155,  size: 2.8, stroke: "rgba(254,133,0,0.22)",   animations: [{ type: "float" }],      duration: 13, delay: 1.0 },

  // ── eighth section ───────────────────────────────────────────────────────
  { shape: "code",      left: 40,   top: 160,  size: 1.6, stroke: "rgba(254,133,0,0.38)",   animations: [{ type: "pulse" }],      duration: 5,  delay: 2.7 },
  { shape: "square",    left: 80,   top: 162,  size: 3,   stroke: "rgba(52,136,255,0.35)",  animations: [{ type: "float" }],      duration: 11, delay: 0.3 },
  { shape: "atom",      left: 12,   top: 168,  size: 2.8, stroke: "rgba(52,136,255,0.48)",  animations: [{ type: "spin-right" }], duration: 23, delay: 1.2 },
  { shape: "triangle",  left: 55,   top: 172,  size: 2.6, stroke: "rgba(254,133,0,0.32)",   animations: [{ type: "float" }],      duration: 8,  delay: 2.0 },
  { shape: "square", rotation: 45,   left: 28,   top: 175,  size: 2,   stroke: "rgba(52,136,255,0.40)",  animations: [{ type: "float" }],      duration: 9,  delay: 0.6 },
  { shape: "cross",     left: 70,   top: 178,  size: 2,   stroke: "rgba(254,133,0,0.28)",   animations: [{ type: "spin-left" }],  duration: 21, delay: 3.4 },
  { shape: "circle",    left:  3,   top: 180,  size: 3.8, stroke: "rgba(254,133,0,0.20)",   animations: [{ type: "float" }],      duration: 14, delay: 1.9 },
  { shape: "lightbulb", left: 88,   top: 183,  size: 1.4, stroke: "rgba(52,136,255,0.30)",  animations: [{ type: "pulse" }],      duration: 7,  delay: 0.8 },

  // ── ninth section ────────────────────────────────────────────────────────
  { shape: "ring",      left: 45,   top: 190,  size: 3.4, stroke: "rgba(52,136,255,0.35)",  animations: [{ type: "float" }],      duration: 10, delay: 2.3 },
  { shape: "square",    left: 14,   top: 194,  size: 2.2, stroke: "rgba(254,133,0,0.42)",   animations: [{ type: "float" }],      duration: 12, delay: 0.4 },
  { shape: "atom",      left: 68,   top: 197,  size: 2.4, stroke: "rgba(254,133,0,0.38)",   animations: [{ type: "spin-right" }], duration: 26, delay: 1.7 },
  { shape: "triangle",  left: 32,   top: 203,  size: 2.8, stroke: "rgba(52,136,255,0.28)",  animations: [{ type: "float" }],      duration: 9,  delay: 3.0 },
  { shape: "code",      left: 78,   top: 205,  size: 1.2, stroke: "rgba(52,136,255,0.35)",  animations: [{ type: "pulse" }],      duration: 6,  delay: 1.1 },
  { shape: "square", rotation: 45,   left:  6,   top: 210,  size: 3,   stroke: "rgba(254,133,0,0.35)",   animations: [{ type: "float" }],      duration: 8,  delay: 0.5 },
  { shape: "cross",     left: 52,   top: 214,  size: 1.8, stroke: "rgba(254,133,0,0.25)",   animations: [{ type: "spin-left" }],  duration: 18, delay: 2.6 },
  { shape: "lightbulb", left: 88,   top: 218,  size: 1.8, stroke: "rgba(52,136,255,0.32)",  animations: [{ type: "pulse" }],      duration: 8,  delay: 4.2 },

  // ── tenth section ────────────────────────────────────────────────────────
  { shape: "circle",    left: 22,   top: 225,  size: 4,   stroke: "rgba(52,136,255,0.30)",  animations: [{ type: "float" }],      duration: 13, delay: 1.5 },
  { shape: "atom",      left: 60,   top: 228,  size: 2.2, stroke: "rgba(254,133,0,0.44)",   animations: [{ type: "spin-left" }],  duration: 21, delay: 0.2 },
  { shape: "square",    left: 84,   top: 232,  size: 2.6, stroke: "rgba(52,136,255,0.38)",  fill: "rgba(52,136,255,0.04)", animations: [{ type: "float" }], duration: 10, delay: 2.8 },
  { shape: "triangle",  left:  8,   top: 237,  size: 2.4, stroke: "rgba(254,133,0,0.28)",   animations: [{ type: "float" }],      duration: 11, delay: 1.3 },
  { shape: "ring",      left: 44,   top: 242,  size: 3.2, stroke: "rgba(52,136,255,0.25)",  animations: [{ type: "float" }],      duration: 15, delay: 3.6 },
  { shape: "cross",     left: 74,   top: 246,  size: 2,   stroke: "rgba(254,133,0,0.30)",   animations: [{ type: "spin-right" }], duration: 19, delay: 0.7 },
  { shape: "code",      left: 30,   top: 250,  size: 1.4, stroke: "rgba(254,133,0,0.35)",   animations: [{ type: "pulse" }],      duration: 7,  delay: 2.1 },
  { shape: "square", rotation: 45,   left: 66,   top: 254,  size: 3.4, stroke: "rgba(52,136,255,0.42)",  animations: [{ type: "float" }],      duration: 8,  delay: 1.0 },
  { shape: "lightbulb", left: 12,   top: 258,  size: 2,   stroke: "rgba(52,136,255,0.30)",  animations: [{ type: "pulse" }],      duration: 9,  delay: 3.9 },
  { shape: "atom",      left: 90,   top: 262,  size: 2.6, stroke: "rgba(254,133,0,0.38)",   animations: [{ type: "spin-right" }], duration: 24, delay: 0.4 },
];

const NEAR: BGShapeProps[] = [
  // ── orange dots ───────────────────────────────────────────────────────────
  { shape: "dot", left:  2.5, top: 16.5, size: 0.38, fill: "rgba(254,133,0,0.75)", animations: [{ type: "pulse" }], duration: 3,   delay: 0.2 },
  { shape: "dot", left: 29,   top: 10.5, size: 0.32, fill: "rgba(254,133,0,0.70)", animations: [{ type: "pulse" }], duration: 5,   delay: 1.1 },
  { shape: "dot", left: 39,   top: 24.5, size: 0.32, fill: "rgba(254,133,0,0.70)", animations: [{ type: "pulse" }], duration: 5,   delay: 2.3 },
  { shape: "dot", left: 14,   top: 30,   size: 0.25, fill: "rgba(254,133,0,0.65)", animations: [{ type: "pulse" }], duration: 4,   delay: 0.8 },
  { shape: "dot", left: 33.5, top:  1.8, size: 0.20, fill: "rgba(254,133,0,0.70)", animations: [{ type: "pulse" }], duration: 6,   delay: 1.5 },
  { shape: "dot", left: 65,   top: 38,   size: 0.30, fill: "rgba(254,133,0,0.65)", animations: [{ type: "pulse" }], duration: 4,   delay: 1.3 },
  { shape: "dot", left: 78,   top: 28.5, size: 0.22, fill: "rgba(254,133,0,0.60)", animations: [{ type: "pulse" }], duration: 6,   delay: 2.1 },
  { shape: "dot", left: 48,   top: 42,   size: 0.28, fill: "rgba(254,133,0,0.60)", animations: [{ type: "pulse" }], duration: 5.5, delay: 0.9 },
  // ── blue dots ─────────────────────────────────────────────────────────────
  { shape: "dot", left: 52,   top: 13.5, size: 0.32, fill: "rgba(108,161,255,0.80)", animations: [{ type: "pulse" }], duration: 4, delay: 0.7 },
  { shape: "dot", left: 40,   top: 32,   size: 0.25, fill: "rgba(108,161,255,0.75)", animations: [{ type: "pulse" }], duration: 6, delay: 1.8 },
  { shape: "dot", left: 59,   top:  7.5, size: 0.25, fill: "rgba(108,161,255,0.75)", animations: [{ type: "pulse" }], duration: 5, delay: 2.5 },
  { shape: "dot", left: 22.5, top: 34,   size: 0.20, fill: "rgba(108,161,255,0.70)", animations: [{ type: "pulse" }], duration: 7, delay: 3.1 },
  { shape: "dot", left:  5,   top: 45,   size: 0.28, fill: "rgba(108,161,255,0.70)", animations: [{ type: "pulse" }], duration: 5, delay: 0.6 },
  { shape: "dot", left: 50,   top: 51,   size: 0.28, fill: "rgba(108,161,255,0.65)", animations: [{ type: "pulse" }], duration: 3, delay: 1.9 },
  { shape: "dot", left: 88,   top: 10,   size: 0.20, fill: "rgba(108,161,255,0.70)", animations: [{ type: "pulse" }], duration: 8, delay: 0.3 },
  { shape: "dot", left: 72,   top: 46,   size: 0.22, fill: "rgba(108,161,255,0.65)", animations: [{ type: "pulse" }], duration: 6, delay: 3.7 },
  // ── lines ─────────────────────────────────────────────────────────────────
  // { shape: "line", left: 39,   top: 15.9, size: 5.6, rotation: 120, stroke: "rgba(52,136,255,0.28)"  },
  // { shape: "line", left: 46,   top: 16,   size: 4.4, rotation: 90,  stroke: "rgba(52,136,255,0.26)"  },
  // { shape: "line", left:  4.3, top: 16.7, size: 3.8, rotation: -30, stroke: "rgba(254,133,0,0.22)"   },
  // { shape: "line", left: 74,   top: 29.5, size: 6,   rotation: 150, stroke: "rgba(52,136,255,0.18)"  },
  // { shape: "line", left: 25,   top: 40,   size: 4,   rotation:  60, stroke: "rgba(254,133,0,0.18)"   },
  // { shape: "line", left: 61,   top: 58,   size: 5,   rotation: -45, stroke: "rgba(254,133,0,0.20)"   },
  // { shape: "line", left: 12,   top: 72,   size: 6.5, rotation: 135, stroke: "rgba(52,136,255,0.22)"  },
  // { shape: "line", left: 83,   top: 80,   size: 4.2, rotation:  30, stroke: "rgba(254,133,0,0.18)"   },
  // { shape: "line", left: 44,   top: 97,   size: 5.8, rotation: -60, stroke: "rgba(52,136,255,0.20)"  },
  // { shape: "line", left: 28,   top: 112,  size: 4.8, rotation: 110, stroke: "rgba(254,133,0,0.22)"   },
  // { shape: "line", left: 70,   top: 125,  size: 6,   rotation: -75, stroke: "rgba(52,136,255,0.18)"  },
  // { shape: "line", left:  6,   top: 140,  size: 5.2, rotation:  50, stroke: "rgba(254,133,0,0.20)"   },
  // { shape: "line", left: 52,   top: 155,  size: 4.6, rotation: 165, stroke: "rgba(52,136,255,0.22)"  },
  // { shape: "line", left: 85,   top: 168,  size: 5.4, rotation: -15, stroke: "rgba(254,133,0,0.18)"   },
  // { shape: "line", left: 18,   top: 182,  size: 6.2, rotation:  80, stroke: "rgba(52,136,255,0.20)"  },
  // { shape: "line", left: 62,   top: 196,  size: 4,   rotation: -50, stroke: "rgba(254,133,0,0.22)"   },
  // { shape: "line", left: 35,   top: 215,  size: 5,   rotation: 140, stroke: "rgba(52,136,255,0.18)"  },
  // { shape: "line", left: 76,   top: 228,  size: 4.8, rotation: -30, stroke: "rgba(254,133,0,0.20)"   },
  // { shape: "line", left:  9,   top: 244,  size: 6.4, rotation: 100, stroke: "rgba(52,136,255,0.22)"  },
  // { shape: "line", left: 50,   top: 258,  size: 5.6, rotation: -80, stroke: "rgba(254,133,0,0.18)"   },

  // ── extended orange dots ──────────────────────────────────────────────────
  { shape: "dot", left: 17,   top: 55.5, size: 0.34, fill: "rgba(254,133,0,0.70)",  animations: [{ type: "pulse" }], duration: 4,   delay: 1.3 },
  { shape: "dot", left: 42,   top: 60,   size: 0.28, fill: "rgba(254,133,0,0.65)",  animations: [{ type: "pulse" }], duration: 5,   delay: 2.8 },
  { shape: "dot", left: 71,   top: 64,   size: 0.30, fill: "rgba(254,133,0,0.72)",  animations: [{ type: "pulse" }], duration: 3.5, delay: 0.4 },
  { shape: "dot", left: 56,   top: 72,   size: 0.22, fill: "rgba(254,133,0,0.60)",  animations: [{ type: "pulse" }], duration: 6,   delay: 3.2 },
  { shape: "dot", left:  8,   top: 78,   size: 0.36, fill: "rgba(254,133,0,0.68)",  animations: [{ type: "pulse" }], duration: 4.5, delay: 1.1 },
  { shape: "dot", left: 84,   top: 82,   size: 0.26, fill: "rgba(254,133,0,0.62)",  animations: [{ type: "pulse" }], duration: 5.5, delay: 2.0 },
  { shape: "dot", left: 33,   top: 90,   size: 0.32, fill: "rgba(254,133,0,0.70)",  animations: [{ type: "pulse" }], duration: 4,   delay: 0.7 },
  { shape: "dot", left: 62,   top: 98,   size: 0.24, fill: "rgba(254,133,0,0.65)",  animations: [{ type: "pulse" }], duration: 6.5, delay: 3.5 },
  { shape: "dot", left: 19,   top: 107,  size: 0.30, fill: "rgba(254,133,0,0.68)",  animations: [{ type: "pulse" }], duration: 4,   delay: 1.6 },
  { shape: "dot", left: 48,   top: 114,  size: 0.28, fill: "rgba(254,133,0,0.62)",  animations: [{ type: "pulse" }], duration: 5,   delay: 0.2 },
  { shape: "dot", left: 77,   top: 120,  size: 0.34, fill: "rgba(254,133,0,0.70)",  animations: [{ type: "pulse" }], duration: 3.5, delay: 2.4 },
  { shape: "dot", left:  4,   top: 128,  size: 0.22, fill: "rgba(254,133,0,0.65)",  animations: [{ type: "pulse" }], duration: 7,   delay: 1.0 },
  { shape: "dot", left: 36,   top: 135,  size: 0.38, fill: "rgba(254,133,0,0.72)",  animations: [{ type: "pulse" }], duration: 4,   delay: 3.8 },
  { shape: "dot", left: 67,   top: 142,  size: 0.26, fill: "rgba(254,133,0,0.60)",  animations: [{ type: "pulse" }], duration: 5.5, delay: 0.5 },
  { shape: "dot", left: 90,   top: 149,  size: 0.30, fill: "rgba(254,133,0,0.65)",  animations: [{ type: "pulse" }], duration: 6,   delay: 2.9 },
  { shape: "dot", left: 24,   top: 158,  size: 0.32, fill: "rgba(254,133,0,0.70)",  animations: [{ type: "pulse" }], duration: 4.5, delay: 1.4 },
  { shape: "dot", left: 53,   top: 165,  size: 0.24, fill: "rgba(254,133,0,0.62)",  animations: [{ type: "pulse" }], duration: 5,   delay: 3.1 },
  { shape: "dot", left: 79,   top: 172,  size: 0.36, fill: "rgba(254,133,0,0.68)",  animations: [{ type: "pulse" }], duration: 4,   delay: 0.8 },
  { shape: "dot", left: 11,   top: 180,  size: 0.28, fill: "rgba(254,133,0,0.65)",  animations: [{ type: "pulse" }], duration: 6,   delay: 2.2 },
  { shape: "dot", left: 43,   top: 188,  size: 0.22, fill: "rgba(254,133,0,0.60)",  animations: [{ type: "pulse" }], duration: 7.5, delay: 1.7 },
  { shape: "dot", left: 70,   top: 196,  size: 0.34, fill: "rgba(254,133,0,0.72)",  animations: [{ type: "pulse" }], duration: 3.5, delay: 0.3 },
  { shape: "dot", left: 88,   top: 205,  size: 0.26, fill: "rgba(254,133,0,0.65)",  animations: [{ type: "pulse" }], duration: 5.5, delay: 3.6 },
  { shape: "dot", left: 28,   top: 213,  size: 0.30, fill: "rgba(254,133,0,0.70)",  animations: [{ type: "pulse" }], duration: 4,   delay: 1.5 },
  { shape: "dot", left: 57,   top: 222,  size: 0.32, fill: "rgba(254,133,0,0.62)",  animations: [{ type: "pulse" }], duration: 6,   delay: 2.7 },
  { shape: "dot", left:  7,   top: 230,  size: 0.38, fill: "rgba(254,133,0,0.68)",  animations: [{ type: "pulse" }], duration: 4.5, delay: 0.6 },
  { shape: "dot", left: 75,   top: 238,  size: 0.24, fill: "rgba(254,133,0,0.65)",  animations: [{ type: "pulse" }], duration: 5,   delay: 4.1 },
  { shape: "dot", left: 40,   top: 247,  size: 0.28, fill: "rgba(254,133,0,0.70)",  animations: [{ type: "pulse" }], duration: 4,   delay: 1.2 },
  { shape: "dot", left: 86,   top: 255,  size: 0.22, fill: "rgba(254,133,0,0.60)",  animations: [{ type: "pulse" }], duration: 8,   delay: 3.3 },
  { shape: "dot", left: 18,   top: 262,  size: 0.34, fill: "rgba(254,133,0,0.68)",  animations: [{ type: "pulse" }], duration: 4.5, delay: 0.9 },

  // ── extended blue dots ────────────────────────────────────────────────────
  { shape: "dot", left: 31,   top: 57,   size: 0.28, fill: "rgba(108,161,255,0.75)", animations: [{ type: "pulse" }], duration: 5,   delay: 1.8 },
  { shape: "dot", left: 60,   top: 62,   size: 0.32, fill: "rgba(108,161,255,0.80)", animations: [{ type: "pulse" }], duration: 4,   delay: 0.3 },
  { shape: "dot", left: 80,   top: 70,   size: 0.24, fill: "rgba(108,161,255,0.70)", animations: [{ type: "pulse" }], duration: 6,   delay: 2.5 },
  { shape: "dot", left: 14,   top: 76,   size: 0.30, fill: "rgba(108,161,255,0.78)", animations: [{ type: "pulse" }], duration: 4.5, delay: 1.0 },
  { shape: "dot", left: 46,   top: 84,   size: 0.26, fill: "rgba(108,161,255,0.72)", animations: [{ type: "pulse" }], duration: 5.5, delay: 3.4 },
  { shape: "dot", left: 91,   top: 92,   size: 0.22, fill: "rgba(108,161,255,0.68)", animations: [{ type: "pulse" }], duration: 7,   delay: 0.6 },
  { shape: "dot", left: 23,   top: 100,  size: 0.34, fill: "rgba(108,161,255,0.76)", animations: [{ type: "pulse" }], duration: 4,   delay: 2.1 },
  { shape: "dot", left: 55,   top: 108,  size: 0.28, fill: "rgba(108,161,255,0.70)", animations: [{ type: "pulse" }], duration: 6.5, delay: 1.4 },
  { shape: "dot", left: 78,   top: 116,  size: 0.32, fill: "rgba(108,161,255,0.80)", animations: [{ type: "pulse" }], duration: 3.5, delay: 3.0 },
  { shape: "dot", left:  9,   top: 123,  size: 0.24, fill: "rgba(108,161,255,0.72)", animations: [{ type: "pulse" }], duration: 5,   delay: 0.4 },
  { shape: "dot", left: 39,   top: 131,  size: 0.30, fill: "rgba(108,161,255,0.75)", animations: [{ type: "pulse" }], duration: 4.5, delay: 2.8 },
  { shape: "dot", left: 69,   top: 139,  size: 0.26, fill: "rgba(108,161,255,0.68)", animations: [{ type: "pulse" }], duration: 6,   delay: 1.1 },
  { shape: "dot", left: 85,   top: 147,  size: 0.22, fill: "rgba(108,161,255,0.78)", animations: [{ type: "pulse" }], duration: 5.5, delay: 3.7 },
  { shape: "dot", left: 16,   top: 155,  size: 0.36, fill: "rgba(108,161,255,0.74)", animations: [{ type: "pulse" }], duration: 4,   delay: 0.8 },
  { shape: "dot", left: 49,   top: 163,  size: 0.28, fill: "rgba(108,161,255,0.70)", animations: [{ type: "pulse" }], duration: 7,   delay: 2.3 },
  { shape: "dot", left: 73,   top: 170,  size: 0.32, fill: "rgba(108,161,255,0.76)", animations: [{ type: "pulse" }], duration: 4.5, delay: 1.6 },
  { shape: "dot", left:  3,   top: 178,  size: 0.24, fill: "rgba(108,161,255,0.72)", animations: [{ type: "pulse" }], duration: 6,   delay: 0.2 },
  { shape: "dot", left: 35,   top: 186,  size: 0.30, fill: "rgba(108,161,255,0.68)", animations: [{ type: "pulse" }], duration: 5,   delay: 3.9 },
  { shape: "dot", left: 64,   top: 194,  size: 0.26, fill: "rgba(108,161,255,0.80)", animations: [{ type: "pulse" }], duration: 3.5, delay: 1.3 },
  { shape: "dot", left: 89,   top: 202,  size: 0.22, fill: "rgba(108,161,255,0.74)", animations: [{ type: "pulse" }], duration: 7.5, delay: 2.6 },
  { shape: "dot", left: 21,   top: 210,  size: 0.34, fill: "rgba(108,161,255,0.76)", animations: [{ type: "pulse" }], duration: 4,   delay: 0.5 },
  { shape: "dot", left: 58,   top: 218,  size: 0.28, fill: "rgba(108,161,255,0.70)", animations: [{ type: "pulse" }], duration: 5.5, delay: 4.3 },
  { shape: "dot", left: 82,   top: 226,  size: 0.32, fill: "rgba(108,161,255,0.78)", animations: [{ type: "pulse" }], duration: 4.5, delay: 1.7 },
  { shape: "dot", left: 12,   top: 234,  size: 0.24, fill: "rgba(108,161,255,0.72)", animations: [{ type: "pulse" }], duration: 6.5, delay: 0.7 },
  { shape: "dot", left: 44,   top: 243,  size: 0.30, fill: "rgba(108,161,255,0.75)", animations: [{ type: "pulse" }], duration: 4,   delay: 3.2 },
  { shape: "dot", left: 71,   top: 251,  size: 0.26, fill: "rgba(108,161,255,0.68)", animations: [{ type: "pulse" }], duration: 5,   delay: 1.5 },
  { shape: "dot", left: 93,   top: 260,  size: 0.22, fill: "rgba(108,161,255,0.74)", animations: [{ type: "pulse" }], duration: 8,   delay: 2.9 },
];




// ─── BG component ────────────────────────────────────────────────────────────

export default function BG() {
  const farRef  = useRef<HTMLDivElement>(null);
  const midRef  = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let lastY = -1;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y === lastY) return;
        lastY = y;
        if (farRef.current)  farRef.current.style.transform  = `translateY(${-y * 0.10}px)`;
        if (midRef.current)  midRef.current.style.transform  = `translateY(${-y * 0.20}px)`;
        if (nearRef.current) nearRef.current.style.transform = `translateY(${-y * 0.40}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const layerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    willChange: "transform",
    transition: "transform 0.2s ease-out",
  };

  return (
    <div className={styles.bg}>

      {/* Far layer — slowest drift */}
      <div ref={farRef} style={layerStyle}>
        <NodeLinkTemplate template="big-dipper" x={25} y={15} rotation={35} scale={0.5} />
        {FAR.map((p, i) => <BGShape key={i} {...p} />)}
      </div>

      {/* Mid layer — medium drift */}
      <div ref={midRef} style={layerStyle}>
        {MID.map((p, i) => <BGShape key={i} {...p} />)}
      </div>

      {/* Near layer — fastest drift */}
      <div ref={nearRef} style={layerStyle}>
        {NEAR.map((p, i) => <BGShape key={i} {...p} />)}
      </div>

    </div>
  );
}
