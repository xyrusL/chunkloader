"use client";

import { getBiomeCategories, getBiomesForDimension } from "@/lib/biome-data";
import { Biome, BIOME_COLORS } from "@/lib/biome-colors";
import type { BiomeOverlayState } from "@/lib/map-overlays";
import type { Dimension } from "@/lib/minecraft-versions";
import { CheckSquareIcon, SparklesIcon, SquareIcon } from "@/components/ui/icons";

interface BiomesPanelProps {
  dimension: Dimension;
  settings: BiomeOverlayState;
  onSettingsChange: (settings: BiomeOverlayState) => void;
  compact?: boolean;
  hideTitle?: boolean;
}

export default function BiomesPanel({
  dimension,
  settings,
  onSettingsChange,
  compact = false,
  hideTitle = false,
}: BiomesPanelProps) {
  const { highlightBiomes, selectedBiomes } = settings;
  const biomeCategories = getBiomeCategories(dimension);
  const visibleBiomes = getBiomesForDimension(dimension);

  const update = (patch: Partial<BiomeOverlayState>) => {
    onSettingsChange({ ...settings, ...patch });
  };

  const toggleBiome = (biome: Biome) => {
    const next = new Set(selectedBiomes);
    if (next.has(biome)) {
      next.delete(biome);
    } else {
      next.add(biome);
    }
    update({ selectedBiomes: next });
  };

  const selectAll = () => {
    update({ selectedBiomes: new Set(visibleBiomes) });
  };

  const clearAll = () => {
    update({ selectedBiomes: new Set() });
  };

  const invert = () => {
    const next = new Set<Biome>();
    visibleBiomes.forEach((biome) => {
      if (!selectedBiomes.has(biome)) {
        next.add(biome);
      }
    });
    update({ selectedBiomes: next });
  };

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-6">
      {!hideTitle && <h3 className="mb-4 text-base font-semibold text-white">Biomes</h3>}

      {/* Highlight toggle */}
      <label className="flex items-center gap-3 cursor-pointer mb-3">
        <button
          type="button"
          onClick={() => update({ highlightBiomes: !highlightBiomes })}
          className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
            highlightBiomes ? "bg-emerald-500" : "bg-white/10"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              highlightBiomes ? "translate-x-5" : ""
            }`}
          />
        </button>
        <span className="text-sm text-gray-300">Highlight selected biomes</span>
      </label>

      <p className="text-sm text-gray-500 mb-3">
        Selected biomes: <span className="text-gray-300 font-medium">{selectedBiomes.size}</span>
      </p>

      {/* Action buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={selectAll}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs 
                     text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <CheckSquareIcon className="h-3.5 w-3.5" />
          <span>Select all</span>
        </button>
        <button
          onClick={clearAll}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs 
                     text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <SquareIcon className="h-3.5 w-3.5" />
          <span>Clear</span>
        </button>
        <button
          onClick={invert}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs 
                     text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <SparklesIcon className="h-3.5 w-3.5" />
          <span>Invert</span>
        </button>
      </div>

      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "md:grid-cols-2 xl:grid-cols-3"}`}>
        {biomeCategories.map((category) => (
          <div key={category.name} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-white/5 pb-1">
              {category.name}
            </h4>
            <div className="space-y-1">
              {category.biomes.map((biome) => {
                const color = BIOME_COLORS[biome];
                const isSelected = selectedBiomes.has(biome);
                return (
                  <label
                    key={biome}
                    className="flex items-center gap-2 cursor-pointer group py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleBiome(biome)}
                      className="accent-emerald-500 w-3.5 h-3.5 shrink-0"
                    />
                    <span
                      className="w-3 h-3 rounded-sm shrink-0 border border-white/10"
                      style={{
                        backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                      }}
                    />
                    <span
                      className={`text-xs transition-colors ${
                        isSelected
                          ? "text-gray-200"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    >
                      {biome}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
