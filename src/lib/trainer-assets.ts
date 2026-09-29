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
// `characters.png` contains 32 complete trainer variants (4 directions × 4 frames).
// Keep all of them available so city NPCs do not recycle the first 12 sprites.
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
  // Variantes reais disponíveis no atlas characters.png (0–11).
  "Guia do Oásis": 0,
  "Guia da Cidade": 0,
  Guia: 0,
  "Viajante do Deserto": 1,
  "Viajante do Oásis": 1,
  Atendente: 1,

  "Lutador de Sparring": 2,
  "Lutador do Sparring Ring": 2,
  "Exploradora do Deserto": 2,

  "Campista Dev": 3,

  "Pescadora do Oásis": 4,
  "Artista do Oásis": 4,
  "Enfermeira Joy": 4,

  "Desenvolvedor Full Stack": 5,
  "Desenvolvedor da Oficina": 5,
  "Hoteleira do Oásis": 5,

  "Mecânica de Software": 6,
  "Ranger do Santuário": 6,
  "Turista do Deserto": 6,
  "Pesquisadora do Oásis": 6,

  "Construtor do Workshop": 7,
  "Pesquisador de Campo": 7,
  "Treinador da Praça": 0,
  "Arquiteto de Software": 7,

  "Mercador de Frutas e Itens": 8,
  "Mercador do Bazar": 8,

  "Mestre de Batalhas": 9,
  "Mestre da Arena": 9,
  "Instrutor SENAI": 9,

  "Curador de Créditos": 10,
  "Pesquisador do Oásis": 10,

  "Juíza da Arena": 11,
  Juíza: 11,

  Lucas: 0,
  "Lucas Amaral": 0,
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
  machop: 2,
  psyduck: 4,
  trapinch: 6,
  charmander: 3,
  porygon: 5,
  eevee: 6,
  arcanine: 9,
  flygon: 1,
  pikachu: 0,
  merchant: 8,
  bulbasaur: 10,
  chansey: 5,
};
