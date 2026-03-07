import type { Biome } from "./biome-colors";
import { STRUCTURE_TYPES, type StructureType } from "./biome-data";
import { hashSeed, mulberry32 } from "./noise";

export interface MarkerSettingsState {
  spawnPoint: boolean;
  slimeChunks: boolean;
  structuresEnabled: boolean;
  selectedStructures: Set<string>;
}

export interface BiomeOverlayState {
  highlightBiomes: boolean;
  selectedBiomes: Set<Biome>;
}

export interface MapViewportState {
  offsetX: number;
  offsetY: number;
  zoom: number;
  sampleScale: number;
  canvasWidth: number;
  canvasHeight: number;
}

export interface WorldBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface VisibleStructureMarker {
  structure: StructureType;
  x: number;
  z: number;
}

export function createDefaultMarkerSettings(): MarkerSettingsState {
  return {
    spawnPoint: true,
    slimeChunks: false,
    structuresEnabled: true,
    selectedStructures: new Set(["village"]),
  };
}

export function createDefaultBiomeOverlayState(): BiomeOverlayState {
  return {
    highlightBiomes: false,
    selectedBiomes: new Set(),
  };
}

export function getWorldBounds(viewport: MapViewportState): WorldBounds {
  const pixelsPerBlock = getPixelsPerBlock(viewport);
  return {
    minX: Math.floor(-viewport.offsetX / pixelsPerBlock),
    maxX: Math.ceil((viewport.canvasWidth - viewport.offsetX) / pixelsPerBlock),
    minZ: Math.floor(-viewport.offsetY / pixelsPerBlock),
    maxZ: Math.ceil((viewport.canvasHeight - viewport.offsetY) / pixelsPerBlock),
  };
}

export function getPixelsPerBlock(viewport: MapViewportState): number {
  return Math.max(0.01, (4 * viewport.zoom) / Math.max(1, viewport.sampleScale));
}

export function isSlimeChunk(seed: string, chunkX: number, chunkZ: number): boolean {
  const value = hashSeed(`${seed}:${chunkX}:${chunkZ}:slime`);
  return Math.abs(value % 10) === 0;
}

export function getVisibleStructureMarkers(
  seed: string,
  selectedStructureIds: Set<string>,
  bounds: WorldBounds
): VisibleStructureMarker[] {
  const visibleMarkers: VisibleStructureMarker[] = [];
  const expandedBounds = {
    minX: bounds.minX - 320,
    maxX: bounds.maxX + 320,
    minZ: bounds.minZ - 320,
    maxZ: bounds.maxZ + 320,
  };

  for (const structure of STRUCTURE_TYPES) {
    if (!selectedStructureIds.has(structure.id)) {
      continue;
    }

    const rng = mulberry32(hashSeed(`${seed}:${structure.id}:markers`));
    for (let index = 0; index < 10; index++) {
      const radius = index === 0
        ? 160 + Math.floor(rng() * 256)
        : 512 + index * 320 + Math.floor(rng() * 192);
      const angle = rng() * Math.PI * 2;
      const x = snapToStructureGrid(Math.cos(angle) * radius);
      const z = snapToStructureGrid(Math.sin(angle) * radius);

      if (
        x >= expandedBounds.minX
        && x <= expandedBounds.maxX
        && z >= expandedBounds.minZ
        && z <= expandedBounds.maxZ
      ) {
        visibleMarkers.push({ structure, x, z });
      }
    }
  }

  return visibleMarkers;
}

function snapToStructureGrid(value: number): number {
  return Math.round(value / 16) * 16;
}
