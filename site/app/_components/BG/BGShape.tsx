import { TbCode, TbAtom2, TbBulb } from "react-icons/tb";
import styles from "./BGShape.module.css";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ShapeType =
  | "square"          // hollow square (SVG rect); use rotation: 45 for diamond
  | "circle"          // hollow circle (SVG circle)
  | "ring"            // alias for circle (stroke only)
  | "dot"             // filled circle (SVG circle)
  | "cross"           // + shape (SVG lines)
  | "triangle"        // SVG polygon
  | "line"            // 1px-height bar; use `rotation` for angle, `size` for length
  | "code"            // TbCode react-icon
  | "lightbulb"       // TbBulb react-icon
  | "atom"            // TbAtom2 react-icon
  | "pulse-gradient" // radial-gradient blob
  | "uhdacm";

export type AnimationType =
  | "float"        // translateY oscillation   — uses CSS `translate` property
  | "drift"        // translateX oscillation   — uses CSS `translate` property
  | "spin-left"    // continuous CCW rotation  — uses CSS `rotate` property
  | "spin-right"   // continuous CW rotation   — uses CSS `rotate` property
  | "pulse"        // opacity oscillation      — uses `opacity`
  | "grow-fade"    // expand + fade out loop   — uses CSS `scale` + `opacity`
  | "shrink-fade"  // shrink + fade out loop   — uses CSS `scale` + `opacity`
  | "blink"        // sharp opacity blink      — uses `opacity`
  | "wobble";      // ±rotation oscillation    — uses CSS `rotate` property

// Note: float+drift conflict (both use `translate`); pulse+grow/shrink-fade
// conflict (both use `opacity`); wobble+spin-left+spin-right conflict (all use
// `rotate`). All other combos compose cleanly.

export interface AnimConfig {
  type: AnimationType;
  strength?: number;  // amplitude multiplier for this animation. Default 1
  duration?: number;  // seconds. Overrides BGShapeProps.duration
  delay?: number;     // seconds. Overrides BGShapeProps.delay
}

export interface BGShapeProps {
  top: number;                  // rem from top of the parallax layer
  left: number;                 // % of container width
  size?: number;                // rem — width & height (line: length). Default 2
  rotation?: number;            // degrees of initial rotation (static). Default 0
  shape: ShapeType;
  animations?: AnimConfig[];
  duration?: number;            // fallback seconds for animations without their own. Default 4
  delay?: number;               // fallback seconds delay. Default 0
  stroke?: string;              // CSS color — SVG stroke / icon color / line color
  strokeWidth?: number;         // SVG stroke width. Default 5
  fill?: string;                // CSS color — SVG fill / pulse-gradient center
  opacity?: number;             // base opacity. Default 1
  borderRadius?: number;        // SVG rx for square/diamond, in viewBox units (0–45). Default 2
}

// ─── Animation helpers ───────────────────────────────────────────────────────

const ANIM_NAME: Record<AnimationType, string> = {
  "float":       styles.bgFloat,
  "drift":       styles.bgDrift,
  "spin-left":   styles.bgSpinLeft,
  "spin-right":  styles.bgSpinRight,
  "pulse":       styles.bgPulse,
  "grow-fade":   styles.bgGrowFade,
  "shrink-fade": styles.bgShrinkFade,
  "blink":       styles.bgBlink,
  "wobble":      styles.bgWobble,
};

const ANIM_EASING: Record<AnimationType, string> = {
  "float":       "ease-in-out",
  "drift":       "ease-in-out",
  "spin-left":   "linear",
  "spin-right":  "linear",
  "pulse":       "ease-in-out",
  "grow-fade":   "ease-out",
  "shrink-fade": "ease-out",
  "blink":       "ease-in-out",
  "wobble":      "ease-in-out",
};

// Maps each animation type to its per-animation CSS strength variable
const ANIM_STRENGTH_VAR: Record<AnimationType, string> = {
  "float":       "--bg-float-strength",
  "drift":       "--bg-drift-strength",
  "spin-left":   "--bg-spin-left-strength",
  "spin-right":  "--bg-spin-right-strength",
  "pulse":       "--bg-pulse-strength",
  "grow-fade":   "--bg-grow-fade-strength",
  "shrink-fade": "--bg-shrink-fade-strength",
  "blink":       "--bg-blink-strength",
  "wobble":      "--bg-wobble-strength",
};

// ─── BGShape component ───────────────────────────────────────────────────────

export function BGShape({
  top, left, size = 2, rotation = 0,
  shape, animations = [], duration = 4, delay = 0,
  stroke, strokeWidth, fill, opacity = 1, borderRadius = 2,
}: BGShapeProps) {
  const animation = animations.length
    ? animations
        .map(({ type, duration: dur, delay: del }) =>
          `${ANIM_NAME[type]} ${dur ?? duration}s ${ANIM_EASING[type]} infinite ${del ?? delay}s`
        )
        .join(", ")
    : undefined;

  const strengthVars = Object.fromEntries(
    animations
      .filter(a => a.strength !== undefined)
      .map(a => [ANIM_STRENGTH_VAR[a.type], a.strength])
  );

  const base: React.CSSProperties = {
    position: "absolute",
    top:    `${top}rem`,
    left:   `${left}%`,
    width:  `${size}rem`,
    height: shape === "line" ? "1px" : `${size}rem`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    opacity,
    animation,
    ...strengthVars,
    // CSS individual rotate property — composes with translate/scale animations
    ...(rotation ? ({ rotate: `${rotation}deg` } as React.CSSProperties) : {}),
  } as React.CSSProperties;

  // ── pulse-gradient ──
  if (shape === "pulse-gradient") {
    return (
      <div style={{
        ...base,
        borderRadius: "50%",
        background: `radial-gradient(ellipse at center, ${fill ?? stroke ?? "rgba(255,255,255,0.1)"} 0%, transparent 65%)`,
      }} />
    );
  }

  // ── line ──
  if (shape === "line") {
    return (
      <div style={{
        ...base,
        background: stroke ?? fill ?? "rgba(255,255,255,0.3)",
      }} />
    );
  }

  // ── icons ──
  const iconColor = stroke ?? fill ?? "white";
  if (shape === "code")      return <div style={base}><TbCode      style={{ fontSize: `${size}rem`, color: iconColor, display: "block" }} /></div>;
  if (shape === "lightbulb") return <div style={base}><TbBulb      style={{ fontSize: `${size}rem`, color: iconColor, display: "block" }} /></div>;
  if (shape === "atom")      return <div style={base}><TbAtom2     style={{ fontSize: `${size}rem`, color: iconColor, display: "block" }} /></div>;

  // ── SVG shapes ──
  const s  = stroke ?? "none";
  const f  = fill   ?? "none";
  const sw = stroke ? (strokeWidth ?? 5) : 0;

  let inner: React.ReactNode = null;
  if (shape === "square") {
    inner = <rect x="5" y="5" width="90" height="90" rx={borderRadius} stroke={s} strokeWidth={sw} fill={f} />;
  } else if (shape === "circle" || shape === "ring") {
    inner = <circle cx="50" cy="50" r="44" stroke={s} strokeWidth={sw} fill={f} />;
  } else if (shape === "dot") {
    inner = <circle cx="50" cy="50" r="42" stroke="none" fill={fill ?? stroke ?? "white"} />;
  } else if (shape === "cross") {
    inner = <>
      <line x1="50" y1="8"  x2="50" y2="92" stroke={s} strokeWidth={sw} strokeLinecap="round" />
      <line x1="8"  y1="50" x2="92" y2="50" stroke={s} strokeWidth={sw} strokeLinecap="round" />
    </>;
  } else if (shape === "triangle") {
    inner = <polygon points="50,6 93,91 7,91" stroke={s} strokeWidth={sw} fill={f} strokeLinejoin="round" />;
  } else if (shape === "uhdacm") {
    inner = <polygon points="0,100 65,0 130,100 36,100 48,80 95,80 65,34 23,100" stroke={s} strokeWidth={sw} fill={f} strokeLinejoin="round" />;
  }

  return (
    <div style={base}>
      <svg
        width={`${size}rem`} height={`${size}rem`}
        viewBox="0 0 100 100"
        fill="none"
        style={{ overflow: "visible" }}
      >
        {inner}
      </svg>
    </div>
  );
}
