import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────


export interface NodeKeyframe {
  x: number;  // % of canvas width
  y: number;  // % of canvas height
}

export interface NodeDef {
  id: string;
  keyframes: NodeKeyframe[];  // ping-pong through these positions
  duration: number;           // seconds for a full ping-pong cycle
  color: string;              // CSS color
  offset?: number;            // seconds phase shift (default 0)
  radius?: number;            // dot radius in px (default 4)
}

export interface EdgeDef {
  from: string;               // node id
  to: string;                 // node id
  color?: string;             // CSS color (default "rgba(255,255,255,0.2)")
  width?: number;             // line width in px (default 1)
}

export interface NodeLinkProps {
  nodes: NodeDef[];
  edges: EdgeDef[];
  className?: string;
  style?: React.CSSProperties;
}

// ─── Animation helpers ────────────────────────────────────────────────────────

function easeInOut(t: number): number {
  return 0.5 - Math.cos(Math.PI * t) / 2;
}

// Given a normalized time p in [0, 1), returns the interpolated {x, y}
// across the ping-pong sequence of keyframes.
function pingPongPosition(
  keyframes: NodeKeyframe[],
  p: number,
): { x: number; y: number } {
  if (keyframes.length === 1) return keyframes[0];

  const segCount = (keyframes.length - 1) * 2; // A→B→C→B→A = 4 segments for 3 kfs
  const segIndex = Math.floor(p * segCount);
  const segT     = easeInOut((p * segCount) - segIndex);

  // Forward: 0..n-2, Backward: n-1..2*(n-1)-1
  const n = keyframes.length - 1;
  let fromIdx: number, toIdx: number;
  if (segIndex < n) {
    fromIdx = segIndex;
    toIdx   = segIndex + 1;
  } else {
    fromIdx = 2 * n - segIndex;
    toIdx   = fromIdx - 1;
  }

  const from = keyframes[fromIdx];
  const to   = keyframes[toIdx];
  return {
    x: from.x + (to.x - from.x) * segT,
    y: from.y + (to.y - from.y) * segT,
  };
}

// ─── Templates ────────────────────────────────────────────────────────────────

export interface NodeLinkTemplateDef {
  nodes: NodeDef[];
  edges: EdgeDef[];
  /** Natural canvas size — NodeLinkTemplate multiplies these by `scale`. */
  baseWidth:  number;  // rem
  baseHeight: number;  // rem
}

// Big Dipper — coords normalized to fill 5–95% of the canvas
// handle (left→right): Alkaid → Mizar → Alioth → Megrez
// bowl: Megrez ↔ Dubhe ↔ Merak ↔ Phecda ↔ Megrez
const BIG_DIPPER: NodeLinkTemplateDef = {
  baseWidth: 45, baseHeight: 22,
  nodes: [
    { id: "g", color: "rgba(254,133,0,0.72)",  radius: 4, duration: 19,  offset: 0.3, keyframes: [{ x:  5, y: 59 }, { x:  6, y: 60 }] }, // Alkaid  – handle tip
    { id: "f", color: "rgba(254,133,0,0.75)",  radius: 3, duration: 20, offset: 2.1, keyframes: [{ x: 24, y: 38 }, { x: 25, y: 37 }] }, // Mizar   – handle mid
    { id: "e", color: "rgba(254,155,20,0.88)", radius: 5, duration: 21,  offset: 0.8, keyframes: [{ x: 42, y: 35 }, { x: 43, y: 39 }] }, // Alioth  – brightest
    { id: "d", color: "rgba(254,133,0,0.52)",  radius: 2, duration: 20, offset: 4.0, keyframes: [{ x: 61, y: 38 }, { x: 62, y: 37 }] }, // Megrez  – dimmest (bowl join)
    { id: "c", color: "rgba(254,133,0,0.68)",  radius: 3, duration: 19, offset: 1.5, keyframes: [{ x: 67, y: 75 }, { x: 65, y: 73 }] }, // Phecda  – bowl bottom-left
    { id: "b", color: "rgba(254,133,0,0.70)",  radius: 3, duration: 21, offset: 3.3, keyframes: [{ x: 91, y: 70 }, { x: 92, y: 75 }] }, // Merak   – bowl bottom-right
    { id: "a", color: "rgba(254,133,0,0.85)",  radius: 4, duration: 20,  offset: 0,   keyframes: [{ x: 94, y: 30 }, { x: 95, y: 35 }] }, // Dubhe   – bowl top-right
  ],
  edges: [
    { from: "g", to: "f", color: "rgba(254,133,0,0.16)", width: 1 },
    { from: "f", to: "e", color: "rgba(254,133,0,0.18)", width: 1 },
    { from: "e", to: "d", color: "rgba(254,133,0,0.18)", width: 1 },
    { from: "d", to: "c", color: "rgba(254,133,0,0.17)", width: 1 },
    { from: "d", to: "a", color: "rgba(254,133,0,0.20)", width: 1 },
    { from: "c", to: "b", color: "rgba(254,133,0,0.18)", width: 1 },
    { from: "b", to: "a", color: "rgba(254,133,0,0.20)", width: 1 },
  ],
};

export const NL_TEMPLATES: Record<string, NodeLinkTemplateDef> = {
  "big-dipper": BIG_DIPPER,
};

// ─── NodeLinkTemplate component ───────────────────────────────────────────────

export interface NodeLinkTemplateProps {
  /** Key from NL_TEMPLATES */
  template: string;
  /** Multiplier on the template's baseWidth / baseHeight */
  scale?: number;
  /** CSS rotation in degrees */
  rotation?: number;
  /** Horizontal position as a percentage of the parent's width */
  x: number;
  /** Vertical position in rem from the top of the parent */
  y: number;
}

export function NodeLinkTemplate({
  template: templateName,
  scale = 1,
  rotation = 0,
  x,
  y,
}: NodeLinkTemplateProps) {
  const tpl = NL_TEMPLATES[templateName];
  if (!tpl) return null;

  return (
    <div style={{
      position:        "absolute",
      left:            `${x}%`,
      top:             `${y}rem`,
      width:           `${tpl.baseWidth}rem`,
      height:          `${tpl.baseHeight}rem`,
      // translate by -50% to anchor at center, then scale and rotate around that center
      transform:       `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: "50% 50%",
      pointerEvents:   "none",
    }}>
      <NodeLink nodes={tpl.nodes} edges={tpl.edges} />
    </div>
  );
}

// ─── NodeLink component ───────────────────────────────────────────────────────

export function NodeLink({ nodes, edges, className, style }: NodeLinkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    let raf: number;

    // Build a lookup map from node id → NodeDef
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const resize = () => {
      const dpr = window.devicePixelRatio ?? 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Group edges by their style key to batch draw calls
    type EdgeGroup = { color: string; width: number; pairs: [NodeDef, NodeDef][] };
    const edgeGroups = new Map<string, EdgeGroup>();
    for (const e of edges) {
      const a = nodeMap.get(e.from);
      const b = nodeMap.get(e.to);
      if (!a || !b) continue;
      const color = e.color ?? "rgba(255,255,255,0.2)";
      const width = e.width ?? 1;
      const key   = `${color}|${width}`;
      if (!edgeGroups.has(key)) edgeGroups.set(key, { color, width, pairs: [] });
      edgeGroups.get(key)!.pairs.push([a, b]);
    }

    const tick = (ts: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Compute live positions for all nodes
      const pos = new Map<string, { x: number; y: number }>();
      for (const n of nodes) {
        const offset = (n.offset ?? 0) * 1000;
        const p      = ((ts + offset) / (n.duration * 1000)) % 1;
        const { x, y } = pingPongPosition(n.keyframes, p);
        pos.set(n.id, { x: (x / 100) * w, y: (y / 100) * h });
      }

      // Draw edges — batched by style
      for (const { color, width, pairs } of edgeGroups.values()) {
        ctx.strokeStyle = color;
        ctx.lineWidth   = width;
        ctx.beginPath();
        for (const [a, b] of pairs) {
          const pa = pos.get(a.id)!;
          const pb = pos.get(b.id)!;
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
        }
        ctx.stroke();
      }

      // Draw nodes
      for (const n of nodes) {
        const { x, y } = pos.get(n.id)!;
        ctx.beginPath();
        ctx.arc(x, y, n.radius ?? 4, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [nodes, edges]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
