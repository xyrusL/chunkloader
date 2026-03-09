"use client";

import { useEffect, useState } from "react";
import { getVersionsForEdition } from "@/lib/minecraft-versions";
import type { Edition, MinecraftVersion } from "@/lib/minecraft-versions";
import { CoffeeIcon, DiceIcon, LayersIcon, MapIcon, SpinnerIcon } from "@/components/ui/icons";

interface SeedInputPanelProps {
  onGenerate: (seed: string, version: MinecraftVersion, edition: Edition) => void;
  isGenerating: boolean;
  initialSeed?: string;
  initialEdition?: Edition;
  initialVersionId?: string;
}

export default function SeedInputPanel({
  onGenerate,
  isGenerating,
  initialSeed = "",
  initialEdition = "java",
  initialVersionId,
}: SeedInputPanelProps) {
  const [seed, setSeed] = useState(initialSeed);
  const [edition, setEdition] = useState<Edition>(initialEdition);
  const versions = getVersionsForEdition(edition);
  const [selectedVersion, setSelectedVersion] = useState(
    versions.find((version) => version.id === initialVersionId) ?? versions[0]
  );

  useEffect(() => {
    setSeed(initialSeed);
  }, [initialSeed]);

  useEffect(() => {
    setEdition(initialEdition);
  }, [initialEdition]);

  useEffect(() => {
    const nextVersions = getVersionsForEdition(initialEdition);
    setSelectedVersion(nextVersions.find((version) => version.id === initialVersionId) ?? nextVersions[0]);
  }, [initialEdition, initialVersionId]);

  const handleEditionChange = (newEdition: Edition) => {
    setEdition(newEdition);
    const newVersions = getVersionsForEdition(newEdition);
    setSelectedVersion(newVersions[0]);
  };

  const handleRandom = () => {
    const randomSeed = String(Math.floor(Math.random() * 9999999999) - 4999999999);
    setSeed(randomSeed);
  };

  const handleGenerate = () => {
    if (!seed.trim()) {
      handleRandom();
      return;
    }
    onGenerate(seed, selectedVersion, edition);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleGenerate();
  };

  return (
    <div className="border-b border-white/5 bg-[var(--theme-bg-toolbar)] px-4 py-3 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
        {/* Edition Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-white/10">
          <button
            onClick={() => handleEditionChange("java")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
              edition === "java"
                ? "bg-emerald-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <CoffeeIcon className="h-4 w-4" />
            <span>Java</span>
          </button>
          <button
            onClick={() => handleEditionChange("bedrock")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
              edition === "bedrock"
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <LayersIcon className="h-4 w-4" />
            <span>Bedrock</span>
          </button>
        </div>

        {/* Version Selector */}
        <select
          value={selectedVersion.id}
          onChange={(e) => {
            const v = versions.find((v) => v.id === e.target.value);
            if (v) setSelectedVersion(v);
          }}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                     appearance-none cursor-pointer min-w-[200px]"
        >
          {versions.map((v) => (
            <option key={v.id} value={v.id} className="bg-[#1a1a2e]">
              {v.label}
            </option>
          ))}
        </select>

        {/* Seed Input */}
        <div className="flex-1 flex items-center gap-2 min-w-[250px]">
          <div className="relative flex-1">
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter seed (number or text)..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white 
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 
                         focus:border-emerald-500/50 font-mono"
            />
          </div>
          <button
            onClick={handleRandom}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-gray-300 
                       hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
            title="Random seed"
          >
            <DiceIcon className="h-4 w-4" />
            <span>Random</span>
          </button>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 
                     hover:to-emerald-400 text-white font-semibold text-sm rounded-lg transition-all 
                     shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 
                     disabled:cursor-not-allowed active:scale-95"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              <span>Generate Map</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
