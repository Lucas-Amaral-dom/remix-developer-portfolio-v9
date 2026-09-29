import { useCallback, useEffect, useRef, useState } from "react";
import type { Dir } from "@/game/engine";

interface Props {
  onDir: (dir: Dir | null) => void;
  onAction: () => void;
  actionLabel: string;
}

type Point = { x: number; y: number };
type Positions = { pad: Point; action: Point };

const STORAGE_KEY = "portfolio_mobile_control_positions_v1";
const DEFAULT_POSITIONS: Positions = {
  pad: { x: 18, y: 18 },
  action: { x: 18, y: 18 },
};

function readPositions(): Positions {
  if (typeof window === "undefined") return DEFAULT_POSITIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_POSITIONS;
    const parsed = JSON.parse(raw) as Partial<Positions>;
    return {
      pad: { ...DEFAULT_POSITIONS.pad, ...(parsed.pad ?? {}) },
      action: { ...DEFAULT_POSITIONS.action, ...(parsed.action ?? {}) },
    };
  } catch {
    return DEFAULT_POSITIONS;
  }
}

export function DPad({ onDir, onAction, actionLabel }: Props) {
  const [editing, setEditing] = useState(false);
  const [positions, setPositions] = useState<Positions>(readPositions);
  const dragRef = useRef<{
    target: keyof Positions;
    pointerId: number;
    startX: number;
    startY: number;
    startPos: Point;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }, [positions]);

  const resetPositions = useCallback(() => {
    setPositions(DEFAULT_POSITIONS);
  }, []);

  const startDrag = useCallback(
    (target: keyof Positions, e: React.PointerEvent<HTMLElement>) => {
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

  const moveDrag = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dx = ((e.clientX - drag.startX) / width) * 100;
      const dy = ((e.clientY - drag.startY) / height) * 100;
      setPositions((prev) => ({
        ...prev,
        [drag.target]: {
          x: Math.min(48, Math.max(1, drag.startPos.x + dx)),
          y: Math.min(48, Math.max(1, drag.startPos.y + dy)),
        },
      }));
    },
    [],
  );

  const stopDrag = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  }, []);

  const pad = (dir: Dir, glyph: string, area: string) => (
    <button
      type="button"
      aria-label={dir}
      style={{ gridArea: area }}
      onPointerDown={(e) => {
        if (editing) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        onDir(dir);
      }}
      onPointerUp={(e) => {
        if (editing) return;
        e.preventDefault();
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        onDir(null);
      }}
      onPointerCancel={(e) => {
        if (editing) return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        onDir(null);
      }}
      onContextMenu={(e) => e.preventDefault()}
      className="game-dpad-btn pixel-press flex h-14 w-14 select-none touch-none touch-manipulation items-center justify-center border border-white/10 bg-white/[0.08] text-card-foreground shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-md hover:bg-white/[0.14] active:bg-white/[0.18] pixel-font text-[13px]"
    >
      {glyph}
    </button>
  );

  return (
    <>
      <div
        className="game-dpad fixed z-[110] flex items-end justify-between gap-4 select-none"
        style={{
          left: `calc(${positions.pad.x}vw + env(safe-area-inset-left))`,
          bottom: `calc(${positions.pad.y}vh + env(safe-area-inset-bottom))`,
          touchAction: editing ? "none" : "none",
        }}
        onPointerDown={(e) => startDrag("pad", e)}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        <div
          className={`game-dpad-pad grid gap-1 ${editing ? "ring-2 ring-amber-300/90 rounded-md p-1 bg-black/30" : ""}`}
          style={{
            gridTemplateAreas: '" . u . " " l . r " " . d . "',
            gridTemplateColumns: "repeat(3, auto)",
          }}
        >
          {pad("up", "▲", "u")}
          {pad("left", "◀", "l")}
          {pad("right", "▶", "r")}
          {pad("down", "▼", "d")}
        </div>

        <button
          type="button"
          aria-label={actionLabel}
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
          onPointerUp={editing ? stopDrag : (e) => {
            e.preventDefault();
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
          }}
          onPointerCancel={editing ? stopDrag : (e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
          }}
          onContextMenu={(e) => e.preventDefault()}
          className={`game-dpad-action pixel-press flex h-[4.5rem] w-[4.5rem] select-none touch-none touch-manipulation items-center justify-center rounded-full border border-white/15 bg-primary/30 text-primary-foreground shadow-[0_4px_18px_rgba(0,0,0,0.22)] backdrop-blur-md hover:bg-primary/40 active:bg-primary/50 pixel-font text-[12px] ${editing ? "ring-2 ring-amber-300/90" : ""}`}
        >
          {actionLabel}
        </button>

        {editing && (
          <div
            className="fixed left-1/2 top-2 z-[120] flex -translate-x-1/2 items-center gap-1.5 rounded border border-amber-400/70 bg-[#1a120e]/95 px-2 py-1.5 text-amber-100 shadow-lg"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span className="pixel-font text-[8px] whitespace-nowrap">Arraste ◈ e A</span>
            <button
              type="button"
              className="pixel-font min-h-8 px-2 text-[8px] border border-amber-400/50 bg-amber-400/10"
              onClick={resetPositions}
            >
              ↺ Padrão
            </button>
            <button
              type="button"
              className="pixel-font min-h-8 px-2 text-[8px] border border-emerald-400/50 bg-emerald-400/10"
              onClick={() => setEditing(false)}
            >
              ✓ Salvar
            </button>
          </div>
        )}
      </div>

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
          .game-dpad,
          .game-dpad-editor {
            display: none !important;
          }
        }
        @media (max-width: 1024px) {
          .game-dpad {
            width: auto !important;
            flex: none !important;
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
