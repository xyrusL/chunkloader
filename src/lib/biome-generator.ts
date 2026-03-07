/**
 * Biome generator — classifies coordinates into Minecraft biomes
 * using multi-layer seeded noise (temperature, humidity, continentalness, erosion).
 */

import { SeededNoise, hashSeed } from "./noise";
import { Biome } from "./biome-colors";
import type { Edition } from "./minecraft-versions";

interface NoiseConfig {
  tempScale: number;
  humidScale: number;
  contScale: number;
  erosionScale: number;
  weirdScale: number;
}

const JAVA_NOISE: NoiseConfig = {
  tempScale: 0.0025,
  humidScale: 0.003,
  contScale: 0.0015,
  erosionScale: 0.002,
  weirdScale: 0.004,
};

const BEDROCK_NOISE: NoiseConfig = {
  tempScale: 0.003,
  humidScale: 0.0035,
  contScale: 0.002,
  erosionScale: 0.0025,
  weirdScale: 0.005,
};

export class BiomeGenerator {
  private tempNoise: SeededNoise;
  private humidNoise: SeededNoise;
  private contNoise: SeededNoise;
  private erosionNoise: SeededNoise;
  private weirdNoise: SeededNoise;
  private config: NoiseConfig;

  constructor(seed: string, edition: Edition) {
    const s = typeof seed === "string" ? hashSeed(seed) : Number(seed);
    this.tempNoise = new SeededNoise(s);
    this.humidNoise = new SeededNoise(s + 1000);
    this.contNoise = new SeededNoise(s + 2000);
    this.erosionNoise = new SeededNoise(s + 3000);
    this.weirdNoise = new SeededNoise(s + 4000);
    this.config = edition === "java" ? JAVA_NOISE : BEDROCK_NOISE;
  }

  /** Get biome at world coordinate (blockX, blockZ) */
  getBiomeAt(x: number, z: number): Biome {
    const cfg = this.config;

    const temp = this.tempNoise.fractal(x * cfg.tempScale, z * cfg.tempScale, 5);
    const humid = this.humidNoise.fractal(x * cfg.humidScale, z * cfg.humidScale, 5);
    const cont = this.contNoise.fractal(x * cfg.contScale, z * cfg.contScale, 4);
    const erosion = this.erosionNoise.fractal(x * cfg.erosionScale, z * cfg.erosionScale, 4);
    const weird = this.weirdNoise.fractal(x * cfg.weirdScale, z * cfg.weirdScale, 3);

    return this.classify(temp, humid, cont, erosion, weird);
  }

  /** 
   * Generate biomes for a rectangular area.
   * Returns a flat Uint8Array of [r,g,b,r,g,b,...] for each pixel.
   */
  generateArea(
    startX: number,
    startZ: number,
    width: number,
    height: number,
    scale: number
  ): { biomes: Biome[][]; } {
    const biomes: Biome[][] = [];
    
    for (let dz = 0; dz < height; dz++) {
      const row: Biome[] = [];
      for (let dx = 0; dx < width; dx++) {
        const worldX = startX + dx * scale;
        const worldZ = startZ + dz * scale;
        row.push(this.getBiomeAt(worldX, worldZ));
      }
      biomes.push(row);
    }

    return { biomes };
  }

  private classify(
    temp: number,
    humid: number,
    cont: number,
    erosion: number,
    weird: number
  ): Biome {
    // cont: -1..1 — negative = ocean, positive = land
    // temp: -1..1 — negative = cold, positive = hot
    // humid: -1..1 — negative = dry, positive = wet

    // --- OCEAN ---
    if (cont < -0.45) {
      if (cont < -0.7) {
        // Deep ocean
        if (temp < -0.5) return Biome.DeepFrozenOcean;
        if (temp < -0.15) return Biome.DeepColdOcean;
        if (temp > 0.45) return Biome.DeepLukewarmOcean;
        return Biome.DeepOcean;
      }
      // Shallow ocean
      if (temp < -0.5) return Biome.FrozenOcean;
      if (temp < -0.15) return Biome.ColdOcean;
      if (temp > 0.5) return Biome.WarmOcean;
      if (temp > 0.2) return Biome.LukewarmOcean;
      return Biome.Ocean;
    }

    // --- BEACH / SHORE (transition) ---
    if (cont < -0.3) {
      if (temp < -0.4) return Biome.SnowyBeach;
      if (erosion > 0.4) return Biome.StonyShore;
      return Biome.Beach;
    }

    // --- RIVER ---
    if (Math.abs(weird) < 0.04 && cont > -0.3 && cont < 0.6) {
      if (temp < -0.35) return Biome.FrozenRiver;
      return Biome.River;
    }

    // --- LAND ---

    // Mushroom (rare — check weird noise)
    if (weird > 0.85 && cont < -0.1 && humid > 0.3) {
      return Biome.MushroomFields;
    }

    // --- MOUNTAINS / PEAKS (high continentalness, low erosion) ---
    if (cont > 0.55 && erosion < -0.2) {
      if (temp < -0.5) return Biome.FrozenPeaks;
      if (temp < -0.2) return Biome.JaggedPeaks;
      if (temp < 0.1) return Biome.StonyPeaks;
      if (temp < 0.3) {
        if (humid > 0.3) return Biome.Meadow;
        return Biome.WindsweptHills;
      }
      return Biome.SavannaPlateau;
    }

    // --- SLOPES ---
    if (cont > 0.4 && erosion < 0.1) {
      if (temp < -0.4) return Biome.SnowySlopes;
      if (temp < -0.1) return Biome.Grove;
      if (humid > 0.4) return Biome.CherryGrove;
      return Biome.Meadow;
    }

    // --- WINDSWEPT ---
    if (cont > 0.3 && erosion < -0.3) {
      if (humid > 0.2) return Biome.WindsweptForest;
      if (weird > 0.3) return Biome.WindsweptGravelly;
      return Biome.WindsweptHills;
    }

    // --- LOW LAND BIOMES ---

    // Very cold
    if (temp < -0.5) {
      if (humid > 0.3) return Biome.SnowyTaiga;
      if (weird > 0.5) return Biome.IceSpikes;
      return Biome.SnowyPlains;
    }

    // Cold
    if (temp < -0.15) {
      if (humid > 0.3) return Biome.OldGrowthSpruceTaiga;
      if (humid > 0.0) return Biome.Taiga;
      return Biome.OldGrowthPineTaiga;
    }

    // Temperate
    if (temp < 0.2) {
      if (humid > 0.55) return Biome.DarkForest;
      if (humid > 0.3) return Biome.BirchForest;
      if (humid > 0.0) return Biome.Forest;
      if (humid > -0.3) return Biome.Plains;
      if (humid > -0.5) return Biome.FlowerForest;
      return Biome.SunflowerPlains;
    }

    // Warm
    if (temp < 0.5) {
      if (humid > 0.5) {
        if (weird > 0.3) return Biome.MangroveSwamp;
        return Biome.Swamp;
      }
      if (humid > 0.2) return Biome.Jungle;
      if (humid > 0.0) return Biome.SparseJungle;
      if (humid > -0.2) return Biome.BambooJungle;
      return Biome.Savanna;
    }

    // Hot
    if (humid > 0.2) {
      if (weird > 0.3) return Biome.ErodedBadlands;
      return Biome.Badlands;
    }
    if (humid > -0.2) return Biome.Savanna;
    return Biome.Desert;
  }
}
