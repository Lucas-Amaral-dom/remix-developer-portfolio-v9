import battleBrendan from "@/assets/trainers/battle/brendan.png";
import battleCalem from "@/assets/trainers/battle/calem.png";
import battleCynthia from "@/assets/trainers/battle/cynthia.png";
import battleDawn from "@/assets/trainers/battle/dawn.png";
import battleEthan from "@/assets/trainers/battle/ethan.png";
import battleHilbert from "@/assets/trainers/battle/hilbert.png";
import battleHilda from "@/assets/trainers/battle/hilda.png";
import battleLeaf from "@/assets/trainers/battle/leaf.png";
import battleLucas from "@/assets/trainers/battle/lucas.png";
import battleMay from "@/assets/trainers/battle/may.png";
import battleRed from "@/assets/trainers/battle/red.png";
import battleSerena from "@/assets/trainers/battle/serena.png";
import overworldBrendan from "@/assets/trainers/overworld/brendan.png";
import overworldCalem from "@/assets/trainers/overworld/calem.png";
import overworldCynthia from "@/assets/trainers/overworld/cynthia.png";
import overworldDawn from "@/assets/trainers/overworld/dawn.png";
import overworldEthan from "@/assets/trainers/overworld/ethan.png";
import overworldHilbert from "@/assets/trainers/overworld/hilbert.png";
import overworldHilda from "@/assets/trainers/overworld/hilda.png";
import overworldLeaf from "@/assets/trainers/overworld/leaf.png";
import overworldLucas from "@/assets/trainers/overworld/lucas.png";
import overworldMay from "@/assets/trainers/overworld/may.png";
import overworldRed from "@/assets/trainers/overworld/red.png";
import overworldSerena from "@/assets/trainers/overworld/serena.png";

/**
 * Ordem física do atlas `src/assets/characters.png`.
 * Cada variante ocupa 16 frames: 4 direções × 4 poses.
 * O índice precisa permanecer alinhado com os retratos de batalha locais.
 */
export const TRAINER_VARIANTS = 12;

export const TRAINER_VARIANT_NAMES = [
  "Red",
  "Leaf",
  "Brendan",
  "May",
  "Dawn",
  "Lucas",
  "Serena",
  "Ethan",
  "Cynthia",
  "Calem",
  "Hilbert",
  "Hilda",
] as const;

export const TRAINER_VARIANT_BY_ID: Record<string, number> = {
  // Keep dialogue aliases aligned with the exact NPC variant used on the map.
  // Variant 0 is the player sprite; city NPC labels intentionally point to their
  // real exterior sprite variant so the dialogue portrait never swaps characters.
  // Variant 0 is reserved for the player. Main city NPCs use variants 1-11
  // exactly once so the player never shares a trainer with a principal NPC.
  Lucas: 0,
  "Lucas Amaral": 0,
  Guia: 1,
  "Guia do Oásis": 1,
  "Viajante do Deserto": 2,
  "Pescadora do Oásis": 3,
  "Lutador de Sparring": 4,
  "Campista Dev": 5,
  "Desenvolvedor da Oficina": 6,
  "Desenvolvedor Full Stack": 6,
  "Mecânica de Software": 7,
  "Ranger do Santuário": 8,
  "Mercador do Bazar": 9,
  "Mercador de Frutas e Itens": 9,
  "Mestre da Arena": 10,
  "Mestre de Batalhas": 10,
  "Pesquisadora do Oásis": 11,
  "Construtor do Workshop": 6,

  Atendente: 2,
  "Instrutor SENAI": 8,
  "Hoteleira do Oásis": 5,
  "Enfermeira Joy": 3,
  "Arquiteto de Software": 7,
  "Juíza da Arena": 10,

  "Turista do Deserto": 2,
  "Viajante do Oásis": 3,
  "Treinador da Praça": 4,
  "Exploradora do Deserto": 5,
  "Artista do Oásis": 6,
  "Pesquisador de Campo": 7,
  "Curador de Créditos": 11,
};

export const TRAINER_OVERWORLD_PORTRAITS_BY_VARIANT: Record<number, string> = {
  0: overworldRed,
  1: overworldLeaf,
  2: overworldBrendan,
  3: overworldMay,
  4: overworldDawn,
  5: overworldLucas,
  6: overworldSerena,
  7: overworldEthan,
  8: overworldCynthia,
  9: overworldCalem,
  10: overworldHilbert,
  11: overworldHilda,
};

/**
 * Dialogue speaker aliases intentionally mirror the same variants used by the
 * world NPC labels. Keeping this map explicit prevents a dialogue like
 * "Instrutor" or "Guia" from falling back to an unrelated trainer sprite.
 */
export const TRAINER_VARIANT_BY_DIALOGUE_SPEAKER: Record<string, number> = {
  ...TRAINER_VARIANT_BY_ID,
};

export const BATTLE_TRAINER_SPRITES_BY_VARIANT: Record<number, string> = {
  0: battleRed,
  1: battleLeaf,
  2: battleBrendan,
  3: battleMay,
  4: battleDawn,
  5: battleLucas,
  6: battleSerena,
  7: battleEthan,
  8: battleCynthia,
  9: battleCalem,
  10: battleHilbert,
  11: battleHilda,
};

/**
 * Fonte de verdade para conversas que terminam em batalha.
 * O mesmo ID liga NPC do mapa, retrato de conversa e retrato da batalha.
 */
export const TRAINER_VARIANT_BY_OPPONENT_ID: Record<string, number> = {
  machop: 4,
  psyduck: 3,
  trapinch: 8,
  charmander: 5,
  porygon: 6,
  eevee: 7,
  arcanine: 10,
  flygon: 2,
};
