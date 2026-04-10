"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
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
import { normalizeSeedValue } from "@/lib/seed-input";
import type { Dimension, Edition, MinecraftVersion } from "@/lib/minecraft-versions";

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
const MAX_STORED_JSON_LENGTH = 10_000;

interface ExploreState {
  seed: string;
  version: string;
  edition: Edition;
  isGenerating: boolean;
  activeTab: string;
  dimension: Dimension;
  mapSettings: MapSettingsState;
  markerSettings: ReturnType<typeof createDefaultMarkerSettings>;
  biomeOverlay: ReturnType<typeof createDefaultBiomeOverlayState>;
  restoredSettings: boolean;
}

type ExploreStateUpdater<T> = T | ((current: T) => T);

type ExploreAction =
  | { type: "hydrate"; state: ExploreState }
  | { type: "generate"; seed: string; version: MinecraftVersion; edition: Edition }
  | { type: "generationComplete" }
  | { type: "setActiveTab"; tab: string }
  | { type: "setDimension"; dimension: Dimension }
  | { type: "setMapSettings"; updater: ExploreStateUpdater<MapSettingsState> }
  | { type: "setMarkerSettings"; updater: ExploreStateUpdater<ExploreState["markerSettings"]> }
  | { type: "setBiomeOverlay"; updater: ExploreStateUpdater<ExploreState["biomeOverlay"]> };

export default function ExploreApp() {
  const [state, dispatch] = useReducer(exploreReducer, undefined, createDefaultExploreState);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const mapExpandedBeforePanelRef = useRef(false);

  const [hoveredBiome, setHoveredBiome] = useState("");
  const [hoveredX, setHoveredX] = useState(0);
  const [hoveredZ, setHoveredZ] = useState(0);

  const {
    seed,
    version,
    edition,
    isGenerating,
    activeTab,
    dimension,
    mapSettings,
    markerSettings,
    biomeOverlay,
    restoredSettings,
  } = state;

  const handleGenerate = (newSeed: string, newVersion: MinecraftVersion, newEdition: Edition) => {
    const normalizedSeed = normalizeSeedValue(newSeed);
    dispatch({ type: "generate", seed: normalizedSeed, version: newVersion, edition: newEdition });
  };

  const handleBiomeHover = useCallback((biome: string, x: number, z: number) => {
    setHoveredBiome(biome);
    setHoveredX(x);
    setHoveredZ(z);
  }, []);

  const handleGenerationComplete = useCallback(() => {
    dispatch({ type: "generationComplete" });
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
    dispatch({ type: "setDimension", dimension: nextDimension });
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    dispatch({ type: "setActiveTab", tab });
  }, []);

  const handleMapSettingsChange = useCallback((updater: ExploreStateUpdater<MapSettingsState>) => {
    dispatch({ type: "setMapSettings", updater });
  }, []);

  const handleMarkerSettingsChange = useCallback((updater: ExploreStateUpdater<ExploreState["markerSettings"]>) => {
    dispatch({ type: "setMarkerSettings", updater });
  }, []);

  const handleBiomeOverlayChange = useCallback((updater: ExploreStateUpdater<ExploreState["biomeOverlay"]>) => {
    dispatch({ type: "setBiomeOverlay", updater });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    dispatch({ type: "hydrate", state: loadExploreStateFromBrowser() });
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

  const escapeMode = !isMapExpanded ? "off" : isSidePanelOpen ? "drawer" : "map";

  useEffect(() => {
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
  }, [escapeMode]);

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
        return <MapSettingsPanel settings={mapSettings} onSettingsChange={handleMapSettingsChange} />;
      case "finder":
        return <SeedFinderPanel />;
      case "markers":
        return <MarkersPanel dimension={dimension} settings={markerSettings} onSettingsChange={handleMarkerSettingsChange} />;
      case "biomes":
        return <BiomesPanel dimension={dimension} settings={biomeOverlay} onSettingsChange={handleBiomeOverlayChange} />;
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
        return <MapSettingsPanel settings={mapSettings} onSettingsChange={handleMapSettingsChange} compact hideTitle />;
      case "finder":
        return <SeedFinderPanel compact hideTitle />;
      case "markers":
        return (
          <MarkersPanel
            dimension={dimension}
            settings={markerSettings}
            onSettingsChange={handleMarkerSettingsChange}
            compact
            hideTitle
          />
        );
      case "biomes":
        return <BiomesPanel dimension={dimension} settings={biomeOverlay} onSettingsChange={handleBiomeOverlayChange} compact hideTitle />;
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
        <SidePanelDrawer activeTab={activeTab} onTabChange={handleTabChange} onClose={handleCloseSidePanel}>
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
              <BottomTabs activeTab={activeTab} onTabChange={handleTabChange} />
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

function createDefaultExploreState(): ExploreState {
  return {
    seed: "",
    version: "1.21",
    edition: "java",
    isGenerating: false,
    activeTab: "seed",
    dimension: "overworld",
    mapSettings: DEFAULT_MAP_SETTINGS,
    markerSettings: createDefaultMarkerSettings(),
    biomeOverlay: createDefaultBiomeOverlayState(),
    restoredSettings: false,
  };
}

function exploreReducer(state: ExploreState, action: ExploreAction): ExploreState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "generate":
      return {
        ...state,
        seed: action.seed,
        version: action.version.id,
        edition: action.edition,
        isGenerating: true,
      };
    case "generationComplete":
      return {
        ...state,
        isGenerating: false,
      };
    case "setActiveTab":
      return {
        ...state,
        activeTab: action.tab,
      };
    case "setDimension":
      return {
        ...state,
        dimension: action.dimension,
        isGenerating: state.seed ? true : state.isGenerating,
      };
    case "setMapSettings":
      return {
        ...state,
        mapSettings: resolveUpdater(action.updater, state.mapSettings),
      };
    case "setMarkerSettings":
      return {
        ...state,
        markerSettings: resolveUpdater(action.updater, state.markerSettings),
      };
    case "setBiomeOverlay":
      return {
        ...state,
        biomeOverlay: resolveUpdater(action.updater, state.biomeOverlay),
      };
    default:
      return state;
  }
}

function loadExploreStateFromBrowser(): ExploreState {
  const nextState = createDefaultExploreState();
  if (typeof window === "undefined") {
    return nextState;
  }

  const storedActiveTab = window.localStorage.getItem(STORAGE_KEYS.activeTab);
  if (storedActiveTab && VALID_TABS.has(storedActiveTab)) {
    nextState.activeTab = storedActiveTab;
  }

  const storedDimension = window.localStorage.getItem(STORAGE_KEYS.dimension);
  if (storedDimension && VALID_DIMENSIONS.has(storedDimension as Dimension)) {
    nextState.dimension = storedDimension as Dimension;
  }

  const storedMapSettings = parseStoredJson<Partial<MapSettingsState>>(window.localStorage.getItem(STORAGE_KEYS.mapSettings));
  if (storedMapSettings) {
    nextState.mapSettings = sanitizeMapSettings(storedMapSettings, nextState.mapSettings);
  }

  const storedMarkerSettings = parseStoredJson<Partial<StoredMarkerSettings>>(window.localStorage.getItem(STORAGE_KEYS.markerSettings));
  if (storedMarkerSettings) {
    nextState.markerSettings = sanitizeMarkerSettings(storedMarkerSettings, nextState.markerSettings);
  }

  const storedBiomeOverlay = parseStoredJson<Partial<StoredBiomeOverlay>>(window.localStorage.getItem(STORAGE_KEYS.biomeOverlay));
  if (storedBiomeOverlay) {
    nextState.biomeOverlay = sanitizeBiomeOverlay(storedBiomeOverlay, nextState.biomeOverlay);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const urlSeed = normalizeSeedValue(urlParams.get("seed"));
  if (urlSeed) {
    const urlEditionParam = urlParams.get("edition");
    const urlVersionParam = urlParams.get("version");
    const urlDimensionParam = urlParams.get("dimension");
    const urlEdition: Edition = urlEditionParam === "bedrock" ? "bedrock" : "java";
    const urlVersions = getVersionsForEdition(urlEdition);

    nextState.seed = urlSeed;
    nextState.edition = urlEdition;
    nextState.version = urlVersions.find((candidate) => candidate.id === urlVersionParam)?.id ?? urlVersions[0].id;
    nextState.dimension = VALID_DIMENSIONS.has(urlDimensionParam as Dimension)
      ? (urlDimensionParam as Dimension)
      : "overworld";
    nextState.isGenerating = true;
  }

  nextState.restoredSettings = true;
  return nextState;
}

function parseStoredJson<T>(value: string | null): T | null {
  if (!value || value.length > MAX_STORED_JSON_LENGTH) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    return isRecord(parsed) ? (parsed as T) : null;
  } catch {
    return null;
  }
}

function sanitizeMapSettings(
  value: Partial<MapSettingsState>,
  fallback: MapSettingsState
): MapSettingsState {
  return {
    terrainEstimation: typeof value.terrainEstimation === "boolean" ? value.terrainEstimation : fallback.terrainEstimation,
    contourLines: typeof value.contourLines === "boolean" ? value.contourLines : fallback.contourLines,
    biomesAtElevation: typeof value.biomesAtElevation === "boolean" ? value.biomesAtElevation : fallback.biomesAtElevation,
    showGrid: typeof value.showGrid === "boolean" ? value.showGrid : fallback.showGrid,
    binaryCoordinates: typeof value.binaryCoordinates === "boolean" ? value.binaryCoordinates : fallback.binaryCoordinates,
    chunkCoordinates: typeof value.chunkCoordinates === "boolean" ? value.chunkCoordinates : fallback.chunkCoordinates,
    snapZoom: typeof value.snapZoom === "boolean" ? value.snapZoom : fallback.snapZoom,
    floatingTooltip: typeof value.floatingTooltip === "boolean" ? value.floatingTooltip : fallback.floatingTooltip,
  };
}

function sanitizeMarkerSettings(
  value: Partial<StoredMarkerSettings>,
  fallback: ExploreState["markerSettings"]
): ExploreState["markerSettings"] {
  return {
    spawnPoint: typeof value.spawnPoint === "boolean" ? value.spawnPoint : fallback.spawnPoint,
    slimeChunks: typeof value.slimeChunks === "boolean" ? value.slimeChunks : fallback.slimeChunks,
    structuresEnabled: typeof value.structuresEnabled === "boolean" ? value.structuresEnabled : fallback.structuresEnabled,
    selectedStructures: Array.isArray(value.selectedStructures)
      ? new Set(
          value.selectedStructures
            .filter((structureId): structureId is string => typeof structureId === "string" && VALID_STRUCTURES.has(structureId))
        )
      : fallback.selectedStructures,
  };
}

function sanitizeBiomeOverlay(
  value: Partial<StoredBiomeOverlay>,
  fallback: ExploreState["biomeOverlay"]
): ExploreState["biomeOverlay"] {
  return {
    highlightBiomes: typeof value.highlightBiomes === "boolean"
      ? value.highlightBiomes
      : fallback.highlightBiomes,
    selectedBiomes: Array.isArray(value.selectedBiomes)
      ? new Set(value.selectedBiomes.filter((biome): biome is Biome => typeof biome === "string" && VALID_BIOMES.has(biome as Biome)))
      : fallback.selectedBiomes,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveUpdater<T>(updater: ExploreStateUpdater<T>, current: T): T {
  return typeof updater === "function"
    ? (updater as (value: T) => T)(current)
    : updater;
}
