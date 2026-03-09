/**
 * Biome generator — classifies coordinates into Minecraft biomes
 * using multi-layer seeded noise (temperature, humidity, continentalness, erosion).
 */

import { SeededNoise, hashSeed } from "./noise";
import { Biome, BIOME_INDEX, BIOME_VALUES } from "./biome-colors";
import type { Dimension, Edition } from "./minecraft-versions";

interface NoiseConfig {
  tempScale: number;
  humidScale: number;
  contScale: number;
  erosionScale: number;
  weirdScale: number;
}

interface ClimateSample {
  temp: number;
  humid: number;
  cont: number;
  erosion: number;
  weird: number;
}

interface TerrainTile {
  biomeIndices: Uint8Array;
  heights: Uint16Array;
  slopes: Uint8Array;
  lights: Uint8Array;
}

export interface TerrainSample {
  biomeIndex: number;
  height: number;
  slope: number;
  light: number;
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

const BIOME_TILE_SIZE = 32;
const MAX_TILE_CACHE_SIZE = 384;

function floorDiv(value: number, divisor: number): number {
  return Math.floor(value / divisor);
}

function positiveMod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

export class BiomeGenerator {
  private tempNoise: SeededNoise;
  private humidNoise: SeededNoise;
  private contNoise: SeededNoise;
  private erosionNoise: SeededNoise;
  private weirdNoise: SeededNoise;
  private ridgeNoise: SeededNoise;
  private terrainNoise: SeededNoise;
  private detailNoise: SeededNoise;
  private config: NoiseConfig;
  private dimension: Dimension;
  private tileCache = new Map<string, TerrainTile>();

  constructor(seed: string, edition: Edition, dimension: Dimension) {
    const s = typeof seed === "string" ? hashSeed(seed) : Number(seed);
    this.tempNoise = new SeededNoise(s);
    this.humidNoise = new SeededNoise(s + 1000);
    this.contNoise = new SeededNoise(s + 2000);
    this.erosionNoise = new SeededNoise(s + 3000);
    this.weirdNoise = new SeededNoise(s + 4000);
    this.ridgeNoise = new SeededNoise(s + 5000);
    this.terrainNoise = new SeededNoise(s + 6000);
    this.detailNoise = new SeededNoise(s + 7000);
    this.config = edition === "java" ? JAVA_NOISE : BEDROCK_NOISE;
    this.dimension = dimension;
  }

  /** Get biome at world coordinate (blockX, blockZ) */
  getBiomeAt(x: number, z: number): Biome {
    return BIOME_VALUES[this.getBiomeIndexAt(x, z)];
  }

  getBiomeIndexAt(x: number, z: number): number {
    const climate = this.sampleClimate(x, z);
    return BIOME_INDEX[this.classify(climate)];
  }

  getBiomeIndexFromTile(worldX: number, worldZ: number, scale: number): number {
    const sampleScale = Math.max(1, scale);
    const sampleX = floorDiv(worldX, sampleScale);
    const sampleZ = floorDiv(worldZ, sampleScale);
    const tileX = floorDiv(sampleX, BIOME_TILE_SIZE);
    const tileZ = floorDiv(sampleZ, BIOME_TILE_SIZE);
    const tile = this.getTile(tileX, tileZ, sampleScale);
    const localX = positiveMod(sampleX, BIOME_TILE_SIZE);
    const localZ = positiveMod(sampleZ, BIOME_TILE_SIZE);

    return tile.biomeIndices[localZ * BIOME_TILE_SIZE + localX];
  }

  getTerrainSampleFromTile(worldX: number, worldZ: number, scale: number): TerrainSample {
    const sampleScale = Math.max(1, scale);
    const sampleX = floorDiv(worldX, sampleScale);
    const sampleZ = floorDiv(worldZ, sampleScale);
    const tileX = floorDiv(sampleX, BIOME_TILE_SIZE);
    const tileZ = floorDiv(sampleZ, BIOME_TILE_SIZE);
    const tile = this.getTile(tileX, tileZ, sampleScale);
    const localX = positiveMod(sampleX, BIOME_TILE_SIZE);
    const localZ = positiveMod(sampleZ, BIOME_TILE_SIZE);
    const index = localZ * BIOME_TILE_SIZE + localX;

    return {
      biomeIndex: tile.biomeIndices[index],
      height: tile.heights[index] / 65535,
      slope: tile.slopes[index] / 255,
      light: tile.lights[index] / 255,
    };
  }

  /**
   * Generate biomes for a rectangular area using the shared tile cache.
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
        row.push(BIOME_VALUES[this.getBiomeIndexFromTile(worldX, worldZ, scale)]);
      }
      biomes.push(row);
    }

    return { biomes };
  }

  private getTile(tileX: number, tileZ: number, scale: number): TerrainTile {
    const key = `${scale}:${tileX}:${tileZ}`;
    const cachedTile = this.tileCache.get(key);
    if (cachedTile) {
      this.tileCache.delete(key);
      this.tileCache.set(key, cachedTile);
      return cachedTile;
    }

    const tile: TerrainTile = {
      biomeIndices: new Uint8Array(BIOME_TILE_SIZE * BIOME_TILE_SIZE),
      heights: new Uint16Array(BIOME_TILE_SIZE * BIOME_TILE_SIZE),
      slopes: new Uint8Array(BIOME_TILE_SIZE * BIOME_TILE_SIZE),
      lights: new Uint8Array(BIOME_TILE_SIZE * BIOME_TILE_SIZE),
    };
    const startSampleX = tileX * BIOME_TILE_SIZE;
    const startSampleZ = tileZ * BIOME_TILE_SIZE;
    const stride = BIOME_TILE_SIZE + 2;
    const heights = new Float32Array(stride * stride);

    for (let z = -1; z <= BIOME_TILE_SIZE; z++) {
      for (let x = -1; x <= BIOME_TILE_SIZE; x++) {
        const worldX = (startSampleX + x) * scale;
        const worldZ = (startSampleZ + z) * scale;
        const climate = this.sampleClimate(worldX, worldZ);
        const height = this.estimateHeight(climate, worldX, worldZ);
        const gridOffset = (z + 1) * stride + (x + 1);
        heights[gridOffset] = height;

        if (x >= 0 && x < BIOME_TILE_SIZE && z >= 0 && z < BIOME_TILE_SIZE) {
          const tileOffset = z * BIOME_TILE_SIZE + x;
          tile.biomeIndices[tileOffset] = BIOME_INDEX[this.classify(climate)];
        }
      }
    }

    for (let z = 0; z < BIOME_TILE_SIZE; z++) {
      for (let x = 0; x < BIOME_TILE_SIZE; x++) {
        const gridOffset = (z + 1) * stride + (x + 1);
        const left = heights[gridOffset - 1];
        const right = heights[gridOffset + 1];
        const up = heights[gridOffset - stride];
        const down = heights[gridOffset + stride];
        const tileOffset = z * BIOME_TILE_SIZE + x;
        const height = heights[gridOffset];
        const dx = ((right - left) / Math.max(1, scale)) * 56;
        const dz = ((down - up) / Math.max(1, scale)) * 56;
        const slope = clamp01(Math.hypot(dx, dz));
        const light = clamp01(0.62 - dx * 0.72 - dz * 0.54 - slope * 0.08);

        tile.heights[tileOffset] = Math.round(height * 65535);
        tile.slopes[tileOffset] = Math.round(slope * 255);
        tile.lights[tileOffset] = Math.round(light * 255);
      }
    }

    this.tileCache.set(key, tile);
    if (this.tileCache.size > MAX_TILE_CACHE_SIZE) {
      const firstKey = this.tileCache.keys().next().value;
      if (firstKey) {
        this.tileCache.delete(firstKey);
      }
    }

    return tile;
  }

  private sampleClimate(x: number, z: number): ClimateSample {
    const cfg = this.config;

    return {
      temp: this.tempNoise.fractal(x * cfg.tempScale, z * cfg.tempScale, 5),
      humid: this.humidNoise.fractal(x * cfg.humidScale, z * cfg.humidScale, 5),
      cont: this.contNoise.fractal(x * cfg.contScale, z * cfg.contScale, 4),
      erosion: this.erosionNoise.fractal(x * cfg.erosionScale, z * cfg.erosionScale, 4),
      weird: this.weirdNoise.fractal(x * cfg.weirdScale, z * cfg.weirdScale, 3),
    };
  }

  private estimateHeight(climate: ClimateSample, x: number, z: number): number {
    if (this.dimension === "nether") {
      return this.estimateNetherHeight(climate, x, z);
    }

    if (this.dimension === "end") {
      return this.estimateEndHeight(x, z);
    }

    return this.estimateOverworldHeight(climate, x, z);
  }

  private estimateOverworldHeight(climate: ClimateSample, x: number, z: number): number {
    const macro = normalizeSigned(this.terrainNoise.fractal(x * 0.0012, z * 0.0012, 5, 2.05, 0.5));
    const ridge = 1 - Math.abs(this.ridgeNoise.fractal(x * 0.0024, z * 0.0024, 5, 2.1, 0.52));
    const detail = this.detailNoise.fractal(x * 0.008, z * 0.008, 4, 2.2, 0.48);
    const continentalLift = climate.cont * 0.22;
    const macroLift = macro * 0.07;
    const erosionResistance = 1 - normalizeSigned(climate.erosion);
    const mountainMask = smoothstep(0.16, 0.78, normalizeSigned(climate.cont))
      * smoothstep(0.22, 0.94, erosionResistance);
    const plateauMask = smoothstep(0.08, 0.7, normalizeSigned(climate.cont))
      * smoothstep(0.18, 0.78, normalizeSigned(climate.erosion));
    const ridgeLift = mountainMask * (0.08 + ridge * 0.24 + macro * 0.06);
    const plateauLift = plateauMask * Math.max(0, macro) * 0.08;
    const valleyCut = smoothstep(0.42, 1, normalizeSigned(climate.erosion)) * (0.03 + (1 - ridge) * 0.04);
    const detailLift = detail * (0.02 + mountainMask * 0.05 + plateauMask * 0.02);

    return clamp01(0.42 + continentalLift + macroLift + ridgeLift + plateauLift + detailLift - valleyCut);
  }

  private estimateNetherHeight(climate: ClimateSample, x: number, z: number): number {
    const macro = normalizeSigned(this.terrainNoise.fractal(x * 0.0028, z * 0.0028, 4, 2.15, 0.52));
    const ridge = 1 - Math.abs(this.ridgeNoise.fractal(x * 0.0052, z * 0.0052, 4, 2.25, 0.55));
    const detail = this.detailNoise.fractal(x * 0.012, z * 0.012, 4, 2.35, 0.48);
    const basin = smoothstep(0.2, 0.82, normalizeSigned(climate.cont));
    const roughness = 1 - normalizeSigned(climate.erosion);
    return clamp01(0.5 + macro * 0.1 + ridge * 0.22 + detail * (0.04 + roughness * 0.08) - basin * 0.08);
  }

  private estimateEndHeight(x: number, z: number): number {
    const distance = Math.hypot(x, z);
    const islandNoise = normalizeSigned(this.terrainNoise.fractal(x * 0.0018, z * 0.0018, 5, 2.05, 0.5));
    const ridge = 1 - Math.abs(this.ridgeNoise.fractal(x * 0.0046, z * 0.0046, 4, 2.1, 0.52));
    const detail = this.detailNoise.fractal(x * 0.009, z * 0.009, 3, 2.2, 0.46);
    const centralIsland = smoothstep(1800, 0, distance) * 0.45;
    const outerIslands = smoothstep(1200, 5400, distance) * islandNoise * 0.42;
    return clamp01(0.06 + centralIsland + outerIslands + ridge * 0.1 + detail * 0.04);
  }

  private classify(climate: ClimateSample): Biome {
    if (this.dimension === "nether") {
      return this.classifyNether(climate);
    }

    if (this.dimension === "end") {
      return Biome.TheEnd;
    }

    return this.classifyOverworld(
      climate.temp,
      climate.humid,
      climate.cont,
      climate.erosion,
      climate.weird
    );
  }

  private classifyNether(climate: ClimateSample): Biome {
    const heat = climate.temp;
    const humidity = climate.humid;
    const basin = climate.cont;
    const erosion = climate.erosion;
    const weird = climate.weird;

    if (erosion < -0.35 && basin > -0.1) {
      return Biome.BasaltDeltas;
    }

    if (weird > 0.22 && humidity > -0.05) {
      return Biome.WarpedForest;
    }

    if (weird < -0.18 && heat > -0.2) {
      return Biome.CrimsonForest;
    }

    if (basin < -0.18 || Math.abs(weird) < 0.1) {
      return Biome.SoulSandValley;
    }

    return Biome.NetherWastes;
  }

  private classifyOverworld(
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

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function normalizeSigned(value: number): number {
  return (value + 1) * 0.5;
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1;
  }

  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
