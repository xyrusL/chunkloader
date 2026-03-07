/**
 * Biome categories for the Biomes panel — groups biomes by type.
 */

import { Biome, BIOME_COLORS } from "./biome-colors";
import type { BiomeColor } from "./biome-colors";

export interface BiomeCategory {
  name: string;
  biomes: Biome[];
}

/** Overworld biome categories (matching Minecraft wiki grouping) */
export const BIOME_CATEGORIES: BiomeCategory[] = [
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

/** The full list of overworld biomes (flattened from categories) */
export const ALL_OVERWORLD_BIOMES: Biome[] = BIOME_CATEGORIES.flatMap((c) => c.biomes);

/** Structure types for the Markers panel */
export interface StructureType {
  id: string;
  name: string;
  icon: string;
}

export const STRUCTURE_TYPES: StructureType[] = [
  { id: "village", name: "Village", icon: "🏘️" },
  { id: "ocean_monument", name: "Ocean Monument", icon: "🏛️" },
  { id: "shipwreck", name: "Shipwreck", icon: "⛵" },
  { id: "mineshaft", name: "Mineshaft", icon: "⛏️" },
  { id: "ancient_city", name: "Ancient City", icon: "🏚️" },
  { id: "amethyst_geode", name: "Amethyst Geode", icon: "💎" },
  { id: "woodland_mansion", name: "Woodland Mansion", icon: "🏰" },
  { id: "desert_pyramid", name: "Desert Pyramid", icon: "🏜️" },
  { id: "jungle_temple", name: "Jungle Temple", icon: "🗿" },
  { id: "igloo", name: "Igloo", icon: "🧊" },
  { id: "pillager_outpost", name: "Pillager Outpost", icon: "🗼" },
  { id: "ruined_portal", name: "Ruined Portal", icon: "🌀" },
  { id: "buried_treasure", name: "Buried Treasure", icon: "💰" },
  { id: "swamp_hut", name: "Swamp Hut", icon: "🛖" },
  { id: "stronghold", name: "Stronghold", icon: "🏗️" },
  { id: "ocean_ruin", name: "Ocean Ruin", icon: "🏚️" },
  { id: "trail_ruin", name: "Trail Ruin", icon: "🗺️" },
  { id: "trial_chambers", name: "Trial Chambers", icon: "⚔️" },
];
