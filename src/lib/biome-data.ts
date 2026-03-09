/**
 * Biome categories for the Biomes panel — groups biomes by type.
 */

import { Biome, BIOME_COLORS } from "./biome-colors";
import type { BiomeColor } from "./biome-colors";
import type { Dimension } from "./minecraft-versions";

export interface BiomeCategory {
  name: string;
  biomes: Biome[];
}

/** Overworld biome categories (matching Minecraft wiki grouping) */
export const OVERWORLD_BIOME_CATEGORIES: BiomeCategory[] = [
  {
    name: "BEACH",
    biomes: [Biome.Beach, Biome.SnowyBeach, Biome.StonyShore],
  },
  {
    name: "CAVE",
    biomes: [Biome.DeepDark, Biome.DripstoneCaves, Biome.LushCaves],
  },
  {
    name: "DESERT",
    biomes: [Biome.Desert],
  },
  {
    name: "FOREST",
    biomes: [Biome.BirchForest, Biome.DarkForest, Biome.FlowerForest, Biome.Forest],
  },
  {
    name: "ICE",
    biomes: [Biome.FrozenPeaks, Biome.FrozenRiver, Biome.IceSpikes],
  },
  {
    name: "JUNGLE",
    biomes: [Biome.BambooJungle, Biome.Jungle, Biome.SparseJungle],
  },
  {
    name: "MESA",
    biomes: [Biome.Badlands, Biome.ErodedBadlands],
  },
  {
    name: "MOUNTAIN",
    biomes: [
      Biome.CherryGrove,
      Biome.Grove,
      Biome.JaggedPeaks,
      Biome.Meadow,
      Biome.SnowySlopes,
      Biome.StonyPeaks,
      Biome.WindsweptForest,
      Biome.WindsweptGravelly,
      Biome.WindsweptHills,
    ],
  },
  {
    name: "MUSHROOM",
    biomes: [Biome.MushroomFields],
  },
  {
    name: "OCEAN",
    biomes: [
      Biome.ColdOcean,
      Biome.DeepColdOcean,
      Biome.DeepFrozenOcean,
      Biome.DeepLukewarmOcean,
      Biome.DeepOcean,
      Biome.FrozenOcean,
      Biome.LukewarmOcean,
      Biome.Ocean,
      Biome.WarmOcean,
    ],
  },
  {
    name: "PLAINS",
    biomes: [Biome.Plains, Biome.SunflowerPlains],
  },
  {
    name: "RIVER",
    biomes: [Biome.River, Biome.FrozenRiver],
  },
  {
    name: "SAVANNA",
    biomes: [Biome.Savanna, Biome.SavannaPlateau],
  },
  {
    name: "SNOWY",
    biomes: [Biome.SnowyPlains, Biome.SnowyTaiga],
  },
  {
    name: "SWAMP",
    biomes: [Biome.MangroveSwamp, Biome.Swamp],
  },
  {
    name: "TAIGA",
    biomes: [Biome.OldGrowthPineTaiga, Biome.OldGrowthSpruceTaiga, Biome.Taiga],
  },
];

export const NETHER_BIOME_CATEGORIES: BiomeCategory[] = [
  {
    name: "NETHER",
    biomes: [
      Biome.NetherWastes,
      Biome.SoulSandValley,
      Biome.CrimsonForest,
      Biome.WarpedForest,
      Biome.BasaltDeltas,
    ],
  },
];

export const END_BIOME_CATEGORIES: BiomeCategory[] = [
  {
    name: "END",
    biomes: [Biome.TheEnd],
  },
];

/** The full list of overworld biomes (flattened from categories) */
export const ALL_OVERWORLD_BIOMES: Biome[] = OVERWORLD_BIOME_CATEGORIES.flatMap((c) => c.biomes);
export const ALL_NETHER_BIOMES: Biome[] = NETHER_BIOME_CATEGORIES.flatMap((c) => c.biomes);
export const ALL_END_BIOMES: Biome[] = END_BIOME_CATEGORIES.flatMap((c) => c.biomes);

export function getBiomeCategories(dimension: Dimension): BiomeCategory[] {
  if (dimension === "nether") {
    return NETHER_BIOME_CATEGORIES;
  }

  if (dimension === "end") {
    return END_BIOME_CATEGORIES;
  }

  return OVERWORLD_BIOME_CATEGORIES;
}

export function getBiomesForDimension(dimension: Dimension): Biome[] {
  if (dimension === "nether") {
    return ALL_NETHER_BIOMES;
  }

  if (dimension === "end") {
    return ALL_END_BIOMES;
  }

  return ALL_OVERWORLD_BIOMES;
}

/** Structure types for the Markers panel */
export interface StructureType {
  id: string;
  name: string;
  icon: import("@/components/ui/icons").StructureIconName;
}

export const STRUCTURE_TYPES: StructureType[] = [
  { id: "village", name: "Village", icon: "village" },
  { id: "ocean_monument", name: "Ocean Monument", icon: "ocean_monument" },
  { id: "shipwreck", name: "Shipwreck", icon: "shipwreck" },
  { id: "mineshaft", name: "Mineshaft", icon: "mineshaft" },
  { id: "ancient_city", name: "Ancient City", icon: "ancient_city" },
  { id: "amethyst_geode", name: "Amethyst Geode", icon: "amethyst_geode" },
  { id: "woodland_mansion", name: "Woodland Mansion", icon: "woodland_mansion" },
  { id: "desert_pyramid", name: "Desert Pyramid", icon: "desert_pyramid" },
  { id: "jungle_temple", name: "Jungle Temple", icon: "jungle_temple" },
  { id: "igloo", name: "Igloo", icon: "igloo" },
  { id: "pillager_outpost", name: "Pillager Outpost", icon: "pillager_outpost" },
  { id: "ruined_portal", name: "Ruined Portal", icon: "ruined_portal" },
  { id: "buried_treasure", name: "Buried Treasure", icon: "buried_treasure" },
  { id: "swamp_hut", name: "Swamp Hut", icon: "swamp_hut" },
  { id: "stronghold", name: "Stronghold", icon: "stronghold" },
  { id: "ocean_ruin", name: "Ocean Ruin", icon: "ocean_ruin" },
  { id: "trail_ruin", name: "Trail Ruin", icon: "trail_ruin" },
  { id: "trial_chambers", name: "Trial Chambers", icon: "trial_chambers" },
];
