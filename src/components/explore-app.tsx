"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TopBar from "@/components/top-bar";
import SeedInputPanel from "@/components/seed-input-panel";
import MapInfoBar from "@/components/map-info-bar";
import MapCanvas from "@/components/map-canvas";
import BottomTabs from "@/components/bottom-tabs";
import SidePanelDrawer from "@/components/side-panel-drawer";
import SeedVersionPanel from "@/components/panels/seed-version-panel";
import MapSettingsPanel, { DEFAULT_MAP_SETTINGS } from "@/components/panels/map-settings-panel";
import type { MapSettingsState } from "@/components/panels/map-settings-panel";
import SeedFinderPanel from "@/components/panels/seed-finder-panel";
import MarkersPanel from "@/components/panels/markers-panel";
import BiomesPanel from "@/components/panels/biomes-panel";
import SeedSidebarPanel from "@/components/panels/seed-sidebar-panel";
import { Biome } from "@/lib/biome-colors";
import { STRUCTURE_TYPES } from "@/lib/biome-data";
import { createDefaultBiomeOverlayState, createDefaultMarkerSettings } from "@/lib/map-overlays";
import { getVersionsForEdition } from "@/lib/minecraft-versions";
import type { Dimension, Edition, MinecraftVersion } from "@/lib/minecraft-versions";
import type { BiomeOverlayState, MarkerSettingsState } from "@/lib/map-overlays";

const STORAGE_KEYS = {
  activeTab: "chunkloader:active-tab",
  dimension: "chunkloader:dimension",
  mapSettings: "chunkloader:map-settings",
  markerSettings: "chunkloader:marker-settings",
  biomeOverlay: "chunkloader:biome-overlay",
} as const;

const VALID_TABS = new Set(["seed", "settings", "finder", "markers", "biomes"]);
const VALID_DIMENSIONS = new Set<Dimension>(["overworld", "nether", "end"]);
const VALID_BIOMES = new Set(Object.values(Biome));
const VALID_STRUCTURES = new Set(STRUCTURE_TYPES.map((structure) => structure.id));

export default function ExploreApp() {
  const [seed, setSeed] = useState("");
  const [version, setVersion] = useState("1.21");
  const [edition, setEdition] = useState<Edition>("java");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("seed");
  const [dimension, setDimension] = useState<Dimension>("overworld");
  const [mapSettings, setMapSettings] = useState<MapSettingsState>(DEFAULT_MAP_SETTINGS);
  const [markerSettings, setMarkerSettings] = useState(createDefaultMarkerSettings);
  const [biomeOverlay, setBiomeOverlay] = useState(createDefaultBiomeOverlayState);
  const [restoredSettings, setRestoredSettings] = useState(false);
  const mapExpandedBeforePanelRef = useRef(false);

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

  const handleToggleMapExpanded = useCallback(() => {
    setIsMapExpanded((current) => {
      const next = !current;
      if (!next) {
        setIsSidePanelOpen(false);
      }
      return next;
    });
  }, []);

  const handleToggleSidePanel = useCallback(() => {
    if (isSidePanelOpen) {
      setIsSidePanelOpen(false);
      setIsMapExpanded(mapExpandedBeforePanelRef.current);
      return;
    }

    mapExpandedBeforePanelRef.current = isMapExpanded;
    setIsMapExpanded(true);
    setIsSidePanelOpen(true);
  }, [isMapExpanded, isSidePanelOpen]);

  const handleCloseSidePanel = useCallback(() => {
    setIsSidePanelOpen(false);
    setIsMapExpanded(mapExpandedBeforePanelRef.current);
  }, []);

  const handleDimensionChange = useCallback((nextDimension: Dimension) => {
    setDimension(nextDimension);
    if (seed) {
      setIsGenerating(true);
    }
  }, [seed]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlSeed = urlParams.get("seed")?.trim() ?? "";
    const urlEditionParam = urlParams.get("edition");
    const urlVersionParam = urlParams.get("version");
    const urlDimensionParam = urlParams.get("dimension");
    const urlEdition: Edition = urlEditionParam === "bedrock" ? "bedrock" : "java";
    const urlVersions = getVersionsForEdition(urlEdition);
    const urlVersion = urlVersions.find((candidate) => candidate.id === urlVersionParam)?.id ?? urlVersions[0].id;
    const urlDimension = VALID_DIMENSIONS.has(urlDimensionParam as Dimension)
      ? (urlDimensionParam as Dimension)
      : "overworld";

    const storedActiveTab = window.localStorage.getItem(STORAGE_KEYS.activeTab);
    if (storedActiveTab && VALID_TABS.has(storedActiveTab)) {
      setActiveTab(storedActiveTab);
    }

    const storedDimension = window.localStorage.getItem(STORAGE_KEYS.dimension);
    if (storedDimension && VALID_DIMENSIONS.has(storedDimension as Dimension)) {
      setDimension(storedDimension as Dimension);
    }

    const storedMapSettings = parseStoredJson<Partial<MapSettingsState>>(window.localStorage.getItem(STORAGE_KEYS.mapSettings));
    if (storedMapSettings) {
      setMapSettings((current) => ({
        ...current,
        ...storedMapSettings,
      }));
    }

    const storedMarkerSettings = parseStoredJson<Partial<StoredMarkerSettings>>(window.localStorage.getItem(STORAGE_KEYS.markerSettings));
    if (storedMarkerSettings) {
      setMarkerSettings((current) => ({
        spawnPoint: typeof storedMarkerSettings.spawnPoint === "boolean" ? storedMarkerSettings.spawnPoint : current.spawnPoint,
        slimeChunks: typeof storedMarkerSettings.slimeChunks === "boolean" ? storedMarkerSettings.slimeChunks : current.slimeChunks,
        structuresEnabled: typeof storedMarkerSettings.structuresEnabled === "boolean" ? storedMarkerSettings.structuresEnabled : current.structuresEnabled,
        selectedStructures: storedMarkerSettings.selectedStructures
          ? new Set(storedMarkerSettings.selectedStructures.filter((structureId) => VALID_STRUCTURES.has(structureId)))
          : current.selectedStructures,
      }));
    }

    const storedBiomeOverlay = parseStoredJson<Partial<StoredBiomeOverlay>>(window.localStorage.getItem(STORAGE_KEYS.biomeOverlay));
    if (storedBiomeOverlay) {
      setBiomeOverlay((current) => ({
        highlightBiomes: typeof storedBiomeOverlay.highlightBiomes === "boolean"
          ? storedBiomeOverlay.highlightBiomes
          : current.highlightBiomes,
        selectedBiomes: storedBiomeOverlay.selectedBiomes
          ? new Set(storedBiomeOverlay.selectedBiomes.filter((biome) => VALID_BIOMES.has(biome)))
          : current.selectedBiomes,
      }));
    }

    if (urlSeed) {
      setSeed(urlSeed);
      setEdition(urlEdition);
      setVersion(urlVersion);
      setDimension(urlDimension);
      setIsGenerating(true);
    }

    setRestoredSettings(true);
  }, []);

  useEffect(() => {
    if (!restoredSettings || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.activeTab, activeTab);
    window.localStorage.setItem(STORAGE_KEYS.dimension, dimension);
    window.localStorage.setItem(STORAGE_KEYS.mapSettings, JSON.stringify(mapSettings));
    window.localStorage.setItem(
      STORAGE_KEYS.markerSettings,
      JSON.stringify({
        ...markerSettings,
        selectedStructures: Array.from(markerSettings.selectedStructures),
      })
    );
    window.localStorage.setItem(
      STORAGE_KEYS.biomeOverlay,
      JSON.stringify({
        ...biomeOverlay,
        selectedBiomes: Array.from(biomeOverlay.selectedBiomes),
      })
    );
  }, [activeTab, biomeOverlay, dimension, mapSettings, markerSettings, restoredSettings]);

  useEffect(() => {
    if (!restoredSettings || typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    if (seed) {
      url.searchParams.set("seed", seed);
      url.searchParams.set("version", version);
      url.searchParams.set("edition", edition);
      url.searchParams.set("dimension", dimension);
    } else {
      url.searchParams.delete("seed");
      url.searchParams.delete("version");
      url.searchParams.delete("edition");
      url.searchParams.delete("dimension");
    }

    window.history.replaceState({}, "", url);
  }, [dimension, edition, restoredSettings, seed, version]);

  useEffect(() => {
    const escapeMode = !isMapExpanded ? "off" : isSidePanelOpen ? "drawer" : "map";

    if (escapeMode === "off" || typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (escapeMode === "drawer") {
          setIsSidePanelOpen(false);
          setIsMapExpanded(mapExpandedBeforePanelRef.current);
          return;
        }

        setIsMapExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMapExpanded ? (isSidePanelOpen ? "drawer" : "map") : "off"]);

  const renderPanel = () => {
    switch (activeTab) {
      case "seed":
        return (
          <SeedVersionPanel
            seed={seed}
            version={version}
            edition={edition}
            dimension={dimension}
            onDimensionChange={handleDimensionChange}
          />
        );
      case "settings":
        return <MapSettingsPanel settings={mapSettings} onSettingsChange={setMapSettings} />;
      case "finder":
        return <SeedFinderPanel />;
      case "markers":
        return <MarkersPanel settings={markerSettings} onSettingsChange={setMarkerSettings} />;
      case "biomes":
        return <BiomesPanel dimension={dimension} settings={biomeOverlay} onSettingsChange={setBiomeOverlay} />;
      default:
        return null;
    }
  };

  const renderSidePanel = () => {
    switch (activeTab) {
      case "seed":
        return (
          <SeedSidebarPanel
            seed={seed}
            version={version}
            edition={edition}
            dimension={dimension}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onDimensionChange={handleDimensionChange}
          />
        );
      case "settings":
        return <MapSettingsPanel settings={mapSettings} onSettingsChange={setMapSettings} compact hideTitle />;
      case "finder":
        return <SeedFinderPanel compact hideTitle />;
      case "markers":
        return <MarkersPanel settings={markerSettings} onSettingsChange={setMarkerSettings} compact hideTitle />;
      case "biomes":
        return <BiomesPanel dimension={dimension} settings={biomeOverlay} onSettingsChange={setBiomeOverlay} compact hideTitle />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-[var(--theme-bg-app)] text-[var(--theme-text-primary)] ${isMapExpanded ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      <TopBar
        seed={seed}
        version={version}
        edition={edition}
        dimension={dimension}
        isMapExpanded={isMapExpanded}
        isSettingsPanelOpen={isSidePanelOpen}
        onToggleSettingsPanel={handleToggleSidePanel}
        onToggleMapExpanded={handleToggleMapExpanded}
      />
      {isSidePanelOpen && (
        <SidePanelDrawer activeTab={activeTab} onTabChange={setActiveTab} onClose={handleCloseSidePanel}>
          {renderSidePanel()}
        </SidePanelDrawer>
      )}
      {!isMapExpanded && (
        <SeedInputPanel
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          initialSeed={seed}
          initialEdition={edition}
          initialVersionId={version}
        />
      )}
      <section
        className={`flex flex-col border-b border-white/5 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isMapExpanded
            ? `h-[calc(100vh-4.5rem)] sm:h-[calc(100vh-3.8125rem)] ${isSidePanelOpen ? "md:mr-[var(--theme-drawer-width)]" : ""}`
            : "h-[calc(100vh-17rem)] min-h-[22rem]"
        }`}
      >
        <MapInfoBar
          biome={hoveredBiome}
          x={hoveredX}
          z={hoveredZ}
          version={version}
          edition={edition}
          seed={seed}
          settings={mapSettings}
        />
        {/* Map sidewalk wrapper — full-width in expanded mode, padded otherwise */}
        <div className={`min-h-0 flex-1 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isMapExpanded
            ? "p-0"
            : "px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6 lg:pb-5"
        }`}>
          <div className={`h-full w-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            isMapExpanded
              ? "rounded-none"
              : "rounded-2xl border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.42)]"
          }`}>
            <MapCanvas
              seed={seed}
              edition={edition}
              dimension={dimension}
              isGenerating={isGenerating}
              settings={mapSettings}
              markerSettings={markerSettings}
              biomeOverlay={biomeOverlay}
              onBiomeHover={handleBiomeHover}
              onGenerationComplete={handleGenerationComplete}
            />
          </div>
        </div>
      </section>

      {!isMapExpanded && (
        <section className="bg-[var(--theme-bg-tabs)]">
          <div className="mx-auto w-full max-w-[112rem] px-2 pb-3 pt-3 sm:px-3 lg:px-5 lg:pb-5 lg:pt-4">
            <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[var(--theme-bg-panel)] shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
              <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="bg-[var(--theme-bg-panel)]">
                <div className="mx-auto w-full max-w-5xl">
                  {renderPanel()}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

interface StoredMarkerSettings {
  spawnPoint: boolean;
  slimeChunks: boolean;
  structuresEnabled: boolean;
  selectedStructures: string[];
}

interface StoredBiomeOverlay {
  highlightBiomes: boolean;
  selectedBiomes: Biome[];
}

function parseStoredJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
