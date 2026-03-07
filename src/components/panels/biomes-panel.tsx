"use client";

import { useState } from "react";
import { BIOME_CATEGORIES, ALL_OVERWORLD_BIOMES } from "@/lib/biome-data";
import { Biome, BIOME_COLORS } from "@/lib/biome-colors";
import { CheckSquareIcon, SparklesIcon, SquareIcon } from "@/components/ui/icons";

export default function BiomesPanel() {
  const [highlightBiomes, setHighlightBiomes] = useState(false);
  const [selectedBiomes, setSelectedBiomes] = useState<Set<Biome>>(new Set());

  const toggleBiome = (biome: Biome) => {
    setSelectedBiomes((prev) => {
      const next = new Set(prev);
      if (next.has(biome)) {
        next.delete(biome);
      } else {
        next.add(biome);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedBiomes(new Set(ALL_OVERWORLD_BIOMES));
  };

  const clearAll = () => {
    setSelectedBiomes(new Set());
  };

  const invert = () => {
    setSelectedBiomes((prev) => {
      const next = new Set<Biome>();
      ALL_OVERWORLD_BIOMES.forEach((b) => {
        if (!prev.has(b)) next.add(b);
      });
      return next;
    });
  };

  return (
    <div className="p-5">
      <h3 className="text-base font-semibold text-white mb-4">Biomes</h3>

      {/* Highlight toggle */}
      <label className="flex items-center gap-3 cursor-pointer mb-3">
        <button
          onClick={() => setHighlightBiomes(!highlightBiomes)}
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
      <div className="flex items-center gap-2 mb-4">
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

      {/* Biome categories grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
        {BIOME_CATEGORIES.map((category) => (
          <div key={category.name}>
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
