import type { Dir } from "@/game/engine";

interface Props {
  onDir: (dir: Dir | null) => void;
  onAction: () => void;
  actionLabel: string;
}

export function DPad({ onDir, onAction, actionLabel }: Props) {
  const pad = (dir: Dir, glyph: string, area: string) => (
    <button
      type="button"
      aria-label={dir}
      style={{ gridArea: area }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onDir(dir);
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        onDir(null);
      }}
      onPointerCancel={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        onDir(null);
      }}
      onContextMenu={(e) => e.preventDefault()}
      className="game-dpad-btn pixel-press bg-card/35 hover:bg-card/50 border border-white/20 text-card-foreground pixel-font flex h-14 w-14 items-center justify-center text-[13px] select-none touch-none touch-manipulation backdrop-blur-[2px]"
    >
      {glyph}
    </button>
  );

  return (
    <div className="game-dpad flex items-end justify-between gap-4 lg:hidden">
      <div
        className="game-dpad-pad grid gap-1"
        style={{
          gridTemplateAreas: '". u ." "l . r" ". d ."',
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
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          onAction();
        }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onPointerCancel={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onContextMenu={(e) => e.preventDefault()}
        className="game-dpad-action pixel-press bg-primary/70 hover:bg-primary/80 border-2 border-white/25 text-primary-foreground pixel-font flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full text-[12px] select-none touch-none touch-manipulation backdrop-blur-[2px]"
      >
        {actionLabel}
      </button>
    </div>
  );
}
