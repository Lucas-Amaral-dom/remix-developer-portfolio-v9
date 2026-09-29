import { useCallback, useEffect, useRef, useState } from "react";
import type { Dir } from "@/game/engine";

interface Props {
  onDir: (dir: Dir | null) => void;
  onAction: () => void;
  actionLabel: string;
}

type Point = { x: number; y: number };
type ControlKey = "up" | "down" | "left" | "right" | "action";
type Positions = Record<ControlKey, Point>;

const STORAGE_KEY = "portfolio_mobile_control_positions_v2";
const DEFAULT_POSITIONS: Positions = {
  up: { x: 13, y: 23 },
  left: { x: 5, y: 14 },
  right: { x: 21, y: 14 },
  down: { x: 13, y: 5 },
  action: { x: 76, y: 14 },
};

function readPositions(): Positions {
  if (typeof window === "undefined") return DEFAULT_POSITIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_POSITIONS;
    const parsed = JSON.parse(raw) as Partial<Positions>;
    return Object.fromEntries(
      (Object.keys(DEFAULT_POSITIONS) as ControlKey[]).map((key) => [
        key,
        { ...DEFAULT_POSITIONS[key], ...(parsed[key] ?? {}) },
      ]),
    ) as Positions;
  } catch {
    return DEFAULT_POSITIONS;
  }
}

export function DPad({ onDir, onAction, actionLabel }: Props) {
  const [editing, setEditing] = useState(false);
  const [positions, setPositions] = useState<Positions>(readPositions);
  const dragRef = useRef<{
    target: ControlKey;
    pointerId: number;
    startX: number;
    startY: number;
    startPos: Point;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }, [positions]);

  const resetPositions = useCallback(() => setPositions(DEFAULT_POSITIONS), []);

  const startDrag = useCallback(
    (target: ControlKey, e: React.PointerEvent<HTMLElement>) => {
      if (!editing) return;
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        target,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startPos: positions[target],
      };
    },
    [editing, positions],
  );

  const moveDrag = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = (e.clientX - drag.startX) / window.innerWidth * 100;
    // The controls use `bottom`, so CSS Y grows upward. Pointer Y grows downward.\n    // Invert the pointer delta so dragging follows the finger naturally.\n    const dy = (drag.startY - e.clientY) / window.innerHeight * 100;
    setPositions((prev) => ({
      ...prev,
      [drag.target]: {
        x: Math.min(92, Math.max(2, drag.startPos.x + dx)),
        y: Math.min(45, Math.max(2, drag.startPos.y + dy)),
      },
    }));
  }, []);

  const stopDrag = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  }, []);

  const buttonStyle = (key: ControlKey) => ({
    left: `calc(${positions[key].x}vw + env(safe-area-inset-left))`,
    bottom: `calc(${positions[key].y}vh + env(safe-area-inset-bottom))`,
    touchAction: "none" as const,
  });

  const pad = (dir: Dir, glyph: string, key: ControlKey) => (
    <button
      type="button"
      aria-label={dir}
      style={buttonStyle(key)}
      onPointerDown={(e) => {
        if (editing) {
          startDrag(key, e);
          return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        onDir(dir);
      }}
      onPointerMove={editing ? moveDrag : undefined}
      onPointerUp={(e) => {
        if (editing) {
          stopDrag(e);
          return;
        }
        e.preventDefault();
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        onDir(null);
      }}
      onPointerCancel={stopDrag}
      onContextMenu={(e) => e.preventDefault()}
      className={`game-dpad-btn pixel-press fixed z-[110] flex h-14 w-14 select-none items-center justify-center border border-white/10 bg-white/[0.08] text-card-foreground shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-md hover:bg-white/[0.14] active:bg-white/[0.18] pixel-font text-[13px] ${editing ? "ring-2 ring-amber-300/90 bg-black/40" : ""}`}
    >
      {glyph}
    </button>
  );

  return (
    <>
      {pad("up", "▲", "up")}
      {pad("left", "◀", "left")}
      {pad("right", "▶", "right")}
      {pad("down", "▼", "down")}

      <button
        type="button"
        aria-label={actionLabel}
        style={buttonStyle("action")}
        onPointerDown={(e) => {
          if (editing) {
            startDrag("action", e);
            return;
          }
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          onAction();
        }}
        onPointerMove={editing ? moveDrag : undefined}
        onPointerUp={(e) => {
          if (editing) {
            stopDrag(e);
            return;
          }
          e.preventDefault();
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onPointerCancel={stopDrag}
        onContextMenu={(e) => e.preventDefault()}
        className={`game-dpad-action pixel-press fixed z-[110] flex h-[4.5rem] w-[4.5rem] select-none items-center justify-center rounded-full border border-white/15 bg-primary/30 text-primary-foreground shadow-[0_4px_18px_rgba(0,0,0,0.22)] backdrop-blur-md hover:bg-primary/40 active:bg-primary/50 pixel-font text-[12px] ${editing ? "ring-2 ring-amber-300/90" : ""}`}
      >
        {actionLabel}
      </button>

      {editing && (
        <div
          className="fixed left-1/2 top-2 z-[120] flex -translate-x-1/2 items-center gap-1.5 rounded border border-amber-400/70 bg-[#1a120e]/95 px-2 py-1.5 text-amber-100 shadow-lg"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="pixel-font text-[8px] whitespace-nowrap">Arraste cada botão separadamente</span>
          <button type="button" className="pixel-font min-h-8 px-2 text-[8px] border border-amber-400/50 bg-amber-400/10" onClick={resetPositions}>
            ↺ Padrão
          </button>
          <button type="button" className="pixel-font min-h-8 px-2 text-[8px] border border-emerald-400/50 bg-emerald-400/10" onClick={() => setEditing(false)}>
            ✓ Salvar
          </button>
        </div>
      )}

      <button
        type="button"
        className="game-dpad-editor fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-[calc(0.75rem+env(safe-area-inset-right))] z-[115] min-h-10 min-w-10 border border-amber-400/60 bg-[#1a120e]/80 px-2 text-[10px] text-amber-100 shadow-lg backdrop-blur-sm"
        onClick={() => setEditing((value) => !value)}
        aria-label={editing ? "Fechar ajuste dos controles" : "Ajustar posição dos controles"}
        title="Ajustar posição dos controles"
      >
        {editing ? "✕" : "⚙"}
      </button>

      <style>{`
        @media (min-width: 1025px) {
          .game-dpad-btn,
          .game-dpad-action,
          .game-dpad-editor {
            display: none !important;
          }
        }
        @media (max-width: 1024px) {
          .game-dpad-btn,
          .game-dpad-action {
            margin: 0 !important;
          }
          .game-dpad-editor {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
