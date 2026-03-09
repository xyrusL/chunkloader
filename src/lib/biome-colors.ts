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

/** Biome color map — natural topographic hues matching Minecraft's biome aesthetic */
export const BIOME_COLORS: Record<Biome, BiomeColor> = {
  // Oceans — steel blue tones, deeper = darker
  [Biome.DeepOcean]:        { r: 18,  g: 52,  b: 120 },
  [Biome.Ocean]:            { r: 32,  g: 82,  b: 154 },
  [Biome.LukewarmOcean]:   { r: 20,  g: 96,  b: 168 },
  [Biome.WarmOcean]:       { r: 24,  g: 116, b: 190 },
  [Biome.ColdOcean]:       { r: 28,  g: 58,  b: 130 },
  [Biome.FrozenOcean]:     { r: 108, g: 128, b: 196 },
  [Biome.DeepColdOcean]:   { r: 14,  g: 38,  b: 100 },
  [Biome.DeepFrozenOcean]: { r: 68,  g: 86,  b: 164 },
  [Biome.DeepLukewarmOcean]: { r: 14, g: 60, b: 128 },

  // Plains & Meadows — muted grass greens
  [Biome.Plains]:          { r: 116, g: 154, b: 72  },
  [Biome.SunflowerPlains]: { r: 162, g: 176, b: 52  },
  [Biome.Meadow]:          { r: 112, g: 172, b: 82  },
  [Biome.CherryGrove]:     { r: 200, g: 138, b: 168 },

  // Forests — dark, rich greens
  [Biome.Forest]:           { r: 34,  g: 85,  b: 28  },
  [Biome.FlowerForest]:     { r: 48,  g: 122, b: 58  },
  [Biome.BirchForest]:      { r: 44,  g: 102, b: 58  },
  [Biome.DarkForest]:       { r: 48,  g: 62,  b: 18  },

  // Taiga — deep blue-greens
  [Biome.Taiga]:                  { r: 12,  g: 90,  b: 78  },
  [Biome.OldGrowthSpruceTaiga]:  { r: 18,  g: 64,  b: 48  },
  [Biome.OldGrowthPineTaiga]:    { r: 26,  g: 72,  b: 38  },
  [Biome.SnowyTaiga]:            { r: 42,  g: 72,  b: 64  },

  // Jungle — deep tropical greens
  [Biome.Jungle]:       { r: 48,  g: 96,  b: 12  },
  [Biome.SparseJungle]: { r: 62,  g: 112, b: 20  },
  [Biome.BambooJungle]: { r: 80,  g: 118, b: 18  },

  // Swamp — muddy dark greens
  [Biome.Swamp]:        { r: 40,  g: 68,  b: 38  },
  [Biome.MangroveSwamp]:{ r: 34,  g: 64,  b: 42  },

  // Desert & Dry — sandy muted tones
  [Biome.Desert]:          { r: 210, g: 175, b: 100 },
  [Biome.Savanna]:         { r: 163, g: 158, b: 82  },
  [Biome.SavannaPlateau]:  { r: 148, g: 140, b: 78  },
  [Biome.Badlands]:        { r: 178, g: 85,  b: 38  },
  [Biome.ErodedBadlands]:  { r: 204, g: 108, b: 58  },

  // Shores & Rivers — natural water/sand tones
  [Biome.Beach]:       { r: 220, g: 198, b: 112 },
  [Biome.SnowyBeach]:  { r: 196, g: 200, b: 178 },
  [Biome.StonyShore]:  { r: 138, g: 136, b: 114 },
  [Biome.River]:       { r: 60,  g: 110, b: 200 },
  [Biome.FrozenRiver]: { r: 148, g: 162, b: 228 },

  // Cold & Peaks — icy whites, slate grays
  [Biome.SnowyPlains]:       { r: 230, g: 238, b: 245 },
  [Biome.IceSpikes]:         { r: 172, g: 208, b: 240 },
  [Biome.SnowySlopes]:       { r: 196, g: 214, b: 228 },
  [Biome.FrozenPeaks]:       { r: 186, g: 198, b: 218 },
  [Biome.JaggedPeaks]:       { r: 168, g: 176, b: 178 },
  [Biome.StonyPeaks]:        { r: 126, g: 124, b: 118 },
  [Biome.Grove]:             { r: 70,  g: 106, b: 80  },
  [Biome.WindsweptHills]:    { r: 82,  g: 86,  b: 84  },
  [Biome.WindsweptForest]:   { r: 68,  g: 96,  b: 70  },
  [Biome.WindsweptGravelly]: { r: 108, g: 108, b: 104 },

  // Mushroom — natural muted purple
  [Biome.MushroomFields]: { r: 182, g: 68,  b: 162 },

  // Cave (surface representation)
  [Biome.DeepDark]:       { r: 10,  g: 18,  b: 28  },
  [Biome.LushCaves]:      { r: 44,  g: 106, b: 44  },
  [Biome.DripstoneCaves]: { r: 108, g: 90,  b: 62  },

  // Nether — dark reds and oranges
  [Biome.NetherWastes]:  { r: 112, g: 38,  b: 24  },
  [Biome.SoulSandValley]:{ r: 68,  g: 52,  b: 40  },
  [Biome.CrimsonForest]: { r: 158, g: 22,  b: 22  },
  [Biome.WarpedForest]:  { r: 18,  g: 130, b: 112 },
  [Biome.BasaltDeltas]:  { r: 68,  g: 68,  b: 72  },

  // End
  [Biome.TheEnd]: { r: 116, g: 114, b: 76  },
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
