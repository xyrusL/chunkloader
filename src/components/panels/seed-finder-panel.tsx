"use client";

import { useState } from "react";
import { ALL_OVERWORLD_BIOMES, STRUCTURE_TYPES } from "@/lib/biome-data";
import { Biome } from "@/lib/biome-colors";

export default function SeedFinderPanel() {
  const [highlightFound, setHighlightFound] = useState(false);
  const [selectedBiomes, setSelectedBiomes] = useState<Biome[]>([]);
  const [selectedStructures, setSelectedStructures] = useState<string[]>([]);
  const [biomeRange, setBiomeRange] = useState(300);
  const [structureRange, setStructureRange] = useState(300);
  const [biomeDropdownOpen, setBiomeDropdownOpen] = useState(false);
  const [structureDropdownOpen, setStructureDropdownOpen] = useState(false);

  return (
    <div className="p-5">
      <h3 className="text-base font-semibold text-white mb-4">Seed finder</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left — Controls */}
        <div className="space-y-5">
          {/* Highlight toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              onClick={() => setHighlightFound(!highlightFound)}
              className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
                highlightFound ? "bg-emerald-500" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  highlightFound ? "translate-x-5" : ""
                }`}
              />
            </button>
            <span className="text-sm text-gray-300">Highlight found biomes</span>
          </label>

          {/* Biomes Wanted */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Biomes wanted:</label>
            <div className="relative">
              <button
                onClick={() => setBiomeDropdownOpen(!biomeDropdownOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-left
                           text-gray-400 hover:border-white/20 transition-colors flex items-center justify-between"
              >
                <span>{selectedBiomes.length > 0 ? `${selectedBiomes.length} selected` : "Select biomes"}</span>
                <span className="text-gray-500">▾</span>
              </button>
              {biomeDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-[#1a1a2e] border border-white/10 
                                rounded-lg shadow-xl">
                  {ALL_OVERWORLD_BIOMES.map((biome) => (
                    <label
                      key={biome}
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 cursor-pointer text-sm text-gray-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBiomes.includes(biome)}
                        onChange={() => {
                          setSelectedBiomes((prev) =>
                            prev.includes(biome) ? prev.filter((b) => b !== biome) : [...prev, biome]
                          );
                        }}
                        className="accent-emerald-500"
                      />
                      {biome}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">within</span>
              <select
                value={biomeRange}
                onChange={(e) => setBiomeRange(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-300 
                           focus:outline-none appearance-none cursor-pointer"
              >
                <option value={100}>100 blocks</option>
                <option value={300}>300 blocks</option>
                <option value={500}>500 blocks</option>
                <option value={1000}>1000 blocks</option>
                <option value={3000}>3000 blocks</option>
              </select>
              <span className="text-xs text-gray-500">from (0,0)</span>
            </div>
          </div>

          {/* Structures Wanted */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Structures wanted:</label>
            <div className="relative">
              <button
                onClick={() => setStructureDropdownOpen(!structureDropdownOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-left
                           text-gray-400 hover:border-white/20 transition-colors flex items-center justify-between"
              >
                <span>{selectedStructures.length > 0 ? `${selectedStructures.length} selected` : "Select structures"}</span>
                <span className="text-gray-500">▾</span>
              </button>
              {structureDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-[#1a1a2e] border border-white/10 
                                rounded-lg shadow-xl">
                  {STRUCTURE_TYPES.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 cursor-pointer text-sm text-gray-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStructures.includes(s.id)}
                        onChange={() => {
                          setSelectedStructures((prev) =>
                            prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
                          );
                        }}
                        className="accent-emerald-500"
                      />
                      <span>{s.icon}</span>
                      {s.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">within</span>
              <select
                value={structureRange}
                onChange={(e) => setStructureRange(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-300 
                           focus:outline-none appearance-none cursor-pointer"
              >
                <option value={100}>100 blocks</option>
                <option value={300}>300 blocks</option>
                <option value={500}>500 blocks</option>
                <option value={1000}>1000 blocks</option>
                <option value={3000}>3000 blocks</option>
              </select>
              <span className="text-xs text-gray-500">from (0,0)</span>
            </div>
          </div>

          {/* Find button */}
          <button className="w-full flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5
                             text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <span>🔍</span>
            <span>Find next seed</span>
          </button>
        </div>

        {/* Right — Tips */}
        <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Tips:</h4>
          <ul className="space-y-2 text-xs text-gray-400 list-disc list-inside">
            <li>Choose larger ranges if there are no results for a long time.</li>
            <li>
              The arrangement of biomes in Minecraft 1.18+ is not completely random, for example
              you will not find hot desert and cold snow biomes right next to each other.
            </li>
            <li>Most structures only generate in certain biomes.</li>
            <li>The seed finder uses CPU power. On mobile devices, the CPU uses battery power.</li>
            <li>
              Try Cubiomes Viewer for advanced and fast seed finding.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
