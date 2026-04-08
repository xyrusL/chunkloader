/**
 * Biome categories for the Biomes panel — groups biomes by type.
 */

import { Biome } from "./biome-colors";
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
  dimensions: Dimension[];
}

export const STRUCTURE_TYPES: StructureType[] = [
  { id: "village", name: "Village", icon: "village", dimensions: ["overworld"] },
  { id: "ocean_monument", name: "Ocean Monument", icon: "ocean_monument", dimensions: ["overworld"] },
  { id: "shipwreck", name: "Shipwreck", icon: "shipwreck", dimensions: ["overworld"] },
  { id: "mineshaft", name: "Mineshaft", icon: "mineshaft", dimensions: ["overworld"] },
  { id: "ancient_city", name: "Ancient City", icon: "ancient_city", dimensions: ["overworld"] },
  { id: "amethyst_geode", name: "Amethyst Geode", icon: "amethyst_geode", dimensions: ["overworld"] },
  { id: "woodland_mansion", name: "Woodland Mansion", icon: "woodland_mansion", dimensions: ["overworld"] },
  { id: "desert_pyramid", name: "Desert Pyramid", icon: "desert_pyramid", dimensions: ["overworld"] },
  { id: "jungle_temple", name: "Jungle Temple", icon: "jungle_temple", dimensions: ["overworld"] },
  { id: "igloo", name: "Igloo", icon: "igloo", dimensions: ["overworld"] },
  { id: "pillager_outpost", name: "Pillager Outpost", icon: "pillager_outpost", dimensions: ["overworld"] },
  { id: "ruined_portal", name: "Ruined Portal", icon: "ruined_portal", dimensions: ["overworld", "nether"] },
  { id: "buried_treasure", name: "Buried Treasure", icon: "buried_treasure", dimensions: ["overworld"] },
  { id: "swamp_hut", name: "Swamp Hut", icon: "swamp_hut", dimensions: ["overworld"] },
  { id: "stronghold", name: "Stronghold", icon: "stronghold", dimensions: ["overworld"] },
  { id: "ocean_ruin", name: "Ocean Ruin", icon: "ocean_ruin", dimensions: ["overworld"] },
  { id: "trail_ruin", name: "Trail Ruin", icon: "trail_ruin", dimensions: ["overworld"] },
  { id: "trial_chambers", name: "Trial Chambers", icon: "trial_chambers", dimensions: ["overworld"] },
  { id: "nether_fortress", name: "Nether Fortress", icon: "nether_fortress", dimensions: ["nether"] },
  { id: "bastion_remnant", name: "Bastion Remnant", icon: "bastion_remnant", dimensions: ["nether"] },
  { id: "nether_fossil", name: "Nether Fossil", icon: "nether_fossil", dimensions: ["nether"] },
  { id: "end_city", name: "End City", icon: "end_city", dimensions: ["end"] },
];

export function getStructureTypesForDimension(dimension: Dimension): StructureType[] {
  return STRUCTURE_TYPES.filter((structure) => structure.dimensions.includes(dimension));
}
