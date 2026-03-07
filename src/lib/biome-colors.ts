/**
 * Minecraft biome types and their map colors.
 * Colors chosen to match the Minecraft biome map aesthetic.
 */

export enum Biome {
  // Ocean biomes
  DeepOcean = "Deep Ocean",
  Ocean = "Ocean",
  LukewarmOcean = "Lukewarm Ocean",
  WarmOcean = "Warm Ocean",
  ColdOcean = "Cold Ocean",
  FrozenOcean = "Frozen Ocean",
  DeepColdOcean = "Deep Cold Ocean",
  DeepFrozenOcean = "Deep Frozen Ocean",
  DeepLukewarmOcean = "Deep Lukewarm Ocean",

  // Land biomes
  Plains = "Plains",
  SunflowerPlains = "Sunflower Plains",
  Forest = "Forest",
  FlowerForest = "Flower Forest",
  BirchForest = "Birch Forest",
  DarkForest = "Dark Forest",
  Taiga = "Taiga",
  OldGrowthSpruceTaiga = "Old Growth Spruce Taiga",
  OldGrowthPineTaiga = "Old Growth Pine Taiga",
  SnowyTaiga = "Snowy Taiga",
  Jungle = "Jungle",
  SparseJungle = "Sparse Jungle",
  BambooJungle = "Bamboo Jungle",
  Swamp = "Swamp",
  MangroveSwamp = "Mangrove Swamp",
  Desert = "Desert",
  Savanna = "Savanna",
  SavannaPlateau = "Savanna Plateau",
  Badlands = "Badlands",
  ErodedBadlands = "Eroded Badlands",
  Beach = "Beach",
  SnowyBeach = "Snowy Beach",
  StonyShore = "Stony Shore",
  River = "River",
  FrozenRiver = "Frozen River",

  // Cold biomes
  SnowyPlains = "Snowy Plains",
  IceSpikes = "Ice Spikes",
  SnowySlopes = "Snowy Slopes",
  FrozenPeaks = "Frozen Peaks",
  JaggedPeaks = "Jagged Peaks",
  StonyPeaks = "Stony Peaks",
  Meadow = "Meadow",
  CherryGrove = "Cherry Grove",
  Grove = "Grove",
  WindsweptHills = "Windswept Hills",
  WindsweptForest = "Windswept Forest",
  WindsweptGravelly = "Windswept Gravelly Hills",

  // Mushroom
  MushroomFields = "Mushroom Fields",

  // Cave biomes (shown as surface overlay)
  DeepDark = "Deep Dark",
  LushCaves = "Lush Caves",
  DripstoneCaves = "Dripstone Caves",

  // Nether (for future use)
  NetherWastes = "Nether Wastes",
  SoulSandValley = "Soul Sand Valley",
  CrimsonForest = "Crimson Forest",
  WarpedForest = "Warped Forest",
  BasaltDeltas = "Basalt Deltas",

  // End
  TheEnd = "The End",
}

export interface BiomeColor {
  r: number;
  g: number;
  b: number;
}

/** Biome color map — colors that look great on a dark-themed seed map */
export const BIOME_COLORS: Record<Biome, BiomeColor> = {
  // Oceans
  [Biome.DeepOcean]: { r: 0, g: 0, b: 112 },
  [Biome.Ocean]: { r: 0, g: 0, b: 160 },
  [Biome.LukewarmOcean]: { r: 0, g: 76, b: 178 },
  [Biome.WarmOcean]: { r: 0, g: 110, b: 200 },
  [Biome.ColdOcean]: { r: 32, g: 32, b: 140 },
  [Biome.FrozenOcean]: { r: 112, g: 112, b: 214 },
  [Biome.DeepColdOcean]: { r: 20, g: 20, b: 100 },
  [Biome.DeepFrozenOcean]: { r: 80, g: 80, b: 180 },
  [Biome.DeepLukewarmOcean]: { r: 0, g: 56, b: 130 },

  // Plains & Meadows
  [Biome.Plains]: { r: 141, g: 179, b: 96 },
  [Biome.SunflowerPlains]: { r: 181, g: 199, b: 46 },
  [Biome.Meadow]: { r: 130, g: 194, b: 100 },
  [Biome.CherryGrove]: { r: 224, g: 160, b: 186 },

  // Forests
  [Biome.Forest]: { r: 5, g: 102, b: 33 },
  [Biome.FlowerForest]: { r: 45, g: 142, b: 73 },
  [Biome.BirchForest]: { r: 48, g: 116, b: 68 },
  [Biome.DarkForest]: { r: 64, g: 81, b: 26 },

  // Taiga
  [Biome.Taiga]: { r: 11, g: 102, b: 89 },
  [Biome.OldGrowthSpruceTaiga]: { r: 22, g: 77, b: 58 },
  [Biome.OldGrowthPineTaiga]: { r: 32, g: 87, b: 48 },
  [Biome.SnowyTaiga]: { r: 49, g: 85, b: 74 },

  // Jungle
  [Biome.Jungle]: { r: 83, g: 123, b: 9 },
  [Biome.SparseJungle]: { r: 98, g: 139, b: 23 },
  [Biome.BambooJungle]: { r: 118, g: 142, b: 20 },

  // Swamp
  [Biome.Swamp]: { r: 7, g: 79, b: 56 },
  [Biome.MangroveSwamp]: { r: 36, g: 77, b: 48 },

  // Desert & Dry
  [Biome.Desert]: { r: 250, g: 148, b: 24 },
  [Biome.Savanna]: { r: 189, g: 178, b: 95 },
  [Biome.SavannaPlateau]: { r: 167, g: 157, b: 100 },
  [Biome.Badlands]: { r: 217, g: 69, b: 21 },
  [Biome.ErodedBadlands]: { r: 255, g: 109, b: 61 },

  // Shores & Rivers
  [Biome.Beach]: { r: 250, g: 222, b: 85 },
  [Biome.SnowyBeach]: { r: 219, g: 220, b: 194 },
  [Biome.StonyShore]: { r: 162, g: 162, b: 132 },
  [Biome.River]: { r: 0, g: 0, b: 255 },
  [Biome.FrozenRiver]: { r: 160, g: 160, b: 255 },

  // Cold & Peaks
  [Biome.SnowyPlains]: { r: 255, g: 254, b: 255 },
  [Biome.IceSpikes]: { r: 180, g: 220, b: 255 },
  [Biome.SnowySlopes]: { r: 210, g: 230, b: 240 },
  [Biome.FrozenPeaks]: { r: 200, g: 210, b: 230 },
  [Biome.JaggedPeaks]: { r: 190, g: 196, b: 194 },
  [Biome.StonyPeaks]: { r: 140, g: 140, b: 130 },
  [Biome.Grove]: { r: 80, g: 120, b: 90 },
  [Biome.WindsweptHills]: { r: 96, g: 96, b: 96 },
  [Biome.WindsweptForest]: { r: 80, g: 112, b: 80 },
  [Biome.WindsweptGravelly]: { r: 120, g: 120, b: 120 },

  // Mushroom
  [Biome.MushroomFields]: { r: 255, g: 0, b: 255 },

  // Cave (surface representation)
  [Biome.DeepDark]: { r: 10, g: 20, b: 30 },
  [Biome.LushCaves]: { r: 50, g: 120, b: 50 },
  [Biome.DripstoneCaves]: { r: 120, g: 100, b: 70 },

  // Nether
  [Biome.NetherWastes]: { r: 130, g: 48, b: 48 },
  [Biome.SoulSandValley]: { r: 77, g: 58, b: 46 },
  [Biome.CrimsonForest]: { r: 180, g: 25, b: 25 },
  [Biome.WarpedForest]: { r: 20, g: 160, b: 133 },
  [Biome.BasaltDeltas]: { r: 80, g: 80, b: 80 },

  // End
  [Biome.TheEnd]: { r: 128, g: 128, b: 90 },
};

export const BIOME_VALUES = Object.values(Biome) as Biome[];

export const BIOME_INDEX = BIOME_VALUES.reduce(
  (index, biome, biomeIndex) => {
    index[biome] = biomeIndex;
    return index;
  },
  {} as Record<Biome, number>
);

export const BIOME_PALETTE = new Uint8ClampedArray(BIOME_VALUES.length * 4);

for (let i = 0; i < BIOME_VALUES.length; i++) {
  const color = BIOME_COLORS[BIOME_VALUES[i]];
  const offset = i * 4;
  BIOME_PALETTE[offset] = color.r;
  BIOME_PALETTE[offset + 1] = color.g;
  BIOME_PALETTE[offset + 2] = color.b;
  BIOME_PALETTE[offset + 3] = 255;
}
