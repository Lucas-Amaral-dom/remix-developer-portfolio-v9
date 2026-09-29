import { useEffect, useState, useRef } from "react";
import type { Dialogue } from "@/lib/portfolio-content";
import { getOpponent } from "@/lib/battle/opponents";
import {
  BATTLE_TRAINER_SPRITES_BY_VARIANT,
  TRAINER_VARIANT_BY_DIALOGUE_SPEAKER,
  TRAINER_VARIANT_BY_OPPONENT_ID,
} from "@/lib/trainer-assets";
import { PixelButton } from "./PixelButton";
import battleDawn from "@/assets/trainers/battle/dawn.png";

interface Props {
  dialogue: Dialogue;
  onClose: () => void;
  onStartBattle?: (opponentId: string, openTeamBuilder?: boolean) => void;
  onHeal?: (source: "nurse" | "inn") => void;
  formSlot?: React.ReactNode;
}

const SPEAKER_VARIANTS = TRAINER_VARIANT_BY_DIALOGUE_SPEAKER;

const POKEMON_DEX_IDS: Record<string, number> = {
  pikachu: 25,
  psyduck: 54,
  machop: 66,
  charmander: 4,
  flygon: 330,
  trapinch: 328,
  eevee: 133,
  chansey: 113,
  arcanine: 59,
  bulbasaur: 1,
  porygon: 137,
  vulpix: 37,
  growlithe: 58,
  totodile: 158,
  hoppip: 187,
  mudkip: 258,
  cacnea: 331,
  turtwig: 387,
  shinx: 403,
  sandile: 551,
  zorua: 570,
  delphox: 655,
  greninja: 658,
  primarina: 730,
  golisopod: 768,
  mimikyu: 778,
  dragapult: 887,
  zamazenta: 889,
  regidrago: 895,
  great_tusk: 984,
  iron_treads: 990,
  roaring_moon: 1005,
  yveltal: 717,
  wooper: 194,
  budew: 406,
  litwick: 607,
};

function findPokemonDexId(speaker: string) {
  const normalized = speaker.toLowerCase().replace(/[()]/g, " ");
  const entry = Object.entries(POKEMON_DEX_IDS).find(([name]) =>
    normalized.includes(name.replace("_", " ")),
  );
  return entry?.[1];
}

function TrainerAvatar({
  speaker,
  battleOpponentId,
}: {
  speaker: string;
  battleOpponentId?: string | undefined;
}) {
  const speakerVariant = SPEAKER_VARIANTS[speaker];
  const opponent = battleOpponentId ? getOpponent(battleOpponentId) : undefined;
  const pokemonDexId = findPokemonDexId(speaker);
  const isPokemonSpeaker = Boolean(pokemonDexId);
  const isTrainerSpeaker = speakerVariant !== undefined && !isPokemonSpeaker;
  // The NPC's own speaker identity is authoritative. The opponent ID is only
  // a fallback for legacy/object dialogues that do not have a trainer speaker.
  const battleVariant = speaker === "Enfermeira Joy"
    ? undefined
    : speakerVariant ?? (
      battleOpponentId ? TRAINER_VARIANT_BY_OPPONENT_ID[battleOpponentId] : undefined
    );
  const battleTrainerSprite =
    speaker === "Enfermeira Joy"
      ? battleDawn
      : isTrainerSpeaker && battleVariant !== undefined
        ? (BATTLE_TRAINER_SPRITES_BY_VARIANT[battleVariant] ?? opponent?.trainerAvatar ?? null)
        : (opponent?.trainerAvatar ?? null);
  const pokemonBattleSprite = pokemonDexId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDexId}.png`
    : null;
  // O retrato do treinador aparece uma única vez, usando a arte de batalha.
  // A caixa ao lado fica reservada ao Pokémon/companheiro.
  const hasBattlePreview = Boolean(pokemonBattleSprite || opponent?.sprite);
  const pokemonPortrait = pokemonDexId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDexId}.png`
    : null;

  return (
    <div className="flex shrink-0 items-end gap-1.5">
      {isPokemonSpeaker ? (
        <div
          aria-label={speaker}
          className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden border-2 border-[var(--pixel-border-deep)] bg-gradient-to-b from-sky-950/40 via-cyan-900/20 to-black/50 shadow-md"
        >
          {pokemonPortrait ? (
            <img
              src={pokemonPortrait}
              alt={speaker}
              loading="lazy"
              className="h-10 w-10 object-contain"
              style={{ imageRendering: "pixelated" }}
              referrerPolicy="no-referrer"
            />
          ) : null}
        </div>
      ) : isTrainerSpeaker ? (
        <div
          aria-label={`${speaker} no mapa`}
          className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden border-2 border-[var(--pixel-border-deep)] bg-gradient-to-b from-amber-950/40 via-amber-900/20 to-black/50 shadow-md"
        >
          {battleTrainerSprite ? (
            <img
              src={battleTrainerSprite}
              alt={`${speaker} em batalha`}
              loading="eager"
              decoding="sync"
              className="h-16 w-11 object-contain"
              style={{ imageRendering: "pixelated" }}
              referrerPolicy="no-referrer"
              draggable={false}
            />
          ) : null}
        </div>
      ) : (
        <div
          aria-label={speaker}
          className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden border-2 border-[var(--pixel-border-deep)] bg-gradient-to-b from-stone-950/60 via-stone-900/30 to-black/50 shadow-md"
        >
          <span className="pixel-font text-2xl text-amber-300" aria-hidden="true">
            ✦
          </span>
        </div>
      )}

      {hasBattlePreview && (
        <div className="flex min-h-16 min-w-14 flex-col items-center justify-center gap-0.5 border-2 border-[var(--pixel-border-deep)] bg-black/60 px-1.5 py-1 shadow-md">
          {pokemonBattleSprite ? (
            <img
              src={pokemonBattleSprite}
              alt={`${speaker} em batalha`}
              loading="lazy"
              className="h-12 w-12 object-contain"
              style={{ imageRendering: "pixelated" }}
              referrerPolicy="no-referrer"
            />
          ) : opponent?.sprite ? (
            <img
              src={opponent.sprite}
              alt={`${opponent.name} em batalha`}
              loading="lazy"
              className="h-12 w-12 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          ) : null}
          <span className="pixel-font text-[5px] uppercase tracking-wide text-amber-300">
            batalha
          </span>
        </div>
      )}
    </div>
  );
}

/** Types the current page out with instant skip support on user click or key */
function useTypewriter(text: string) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setShown("");
    setDone(false);
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      i += 3;
      if (i >= text.length) {
        setShown(text);
        setDone(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setShown(text.slice(0, i));
      }
    }, 12);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  const finish = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShown(text);
    setDone(true);
  };

  return { shown, done, finish };
}

export function DialogueBox({ dialogue, onClose, onStartBattle, onHeal, formSlot }: Props) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [dialogue.speaker, dialogue.pages.length]);

  const current = dialogue.pages[page] ?? { text: "" };
  const battlePageOpponentId =
    current.battleOpponentId ?? dialogue.pages.find((p) => p.battleOpponentId)?.battleOpponentId;
  const { shown, done, finish } = useTypewriter(current.text);
  const isLast = page >= dialogue.pages.length - 1;

  function advance() {
    if (!done) {
      finish();
      return;
    }
    if (isLast) onClose();
    else setPage((p) => p + 1);
  }

  const advanceRef = useRef(advance);
  advanceRef.current = advance;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input,textarea")) return;
      if (["Enter", " ", "e", "E"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        advanceRef.current();
      }
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  return (
    <div
      className="dialogue-box pointer-events-auto absolute inset-x-1 bottom-1 z-30 md:inset-x-8 md:bottom-6 cursor-pointer select-none sm:inset-x-2"
      onClick={(e) => {
        // Only advance if click was not inside an input, textarea or button
        if (e.target instanceof HTMLElement && e.target.closest("button,a,input,textarea")) return;
        advance();
      }}
    >
      <div className="bg-card/95 text-card-foreground pixel-frame relative p-2 pt-4 sm:p-3 sm:pt-5 md:p-5 md:pt-6 max-h-[46dvh] sm:max-h-[52dvh] md:max-h-[58dvh] overflow-y-auto">
        <span className="pixel-font bg-primary text-primary-foreground absolute -top-2.5 left-2 px-1.5 py-0.5 text-[9px] sm:text-[8px]">
          {dialogue.speaker}
        </span>

        <div className="flex items-start gap-1.5 sm:gap-2.5 md:gap-4">
          <TrainerAvatar speaker={dialogue.speaker} battleOpponentId={battlePageOpponentId} />
          <p className="flex-1 min-w-0 min-h-0 text-[13px] leading-6 whitespace-pre-line sm:text-[13px] sm:leading-6 md:text-base">
            {shown}
            {!done && (
              <span className="ml-0.5 inline-block animate-[blink-cursor_1s_steps(1)_infinite]">
                ▌
              </span>
            )}
          </p>
        </div>

        {done && current.links && current.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {current.links.map((l) => (
              <a
                key={l.href + l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="pixel-font pixel-press bg-accent/70 text-accent-foreground min-h-10 px-2.5 py-2 text-[10px] sm:text-[10px] touch-manipulation select-none"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}

        {current.healAction && (
          <div className="mt-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onHeal?.(current.healAction!);
                advance();
              }}
              className="pixel-font pixel-press flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 text-xs shadow-md border-2 border-emerald-950 rounded-sm font-bold cursor-pointer transition-transform active:scale-95 animate-pulse"
            >
              <span className="text-sm">💖</span>
              <span>{current.healLabel || "Curar meus Pokémon!"}</span>
            </button>
          </div>
        )}

        {current.battleOpponentId && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const oppId = current.battleOpponentId;
                if (oppId) {
                  onStartBattle?.(oppId, false);
                  onClose();
                }
              }}
              className="pixel-font pixel-press flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white px-3.5 py-2.5 text-xs shadow-md border-2 border-red-950 rounded-sm font-bold cursor-pointer transition-transform active:scale-95 animate-pulse"
            >
              <span className="text-sm">⚔️</span>
              <span>{current.battleLabel || "Batalhar Agora!"}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const oppId = current.battleOpponentId;
                if (oppId) {
                  onStartBattle?.(oppId, true);
                  onClose();
                }
              }}
              className="pixel-font pixel-press flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-100 px-3.5 py-2.5 text-xs shadow-md border-2 border-amber-950 rounded-sm font-bold cursor-pointer transition-transform active:scale-95"
              title="Personalizar seu time de Pokémon e ataques antes de entrar em combate"
            >
              <span>⭐</span>
              <span>Escolher Time & Golpes</span>
            </button>
          </div>
        )}

        {done && dialogue.form && formSlot ? <div className="mt-4">{formSlot}</div> : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="pixel-font text-muted-foreground text-[10px] sm:text-[9px]">
            {page + 1}/{dialogue.pages.length} · A / Enter
          </span>
          <div className="flex gap-2">
            <PixelButton variant="ghost" onClick={onClose}>
              Fechar
            </PixelButton>
            <PixelButton onClick={advance}>{isLast && done ? "Ok" : "Próximo ▶"}</PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}


/* Mobile readability: keep the pixel aesthetic, but use comfortable touch targets and readable copy. */
<style>{\`\
@media (max-width: 900px) and (pointer: coarse) {\
  .dialogue-box > div { padding: 12px 12px 10px !important; max-height: 52dvh !important; }\
  .dialogue-box .pixel-font { letter-spacing: 0.01em; }\
  .dialogue-box button, .dialogue-box a { min-height: 42px; font-size: 11px !important; }\
  .dialogue-box .trainer-avatar { width: 52px !important; height: 64px !important; }\
}\
\`}</style>\
