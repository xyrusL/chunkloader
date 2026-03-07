"use client";

import { useState, useCallback } from "react";
import TopBar from "@/components/top-bar";
import SeedInputPanel from "@/components/seed-input-panel";
import MapInfoBar from "@/components/map-info-bar";
import MapCanvas from "@/components/map-canvas";
import BottomTabs from "@/components/bottom-tabs";
import SeedVersionPanel from "@/components/panels/seed-version-panel";
import MapSettingsPanel, { DEFAULT_MAP_SETTINGS } from "@/components/panels/map-settings-panel";
import type { MapSettingsState } from "@/components/panels/map-settings-panel";
import SeedFinderPanel from "@/components/panels/seed-finder-panel";
import MarkersPanel from "@/components/panels/markers-panel";
import BiomesPanel from "@/components/panels/biomes-panel";
import type { Edition, MinecraftVersion } from "@/lib/minecraft-versions";

export default function Home() {
  const [seed, setSeed] = useState("");
  const [version, setVersion] = useState("1.21");
  const [edition, setEdition] = useState<Edition>("java");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("seed");
  const [mapSettings, setMapSettings] = useState<MapSettingsState>(DEFAULT_MAP_SETTINGS);

  // Hovered biome info
  const [hoveredBiome, setHoveredBiome] = useState("");
  const [hoveredX, setHoveredX] = useState(0);
  const [hoveredZ, setHoveredZ] = useState(0);

  const handleGenerate = (newSeed: string, newVersion: MinecraftVersion, newEdition: Edition) => {
    setSeed(newSeed);
    setVersion(newVersion.id);
    setEdition(newEdition);
    setIsGenerating(true);
  };

  const handleBiomeHover = useCallback((biome: string, x: number, z: number) => {
    setHoveredBiome(biome);
    setHoveredX(x);
    setHoveredZ(z);
  }, []);

  const handleGenerationComplete = useCallback(() => {
    setIsGenerating(false);
  }, []);

  // Render the active tab panel
  const renderPanel = () => {
    switch (activeTab) {
      case "seed":
        return <SeedVersionPanel seed={seed} version={version} edition={edition} />;
      case "settings":
        return <MapSettingsPanel settings={mapSettings} onSettingsChange={setMapSettings} />;
      case "finder":
        return <SeedFinderPanel />;
      case "markers":
        return <MarkersPanel />;
      case "biomes":
        return <BiomesPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <TopBar seed={seed} version={version} edition={edition} />
      <SeedInputPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
      <section className="flex h-[calc(100vh-17rem)] min-h-[22rem] flex-col border-b border-white/5">
        <MapInfoBar
          biome={hoveredBiome}
          x={hoveredX}
          z={hoveredZ}
          version={version}
          edition={edition}
          seed={seed}
        />
        <div className="min-h-0 flex-1">
          <MapCanvas
            seed={seed}
            edition={edition}
            isGenerating={isGenerating}
            settings={mapSettings}
            onBiomeHover={handleBiomeHover}
            onGenerationComplete={handleGenerationComplete}
          />
        </div>
      </section>

      <section className="bg-[#090916]">
        <div className="shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="bg-[#111124]">
          <div className="mx-auto w-full max-w-7xl">
            {renderPanel()}
          </div>
        </div>
      </section>
    </div>
  );
}
