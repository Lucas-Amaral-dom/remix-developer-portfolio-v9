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
// `characters.png` contains 12 complete trainer variants (4 directions × 4 frames).
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
] as const;/**
 * Physical positions in characters.png, using human-friendly 1-based numbering.
 * Position 5 is Dawn; position 6 is Lucas.
 */
export const TRAINER_ATLAS_POSITION_BY_NAME = {
  Red: 1,
  Leaf: 2,
  Brendan: 3,
  May: 4,
  Dawn: 6,
  Lucas: 6,
  Serena: 7,
  Ethan: 8,
  Cynthia: 9,
  Calem: 10,
  Hilbert: 11,
  Hilda: 12,
} as const;

export const TRAINER_ATLAS_VARIANT_BY_NAME = Object.fromEntries(
  Object.entries(TRAINER_ATLAS_POSITION_BY_NAME).map(([name, position]) => [name, position - 1]),
) as Record<keyof typeof TRAINER_ATLAS_POSITION_BY_NAME, number>;


export const TRAINER_VARIANT_BY_ID: Record<string, number> = {
  // Role -> canonical trainer from characters.png. The same canonical
  // identity is used to select the matching local battle sprite.
  "Guia do Oásis": TRAINER_ATLAS_VARIANT_BY_NAME.Red,
  "Guia da Cidade": TRAINER_ATLAS_VARIANT_BY_NAME.Red,
  Guia: TRAINER_ATLAS_VARIANT_BY_NAME.Red,

  "Viajante do Deserto": TRAINER_ATLAS_VARIANT_BY_NAME.Leaf,
  "Viajante do Oásis": TRAINER_ATLAS_VARIANT_BY_NAME.Leaf,
  Atendente: TRAINER_ATLAS_VARIANT_BY_NAME.Cynthia,

  "Lutador de Sparring": TRAINER_ATLAS_VARIANT_BY_NAME.Brendan,
  "Lutador do Sparring Ring": TRAINER_ATLAS_VARIANT_BY_NAME.Brendan,
  "Treinador da Praça": TRAINER_ATLAS_VARIANT_BY_NAME.Brendan,
  "Exploradora do Deserto": TRAINER_ATLAS_VARIANT_BY_NAME.Dawn,

  "Campista Dev": TRAINER_ATLAS_VARIANT_BY_NAME.May,
  "Hoteleira do Oásis": TRAINER_ATLAS_VARIANT_BY_NAME.May,

  "Pescadora do Oásis": TRAINER_ATLAS_VARIANT_BY_NAME.Dawn,
  "Artista do Oásis": TRAINER_ATLAS_VARIANT_BY_NAME.Serena,
  "Enfermeira Joy": TRAINER_ATLAS_VARIANT_BY_NAME.Dawn,

  "Desenvolvedor Full Stack": TRAINER_ATLAS_VARIANT_BY_NAME.Lucas,
  "Desenvolvedor da Oficina": TRAINER_ATLAS_VARIANT_BY_NAME.Lucas,
  "Arquiteto de Software": TRAINER_ATLAS_VARIANT_BY_NAME.Lucas,

  "Mecânica de Software": TRAINER_ATLAS_VARIANT_BY_NAME.Serena,
  "Ranger do Santuário": TRAINER_ATLAS_VARIANT_BY_NAME.Ethan,
  "Turista do Deserto": TRAINER_ATLAS_VARIANT_BY_NAME.Red,
  "Pesquisadora do Oásis": TRAINER_ATLAS_VARIANT_BY_NAME.Hilbert,

  "Construtor do Workshop": TRAINER_ATLAS_VARIANT_BY_NAME.Hilda,
  "Pesquisador de Campo": TRAINER_ATLAS_VARIANT_BY_NAME.Ethan,

  "Mercador de Frutas e Itens": TRAINER_ATLAS_VARIANT_BY_NAME.Cynthia,
  "Mercador do Bazar": TRAINER_ATLAS_VARIANT_BY_NAME.Cynthia,

  "Mestre de Batalhas": TRAINER_ATLAS_VARIANT_BY_NAME.Calem,
  "Mestre da Arena": TRAINER_ATLAS_VARIANT_BY_NAME.Calem,
  "Instrutor SENAI": TRAINER_ATLAS_VARIANT_BY_NAME.Hilbert,

  "Curador de Créditos": TRAINER_ATLAS_VARIANT_BY_NAME.Calem,
  "Pesquisador do Oásis": TRAINER_ATLAS_VARIANT_BY_NAME.Hilbert,

  "Juíza da Arena": TRAINER_ATLAS_VARIANT_BY_NAME.Hilda,
  Juíza: TRAINER_ATLAS_VARIANT_BY_NAME.Hilda,

  // The playable protagonist remains Red because that is the stable
  // fully animated 4-direction fallback currently available.
  Lucas: TRAINER_ATLAS_VARIANT_BY_NAME.Red,
  "Lucas Amaral": TRAINER_ATLAS_VARIANT_BY_NAME.Red,
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
  machop: TRAINER_ATLAS_VARIANT_BY_NAME.Brendan,
  psyduck: TRAINER_ATLAS_VARIANT_BY_NAME.Dawn,
  trapinch: TRAINER_ATLAS_VARIANT_BY_NAME.Ethan,
  charmander: TRAINER_ATLAS_VARIANT_BY_NAME.May,
  porygon: TRAINER_ATLAS_VARIANT_BY_NAME.Lucas,
  eevee: TRAINER_ATLAS_VARIANT_BY_NAME.Serena,
  arcanine: TRAINER_ATLAS_VARIANT_BY_NAME.Calem,
  flygon: TRAINER_ATLAS_VARIANT_BY_NAME.Leaf,
  pikachu: TRAINER_ATLAS_VARIANT_BY_NAME.Red,
  merchant: TRAINER_ATLAS_VARIANT_BY_NAME.Cynthia,
  bulbasaur: TRAINER_ATLAS_VARIANT_BY_NAME.Hilbert,
  chansey: TRAINER_ATLAS_VARIANT_BY_NAME.May,

  // Lower-area trainers.
  builder: TRAINER_ATLAS_VARIANT_BY_NAME.Hilda,
  tourist: TRAINER_ATLAS_VARIANT_BY_NAME.Red,
  "oasis-traveler": TRAINER_ATLAS_VARIANT_BY_NAME.Leaf,
  "square-trainer": TRAINER_ATLAS_VARIANT_BY_NAME.Brendan,
  explorer: TRAINER_ATLAS_VARIANT_BY_NAME.Dawn,
  artist: TRAINER_ATLAS_VARIANT_BY_NAME.Serena,
  "field-researcher": TRAINER_ATLAS_VARIANT_BY_NAME.Ethan,
  "oasis-researcher": TRAINER_ATLAS_VARIANT_BY_NAME.Hilbert,
};
