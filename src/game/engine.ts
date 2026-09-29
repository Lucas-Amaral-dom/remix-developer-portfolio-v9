import kaplay from "kaplay";
import type { KAPLAYCtx } from "kaplay";

import {
  SCENES,
  SOLID_TILES,
  TILE,
  type FurnitureKind,
  type Interactable,
  type SceneDef,
  type SceneId,
} from "./world";

import homeSprite from "@/assets/build-home.png";
import pokecenterSprite from "@/assets/build-pokecenter.png";
import pokemartSprite from "@/assets/build-pokemart.png";
import innSprite from "@/assets/build-inn.png";
import workshopSprite from "@/assets/build-workshop.png";
import cottageSprite from "@/assets/build-cottage.png";
import townFlowerhouseSprite from "@/assets/build-town-flowerhouse.png";
import townMarketSprite from "@/assets/build-town-market.png";
import townGreenhallSprite from "@/assets/build-town-greenhall.png";
import townBluehallSprite from "@/assets/build-town-bluehall.png";
import townPinkcottageSprite from "@/assets/build-town-pinkcottage.png";
import townOrangecottageSprite from "@/assets/build-town-orangecottage.png";
import trainerOverworldAtlas from "@/assets/characters.png";
import doorModernSprite from "@/assets/door-modern.png";
import doorWoodSprite from "@/assets/door-wood.png";
import desertSandTile from "@/assets/tiles/desert-sand.png";
import desertBrickTile from "@/assets/tiles/desert-brick.png";

import PikachuSprite from "@/assets/pokemon/pikachu.png";
import PsyduckSprite from "@/assets/pokemon/psyduck.png";
import CharmanderSprite from "@/assets/pokemon/charmander.png";
import MachopSprite from "@/assets/pokemon/machop.png";
import ChanseySprite from "@/assets/pokemon/chansey.png";
import PorygonSprite from "@/assets/pokemon/porygon.png";
import ArcanineSprite from "@/assets/pokemon/arcanine.png";
import EeveeSprite from "@/assets/pokemon/eevee.png";
import FlygonSprite from "@/assets/pokemon/flygon.png";
import BulbasaurSprite from "@/assets/pokemon/bulbasaur.png";
import VulpixSprite from "@/assets/pokemon/vulpix.png";
import GrowlitheSprite from "@/assets/pokemon/growlithe.png";
import TotodileSprite from "@/assets/pokemon/totodile.png";
import HoppipSprite from "@/assets/pokemon/hoppip.png";
import WooperSprite from "@/assets/pokemon/wooper.png";
import MudkipSprite from "@/assets/pokemon/mudkip.png";
import TrapinchSprite from "@/assets/pokemon/trapinch.png";
import CacneaSprite from "@/assets/pokemon/cacnea.png";
import TurtwigSprite from "@/assets/pokemon/turtwig.png";
import ShinxSprite from "@/assets/pokemon/shinx.png";
import BudewSprite from "@/assets/pokemon/budew.png";
import SandileSprite from "@/assets/pokemon/sandile.png";
import ZoruaSprite from "@/assets/pokemon/zorua.png";
import LitwickSprite from "@/assets/pokemon/litwick.png";
import DelphoxSprite from "@/assets/pokemon/delphox.png";
import GreninjaSprite from "@/assets/pokemon/greninja.png";
import YveltalSprite from "@/assets/pokemon/yveltal.png";
import PrimarinaSprite from "@/assets/pokemon/primarina.png";
import GolisopodSprite from "@/assets/pokemon/golisopod.png";
import MimikyuSprite from "@/assets/pokemon/mimikyu.png";
import DragapultSprite from "@/assets/pokemon/dragapult.png";
import ZamazentaSprite from "@/assets/pokemon/zamazenta.png";
import RegidragoSprite from "@/assets/pokemon/regidrago.png";
import GreatTuskSprite from "@/assets/pokemon/great_tusk.png";
import IronTreadsSprite from "@/assets/pokemon/iron_treads.png";
import RoaringMoonSprite from "@/assets/pokemon/roaring_moon.png";
import { sound } from "@/lib/sound";
import { TRAINER_VARIANTS, TRAINER_VARIANT_BY_ID } from "@/lib/trainer-assets";
import { TransitionManager, type TransitionType } from "./transition";

// KAPLAY components can be torn down while an animation callback is still queued.
// Keep visual updates defensive so scene transitions never write into a missing
// position/scale component.
type MutableVisual = {
  pos?: { x?: number; y?: number };
  scale?: { x: number; y: number };
};
const setPosX = (obj: MutableVisual | null | undefined, value: number) => {
  if (obj?.pos) obj.pos.x = value;
};
const setPosY = (obj: MutableVisual | null | undefined, value: number) => {
  if (obj?.pos) obj.pos.y = value;
};
const setScaleX = (obj: MutableVisual | null | undefined, value: number) => {
  if (obj?.scale) obj.scale.x = value;
};
const setScaleY = (obj: MutableVisual | null | undefined, value: number) => {
  if (obj?.scale) obj.scale.y = value;
};

export type Dir = "up" | "down" | "left" | "right";

export interface GameCallbacks {
  onDialogue: (id: string) => void;
  onScene: (scene: SceneDef) => void;
  onPrompt: (prompt: { label: string; action: string } | null) => void;
  onTransitionComplete?: (scene: SceneDef) => void;
}

export interface GameHandle {
  destroy: () => void;
  setPaused: (paused: boolean) => void;
  setDir: (dir: Dir | null) => void;
  interact: () => void;
  clearInteraction: () => void;
  goTo: (scene: SceneId) => void;
  setTransitionType: (type: TransitionType) => void;
}

const SPRITES: Record<string, string> = {
  home: homeSprite,
  lab: townGreenhallSprite,
  arena: townBluehallSprite,
  shop: townMarketSprite,
  pokecenter: pokecenterSprite,
  pokemart: pokemartSprite,
  inn: innSprite,
  workshop: workshopSprite,
  cottage: cottageSprite,
  "town-flowerhouse": townFlowerhouseSprite,
  "town-market": townMarketSprite,
  "town-greenhall": townGreenhallSprite,
  "town-bluehall": townBluehallSprite,
  "town-pinkcottage": townPinkcottageSprite,
  "town-orangecottage": townOrangecottageSprite,
  "poke-pikachu": PikachuSprite,
  "poke-psyduck": PsyduckSprite,
  "poke-charmander": CharmanderSprite,
  "poke-machop": MachopSprite,
  "poke-chansey": ChanseySprite,
  "poke-porygon": PorygonSprite,
  "poke-arcanine": ArcanineSprite,
  "poke-eevee": EeveeSprite,
  "poke-flygon": FlygonSprite,
  "poke-bulbasaur": BulbasaurSprite,
  "poke-vulpix": VulpixSprite,
  "poke-growlithe": GrowlitheSprite,
  "poke-totodile": TotodileSprite,
  "poke-hoppip": HoppipSprite,
  "poke-wooper": WooperSprite,
  "poke-mudkip": MudkipSprite,
  "poke-trapinch": TrapinchSprite,
  "poke-cacnea": CacneaSprite,
  "poke-turtwig": TurtwigSprite,
  "poke-shinx": ShinxSprite,
  "poke-budew": BudewSprite,
  "poke-sandile": SandileSprite,
  "poke-zorua": ZoruaSprite,
  "poke-litwick": LitwickSprite,
  "poke-delphox": DelphoxSprite,
  "poke-greninja": GreninjaSprite,
  "poke-yveltal": YveltalSprite,
  "poke-primarina": PrimarinaSprite,
  "poke-golisopod": GolisopodSprite,
  "poke-mimikyu": MimikyuSprite,
  "poke-dragapult": DragapultSprite,
  "poke-zamazenta": ZamazentaSprite,
  "poke-regidrago": RegidragoSprite,
  "poke-great_tusk": GreatTuskSprite,
  "poke-iron_treads": IronTreadsSprite,
  "poke-roaring_moon": RoaringMoonSprite,
};

/**
 * characters.png — GBA-style trainer sheets stacked vertically.
 * The variant order is centralized in `@/lib/trainer-assets` so overworld and
 * dialogue sprites cannot drift apart.
 */
// characters.png stores four direction rows per trainer in this physical order:
// down, left, right, up. Keeping this map explicit prevents side/back poses
// from being shown when an NPC changes direction.
const TRAINER_DIR_INDEX: Record<Dir, number> = { down: 0, left: 1, right: 2, up: 3 };
const TRAINER_FRAMES_PER_DIRECTION = 4;
// characters.png is 128x2304 and contains 12 trainer blocks.
// Each block is 4 direction rows × 4 walking frames.
// The Lucas standalone asset is only 32x48 (one pose), so the protagonist uses
// Red (the first, fully animated block) as the stable fallback requested for the demo.
const PLAYER_TRAINER_VARIANT = 0;
const WALK_ANIMATION_FPS = 8;

const trainerFrame = (variant: number, dir: Dir, walkFrame = 0) =>
  ((Math.abs(variant) % TRAINER_VARIANTS) * 4 + TRAINER_DIR_INDEX[dir]) *
    TRAINER_FRAMES_PER_DIRECTION +
  (Math.abs(walkFrame) % TRAINER_FRAMES_PER_DIRECTION);

const npcTrainerVariant = (id: number, npcId?: string) =>
  npcId && TRAINER_VARIANT_BY_ID[npcId] !== undefined
    ? TRAINER_VARIANT_BY_ID[npcId]
    : Math.abs(id) % TRAINER_VARIANTS;

/** minimal structural types so we can mutate kaplay objects with strict TS */
type LeafObj = { width: number; pos: { x: number; y: number } };
type PlayerObj = {
  pos: { x: number; y: number };
  frame: number;
  facing: Dir;
  step: number;
  walkAnimTime: number;
  z: number;
};

/** Desert Oasis palette */
const PALETTE: Record<string, [number, number, number]> = {
  s: [234, 213, 165], // warm desert sand
  p: [214, 182, 142], // sandstone paved street
  w: [56, 160, 220], // oasis lake water
  W: [110, 200, 242], // waterfall
  C: [176, 80, 52], // canyon red cliff rock
  D: [186, 140, 96], // wooden pier / dock
  P: [234, 213, 165], // palm tree ground
  X: [234, 213, 165], // cactus ground
  x: [234, 213, 165], // small cactus ground
  F: [214, 182, 142], // planter ground
  H: [136, 92, 58], // vegetable farm soil
  h: [234, 213, 165], // fence ground
  K: [234, 213, 165], // campfire ground
  S: [234, 213, 165], // monument ground
  Y: [234, 213, 165], // training dummy ground
  L: [214, 182, 142], // streetlamp ground
  B: [234, 213, 165], // building base
  g: [124, 190, 148], // grass
  ".": [238, 224, 196], // indoor wooden floor
  V: [150, 116, 92], // indoor back wall
  E: [214, 72, 72], // indoor exit mat
  i: [198, 154, 108], // warm indoor wood
  q: [198, 190, 174], // warm neutral indoor tile
  r: [148, 86, 74], // interior rug
};

export function createGame(root: HTMLElement, cb: GameCallbacks): GameHandle {
  // Own the canvas so it always fills the React container instead of the window.
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.outline = "none";
  canvas.tabIndex = 0;
  root.appendChild(canvas);
  canvas.addEventListener("pointerdown", () => canvas.focus());
  requestAnimationFrame(() => canvas.focus());

  const k: KAPLAYCtx = kaplay({
    canvas,
    width: 960,
    height: 540,
    background: [36, 26, 22],
    global: false,
    crisp: true,
    pixelDensity: 1,
    stretch: true,
    letterbox: true,
    debug: false,
    focus: false,
  });

  for (const [name, src] of Object.entries(SPRITES)) k.loadSprite(name, src);
  k.loadSprite("trainer-chars", trainerOverworldAtlas, { sliceX: 4, sliceY: TRAINER_VARIANTS * 4 });
  k.loadSprite("door-modern", doorModernSprite);
  k.loadSprite("door-wood", doorWoodSprite);
  k.loadSprite("terrain-sand", desertSandTile);
  k.loadSprite("terrain-brick", desertBrickTile);

  const state = {
    paused: false,
    transitioning: false,
    dir: null as Dir | null,
    facing: "down" as Dir,
    interact: null as null | (() => void),
    lastPromptKey: "" as string,
  };

  type WaterVisual = {
    obj: MutableVisual & { opacity?: number };
    kind: "foamX" | "foamY" | "wave" | "ripple" | "glint";
    baseX: number;
    baseY: number;
    phase: number;
    baseOpacity?: number;
    speed?: number;
  };
  type WaterfallVisual = {
    obj: MutableVisual & { opacity?: number };
    kind: "stream" | "mist";
    baseX: number;
    baseY: number;
    phase: number;
  };
  type FireVisual = {
    flame: MutableVisual;
    core?: MutableVisual;
    spark?: MutableVisual & { opacity?: number };
    baseY: number;
    coreY?: number;
    phase: number;
    kind: "tile" | "furniture";
  };
  const waterVisuals: WaterVisual[] = [];
  const waterfallVisuals: WaterfallVisual[] = [];
  const fireVisuals: FireVisual[] = [];
  let waterTick = 0;
  let activeInteriorStyleKey: Exclude<SceneId, "city"> = "home";

  const INTERIOR_STYLES: Record<
    Exclude<SceneId, "city">,
    {
      wall: [number, number, number];
      wallTop: [number, number, number];
      wallLine: [number, number, number];
      floor: [number, number, number];
      floorAlt: [number, number, number];
      trim: [number, number, number];
    }
  > = {
    home: {
      wall: [104, 72, 54],
      wallTop: [164, 112, 76],
      wallLine: [74, 52, 42],
      floor: [229, 205, 165],
      floorAlt: [216, 188, 148],
      trim: [178, 126, 78],
    },
    lab: {
      wall: [62, 86, 88],
      wallTop: [102, 134, 132],
      wallLine: [38, 58, 61],
      floor: [203, 206, 196],
      floorAlt: [181, 190, 184],
      trim: [106, 156, 150],
    },
    arena: {
      wall: [96, 54, 48],
      wallTop: [156, 84, 62],
      wallLine: [58, 34, 32],
      floor: [217, 190, 174],
      floorAlt: [198, 162, 146],
      trim: [174, 100, 70],
    },
    shop: {
      wall: [174, 126, 82],
      wallTop: [228, 182, 120],
      wallLine: [110, 76, 52],
      floor: [236, 218, 184],
      floorAlt: [220, 198, 162],
      trim: [190, 140, 88],
    },
    inn: {
      wall: [132, 74, 58],
      wallTop: [196, 112, 80],
      wallLine: [76, 44, 38],
      floor: [230, 202, 166],
      floorAlt: [213, 177, 141],
      trim: [176, 96, 62],
    },
    workshop: {
      wall: [58, 68, 72],
      wallTop: [96, 112, 112],
      wallLine: [34, 40, 44],
      floor: [197, 201, 196],
      floorAlt: [175, 182, 180],
      trim: [88, 120, 118],
    },
    pokecenter: {
      wall: [116, 104, 92],
      wallTop: [210, 198, 174],
      wallLine: [72, 64, 58],
      floor: [222, 214, 198],
      floorAlt: [203, 194, 176],
      trim: [128, 156, 176],
    },
    credits: {
      wall: [66, 78, 58],
      wallTop: [122, 136, 92],
      wallLine: [38, 46, 34],
      floor: [225, 208, 170],
      floorAlt: [208, 185, 142],
      trim: [172, 134, 74],
    },
  };

  function rgb(ch: string) {
    const c = PALETTE[ch] ?? PALETTE["s"]!;
    return k.rgb(c[0], c[1], c[2]);
  }

  /** stable per-tile pseudo random so the texture never flickers */
  const noise = (col: number, row: number, salt = 0) => {
    const n = Math.sin((col * 127.1 + row * 311.7 + salt * 74.7) * 43758.5453);
    return n - Math.floor(n);
  };

  function drawTile(ch: string, col: number, row: number, rows?: string[]) {
    const px = col * TILE;
    const py = row * TILE;
    const dot = (x: number, y: number, w: number, h: number, c: [number, number, number], z = 1) =>
      k.add([k.rect(w, h), k.pos(px + x, py + y), k.color(c[0], c[1], c[2]), k.z(z)]);

    // Base background tile
    k.add([k.rect(TILE, TILE), k.pos(px, py), k.color(rgb(ch)), k.z(0)]);

    // Terrain sprites are already textured. Keep only a sparse procedural accent
    // on a subset of tiles so the map remains detailed without creating thousands
    // of extra draw objects.
    if (ch === "s") {
      k.add([k.sprite("terrain-sand"), k.pos(px + TILE / 2, py + TILE / 2), k.z(0)]);
      if ((col * 7 + row * 11) % 5 === 0) {
        dot(7 + ((col + row) % 8), 8 + ((col * 3 + row) % 8), 4, 2, [222, 196, 148], 1);
      }
      return;
    }
    if (ch === "p") {
      k.add([k.sprite("terrain-brick"), k.pos(px + TILE / 2, py + TILE / 2), k.z(1)]);
      if ((col + row) % 3 === 0) {
        dot(6 + ((col * 5 + row) % 10), 8 + ((row * 3 + col) % 8), 5, 2, [198, 164, 124], 2);
      }
      return;
    }

    // Desert sand texture
    if (
      ch === "s" ||
      ch === "P" ||
      ch === "X" ||
      ch === "x" ||
      ch === "h" ||
      ch === "B" ||
      ch === "K" ||
      ch === "S" ||
      ch === "Y"
    ) {
      const n = noise(col, row, 11);
      // Subtle dune shading
      if ((col + row) % 2 === 0) dot(0, 0, TILE, TILE, [238, 218, 172], 0);
      dot(2 + Math.floor(n * 20), 4 + Math.floor(n * 16), 5, 2, [222, 196, 148]);
      dot(16 - Math.floor(n * 10), 18 + Math.floor(n * 8), 4, 2, [246, 230, 190]);
      if (n > 0.8) {
        // Desert pebble
        dot(12, 14, 5, 3, [192, 168, 126], 1);
        dot(12, 14, 5, 1, [238, 220, 186], 2);
      }
    }

    // Sandstone paved pathways
    if (ch === "p" || ch === "L" || ch === "F") {
      const n = noise(col, row, 3);
      dot(0, 0, TILE, 2, [188, 154, 116], 1);
      dot(0, 0, 2, TILE, [188, 154, 116], 1);
      dot(TILE - 2, 0, 2, TILE, [236, 206, 172], 1);
      dot(0, TILE - 2, TILE, 2, [236, 206, 172], 1);
      // Paver stone texture
      dot(4 + Math.floor(n * 14), 6 + Math.floor(n * 10), 6, 4, [198, 164, 124]);
      dot(18 - Math.floor(n * 10), 18, 5, 3, [228, 198, 160]);
    }

    // Canyon rock cliff
    if (ch === "C") {
      // Layered sedimentary cliff strata
      dot(0, 0, TILE, 6, [142, 60, 40], 2);
      dot(0, 6, TILE, 8, [196, 94, 62], 2);
      dot(0, 14, TILE, 7, [164, 74, 48], 2);
      dot(0, 21, TILE, 11, [122, 50, 32], 2);
      // Rock highlight cracks
      const n = noise(col, row, 7);
      dot(3 + Math.floor(n * 16), 4, 10, 2, [220, 120, 84], 3);
      dot(12, 12, 8, 2, [142, 60, 40], 3);
      dot(6 + Math.floor(n * 12), 22, 12, 2, [98, 38, 24], 3);
    }

    // Dynamic Oasis Lake Water with realistic physics, waves, ripples, glints & shoreline foam
    if (ch === "w") {
      // Depth gradient base
      dot(0, 0, TILE, TILE, [36, 138, 204], 1);
      dot(2, 2, TILE - 4, TILE - 4, [48, 158, 222], 1);

      // Check shoreline edges against neighboring grid cells
      const isShoreN =
        rows &&
        rows[row - 1]?.[col] !== "w" &&
        rows[row - 1]?.[col] !== "W" &&
        rows[row - 1]?.[col] !== "D";
      const isShoreS =
        rows &&
        rows[row + 1]?.[col] !== "w" &&
        rows[row + 1]?.[col] !== "W" &&
        rows[row + 1]?.[col] !== "D";
      const isShoreW =
        rows &&
        rows[row]?.[col - 1] !== "w" &&
        rows[row]?.[col - 1] !== "W" &&
        rows[row]?.[col - 1] !== "D";
      const isShoreE =
        rows &&
        rows[row]?.[col + 1] !== "w" &&
        rows[row]?.[col + 1] !== "W" &&
        rows[row]?.[col + 1] !== "D";

      // Animated Shoreline Foaming Waves
      if (isShoreN) {
        const foamN = k.add([
          k.rect(TILE, 4),
          k.pos(px, py),
          k.color(240, 252, 255),
          k.opacity(0.85),
          k.z(3),
        ]) as unknown as { pos: { y: number }; opacity: number };
        waterVisuals.push({
          obj: foamN,
          kind: "foamY",
          baseX: px,
          baseY: py,
          phase: col * 0.8,
          baseOpacity: 0.5,
          speed: 2.5,
        });
      }
      if (isShoreS) {
        const foamS = k.add([
          k.rect(TILE, 4),
          k.pos(px, py + TILE - 4),
          k.color(240, 252, 255),
          k.opacity(0.85),
          k.z(3),
        ]) as unknown as { pos: { y: number }; opacity: number };
        waterVisuals.push({
          obj: foamS,
          kind: "foamY",
          baseX: px,
          baseY: py + TILE - 4,
          phase: col * 0.8 + Math.PI,
          baseOpacity: 0.5,
          speed: 2.5,
        });
      }
      if (isShoreW) {
        const foamW = k.add([
          k.rect(4, TILE),
          k.pos(px, py),
          k.color(240, 252, 255),
          k.opacity(0.85),
          k.z(3),
        ]) as unknown as { pos: { x: number }; opacity: number };
        waterVisuals.push({
          obj: foamW,
          kind: "foamX",
          baseX: px,
          baseY: py,
          phase: row * 0.8,
          baseOpacity: 0.5,
          speed: 2.5,
        });
      }
      if (isShoreE) {
        const foamE = k.add([
          k.rect(4, TILE),
          k.pos(px + TILE - 4, py),
          k.color(240, 252, 255),
          k.opacity(0.85),
          k.z(3),
        ]) as unknown as { pos: { x: number }; opacity: number };
        waterVisuals.push({
          obj: foamE,
          kind: "foamX",
          baseX: px + TILE - 4,
          baseY: py,
          phase: row * 0.8 + Math.PI,
          baseOpacity: 0.5,
          speed: 2.5,
        });
      }

      // Multi-frequency surface wave bands
      const waveA = k.add([
        k.rect(14, 2, { radius: 1 }),
        k.pos(px + 4, py + 8),
        k.color(196, 244, 255),
        k.z(2),
        k.opacity(0.75),
      ]) as unknown as { pos: { x: number } };
      const waveB = k.add([
        k.rect(10, 2, { radius: 1 }),
        k.pos(px + 16, py + 20),
        k.color(140, 222, 255),
        k.z(2),
        k.opacity(0.6),
      ]) as unknown as { pos: { x: number } };
      const ox = px + 4;
      const oxB = px + 16;
      waterVisuals.push(
        { obj: waveA, kind: "wave", baseX: ox, baseY: py + 8, phase: col * 1.5, speed: 2.0 },
        {
          obj: waveB,
          kind: "wave",
          baseX: oxB,
          baseY: py + 20,
          phase: row * 1.5 + Math.PI / 2,
          speed: 1.7,
        },
      );

      // Sparse static sunlight glints keep the lake lively without creating
      // one additional animated object per water tile.
      if ((col + row) % 4 === 0) {
        const glintX = px + ((col * 13 + row * 7) % 20) + 6;
        const glintY = py + ((col * 7 + row * 19) % 18) + 6;
        k.add([
          k.rect(2, 2),
          k.pos(glintX, glintY),
          k.color(255, 255, 255),
          k.opacity(0.7),
          k.z(3),
        ]);
      }
    }

    // Realistic Waterfall with vertical rushing streams and spray mist
    if (ch === "W") {
      dot(0, 0, TILE, TILE, [62, 168, 230], 2);
      // Rushing vertical streams
      const s1 = k.add([
        k.rect(4, TILE),
        k.pos(px + 4, py),
        k.color(220, 248, 255),
        k.opacity(0.8),
        k.z(3),
      ]) as unknown as { pos: { y: number } };
      const s2 = k.add([
        k.rect(5, TILE),
        k.pos(px + 14, py),
        k.color(240, 254, 255),
        k.opacity(0.9),
        k.z(3),
      ]) as unknown as { pos: { y: number } };
      const s3 = k.add([
        k.rect(4, TILE),
        k.pos(px + 24, py),
        k.color(220, 248, 255),
        k.opacity(0.8),
        k.z(3),
      ]) as unknown as { pos: { y: number } };
      waterfallVisuals.push(
        { obj: s1, kind: "stream", baseX: px + 4, baseY: py, phase: 0 },
        { obj: s2, kind: "stream", baseX: px + 14, baseY: py, phase: 6 },
        { obj: s3, kind: "stream", baseX: px + 24, baseY: py, phase: 3 },
      );
      // Bottom splash mist
      const mist = k.add([
        k.rect(TILE + 4, 8, { radius: 3 }),
        k.scale(1),
        k.pos(px - 2, py + TILE - 8),
        k.color(250, 254, 255),
        k.opacity(0.85),
        k.z(4),
      ]) as unknown as { scale: { x: number; y: number }; opacity: number };
      waterfallVisuals.push({
        obj: mist,
        kind: "mist",
        baseX: px - 2,
        baseY: py + TILE - 8,
        phase: col,
      });
    }

    // Wooden Pier / Dock
    if (ch === "D") {
      k.add([k.rect(TILE, 4), k.pos(px, py + 2), k.color(160, 114, 76), k.z(4)]);
      k.add([k.rect(TILE, 4), k.pos(px, py + 10), k.color(160, 114, 76), k.z(4)]);
      k.add([k.rect(TILE, 4), k.pos(px, py + 18), k.color(160, 114, 76), k.z(4)]);
      k.add([k.rect(TILE, 4), k.pos(px, py + 26), k.color(160, 114, 76), k.z(4)]);
      k.add([k.rect(4, TILE), k.pos(px + 2, py), k.color(118, 80, 52), k.z(5)]);
      k.add([k.rect(4, TILE), k.pos(px + TILE - 6, py), k.color(118, 80, 52), k.z(5)]);
    }

    // Palm Tree
    if (ch === "P") {
      // Curved trunk
      k.add([k.rect(8, 18, { radius: 2 }), k.pos(px + 12, py + 14), k.color(138, 98, 66), k.z(5)]);
      k.add([k.rect(6, 4), k.pos(px + 13, py + 18), k.color(108, 74, 48), k.z(6)]);
      k.add([k.rect(6, 4), k.pos(px + 13, py + 26), k.color(108, 74, 48), k.z(6)]);
      // Coconuts
      k.add([k.circle(4), k.pos(px + 13, py + 13), k.color(92, 60, 36), k.z(7)]);
      k.add([k.circle(4), k.pos(px + 18, py + 13), k.color(92, 60, 36), k.z(7)]);
      // Palm fronds
      k.add([k.circle(15), k.pos(px + 16, py + 8), k.color(44, 138, 74), k.z(8)]);
      k.add([k.circle(12), k.pos(px + 14, py + 6), k.color(68, 168, 96), k.z(9)]);
      k.add([k.circle(6), k.pos(px + 11, py + 4), k.color(112, 204, 136), k.z(10)]);
    }

    // Tall Saguaro Cactus
    if (ch === "X") {
      // Main central trunk
      k.add([k.rect(10, 24, { radius: 3 }), k.pos(px + 11, py + 7), k.color(48, 136, 78), k.z(6)]);
      k.add([k.rect(4, 24), k.pos(px + 14, py + 7), k.color(68, 168, 98), k.z(7)]);
      // Left arm
      k.add([k.rect(6, 4), k.pos(px + 5, py + 16), k.color(48, 136, 78), k.z(6)]);
      k.add([k.rect(5, 10, { radius: 2 }), k.pos(px + 4, py + 8), k.color(48, 136, 78), k.z(6)]);
      // Right arm
      k.add([k.rect(6, 4), k.pos(px + 21, py + 13), k.color(48, 136, 78), k.z(6)]);
      k.add([k.rect(5, 12, { radius: 2 }), k.pos(px + 23, py + 3), k.color(48, 136, 78), k.z(6)]);
      // Flower bloom on top
      k.add([k.circle(3), k.pos(px + 16, py + 6), k.color(248, 208, 88), k.z(8)]);
    }

    // Small Prickly Cactus
    if (ch === "x") {
      k.add([k.circle(8), k.pos(px + 16, py + 20), k.color(52, 142, 82), k.z(6)]);
      k.add([k.circle(5), k.pos(px + 11, py + 15), k.color(44, 128, 72), k.z(6)]);
      k.add([k.circle(3), k.pos(px + 16, py + 12), k.color(248, 112, 136), k.z(7)]);
    }

    // Flower Planters
    if (ch === "F") {
      k.add([k.rect(26, 12, { radius: 2 }), k.pos(px + 3, py + 16), k.color(164, 118, 78), k.z(5)]);
      k.add([k.rect(22, 6), k.pos(px + 5, py + 14), k.color(78, 52, 34), k.z(6)]);
      // Colorful flowers
      k.add([k.circle(4), k.pos(px + 8, py + 12), k.color(242, 98, 132), k.z(7)]);
      k.add([k.circle(4), k.pos(px + 16, py + 10), k.color(248, 218, 92), k.z(7)]);
      k.add([k.circle(4), k.pos(px + 24, py + 12), k.color(132, 184, 248), k.z(7)]);
    }

    // Vegetable Farm Plot
    if (ch === "H") {
      k.add([k.rect(TILE, TILE), k.pos(px, py), k.color(112, 74, 46), k.z(2)]);
      // Tilled furrow
      k.add([k.rect(TILE, 6), k.pos(px, py + 4), k.color(88, 56, 34), k.z(3)]);
      k.add([k.rect(TILE, 6), k.pos(px, py + 18), k.color(88, 56, 34), k.z(3)]);
      // Fresh leafy crops
      k.add([k.circle(4), k.pos(px + 6, py + 7), k.color(68, 178, 92), k.z(4)]);
      k.add([k.circle(4), k.pos(px + 16, py + 7), k.color(68, 178, 92), k.z(4)]);
      k.add([k.circle(4), k.pos(px + 26, py + 7), k.color(68, 178, 92), k.z(4)]);
      k.add([k.circle(4), k.pos(px + 11, py + 21), k.color(78, 196, 104), k.z(4)]);
      k.add([k.circle(4), k.pos(px + 21, py + 21), k.color(78, 196, 104), k.z(4)]);
    }

    // Wooden Fence
    if (ch === "h") {
      k.add([k.rect(TILE, 4), k.pos(px, py + 10), k.color(178, 134, 92), k.z(5)]);
      k.add([k.rect(TILE, 4), k.pos(px, py + 20), k.color(178, 134, 92), k.z(5)]);
      k.add([k.rect(5, 24), k.pos(px + 4, py + 5), k.color(138, 98, 62), k.z(6)]);
      k.add([k.rect(5, 24), k.pos(px + 22, py + 5), k.color(138, 98, 62), k.z(6)]);
    }

    // Open Wooden Fence Gate (walkable, clearly drawn with swinging gates open)
    if (ch === "o") {
      // Left gate post & open swinging gate door
      k.add([k.rect(5, 26), k.pos(px + 1, py + 4), k.color(138, 98, 62), k.z(6)]);
      k.add([k.rect(9, 4), k.pos(px + 2, py + 8), k.color(178, 134, 92), k.z(6)]);
      k.add([k.rect(9, 4), k.pos(px + 2, py + 18), k.color(178, 134, 92), k.z(6)]);
      // Right gate post & open swinging gate door
      k.add([k.rect(5, 26), k.pos(px + 26, py + 4), k.color(138, 98, 62), k.z(6)]);
      k.add([k.rect(9, 4), k.pos(px + 21, py + 8), k.color(178, 134, 92), k.z(6)]);
      k.add([k.rect(9, 4), k.pos(px + 21, py + 18), k.color(178, 134, 92), k.z(6)]);
      // Smooth open threshold stone path underneath
      k.add([
        k.rect(TILE - 6, 4, { radius: 1 }),
        k.pos(px + 3, py + 24),
        k.color(212, 182, 140),
        k.z(3),
      ]);
    }

    // Streetlamp with Red Banner
    if (ch === "L") {
      k.add([k.rect(4, 26), k.pos(px + 14, py + 5), k.color(52, 54, 64), k.z(6)]);
      k.add([k.rect(12, 3), k.pos(px + 10, py + 30), k.color(40, 42, 50), k.z(7)]);
      // Glowing Lantern
      k.add([
        k.rect(12, 10, { radius: 2 }),
        k.pos(px + 10, py + 2),
        k.color(252, 234, 136),
        k.outline(2, k.rgb(46, 48, 56)),
        k.z(8),
      ]);
      // Red celebratory banner hanging
      k.add([k.rect(6, 14), k.pos(px + 19, py + 8), k.color(214, 64, 64), k.z(7)]);
      k.add([k.rect(6, 2), k.pos(px + 19, py + 14), k.color(248, 222, 94), k.z(8)]);
    }

    // Ancient Stone Monument
    if (ch === "S") {
      k.add([
        k.rect(26, 10, { radius: 2 }),
        k.pos(px + 3, py + 20),
        k.color(138, 142, 154),
        k.z(6),
      ]);
      k.add([k.rect(18, 16, { radius: 3 }), k.pos(px + 7, py + 6), k.color(172, 178, 192), k.z(7)]);
      // Golden carving / emblem
      k.add([k.circle(4), k.pos(px + 16, py + 13), k.color(248, 214, 92), k.z(8)]);
    }

    // Training Sparring Dummy
    if (ch === "Y") {
      k.add([k.rect(6, 22), k.pos(px + 13, py + 9), k.color(128, 92, 60), k.z(6)]);
      k.add([k.rect(16, 14, { radius: 3 }), k.pos(px + 8, py + 6), k.color(186, 142, 96), k.z(7)]);
      // Red Target ring
      k.add([k.circle(4), k.pos(px + 16, py + 13), k.color(224, 64, 64), k.z(8)]);
    }

    // Campfire / Torch Brazier
    if (ch === "K") {
      k.add([k.circle(10), k.pos(px + 16, py + 22), k.color(92, 88, 94), k.z(5)]);
      k.add([k.rect(14, 4), k.pos(px + 9, py + 20), k.color(112, 78, 50), k.z(6)]);
      // Animated Flickering Fire Flame
      const flame = k.add([
        k.rect(8, 12, { radius: 3 }),
        k.pos(px + 12, py + 11),
        k.color(248, 148, 42),
        k.z(7),
      ]) as unknown as { pos: { y: number } };
      const core = k.add([
        k.rect(4, 7, { radius: 2 }),
        k.pos(px + 14, py + 14),
        k.color(255, 234, 112),
        k.z(8),
      ]) as unknown as { pos: { y: number } };
      fireVisuals.push({
        flame,
        core,
        baseY: py + 11,
        coreY: py + 14,
        phase: col * 0.7 + row * 0.31,
        kind: "tile",
      });
    }

    // Interior walls/floors use dry plaster, wood and stone tones rather than blue water-like tiles.
    if (ch === "V") {
      const style = INTERIOR_STYLES[activeInteriorStyleKey];
      k.add([
        k.rect(TILE, TILE),
        k.pos(px, py),
        k.color(style.wall[0], style.wall[1], style.wall[2]),
        k.z(1),
      ]);
      k.add([
        k.rect(TILE, 5),
        k.pos(px, py),
        k.color(style.wallTop[0], style.wallTop[1], style.wallTop[2]),
        k.z(2),
      ]);
      k.add([
        k.rect(TILE, 2),
        k.pos(px, py + 27),
        k.color(style.wallLine[0], style.wallLine[1], style.wallLine[2]),
        k.z(2),
      ]);
      k.add([
        k.rect(3, 22),
        k.pos(px + 5, py + 5),
        k.color(style.trim[0], style.trim[1], style.trim[2]),
        k.z(3),
      ]);
      k.add([
        k.rect(18, 2),
        k.pos(px + 10, py + 10),
        k.color(style.wallLine[0], style.wallLine[1], style.wallLine[2]),
        k.z(3),
      ]);

      // Small upper-wall windows make interiors read like rooms rather than
      // flat colored boxes. They use the current room palette, so each scene
      // keeps its own identity without importing another tileset.
      if (row === 1 && (col === 4 || col === 9 || col === 14)) {
        k.add([
          k.rect(TILE - 6, 16, { radius: 1 }),
          k.pos(px + 3, py + 8),
          k.color(style.wallLine[0], style.wallLine[1], style.wallLine[2]),
          k.z(4),
        ]);
        k.add([
          k.rect(TILE - 10, 12, { radius: 1 }),
          k.pos(px + 5, py + 10),
          k.color(style.floor[0], style.floor[1], style.floor[2]),
          k.opacity(0.72),
          k.z(5),
        ]);
        k.add([
          k.rect(2, 12),
          k.pos(px + 15, py + 10),
          k.color(style.trim[0], style.trim[1], style.trim[2]),
          k.z(6),
        ]);
      }
    }

    if (ch === "q" || ch === "i") {
      const style = INTERIOR_STYLES[activeInteriorStyleKey];
      k.add([
        k.rect(TILE, TILE),
        k.pos(px, py),
        k.color(
          (ch === "q" ? style.floor : style.floorAlt)[0],
          (ch === "q" ? style.floor : style.floorAlt)[1],
          (ch === "q" ? style.floor : style.floorAlt)[2],
        ),
        k.z(1),
      ]);
      k.add([
        k.rect(TILE - 2, 1),
        k.pos(px + 1, py + 3),
        k.color(style.trim[0], style.trim[1], style.trim[2]),
        k.opacity(0.22),
        k.z(2),
      ]);
      k.add([
        k.rect(1, TILE - 6),
        k.pos(px + 5, py + 5),
        k.color(style.trim[0], style.trim[1], style.trim[2]),
        k.opacity(0.18),
        k.z(2),
      ]);

      // Sparse plank/tile seams give the floor the handcrafted look of the
      // reference while remaining cheap: two tiny primitives per tile.
      if (ch === "i") {
        k.add([
          k.rect(TILE - 8, 1),
          k.pos(px + 4, py + 14),
          k.color(style.trim[0], style.trim[1], style.trim[2]),
          k.opacity(0.18),
          k.z(2),
        ]);
      } else {
        k.add([
          k.rect(TILE - 8, 1),
          k.pos(px + 4, py + 14),
          k.color(style.trim[0], style.trim[1], style.trim[2]),
          k.opacity(0.12),
          k.z(2),
        ]);
      }
    }
    // Authentic indoor exit threshold & exterior sunlight spill (tile 'E')
    if (ch === "E") {
      // Sandstone door threshold frame
      k.add([k.rect(TILE, 6), k.pos(px, py + 26), k.color(196, 164, 124), k.z(2)]);
      k.add([k.rect(TILE - 4, 3), k.pos(px + 2, py + 28), k.color(158, 126, 92), k.z(3)]);
      // Gentle sunbeam coming from outside through the open entrance
      k.add([
        k.rect(TILE - 6, 16),
        k.pos(px + 3, py + 10),
        k.color(255, 244, 200),
        k.opacity(0.22),
        k.z(4),
      ]);
    }
  }

  interface ActiveNpc {
    item: Interactable;
    trainerVariant: number;
    facing: Dir;
    homeCol: number;
    homeRow: number;
    curCol: number;
    curRow: number;
    state: "idle" | "walking" | "talking";
    idleTimer: number;
    walkProgress: number;
    walkAnimTime: number;
    walkStep: number;
    fromX: number;
    fromY: number;
    targetX: number;
    targetY: number;
    canWander: boolean;
    spr: { frame: number; pos: { x: number; y: number }; opacity: number; z: number };
    shadow: { pos: { x: number; y: number } };
    emote: { opacity: number; pos: { x: number; y: number } };
  }

  let currentActiveNpcs: ActiveNpc[] = [];

  function drawFurniture(item: Interactable) {
    const { kind, x: col, y: row } = item;
    const px = col * TILE;
    const py = row * TILE;

    // NPCs are managed by the dynamic autonomous NPC system in scene("play")
    if (kind === "npc") {
      return;
    }

    const box = (x: number, y: number, w: number, h: number, c: [number, number, number], z = 8) =>
      k.add([
        k.rect(w, h, { radius: 2 }),
        k.pos(px + x, py + y),
        k.color(c[0], c[1], c[2]),
        k.outline(2, k.rgb(40, 34, 46)),
        k.z(z),
      ]);

    switch (kind as FurnitureKind) {
      case "pokemon": {
        const pokeKey = item.poke ? `poke-${item.poke}` : "poke-pikachu";
        const poke = item.poke || "pikachu";
        const isLarge = poke === "arcanine" || poke === "flygon";
        const isMedium =
          poke === "bulbasaur" ||
          poke === "charmander" ||
          poke === "machop" ||
          poke === "psyduck" ||
          poke === "chansey";
        const baseScale = isLarge ? 1.1 : isMedium ? 0.95 : 0.85;

        // Proportional soft pixel drop-shadow under the Pokémon
        k.add([
          k.rect(isLarge ? 36 : isMedium ? 26 : 20, isLarge ? 11 : isMedium ? 8 : 6, {
            radius: 4,
          }),
          k.anchor("center"),
          k.pos(px + 16, py + (isLarge ? 28 : 25)),
          k.color(28, 20, 16),
          k.opacity(0.38),
          k.z(10),
        ]);

        // Pokemon sprite: high-visibility GBA sprite scaled with gentle idle bobbing
        const spr = k.add([
          k.sprite(pokeKey, { frame: 0 }),
          k.anchor("center"),
          k.pos(px + 16, py + (isLarge ? 12 : 15)),
          k.scale(baseScale),
          k.z(12),
        ]) as unknown as { pos: { y: number; x: number }; scale: { x: number; y: number } };

        break;
      }
      case "campfire": {
        // Campfire with stone ring and flickering flame + rising spark particles
        box(6, 16, 20, 10, [104, 100, 106]);
        box(8, 14, 16, 6, [124, 82, 54], 9);
        const flame = k.add([
          k.rect(10, 15, { radius: 4 }),
          k.pos(px + 11, py + 4),
          k.color(248, 128, 36),
          k.z(11),
        ]) as unknown as { pos: { y: number } };
        k.add([k.circle(3), k.pos(px + 16, py + 12), k.color(255, 238, 116), k.z(12)]);
        const spark = k.add([
          k.rect(2, 2),
          k.pos(px + 15, py + 6),
          k.color(255, 230, 90),
          k.z(13),
        ]) as unknown as { pos: { y: number; x: number }; opacity: number };
        fireVisuals.push({
          flame,
          spark,
          baseY: py + 4,
          phase: col * 0.6 + row * 0.4,
          kind: "furniture",
        });
        break;
      }
      case "tent": {
        // Enlarged 2×2-tile camping tent for the oasis rest area.
        box(-4, 30, 72, 26, [112, 72, 46], 6);
        box(-2, 10, 68, 28, [190, 70, 52], 7);
        box(4, 2, 56, 14, [238, 148, 84], 8);
        box(16, 16, 32, 40, [54, 34, 28], 8);
        box(22, 18, 20, 38, [86, 54, 40], 9);
        box(4, 40, 56, 4, [234, 178, 102], 9);
        box(-8, 46, 6, 6, [138, 96, 62], 8);
        box(66, 46, 6, 6, [138, 96, 62], 8);
        break;
      }
      case "brazier": {
        // Ceremonial flaming brazier
        box(10, 18, 12, 14, [118, 114, 124], 7);
        box(6, 12, 20, 8, [168, 124, 76], 8);
        const bFlame = k.add([
          k.rect(8, 12, { radius: 3 }),
          k.pos(px + 12, py + 3),
          k.color(248, 136, 38),
          k.z(9),
        ]) as unknown as { pos: { y: number } };
        k.add([k.circle(3), k.pos(px + 16, py + 8), k.color(255, 240, 120), k.z(10)]);
        // Static brazier flame avoids another per-object animation callback.
        break;
      }
      case "fountain": {
        // Larger lakeside fountain with stone rim, blue basin and a static sparkle.
        box(-2, 2, 36, 30, [132, 140, 154], 6);
        box(2, 5, 28, 24, [188, 194, 204], 7);
        box(6, 9, 20, 16, [56, 168, 228], 8);
        box(10, 11, 12, 12, [76, 188, 236], 9);
        k.add([k.circle(3), k.pos(px + 16, py + 15), k.color(240, 252, 255), k.z(10)]);
        k.add([k.rect(6, 2), k.pos(px + 13, py + 8), k.color(208, 248, 255), k.z(10)]);
        break;
      }
      case "computer": {
        // Dev Workshop workstation with dual monitors
        box(1, 10, 30, 8, [136, 96, 64]);
        box(3, 16, 4, 12, [110, 76, 48]);
        box(25, 16, 4, 12, [110, 76, 48]);
        // Left Monitor (IDE with glowing code lines)
        box(3, 1, 12, 10, [46, 52, 68], 9);
        k.add([k.rect(10, 6), k.pos(px + 4, py + 3), k.color(44, 144, 218), k.z(10)]);
        // Right Monitor (Terminal with green status)
        box(17, 1, 12, 10, [46, 52, 68], 9);
        k.add([k.rect(10, 6), k.pos(px + 18, py + 3), k.color(52, 198, 116), k.z(10)]);
        break;
      }
      case "monument": {
        box(2, 16, 28, 12, [142, 146, 158]);
        box(6, 4, 20, 14, [178, 184, 196], 9);
        k.add([k.circle(5), k.pos(px + 16, py + 10), k.color(246, 212, 88), k.z(10)]);
        break;
      }
      case "dummy": {
        box(13, 12, 6, 18, [138, 98, 66]);
        box(7, 4, 18, 14, [198, 154, 106], 9);
        k.add([k.circle(5), k.pos(px + 16, py + 11), k.color(228, 68, 68), k.z(10)]);
        break;
      }
      case "desk":
        box(1, 12, 30, 6, [156, 112, 76]);
        box(3, 18, 5, 12, [126, 90, 60]);
        box(24, 18, 5, 12, [126, 90, 60]);
        box(8, 2, 16, 11, [72, 88, 132], 9);
        k.add([k.rect(12, 7), k.pos(px + 10, py + 4), k.color(146, 226, 202), k.z(10)]);
        break;
      case "shelf":
        box(2, 0, 28, 30, [148, 106, 72]);
        box(5, 4, 22, 5, [214, 96, 96], 9);
        box(5, 13, 22, 5, [96, 148, 214], 9);
        box(5, 22, 22, 5, [246, 206, 106], 9);
        break;
      case "plant":
        box(11, 20, 11, 11, [186, 118, 82]);
        box(6, 2, 20, 18, [72, 158, 96], 9);
        break;
      case "trophy":
        box(8, 22, 17, 9, [126, 90, 60]);
        box(13, 12, 6, 11, [244, 206, 92]);
        box(7, 2, 18, 12, [252, 222, 118], 9);
        break;
      case "counter":
        box(0, 8, TILE, 22, [178, 130, 88]);
        box(2, 4, TILE - 4, 6, [220, 178, 128], 9);
        break;
      case "painting":
        box(3, 2, 26, 22, [92, 76, 132]);
        box(6, 5, 20, 16, [156, 206, 236], 9);
        k.add([k.rect(8, 8), k.pos(px + 9, py + 10), k.color(246, 216, 120), k.z(10)]);
        break;
      case "bed":
        box(4, 2, 24, 28, [226, 226, 236]);
        box(4, 2, 24, 9, [236, 246, 252], 9);
        box(4, 18, 24, 12, [214, 96, 96], 9);
        break;
      case "rug":
        box(1, 6, 30, 20, [214, 132, 132], 2);
        break;
      case "console":
        box(4, 8, 24, 22, [72, 70, 86]);
        box(7, 11, 18, 12, [126, 226, 196], 9);
        k.add([k.rect(4, 4), k.pos(px + 22, py + 25), k.color(238, 108, 108), k.z(10)]);
        break;
      case "bench":
        box(1, 14, 30, 6, [168, 120, 76]);
        box(1, 8, 30, 5, [186, 138, 90], 9);
        box(4, 20, 4, 10, [126, 88, 56]);
        box(24, 20, 4, 10, [126, 88, 56]);
        break;
      case "well": {
        // Stone desert well: a readable landmark and a natural gathering point.
        box(3, 13, 26, 13, [142, 126, 112], 6);
        box(6, 8, 20, 8, [188, 160, 126], 7);
        box(9, 10, 14, 8, [48, 94, 116], 8);
        k.add([k.rect(20, 3), k.pos(px + 6, py + 4), k.color(116, 78, 48), k.z(9)]);
        k.add([
          k.circle(3),
          k.pos(px + 16, py + 14),
          k.color(120, 210, 236),
          k.opacity(0.75),
          k.z(10),
        ]);
        break;
      }
      case "stall": {
        // Expanded 2×2-tile market stall inspired by the credited references in CREDITS.md.
        // The local drawing keeps the project's palette and avoids redistributing third-party packs.
        box(2, 43, 60, 14, [112, 72, 46], 6);
        box(1, 7, 62, 18, [190, 62, 48], 7);
        box(5, 4, 54, 10, [231, 158, 76], 8);
        box(8, 15, 48, 16, [243, 208, 142], 8);
        box(7, 30, 10, 27, [116, 78, 50], 8);
        box(47, 30, 10, 27, [116, 78, 50], 8);
        // goods / crates under the canopy
        box(13, 31, 10, 9, [72, 116, 74], 9);
        box(26, 31, 10, 9, [184, 90, 54], 9);
        box(39, 31, 10, 9, [196, 144, 62], 9);
        k.add([k.rect(48, 3), k.pos(px + 8, py + 12), k.color(112, 50, 42), k.z(9)]);
        break;
      }
      case "rock": {
        // Low canyon stones to break up empty sand without blocking the path.
        box(5, 17, 22, 10, [122, 94, 76], 6);
        box(9, 11, 14, 9, [166, 130, 100], 7);
        box(12, 8, 8, 5, [194, 156, 116], 8);
        break;
      }
      case "banner": {
        // Decorative oasis banner adds vertical color without occupying the road.
        box(14, 5, 4, 25, [102, 72, 48], 7);
        box(8, 4, 20, 10, [194, 62, 52], 8);
        box(11, 7, 14, 4, [238, 190, 92], 9);
        break;
      }
      case "gazebo": {
        // Lakeside plaza pavilion: layered sandstone base, four wooden posts,
        // shaded roof and a readable central opening. This is a real landmark,
        // not a floating decorative rectangle.
        box(2, 23, 28, 7, [112, 78, 54], 6);
        box(4, 20, 24, 7, [178, 132, 84], 7);
        box(1, 7, 30, 15, [224, 182, 116], 8);
        box(0, 3, 32, 8, [152, 70, 46], 9);
        box(3, 1, 26, 5, [196, 98, 56], 10);
        // roof highlights / eaves
        box(5, 5, 22, 2, [238, 170, 94], 11);
        // structural posts
        for (const x of [5, 24]) {
          box(x, 10, 4, 18, [108, 74, 50], 9);
          box(x + 1, 10, 2, 18, [168, 118, 72], 10);
        }
        // central shade and entrance
        box(10, 12, 12, 9, [104, 76, 58], 8);
        box(12, 13, 8, 8, [78, 120, 124], 9);
        // two benches facing the water
        box(8, 24, 6, 3, [126, 82, 48], 10);
        box(18, 24, 6, 3, [126, 82, 48], 10);
        break;
      }
      case "table": {
        box(4, 9, 24, 12, [154, 108, 70], 7);
        box(8, 20, 5, 9, [112, 76, 48], 6);
        box(19, 20, 5, 9, [112, 76, 48], 6);
        break;
      }
      case "chair": {
        box(8, 9, 16, 7, [170, 120, 76], 7);
        box(10, 15, 12, 11, [126, 86, 54], 6);
        break;
      }
      case "planter": {
        box(5, 17, 22, 10, [156, 102, 62], 7);
        k.add([k.circle(6), k.pos(px + 9, py + 14), k.color(74, 154, 86), k.z(8)]);
        k.add([k.circle(7), k.pos(px + 17, py + 12), k.color(64, 142, 80), k.z(8)]);
        k.add([k.circle(5), k.pos(px + 24, py + 15), k.color(92, 174, 92), k.z(8)]);
        break;
      }
      case "crate": {
        box(4, 6, 24, 24, [168, 112, 66], 7);
        k.add([k.rect(20, 3), k.pos(px + 6, py + 10), k.color(110, 72, 44), k.z(8)]);
        k.add([k.rect(20, 3), k.pos(px + 6, py + 22), k.color(110, 72, 44), k.z(8)]);
        break;
      }
      case "sign":
        box(13, 14, 6, 16, [140, 100, 66], 9);
        box(2, 2, 28, 16, [196, 150, 100], 10);
        k.add([k.rect(20, 3), k.pos(px + 6, py + 7), k.color(90, 62, 40), k.z(11)]);
        k.add([k.rect(14, 3), k.pos(px + 6, py + 13), k.color(90, 62, 40), k.z(11)]);
        break;
      default:
        break;
    }
  }

  function makePlayer(pos: { x: number; y: number }, initialFacing: Dir = "down") {
    const p = k.add([
      k.sprite("trainer-chars", { frame: trainerFrame(PLAYER_TRAINER_VARIANT, initialFacing, 0) }),
      k.pos(pos.x * TILE + TILE / 2, pos.y * TILE + TILE),
      k.anchor("bot"),
      k.scale(1.0),
      k.z(30),
      { facing: initialFacing, step: 0, walkAnimTime: 0 },
      "player",
    ]);
    return p;
  }

  function isSolid(rows: string[], col: number, row: number) {
    // Sand (s) and paved ground (p) are intentionally walkable across the whole map.
    // Only explicit obstacle tiles below block the player.
    const line = rows[row];
    if (!line) return true;
    const ch = line[col];
    if (ch === undefined) return true;
    return SOLID_TILES.has(ch);
  }

  function isBuildingVisualFootprint(scene: SceneDef, col: number, row: number) {
    // Building PNGs have roof/eave overhangs above their logical map rectangle.
    // Block that visual area too, otherwise the player/NPCs can walk across a roof.
    return scene.buildings.some((building) => {
      // A porta faz parte do footprint visual do prédio, mas precisa continuar
      // realmente caminhável para que o jogador consiga entrar.
      if (col === building.door.x && row === building.door.y) return false;

      const left = building.x - 1;
      const right = building.x + building.w + (building.sprite === "home" ? 2 : 0);
      const top = Math.max(0, building.y - 2);
      const bottom = building.y + building.h;
      return col >= left && col <= right && row >= top && row <= bottom;
    });
  }

  function isPlayerMovementBlocked(scene: SceneDef, rows: string[], col: number, row: number) {
    // The protagonist has free-roam priority: decorative building overhangs are
    // visual assets, not invisible walls. This prevents the player from getting
    // snagged on roof/eave pixels while crossing the desert paths.
    return isSolid(rows, col, row);
  }

  function isRoamingBlocked(scene: SceneDef, rows: string[], col: number, row: number) {
    // Autonomous NPCs and Pokémon keep the stricter collision footprint so they
    // do not wander through buildings or disappear behind architectural sprites.
    return isSolid(rows, col, row) || (!scene.indoor && isBuildingVisualFootprint(scene, col, row));
  }

  // Active player reference for coordinate tracking
  let activePlayer: PlayerObj | null = null;

  // Active doors reference for smooth entrance animations
  let currentDoors: {
    x: number;
    y: number;
    to: SceneId;
    sign: string;
    open: number;
    apply: (open: number) => void;
  }[] = [];

  // Transition engine for authentic Pokemon-style door warps
  const transitionManager = new TransitionManager(root, 960, 540);
  let currentTransitionType: TransitionType = "iris";

  // One shared animation callback replaces dozens of per-water-tile callbacks.
  // Water still animates, but at a capped 30 FPS to keep the overworld responsive.
  k.onUpdate(() => {
    waterTick += k.dt();
    if (waterTick < 1 / 24) return;
    waterTick = 0;
    const time = k.time();
    for (const visual of waterVisuals) {
      const speed = visual.speed ?? 1;
      if (visual.kind === "foamY") {
        setPosY(visual.obj, visual.baseY + Math.sin(time * speed + visual.phase) * 1.5);
        visual.obj.opacity =
          (visual.baseOpacity ?? 0.5) + Math.sin(time * speed + visual.phase) * 0.35;
      } else if (visual.kind === "foamX") {
        setPosX(visual.obj, visual.baseX + Math.sin(time * speed + visual.phase) * 1.5);
        visual.obj.opacity =
          (visual.baseOpacity ?? 0.5) + Math.sin(time * speed + visual.phase) * 0.35;
      } else if (visual.kind === "wave") {
        setPosX(visual.obj, visual.baseX + Math.sin(time * speed + visual.phase) * 3);
      }
    }
    for (const visual of waterfallVisuals) {
      if (visual.kind === "stream") {
        const t = time * 90 + visual.phase;
        setPosY(visual.obj, visual.baseY + (t % 12) - 6);
      } else {
        setScaleY(visual.obj, 0.8 + Math.sin(time * 9 + visual.phase) * 0.4);
        visual.obj.opacity = 0.65 + Math.sin(time * 8 + visual.phase) * 0.25;
      }
    }
    for (const fire of fireVisuals) {
      const flicker = Math.sin(time * 9 + fire.phase) * 2;
      setPosY(fire.flame, fire.baseY + flicker);
      if (fire.core && fire.coreY !== undefined) {
        setPosY(fire.core, fire.coreY + flicker);
      }
      if (fire.spark) {
        const sparkPhase = (time * 2 + fire.phase * 0.1) % 1;
        setPosY(fire.spark, fire.baseY + 4 - sparkPhase * 16);
        fire.spark.opacity = 1 - sparkPhase;
      }
    }
  });

  k.scene("play", (arg: { id: SceneId; spawn?: { x: number; y: number }; initialFacing?: Dir }) => {
    const scene = SCENES[arg.id];
    if (scene.id !== "city") activeInteriorStyleKey = scene.id;
    waterVisuals.length = 0;
    waterfallVisuals.length = 0;
    fireVisuals.length = 0;
    waterTick = 0;
    const rows = scene.grid;
    const mapW = rows[0]!.length;
    const mapH = rows.length;

    // Precompute the complete movement grid once per scene. The old per-frame
    // collision path repeatedly scanned every building for each corner of the
    // player hitbox, which was disproportionately expensive on mobile CPUs.
    const blockedCells = new Uint8Array(mapW * mapH);
    for (let row = 0; row < mapH; row++) {
      for (let col = 0; col < mapW; col++) {
        blockedCells[row * mapW + col] = isPlayerMovementBlocked(scene, rows, col, row) ? 1 : 0;
      }
    }

    const movementBlocked = (col: number, row: number) => {
      if (col < 0 || row < 0 || col >= mapW || row >= mapH) return true;
      return blockedCells[row * mapW + col] === 1;
    };

    for (let row = 0; row < mapH; row++) {
      for (let col = 0; col < mapW; col++) {
        drawTile(rows[row]![col] ?? "s", col, row, rows);
      }
    }

    // Authentic Pokémon building entrances with animated pixel art doors
    const doors: {
      x: number;
      y: number;
      to: SceneId;
      sign: string;
      open: number;
      apply: (open: number) => void;
    }[] = [];
    currentDoors = doors;

    if (scene.indoor) {
      const exit = scene.exits[0];
      const exitX = exit?.x ?? 9;
      const exitY = exit?.y ?? scene.grid.length - 1;
      const dx = exitX * TILE;
      const dy = (exitY - 1) * TILE;
      const doorGlow = k.add([
        k.rect(22, 12, { radius: 2 }),
        k.pos(dx + TILE / 2, dy + 20),
        k.color(255, 238, 176),
        k.opacity(0),
        k.z(12),
      ]) as unknown as { opacity: number };
      const doorObj = k.add([
        k.sprite("door-wood"),
        k.anchor("bot"),
        k.pos(dx + TILE / 2, dy + TILE),
        k.scale(1),
        k.z(13),
      ]) as unknown as { pos: { x: number; y: number }; scale: { x: number; y: number } };
      const applyInteriorDoor = (openVal: number) => {
        const openness = Math.round((1 - openVal * 0.65) * 8) / 8;
        doorObj.scale.x = Math.max(0.35, openness);
        setPosY(doorObj, dy + TILE - openVal * 3);
        doorGlow.opacity = openVal * 0.5;
      };
      doors.push({
        x: exitX,
        y: exitY,
        to: exit?.to ?? "city",
        sign: "Sair para o Oásis",
        open: 0,
        apply: applyInteriorDoor,
      });
    }

    for (const b of scene.buildings) {
      const w = b.w * TILE;
      // Keep the building sprite as the main architectural asset. The house asset
      // is now sourced from the original Town tileset and already contains its roof,
      // facade and windows, so no synthetic roof/AI-looking overlay is added.
      const spriteScale = b.sprite === "home" ? 1 : (w + 8) / 256;
      k.add([
        k.sprite(b.sprite),
        k.pos(b.x * TILE - 4, b.y * TILE - TILE * 1.5),
        k.scale(spriteScale),
        k.z(12),
      ]);

      const dx = b.door.x * TILE;
      const dy = b.door.y * TILE - TILE;
      const doorGlow = k.add([
        k.rect(26, 14, { radius: 2 }),
        k.pos(dx + TILE / 2, dy + 22),
        k.color(255, 238, 176),
        k.opacity(0),
        k.z(12),
      ]) as unknown as { opacity: number };

      // The building artwork already contains a real entrance door. The old extra
      // four-frame door strip produced the red/blue vertical artifacts seen in the map.
      // Keep the existing door intact and only add a soft proximity glow.
      const applyDoor = (openVal: number) => {
        doorGlow.opacity = openVal * 0.38;
      };

      doors.push({
        x: b.door.x,
        y: b.door.y,
        to: b.to,
        sign: b.sign,
        open: 0,
        apply: applyDoor,
      });

      k.add([
        k.rect(Math.min(56, w + 18), 9, { radius: 1 }),
        k.pos(b.x * TILE + w / 2, (b.y + b.h) * TILE + 2),
        k.anchor("top"),
        k.color(236, 204, 148),
        k.outline(1, k.rgb(126, 86, 54)),
        k.z(14),
      ]);
    }

    // Separate NPCs and Pokemon from other static furniture
    const npcInteractables = scene.interactables.filter((item) => item.kind === "npc");
    const pokeInteractables = scene.interactables.filter((item) => item.kind === "pokemon");
    const otherInteractables = scene.interactables.filter(
      (item) => item.kind !== "npc" && item.kind !== "pokemon",
    );

    for (const item of otherInteractables) {
      drawFurniture(item);
    }

    // Dynamic Autonomous Map Pokémon System with walking animations
    interface ActivePoke {
      item: Interactable;
      poke: string;
      homeCol: number;
      homeRow: number;
      curCol: number;
      curRow: number;
      facing: Dir;
      state: "idle" | "walking" | "talking";
      idleTimer: number;
      walkProgress: number;
      fromX: number;
      fromY: number;
      targetX: number;
      targetY: number;
      baseScale: number;
      spr: {
        pos: { x: number; y: number };
        scale: { x: number; y: number };
        angle: number;
        z: number;
      };
      shadow: { pos: { x: number; y: number } };
      emote: { pos: { x: number; y: number }; opacity: number };
    }

    const activePokemon: ActivePoke[] = [];
    for (const item of pokeInteractables) {
      const poke = item.poke || "pikachu";
      const pokeKey = `poke-${poke}`;
      const POKEMON_SCALE: Record<string, number> = {
        yveltal: 0.52,
        zamazenta: 0.55,
        regidrago: 0.55,
        great_tusk: 0.58,
        iron_treads: 0.58,
        roaring_moon: 0.58,
        flygon: 0.64,
        arcanine: 0.66,
      };
      const baseScale = POKEMON_SCALE[poke] ?? 0.76;
      const px = item.x * TILE + TILE / 2;
      const py = item.y * TILE + TILE - 2;

      const shadow = k.add([
        k.rect(Math.max(16, 22 * baseScale), Math.max(5, 8 * baseScale), {
          radius: 3,
        }),
        k.anchor("center"),
        k.pos(px, py),
        k.color(28, 20, 16),
        k.opacity(0.35),
        k.z(10),
      ]) as unknown as { pos: { x: number; y: number } };

      const spr = k.add([
        k.sprite(pokeKey, { frame: 0 }),
        k.anchor("bot"),
        k.pos(px, py),
        k.scale(baseScale),
        k.z(20),
      ]) as unknown as {
        pos: { x: number; y: number };
        scale: { x: number; y: number };
        angle: number;
        z: number;
      };

      const emote = k.add([
        k.text("❤️", { size: 9 }),
        k.pos(px, py - 40),
        k.anchor("center"),
        k.opacity(0),
        k.z(26),
      ]) as unknown as { pos: { x: number; y: number }; opacity: number };

      activePokemon.push({
        item,
        poke,
        homeCol: item.x,
        homeRow: item.y,
        curCol: item.x,
        curRow: item.y,
        facing: "left",
        state: "idle",
        idleTimer: 1.0 + Math.random() * 2.0,
        walkProgress: 0,
        fromX: px,
        fromY: py,
        targetX: px,
        targetY: py,
        baseScale,
        spr,
        shadow,
        emote,
      });
    }

    // Autonomous Dynamic NPC System
    const activeNpcs: ActiveNpc[] = [];
    for (const item of npcInteractables) {
      const trainerVariant = npcTrainerVariant(item.npc ?? 0, item.label);
      const face = item.face ?? "down";
      const isNurseJoy = item.label === "Enfermeira Joy";
      const px = item.x * TILE + TILE / 2;
      const py = item.y * TILE + TILE;

      // Soft pixel drop-shadow under NPC feet
      const shadow = k.add([
        k.rect(18, 6, { radius: 3 }),
        k.anchor("center"),
        k.pos(px, py - 2),
        k.color(28, 20, 16),
        k.opacity(0.35),
        k.z(19),
      ]) as unknown as { pos: { x: number; y: number } };

      // One visual instance only: using two overlapping sprites caused the
      // old walking/idle switch to leave a visible duplicate or halo.
      const spr = k.add([
        k.sprite("trainer-chars", {
          // Nurse Joy is the Dawn block from characters.png: position 6 (index 5).
          frame: trainerFrame(isNurseJoy ? 5 : trainerVariant, isNurseJoy ? "down" : face, 0),
        }),
        k.pos(px, py),
        k.anchor("bot"),
        k.scale(1),
        k.opacity(1),
        k.z(20),
      ]) as unknown as { frame?: number; pos: { x: number; y: number }; opacity: number; z: number };

      const emote = k.add([
        k.text("❤️", { size: 9 }),
        k.pos(px, py - 40),
        k.anchor("center"),
        k.opacity(0),
        k.z(26),
      ]) as unknown as { pos: { x: number; y: number }; opacity: number };

      activeNpcs.push({
        item,
        trainerVariant,
        facing: face,
        homeCol: item.x,
        homeRow: item.y,
        curCol: item.x,
        curRow: item.y,
        state: "idle",
        idleTimer: 1.5 + Math.random() * 2.5,
        walkProgress: 0,
        walkAnimTime: 0,
        walkStep: 0,
        fromX: px,
        fromY: py,
        targetX: px,
        targetY: py,
        canWander: !isNurseJoy,
        spr,
        shadow,
        emote,
      });
    }

    currentActiveNpcs = activeNpcs;

    const spawn = arg.spawn ?? scene.spawn;
    const initialFacing = arg.initialFacing ?? (scene.indoor ? "up" : "down");
    const player = makePlayer(spawn, initialFacing) as unknown as PlayerObj;
    activePlayer = player;
    state.facing = initialFacing;
    let cameraX = player.pos.x;
    let cameraY = player.pos.y;
    k.setCamPos(Math.round(cameraX), Math.round(cameraY));

    // Player soft pixel drop shadow aligned under feet
    const playerShadow = k.add([
      k.rect(18, 6, { radius: 3 }),
      k.anchor("center"),
      k.pos(player.pos.x, player.pos.y - 2),
      k.color(28, 20, 16),
      k.opacity(0.35),
      k.z(29),
    ]) as unknown as { pos: { x: number; y: number } };

    const SPEED = 120;

    k.onUpdate(() => {
      const dt = k.dt();
      const now = k.time();
      // Keep player shadow aligned under feet
      setPosX(playerShadow, player.pos.x);
      setPosY(playerShadow, player.pos.y - 2);

      // Dynamic Y-depth sorting so characters and player never clip through roofs, walls or each other
      player.z = 20 + Math.floor(player.pos.y / 8);
      for (const npc of activeNpcs) {
        npc.spr.z = 20 + Math.floor(npc.spr.pos.y / 8);
      }

      // Doors slide open smoothly when near
      const ptxD = player.pos.x / TILE - 0.5;
      const ptyD = player.pos.y / TILE - 1.0;
      for (const d of doors) {
        const near = Math.hypot(d.x - ptxD, d.y - ptyD) < 1.9;
        d.open += ((near ? 1 : 0) - d.open) * Math.min(1, dt * 9);
        d.apply(d.open);
      }

      // Update active roaming Pokémon with walking and trot animations
      for (const p of activePokemon) {
        if (state.paused || p.state === "talking") continue;

        p.spr.z = 20 + Math.floor(p.spr.pos.y / 8);

        if (p.state === "idle") {
          p.idleTimer -= dt;
          // Gentle breathing idle
          const t = now;
          setScaleY(p.spr, p.baseScale + Math.sin(t * 3.5 + p.curCol) * 0.04);
          setScaleX(p.spr, (p.facing === "left" ? -1 : 1) * p.baseScale);
          p.spr.angle = 0;

          if (p.idleTimer <= 0) {
            if (Math.random() < 0.35) {
              // Turn direction. These Pokémon assets are static overworld poses:
              // left/right can mirror safely; up/down keep the native pose.
              const dirs: Dir[] = ["down", "left", "right", "up"];
              p.facing = dirs[Math.floor(Math.random() * dirs.length)]!;
              setScaleX(p.spr, p.facing === "left" ? -1 : 1);
              p.idleTimer = 1.0 + Math.random() * 1.5;
            } else {
              // Take a roaming step
              const dirs: [number, number][] = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
              ];
              const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)]!;
              const nextCol = p.curCol + dx;
              const nextRow = p.curRow + dy;
              const distFromHome = Math.hypot(nextCol - p.homeCol, nextRow - p.homeRow);

              const occupiedByOtherPokemon = activePokemon.some(
                (other) => other !== p && other.curCol === nextCol && other.curRow === nextRow,
              );

              if (
                distFromHome <= 1.8 &&
                !isRoamingBlocked(nextCol, nextRow) &&
                !occupiedByOtherPokemon
              ) {
                p.state = "walking";
                p.facing = dx < 0 ? "left" : dx > 0 ? "right" : dy < 0 ? "up" : "down";
                // Apply lateral flip immediately so a leftward walk never starts
                // with the previous right-facing pose.
                setScaleX(p.spr, (p.facing === "left" ? -1 : 1) * p.baseScale);
                p.walkProgress = 0;
                p.fromX = p.spr.pos.x;
                p.fromY = p.curRow * TILE + TILE - 2;
                p.targetX = nextCol * TILE + TILE / 2;
                p.targetY = nextRow * TILE + TILE - 2;
              } else {
                p.idleTimer = 0.8 + Math.random() * 1.2;
              }
            }
          }
        } else if (p.state === "walking") {
          p.walkProgress += dt * 1.5;
          const prog = Math.min(1, p.walkProgress);

          const curPx = p.fromX + (p.targetX - p.fromX) * prog;
          const curPy = p.fromY + (p.targetY - p.fromY) * prog;
          // Standalone overworld sprites stay on frame 0; walking only changes position and horizontal flip.
          const hop = Math.abs(Math.sin(prog * Math.PI * 2.0)) * 2;
          p.spr.angle = 0;
          setScaleX(p.spr, (p.facing === "left" ? -1 : 1) * p.baseScale);
          setPosX(p.spr, curPx);
          setPosY(p.spr, curPy - hop);
          setPosX(p.shadow, curPx);
          setPosY(p.shadow, curPy);

          if (p.walkProgress >= 1) {
            p.curCol = Math.round((p.targetX - TILE / 2) / TILE);
            p.curRow = Math.round((p.targetY - (TILE - 2)) / TILE);
            p.item.x = p.curCol;
            p.item.y = p.curRow;
            p.state = "idle";
            p.spr.angle = 0;
            setPosY(p.spr, curPy);
            p.idleTimer = 1.8 + Math.random() * 2.8;
          }
        }
      }

      // Update active NPCs with authentic Pokemon movement AI
      for (const npc of activeNpcs) {
        if (state.paused || npc.state === "talking") continue;

        // Nurse Joy uses the actual Dawn overworld block from characters.png:
        // the 6th physical block (zero-based index 5), not the yellow-hat block at index 4.
        if (npc.item.label === "Enfermeira Joy") continue;

        if (npc.state === "idle") {
          // Subtle breathing/bobbing keeps stationary trainers from looking frozen.
          // It is intentionally tiny so the pixel-art silhouette stays stable.
          const idleBob = Math.sin(now * 3.2 + npc.homeCol * 0.7 + npc.homeRow * 0.4) * 0.45;
          setPosY(npc.spr, npc.curRow * TILE + TILE + idleBob);
          setPosY(npc.shadow, npc.curRow * TILE + TILE - 2);
          // Idle sprites only change frame when direction/state changes. Rewriting
          // the frame and opacity every animation tick created unnecessary work.
          npc.idleTimer -= dt;

          if (npc.idleTimer <= 0) {
            const dirs: Dir[] = ["down", "left", "right", "up"];
            if (!npc.canWander || Math.random() < 0.25) {
              // Turn first, then resolve the correct row in the trainer atlas.
              npc.facing = dirs[Math.floor(Math.random() * dirs.length)]!;
              npc.spr.frame = trainerFrame(npc.trainerVariant, npc.facing, 0);
              npc.idleTimer = 0.7 + Math.random() * 1.1;
            } else {
              // Choose a step to walk
              const pickDir = dirs[Math.floor(Math.random() * dirs.length)]!;
              const deltaX = pickDir === "right" ? 1 : pickDir === "left" ? -1 : 0;
              const deltaY = pickDir === "down" ? 1 : pickDir === "up" ? -1 : 0;
              const nextCol = npc.curCol + deltaX;
              const nextRow = npc.curRow + deltaY;

              const distFromHome = Math.hypot(nextCol - npc.homeCol, nextRow - npc.homeRow);
              const pTileX = Math.floor(player.pos.x / TILE);
              const pTileY = Math.floor(player.pos.y / TILE);
              const nearPlayer = nextCol === pTileX && nextRow === pTileY;
              const occupiedByOther = activeNpcs.some(
                (other) =>
                  other !== npc &&
                  ((other.curCol === nextCol && other.curRow === nextRow) ||
                    (other.state === "walking" &&
                      Math.round((other.targetX - TILE / 2) / TILE) === nextCol &&
                      Math.round((other.targetY - (TILE - 2)) / TILE) === nextRow)),
              );

              if (
                distFromHome <= 2.2 &&
                !isRoamingBlocked(nextCol, nextRow) &&
                !nearPlayer &&
                !occupiedByOther
              ) {
                npc.state = "walking";
                npc.facing = pickDir;
                // Set the direction frame immediately, so the first walking tick
                // cannot briefly show the previous direction.
                npc.spr.frame = trainerFrame(npc.trainerVariant, npc.facing, 0);
                npc.walkProgress = 0;
                npc.walkAnimTime = 0;
                npc.walkStep = 0;
                npc.fromX = npc.curCol * TILE + TILE / 2;
                npc.fromY = npc.curRow * TILE + TILE - 2;
                npc.targetX = nextCol * TILE + TILE / 2;
                npc.targetY = nextRow * TILE + TILE - 2;
              } else {
                npc.idleTimer = 1.0 + Math.random() * 1.5;
              }
            }
          }
        } else if (npc.state === "walking") {
          npc.walkProgress += dt * 2.2;
          npc.walkAnimTime += dt;
          const prog = Math.min(1, npc.walkProgress);

          // Use a fixed animation clock so every direction, especially up/down,
          // begins stepping on the first rendered frames of the movement.
          const walkFrame = Math.floor(npc.walkAnimTime * WALK_ANIMATION_FPS) % 4;
          npc.spr.frame = trainerFrame(npc.trainerVariant, npc.facing, walkFrame);
          npc.spr.opacity = 1;
          const stepPhase = walkFrame;

          const curPx = npc.fromX + (npc.targetX - npc.fromX) * prog;
          const curPy = npc.fromY + (npc.targetY - npc.fromY) * prog;
          const stepBob = stepPhase === 1 || stepPhase === 3 ? 1 : 0;

          setPosX(npc.spr, curPx);
          setPosY(npc.spr, curPy + stepBob);
          setPosX(npc.shadow, curPx);
          setPosY(npc.shadow, curPy);
          setPosX(npc.emote, curPx);
          setPosY(npc.emote, curPy - 42);

          if (npc.walkProgress >= 1) {
            npc.curCol = Math.round((npc.targetX - TILE / 2) / TILE);
            npc.curRow = Math.round((npc.targetY - (TILE - 2)) / TILE);
            npc.item.x = npc.curCol;
            npc.item.y = npc.curRow;
            npc.state = "idle";
            npc.walkAnimTime = 0;
            npc.spr.frame = trainerFrame(npc.trainerVariant, npc.facing, 0);
            npc.spr.opacity = 1;
            setPosY(npc.spr, curPy);
            npc.idleTimer = 1.8 + Math.random() * 2.5;
          }
        }
      }

      if (state.paused || state.transitioning) return;

      let dx = 0;
      let dy = 0;
      if (k.isKeyDown("right") || k.isKeyDown("d")) dx += 1;
      if (k.isKeyDown("left") || k.isKeyDown("a")) dx -= 1;
      if (k.isKeyDown("down") || k.isKeyDown("s")) dy += 1;
      if (k.isKeyDown("up") || k.isKeyDown("w")) dy -= 1;
      if (state.dir === "right") dx += 1;
      if (state.dir === "left") dx -= 1;
      if (state.dir === "down") dy += 1;
      if (state.dir === "up") dy -= 1;

      dx = Math.sign(dx);
      dy = Math.sign(dy);

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy) || 1;
        const vx = (dx / len) * SPEED * k.dt();
        const vy = (dy / len) * SPEED * k.dt();

        // Collision check with refined bounding box for bot anchor
        const tryMove = (nx: number, ny: number) => {
          const half = 9;
          const corners = [
            [nx - half, ny - 14],
            [nx + half, ny - 14],
            [nx - half, ny - 2],
            [nx + half, ny - 2],
          ];
          return corners.every(([cx, cy]) => {
            const col = Math.floor(cx! / TILE);
            const row = Math.floor(cy! / TILE);
            return !movementBlocked(col, row);
          });
        };

        const prevX = player.pos.x;
        const prevY = player.pos.y;
        let movedX = false;
        let movedY = false;

        if (tryMove(player.pos.x + vx, player.pos.y)) {
          player.pos.x += vx;
          movedX = true;
        }
        if (tryMove(player.pos.x, player.pos.y + vy)) {
          player.pos.y += vy;
          movedY = true;
        }

        if (movedY && Math.abs(vy) > 0.001) {
          player.facing = vy > 0 ? "down" : "up";
        } else if (movedX && Math.abs(vx) > 0.001) {
          player.facing = vx > 0 ? "right" : "left";
        } else {
          player.facing = dy > 0 ? "down" : dy < 0 ? "up" : dx > 0 ? "right" : "left";
        }
        state.facing = player.facing;

        const movedDist = Math.hypot(player.pos.x - prevX, player.pos.y - prevY);
        if (movedDist > 0.001) {
          // Animation is time-based, not distance-based, so up/down movement starts
          // immediately even when the first few rendered frames move only slightly.
          player.walkAnimTime += k.dt();
          const walkFrame = Math.floor(player.walkAnimTime * WALK_ANIMATION_FPS) % 4;
          player.step = walkFrame;
          player.frame = trainerFrame(PLAYER_TRAINER_VARIANT, player.facing, walkFrame);
        } else {
          player.walkAnimTime = 0;
          player.step = 0;
          player.frame = trainerFrame(PLAYER_TRAINER_VARIANT, player.facing, 0);
        }
      } else {
        player.walkAnimTime = 0;
        player.step = 0;
        player.frame = trainerFrame(PLAYER_TRAINER_VARIANT, player.facing, 0);
      }

      // Check nearest interaction or door
      const ptx = player.pos.x / TILE - 0.5;
      const pty = player.pos.y / TILE - 1.0;
      let best: { label: string; action: string; run: () => void; dist: number } | null = null;

      // Dynamically open/close building doors smoothly as player approaches
      for (const dObj of currentDoors) {
        const d = Math.hypot(dObj.x - ptx, dObj.y - pty);
        const shouldOpen = d < 1.7 && player.pos.y >= (dObj.y - 1.2) * TILE;
        const targetOpen = shouldOpen ? 1 : 0;
        if (Math.abs(dObj.open - targetOpen) > 0.01) {
          const speed = targetOpen > dObj.open ? 8 : 4;
          dObj.open += (targetOpen - dObj.open) * Math.min(1, k.dt() * speed);
          dObj.apply(dObj.open);
        }
      }

      // Check exits & doors
      for (const exit of scene.exits) {
        const d = Math.hypot(exit.x - ptx, exit.y - pty);
        if (d < 1.4 && (!best || d < best.dist)) {
          const target = SCENES[exit.to];
          best = {
            label: scene.indoor ? "Voltar ao Desert Oasis" : `Entrar: ${target.title}`,
            action: scene.indoor ? "Sair" : "Entrar",
            dist: d,
            run: () => goTo(exit.to),
          };

          // Auto-trigger if stepped directly on the door mat facing the doorway/exit
          if (d < 0.75 && !state.transitioning) {
            if (scene.indoor && player.facing === "down") {
              goTo(exit.to);
              return;
            }
            if (!scene.indoor && player.facing === "up") {
              goTo(exit.to);
              return;
            }
          }
        }
      }

      for (const item of scene.interactables) {
        const d = Math.hypot(item.x - ptx, item.y - pty);
        if (d < 1.4 && (!best || d < best.dist)) {
          const isPoke = item.kind === "pokemon";
          const opensScene = Boolean(item.toScene);
          best = {
            label: item.label,
            action: opensScene
              ? "Abrir"
              : isPoke || item.kind === "npc"
                ? "Conversar"
                : "Inspecionar",
            dist: d,
            run: () => {
              if (item.toScene) {
                goTo(item.toScene);
                return;
              }
              if (item.kind === "npc") {
                const matchedNpc = activeNpcs.find((n) => n.item === item);
                if (matchedNpc) {
                  matchedNpc.state = "talking";
                  const diffX = player.pos.x - matchedNpc.spr.pos.x;
                  const diffY = player.pos.y - matchedNpc.spr.pos.y;
                  if (Math.abs(diffX) > Math.abs(diffY)) {
                    matchedNpc.facing = diffX > 0 ? "right" : "left";
                  } else {
                    matchedNpc.facing = diffY > 0 ? "down" : "up";
                  }
                  if (matchedNpc.item.label !== "Enfermeira Joy") {
                    matchedNpc.spr.frame = trainerFrame(
                      matchedNpc.trainerVariant,
                      matchedNpc.facing,
                    );
                  }
                  matchedNpc.emote.opacity = 1;
                  k.wait(0.8, () => {
                    matchedNpc.emote.opacity = 0;
                  });
                }
              }
              if (isPoke) {
                const matchedPoke = activePokemon.find((p) => p.item === item);
                if (matchedPoke) {
                  matchedPoke.state = "talking";
                  matchedPoke.facing = player.pos.x < matchedPoke.spr.pos.x ? "left" : "right";
                  setScaleX(
                    matchedPoke.spr,
                    (matchedPoke.facing === "left" ? -1 : 1) * matchedPoke.baseScale,
                  );
                  matchedPoke.emote.opacity = 1;
                  // Joyful hop
                  matchedPoke.spr.pos.y -= 5;
                  k.wait(0.2, () => {
                    matchedPoke.spr.pos.y += 5;
                  });
                  k.wait(1.4, () => {
                    matchedPoke.emote.opacity = 0;
                    matchedPoke.state = "idle";
                  });
                }
              }
              if (item.dialogue === "pokecenter-nurse" || item.dialogue === "inn-rest") {
                sound.playHealJingle();
              } else {
                sound.playInteract();
              }
              // Pokemon dialogue is derived from the species itself so a bad/manual map id
              // can never make Mudkip, Psyduck, or another species open Pikachu's conversation.
              const resolvedDialogueId = isPoke && item.poke ? `poke-${item.poke}` : item.dialogue;
              cb.onDialogue(resolvedDialogueId);
            },
          };
        }
      }

      state.interact = best ? best.run : null;
      const promptKey = best ? `${best.label}__${best.action}` : "";
      if (promptKey !== state.lastPromptKey) {
        state.lastPromptKey = promptKey;
        cb.onPrompt(best ? { label: best.label, action: best.action } : null);
      }

      // Smooth follow with proper map-boundary clamping.
      // This avoids the "camera stuck" feeling while keeping the player readable
      // near the center and preventing the camera from exposing void space.
      const halfW = k.width() / 2;
      const halfH = k.height() / 2;
      const targetCx =
        mapW * TILE <= k.width()
          ? (mapW * TILE) / 2
          : Math.min(Math.max(player.pos.x, halfW), mapW * TILE - halfW);
      const targetCy =
        mapH * TILE <= k.height()
          ? (mapH * TILE) / 2
          : Math.min(Math.max(player.pos.y, halfH), mapH * TILE - halfH);

      const follow = Math.min(1, k.dt() * 12);
      cameraX += (targetCx - cameraX) * follow;
      cameraY += (targetCy - cameraY) * follow;
      k.setCamPos(Math.round(cameraX), Math.round(cameraY));
    });

    k.onKeyPress("enter", () => triggerInteract());
    k.onKeyPress("space", () => triggerInteract());
    k.onKeyPress("e", () => triggerInteract());
    k.onKeyPress("a", () => triggerInteract());

    cb.onScene(scene);
  });

  function goTo(id: SceneId) {
    if (state.transitioning) return;
    state.transitioning = true;
    state.dir = null;
    state.lastPromptKey = "";
    cb.onPrompt(null);

    // If entering a building from city, visually slide the door open and step in
    if (currentSceneId === "city") {
      const doorObj = currentDoors.find((d) => d.to === id);
      if (doorObj) {
        doorObj.open = 1;
        doorObj.apply(1);
        if (activePlayer) {
          activePlayer.facing = "up";
          activePlayer.frame = trainerFrame(PLAYER_TRAINER_VARIANT, "up", 0);
          setPosX(activePlayer, doorObj.x * TILE + TILE / 2);
          setPosY(activePlayer, doorObj.y * TILE + 2);
        }
      }
    }

    // Play classic Pokemon door chime
    sound.playDoorChime();

    // Determine center of transition (screen coordinates)
    let origin = { x: 960 / 2, y: 540 / 2 };
    try {
      if (activePlayer && activePlayer.pos) {
        const screenPos = k.toScreen(k.vec2(activePlayer.pos.x, activePlayer.pos.y));
        origin = { x: screenPos.x, y: screenPos.y };
      }
    } catch {
      // fallback to center
    }

    const target = SCENES[id];
    let spawn = target.spawn;
    const initialFacing: Dir = id === "city" ? "down" : "up";

    if (id === "city") {
      const from = currentSceneId;
      const b = SCENES.city.buildings.find((x) => x.to === from);
      if (b) {
        spawn = { x: b.door.x, y: b.door.y + 1 };
      }
    }

    transitionManager.runTransition({
      type: currentTransitionType,
      origin,
      onMidpoint: () => {
        currentSceneId = id;
        k.go("play", { id, spawn, initialFacing });
      },
      getNewOrigin: () => {
        try {
          const spawnScreen = k.toScreen(
            k.vec2(spawn.x * TILE + TILE / 2, spawn.y * TILE + TILE / 2),
          );
          return { x: spawnScreen.x, y: spawnScreen.y };
        } catch {
          return { x: 960 / 2, y: 540 / 2 };
        }
      },
      onComplete: () => {
        state.transitioning = false;
        cb.onTransitionComplete?.(target);
      },
    });
  }

  function triggerInteract() {
    if (state.paused || state.transitioning) return;
    state.interact?.();
  }

  function clearInteraction() {
    state.interact = null;
    state.lastPromptKey = "";
    cb.onPrompt(null);
  }

  let currentSceneId: SceneId = "city";
  k.go("play", { id: "city" });

  return {
    destroy: () => {
      transitionManager.destroy();
      k.quit();
      canvas.remove();
    },
    setPaused: (paused) => {
      state.paused = paused;
      if (paused) {
        state.dir = null;
        clearInteraction();
      } else {
        for (const npc of currentActiveNpcs) {
          if (npc.state === "talking") {
            npc.state = "idle";
            npc.spr.frame = trainerFrame(npc.trainerVariant, npc.facing, 0);
            npc.spr.opacity = 1;
            npc.walkAnimTime = 0;
            npc.idleTimer = 2.0 + Math.random() * 2.0;
          }
        }
      }
    },
    setDir: (dir) => {
      state.dir = dir;
    },
    interact: triggerInteract,
    clearInteraction,
    goTo,
    setTransitionType: (type: TransitionType) => {
      currentTransitionType = type;
      transitionManager.setType(type);
    },
  };
}
