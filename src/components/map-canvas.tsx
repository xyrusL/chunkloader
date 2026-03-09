"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { MapSettingsState } from "@/components/panels/map-settings-panel";
import {
  ClipboardIcon,
  CompassRoseIcon,
  LeafIcon,
  MapIcon,
  StructureIcon,
  VillagerHeadIcon,
} from "@/components/ui/icons";
import { BiomeGenerator, type TerrainSample } from "@/lib/biome-generator";
import { Biome, BIOME_COLORS, BIOME_PALETTE, BIOME_VALUES } from "@/lib/biome-colors";
import { formatWorldCoordinate } from "@/lib/coordinate-format";
import {
  getPixelsPerBlock,
  getVisibleStructureMarkers,
  getWorldBounds,
  isSlimeChunk,
  type BiomeOverlayState,
  type MapViewportState,
  type MarkerSettingsState,
} from "@/lib/map-overlays";
import type { Dimension, Edition } from "@/lib/minecraft-versions";

interface MapCanvasProps {
  seed: string;
  edition: Edition;
  dimension: Dimension;
  isGenerating: boolean;
  settings: MapSettingsState;
  markerSettings: MarkerSettingsState;
  biomeOverlay: BiomeOverlayState;
  onBiomeHover: (biome: string, x: number, z: number) => void;
  onGenerationComplete: () => void;
}

type RenderMode = "generation" | "settled" | "interaction";

interface RenderJob {
  token: number;
  mode: RenderMode;
  notifyComplete: boolean;
  canvasWidth: number;
  canvasHeight: number;
  blockSize: number;
  sampleScale: number;
  cols: number;
  rows: number;
  startCellX: number;
  startCellZ: number;
  rowsRendered: number;
  imageData: ImageData;
  offscreenCanvas: HTMLCanvasElement;
  offscreenContext: CanvasRenderingContext2D;
  frameBudgetMs: number;
  drawGrid: boolean;
  drawAxis: boolean;
  drawChunkAxis: boolean;
  useTerrainModel: boolean;
  useTerrainShading: boolean;
  drawContours: boolean;
  elevatedBiomes: boolean;
  offsetX: number;
  offsetY: number;
  biomeLabels: VisibleBiomeLabel[];
  seenBiomeLabels: Set<Biome>;
}

interface VisibleBiomeLabel {
  biome: Biome;
  worldX: number;
  worldZ: number;
  color: string;
}

interface SelectedOverlayCommand {
  key: string;
  label: string;
  worldX: number;
  worldZ: number;
  command: string;
}

interface HoverTooltipState {
  biome: Biome;
  worldX: number;
  worldZ: number;
  screenX: number;
  screenY: number;
}

interface OverlayTarget extends SelectedOverlayCommand {
  x: number;
  y: number;
  accent: string;
  swatch?: string;
  icon: ReactNode;
}

const TILE_SIZE = 4;
const SETTLE_DELAY_MS = 120;

export default function MapCanvas({
  seed,
  edition,
  dimension,
  isGenerating,
  settings,
  markerSettings,
  biomeOverlay,
  onBiomeHover,
  onGenerationComplete,
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<BiomeGenerator | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const isDraggingRef = useRef(false);
  const dragButtonRef = useRef<number | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const downOverlayKeyRef = useRef<string | null>(null);
  const prepareFrameRef = useRef<number>(0);
  const renderFrameRef = useRef<number>(0);
  const settleTimeoutRef = useRef<number>(0);
  const renderTokenRef = useRef(0);
  const pendingRenderRef = useRef<{ mode: RenderMode; notifyComplete: boolean } | null>(null);
  const renderJobRef = useRef<RenderJob | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const lowEndDeviceRef = useRef(false);
  const generationCompletePendingRef = useRef(false);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const [isRenderingMap, setIsRenderingMap] = useState(false);
  const [viewport, setViewport] = useState<MapViewportState>({
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
    sampleScale: 4,
    canvasWidth: 800,
    canvasHeight: 600,
  });
  const [visibleBiomeLabels, setVisibleBiomeLabels] = useState<VisibleBiomeLabel[]>([]);
  const [selectedOverlay, setSelectedOverlay] = useState<SelectedOverlayCommand | null>(null);
  const [copiedCommandKey, setCopiedCommandKey] = useState<string | null>(null);
  const [hoveredOverlayKey, setHoveredOverlayKey] = useState<string | null>(null);
  const [hoverTooltip, setHoverTooltip] = useState<HoverTooltipState | null>(null);

  useEffect(() => {
    lowEndDeviceRef.current = detectLowEndDevice();
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const resize = () => {
      const rect = element.getBoundingClientRect();
      setCanvasSize({ w: Math.max(1, Math.floor(rect.width)), h: Math.max(1, Math.floor(rect.height)) });
    };

    resize();
    window.addEventListener("resize", resize);

    if (typeof ResizeObserver === "undefined") {
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    const observer = new ResizeObserver(resize);
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!isGenerating || !seed) {
      return;
    }

    generatorRef.current = new BiomeGenerator(seed, edition, dimension);
    generationCompletePendingRef.current = true;
    offsetRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    setVisibleBiomeLabels([]);
    setSelectedOverlay(null);
    setCopiedCommandKey(null);
    setHoverTooltip(null);
    scheduleRender("generation", true);
  }, [dimension, edition, isGenerating, seed]);

  useEffect(() => {
    if (!generatorRef.current) {
      return;
    }

    scheduleRender("settled");
  }, [canvasSize, settings, biomeOverlay]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(prepareFrameRef.current);
      cancelAnimationFrame(renderFrameRef.current);
      window.clearTimeout(settleTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!settings.floatingTooltip) {
      setHoverTooltip(null);
    }
  }, [settings.floatingTooltip]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const handleNativeWheel = (event: WheelEvent) => {
      if (!generatorRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      applyZoomFromWheel(event.deltaY, event.clientX, event.clientY);
    };

    element.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleNativeWheel);
    };
  }, []);

  function getLiveCanvasSize() {
    const containerSize = getElementSize(containerRef.current);
    const canvasSizeFromDom = getCanvasElementSize(canvasRef.current);

    return {
      w: Math.max(containerSize.w, canvasSizeFromDom.w),
      h: Math.max(containerSize.h, canvasSizeFromDom.h),
    };
  }

  function scheduleRender(mode: RenderMode, notifyComplete = false) {
    pendingRenderRef.current = { mode, notifyComplete: pendingRenderRef.current?.notifyComplete || notifyComplete };
    cancelAnimationFrame(prepareFrameRef.current);
    prepareFrameRef.current = requestAnimationFrame(() => {
      const request = pendingRenderRef.current;
      pendingRenderRef.current = null;
      if (request) {
        beginRender(request.mode, request.notifyComplete);
      }
    });
  }

  function beginRender(mode: RenderMode, notifyComplete: boolean) {
    const canvas = canvasRef.current;
    if (!canvas || !generatorRef.current) {
      return;
    }

    if (!canvas.getContext("2d")) {
      return;
    }

    cancelAnimationFrame(renderFrameRef.current);

    const { w, h } = getLiveCanvasSize();
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const zoom = zoomRef.current;
    const blockSize = Math.max(1, TILE_SIZE * zoom);
    const sampleScale = getSampleScale(mode, zoom, lowEndDeviceRef.current);
    const padding = 1;
    const startCellX = Math.floor(-offsetRef.current.x / blockSize) - padding;
    const startCellZ = Math.floor(-offsetRef.current.y / blockSize) - padding;
    const cols = Math.ceil(w / blockSize) + padding * 2 + 1;
    const rows = Math.ceil(h / blockSize) + padding * 2 + 1;
    const { canvas: offscreenCanvas, context: offscreenContext } = ensureOffscreenBuffer(cols, rows);
    const imageData = offscreenContext.createImageData(cols, rows);
    const token = ++renderTokenRef.current;

    renderJobRef.current = {
      token,
      mode,
      notifyComplete,
      canvasWidth: w,
      canvasHeight: h,
      blockSize,
      sampleScale,
      cols,
      rows,
      startCellX,
      startCellZ,
      rowsRendered: 0,
      imageData,
      offscreenCanvas,
      offscreenContext,
      frameBudgetMs: getFrameBudget(mode, lowEndDeviceRef.current),
      drawGrid: settings.showGrid,
      drawAxis: settings.showGrid && mode === "settled",
      drawChunkAxis: settings.showGrid && settings.chunkCoordinates && mode === "settled",
      useTerrainModel: settings.terrainEstimation || settings.contourLines || settings.biomesAtElevation,
      useTerrainShading: settings.terrainEstimation,
      drawContours: settings.contourLines && mode === "settled",
      elevatedBiomes: settings.biomesAtElevation,
      offsetX: offsetRef.current.x,
      offsetY: offsetRef.current.y,
      biomeLabels: [],
      seenBiomeLabels: new Set(),
    };

    setIsRenderingMap(mode !== "interaction");

    if (mode === "interaction") {
      continueRender(token);
      return;
    }

    renderFrameRef.current = requestAnimationFrame(() => continueRender(token));
  }

  function continueRender(token: number) {
    const job = renderJobRef.current;
    const generator = generatorRef.current;
    if (!job || !generator || job.token !== token) {
      return;
    }

    const startedAt = performance.now();
    const data = job.imageData.data;

    while (job.rowsRendered < job.rows && performance.now() - startedAt < job.frameBudgetMs) {
      const row = job.rowsRendered;
      const sampleZ = (job.startCellZ + row) * job.sampleScale;
      for (let col = 0; col < job.cols; col++) {
        const sampleX = (job.startCellX + col) * job.sampleScale;
        const terrain = job.useTerrainModel
          ? generator.getTerrainSampleFromTile(sampleX, sampleZ, job.sampleScale)
          : null;
        const biomeIndex = terrain?.biomeIndex ?? generator.getBiomeIndexFromTile(sampleX, sampleZ, job.sampleScale);
        const biome = BIOME_VALUES[biomeIndex];
        const paletteOffset = biomeIndex * 4;
        const pixelOffset = (row * job.cols + col) * 4;
        let red = BIOME_PALETTE[paletteOffset];
        let green = BIOME_PALETTE[paletteOffset + 1];
        let blue = BIOME_PALETTE[paletteOffset + 2];

        if (terrain) {
          ({ red, green, blue } = applyTerrainStyle({
            biome,
            red,
            green,
            blue,
            terrain,
            terrainEstimation: job.useTerrainShading,
            contourLines: job.drawContours,
            biomesAtElevation: job.elevatedBiomes,
          }));
        }

        if (biomeOverlay.highlightBiomes && biomeOverlay.selectedBiomes.has(biome)) {
          red = brightenChannel(red, 32);
          green = brightenChannel(green, 26);
          blue = brightenChannel(blue, 12);

          if (!job.seenBiomeLabels.has(biome)) {
            const screenX = (job.startCellX + col + 0.5) * job.blockSize + job.offsetX;
            const screenY = (job.startCellZ + row + 0.5) * job.blockSize + job.offsetY;

            if (
              screenX > 24
              && screenX < job.canvasWidth - 24
              && screenY > 24
              && screenY < job.canvasHeight - 24
            ) {
              job.biomeLabels.push({
                biome,
                worldX: sampleX,
                worldZ: sampleZ,
                color: `rgb(${red} ${green} ${blue})`,
              });
              job.seenBiomeLabels.add(biome);
            }
          }
        }

        data[pixelOffset] = red;
        data[pixelOffset + 1] = green;
        data[pixelOffset + 2] = blue;
        data[pixelOffset + 3] = 255;
      }
      job.rowsRendered += 1;
    }

    const isComplete = job.rowsRendered >= job.rows;
    if (isComplete) {
      job.offscreenContext.putImageData(job.imageData, 0, 0);
      drawFrame(job);
      setViewport({
        offsetX: job.offsetX,
        offsetY: job.offsetY,
        zoom: job.blockSize / TILE_SIZE,
        sampleScale: job.sampleScale,
        canvasWidth: job.canvasWidth,
        canvasHeight: job.canvasHeight,
      });
    }

    if (!isComplete) {
      renderFrameRef.current = requestAnimationFrame(() => continueRender(token));
      return;
    }

    renderJobRef.current = null;
    setIsRenderingMap(false);
    setVisibleBiomeLabels(job.biomeLabels);

    if (job.notifyComplete || generationCompletePendingRef.current) {
      generationCompletePendingRef.current = false;
      onGenerationComplete();
    }
  }

  function ensureOffscreenBuffer(width: number, height: number) {
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement("canvas");
      offscreenContextRef.current = offscreenCanvasRef.current.getContext("2d", { alpha: false });
    }

    const offscreenCanvas = offscreenCanvasRef.current;
    const offscreenContext = offscreenContextRef.current;
    if (!offscreenCanvas || !offscreenContext) {
      throw new Error("Unable to allocate offscreen canvas");
    }

    if (offscreenCanvas.width !== width || offscreenCanvas.height !== height) {
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
    }

    return { canvas: offscreenCanvas, context: offscreenContext };
  }

  function drawFrame(job: RenderJob) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;
    context.drawImage(
      job.offscreenCanvas,
      job.startCellX * job.blockSize + job.offsetX,
      job.startCellZ * job.blockSize + job.offsetY,
      job.cols * job.blockSize,
      job.rows * job.blockSize
    );

    if (job.drawGrid) {
      drawGrid(context, job);
    }

    if (job.drawAxis) {
      drawAxisLabels(context, job, settings);
    }
  }

  function queueSettledRender() {
    window.clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = window.setTimeout(() => {
      scheduleRender("settled");
    }, SETTLE_DELAY_MS);
  }

  function handleMouseDown(event: React.MouseEvent) {
    if (!generatorRef.current || (event.button !== 0 && event.button !== 2)) {
      return;
    }

    event.preventDefault();
    isDraggingRef.current = true;
    dragButtonRef.current = event.button;
    lastMouseRef.current = { x: event.clientX, y: event.clientY };
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    downOverlayKeyRef.current = getOverlayTargetAtPoint(
      event.clientX,
      event.clientY,
      canvasRef.current,
      overlayTargets
    )?.key ?? null;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grabbing";
    }
  }

  function handleMouseMove(event: React.MouseEvent) {
    if (!isDraggingRef.current) {
      const hoveredTarget = getOverlayTargetAtPoint(
        event.clientX,
        event.clientY,
        canvasRef.current,
        overlayTargets
      );
      setHoveredOverlayKey(hoveredTarget?.key ?? null);
    }

    if (generatorRef.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const hoverScale = getSampleScale("settled", zoomRef.current, lowEndDeviceRef.current);
      const blockSize = Math.max(1, TILE_SIZE * zoomRef.current);
      const worldX = Math.floor((px - offsetRef.current.x) / blockSize) * hoverScale;
      const worldZ = Math.floor((py - offsetRef.current.y) / blockSize) * hoverScale;
      const biomeIndex = generatorRef.current.getBiomeIndexFromTile(worldX, worldZ, hoverScale);
      const biome = BIOME_VALUES[biomeIndex];
      onBiomeHover(biome, worldX, worldZ);
      if (settings.floatingTooltip && !isDraggingRef.current) {
        setHoverTooltip({
          biome,
          worldX,
          worldZ,
          screenX: px,
          screenY: py,
        });
      }
    }

    if (!isDraggingRef.current) {
      return;
    }

    setHoverTooltip(null);

    const expectedButtonMask = dragButtonRef.current === 2 ? 2 : 1;
    if ((event.buttons & expectedButtonMask) === 0) {
      handleMouseUp();
      return;
    }

    event.preventDefault();

    const dx = event.clientX - lastMouseRef.current.x;
    const dy = event.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: event.clientX, y: event.clientY };
    offsetRef.current.x += dx;
    offsetRef.current.y += dy;

    scheduleRender("interaction");
    queueSettledRender();
  }

  function handleMouseUp() {
    const movedDistance = Math.hypot(
      lastMouseRef.current.x - dragStartRef.current.x,
      lastMouseRef.current.y - dragStartRef.current.y
    );
    const clickedOverlay = movedDistance < 6
      ? overlayTargets.find((target) => target.key === downOverlayKeyRef.current)
      : null;

    isDraggingRef.current = false;
    dragButtonRef.current = null;
    if (containerRef.current) {
      containerRef.current.style.cursor = hoveredOverlayKey ? "pointer" : "grab";
    }

    if (clickedOverlay) {
      setSelectedOverlay({
        key: clickedOverlay.key,
        label: clickedOverlay.label,
        worldX: clickedOverlay.worldX,
        worldZ: clickedOverlay.worldZ,
        command: clickedOverlay.command,
      });
    }

    downOverlayKeyRef.current = null;
    queueSettledRender();
  }

  function handleMouseLeave() {
    handleMouseUp();
    setHoverTooltip(null);
  }

  function applyZoomFromWheel(deltaY: number, clientX: number, clientY: number) {
    if (isDraggingRef.current || dragButtonRef.current !== null) {
      return;
    }

    const zoomFactor = deltaY < 0 ? 1.15 : 0.87;
    const oldZoom = zoomRef.current;
    const unclampedZoom = oldZoom * zoomFactor;
    const newZoom = clampZoom(settings.snapZoom ? snapZoomLevel(unclampedZoom) : unclampedZoom);
    const rect = canvasRef.current?.getBoundingClientRect();

    if (rect) {
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      offsetRef.current.x = mouseX - (mouseX - offsetRef.current.x) * (newZoom / oldZoom);
      offsetRef.current.y = mouseY - (mouseY - offsetRef.current.y) * (newZoom / oldZoom);
    }

    zoomRef.current = newZoom;
    scheduleRender("interaction");
    queueSettledRender();
  }

  async function handleCopyCommand(command: string, key: string) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
        setCopiedCommandKey(key);
        window.setTimeout(() => {
          setCopiedCommandKey((current) => (current === key ? null : current));
        }, 1400);
      }
    } catch {
      setCopiedCommandKey(null);
    }
  }

  const worldBounds = getWorldBounds(viewport);
  const pixelsPerBlock = getPixelsPerBlock(viewport);
  const spawnMarkerPosition = worldToScreen(viewport, 0, 0);
  const allowOverworldMarkers = dimension === "overworld";
  const visibleStructureMarkers = seed && allowOverworldMarkers && markerSettings.structuresEnabled
    ? getVisibleStructureMarkers(seed, markerSettings.selectedStructures, worldBounds).slice(0, 18)
    : [];
  const visibleSlimeChunks = seed && allowOverworldMarkers && markerSettings.slimeChunks && pixelsPerBlock * 16 >= 10
    ? getVisibleSlimeChunkRects(seed, worldBounds, viewport)
    : [];
  const overlayTargets: OverlayTarget[] = [];

  if (allowOverworldMarkers && markerSettings.spawnPoint && isOverlayVisible(spawnMarkerPosition.x, spawnMarkerPosition.y, viewport)) {
    overlayTargets.push({
      ...createOverlayCommand("spawn", "Spawn Point", 0, 0),
      x: spawnMarkerPosition.x,
      y: spawnMarkerPosition.y,
      accent: "border-red-400/50 bg-black/75 text-white",
      icon: <CompassRoseIcon className="h-4 w-4 text-red-300" />,
    });
  }

  for (const marker of visibleStructureMarkers) {
    const position = worldToScreen(viewport, marker.x, marker.z);
    if (!isOverlayVisible(position.x, position.y, viewport)) {
      continue;
    }

    overlayTargets.push({
      ...createOverlayCommand(`${marker.structure.id}:${marker.x}:${marker.z}`, marker.structure.name, marker.x, marker.z),
      x: position.x,
      y: position.y,
      accent: "border-amber-400/35 bg-[#201814]/90 text-amber-50",
      icon: marker.structure.id === "village"
        ? <VillagerHeadIcon className="h-4 w-4 text-[#d8b07b]" />
        : <StructureIcon name={marker.structure.icon} className="h-4 w-4 text-amber-200" />,
    });
  }

  if (biomeOverlay.highlightBiomes) {
    for (const label of visibleBiomeLabels) {
      const position = worldToScreen(viewport, label.worldX, label.worldZ);
      if (!isOverlayVisible(position.x, position.y, viewport)) {
        continue;
      }

      overlayTargets.push({
        ...createOverlayCommand(
          `biome:${label.biome}:${label.worldX}:${label.worldZ}`,
          `${label.biome} biome`,
          label.worldX,
          label.worldZ
        ),
        x: position.x,
        y: position.y,
        accent: "border-white/15 bg-black/70 text-white",
        swatch: label.color,
        icon: <LeafIcon className="h-4 w-4 text-emerald-200" />,
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden overscroll-contain bg-[#1a1a2e] select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(event) => {
        if (generatorRef.current) {
          event.preventDefault();
        }
      }}
      style={{
        cursor: generatorRef.current ? (hoveredOverlayKey ? "pointer" : "grab") : "default",
        overscrollBehavior: "contain",
      }}
    >
      <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h} className="block h-full w-full" />

      {generatorRef.current && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {visibleSlimeChunks.map((chunk) => (
            <div
              key={`${chunk.chunkX}:${chunk.chunkZ}`}
              className="absolute border border-emerald-300/40 bg-emerald-400/10"
              style={{
                left: chunk.left,
                top: chunk.top,
                width: chunk.size,
                height: chunk.size,
              }}
            />
          ))}

          {overlayTargets.map((target) => (
            <MapOverlayBadge
              key={target.key}
              x={target.x}
              y={target.y}
              label={target.label === "Spawn Point" ? "Spawn" : target.label.replace(/ biome$/, "")}
              accent={target.accent}
              swatch={target.swatch}
              icon={target.icon}
            />
          ))}

          {selectedOverlay && (() => {
            const position = worldToScreen(viewport, selectedOverlay.worldX, selectedOverlay.worldZ);
            if (!isOverlayVisible(position.x, position.y, viewport)) {
              return null;
            }

            return (
              <CommandPopup
                x={position.x}
                y={position.y + 18}
                label={selectedOverlay.label}
                command={selectedOverlay.command}
                copied={copiedCommandKey === selectedOverlay.key}
                onClose={() => {
                  setSelectedOverlay(null);
                  setCopiedCommandKey(null);
                }}
                onCopy={() => handleCopyCommand(selectedOverlay.command, selectedOverlay.key)}
              />
            );
          })()}

          {settings.floatingTooltip && hoverTooltip && (() => {
            const biomeColor = BIOME_COLORS[hoverTooltip.biome];
            const tooltipLeft = Math.min(hoverTooltip.screenX + 16, canvasSize.w - 172);
            const tooltipTop = Math.max(12, hoverTooltip.screenY - 18);

            return (
              <div
                className="pointer-events-none absolute z-10 min-w-36 rounded-md border border-white/10 bg-[#090c16]/92 px-3 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.4)] backdrop-blur"
                style={{ left: tooltipLeft, top: tooltipTop }}
              >
                <div className="flex items-center gap-2">
                  {biomeColor && (
                    <span
                      className="h-3 w-3 rounded-[3px] border border-white/15"
                      style={{ backgroundColor: `rgb(${biomeColor.r},${biomeColor.g},${biomeColor.b})` }}
                    />
                  )}
                  <span className="text-xs font-medium text-white">{hoverTooltip.biome}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                  <span>x: <span className="font-mono text-gray-200">{formatWorldCoordinate(hoverTooltip.worldX, settings)}</span></span>
                  <span>z: <span className="font-mono text-gray-200">{formatWorldCoordinate(hoverTooltip.worldZ, settings)}</span></span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {!generatorRef.current && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.03] text-emerald-300">
              <MapIcon className="h-10 w-10" />
            </div>
            <p className="text-lg text-gray-400">
              Enter a seed and click <span className="font-semibold text-emerald-400">Generate Map</span> to start
            </p>
            <p className="text-sm text-gray-500">Drag to pan • Scroll to zoom</p>
          </div>
        </div>
      )}

      {generatorRef.current && isRenderingMap && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/70 backdrop-blur">
          {lowEndDeviceRef.current ? "Optimized progressive render" : "Rendering map"}
        </div>
      )}
    </div>
  );
}

function MapOverlayBadge({
  x,
  y,
  label,
  icon,
  accent,
  swatch,
}: {
  x: number;
  y: number;
  label: string;
  icon: ReactNode;
  accent: string;
  swatch?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-full transition-transform duration-150 hover:scale-105"
      style={{ left: x, top: y }}
    >
      <div className={`flex items-center gap-1.5 rounded border px-2 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-sm ${accent}`}>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-black/40">
          {icon}
        </span>
        {swatch && (
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-[2px] border border-white/25 shadow-inner"
            style={{ backgroundColor: swatch }}
          />
        )}
        <span className="max-w-[12rem] truncate font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
          {label}
        </span>
      </div>
      {/* Stem */}
      <div className="mx-auto h-3 w-px bg-gradient-to-b from-white/40 to-white/10" />
      {/* Anchor dot */}
      <div className="mx-auto h-1.5 w-1.5 -translate-x-px rounded-full bg-white/40" />
    </div>
  );
}

function CommandPopup({
  x,
  y,
  label,
  command,
  copied,
  onCopy,
  onClose,
}: {
  x: number;
  y: number;
  label: string;
  command: string;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="pointer-events-auto absolute z-10 w-64 -translate-x-1/2"
      style={{ left: x, top: y }}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="rounded-md border border-white/10 bg-[#090c16]/95 p-3 shadow-[0_14px_32px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">Command ready</p>
            <p className="text-sm font-medium text-white">{label}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-white/10 px-1.5 py-0.5 text-xs text-gray-400 hover:border-white/20 hover:text-white"
          >
            X
          </button>
        </div>
        <div className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-2 py-2">
          <code className="min-w-0 flex-1 truncate text-xs text-emerald-100">{command}</code>
          <button
            type="button"
            onClick={onCopy}
            className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-gray-300 hover:border-emerald-300/40 hover:text-white"
            aria-label="Copy teleport command"
          >
            <ClipboardIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[11px] text-gray-400">{copied ? "Copied." : "Click copy to use this teleport command."}</p>
      </div>
    </div>
  );
}

function worldToScreen(viewport: MapViewportState, worldX: number, worldZ: number) {
  const pixelsPerBlock = getPixelsPerBlock(viewport);
  return {
    x: worldX * pixelsPerBlock + viewport.offsetX,
    y: worldZ * pixelsPerBlock + viewport.offsetY,
  };
}

function isOverlayVisible(x: number, y: number, viewport: MapViewportState) {
  return x >= -48 && x <= viewport.canvasWidth + 48 && y >= -48 && y <= viewport.canvasHeight + 48;
}

function getVisibleSlimeChunkRects(seed: string, bounds: ReturnType<typeof getWorldBounds>, viewport: MapViewportState) {
  const chunkSizePixels = 16 * getPixelsPerBlock(viewport);
  const chunkMinX = Math.floor(bounds.minX / 16);
  const chunkMaxX = Math.ceil(bounds.maxX / 16);
  const chunkMinZ = Math.floor(bounds.minZ / 16);
  const chunkMaxZ = Math.ceil(bounds.maxZ / 16);
  const rects: Array<{ chunkX: number; chunkZ: number; left: number; top: number; size: number }> = [];

  for (let chunkZ = chunkMinZ; chunkZ <= chunkMaxZ; chunkZ++) {
    for (let chunkX = chunkMinX; chunkX <= chunkMaxX; chunkX++) {
      if (!isSlimeChunk(seed, chunkX, chunkZ)) {
        continue;
      }

      const position = worldToScreen(viewport, chunkX * 16, chunkZ * 16);
      rects.push({
        chunkX,
        chunkZ,
        left: position.x,
        top: position.y,
        size: chunkSizePixels,
      });
    }
  }

  return rects;
}

function createOverlayCommand(key: string, label: string, worldX: number, worldZ: number): SelectedOverlayCommand {
  return {
    key,
    label,
    worldX,
    worldZ,
    command: `/tp @s ${Math.round(worldX)} ~ ${Math.round(worldZ)}`,
  };
}

function getOverlayTargetAtPoint(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement | null,
  targets: OverlayTarget[]
) {
  if (!canvas) {
    return null;
  }

  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  for (let index = targets.length - 1; index >= 0; index--) {
    const target = targets[index];
    const width = Math.min(192, 40 + target.label.length * 8 + (target.swatch ? 18 : 0));
    const left = target.x - width / 2;
    const top = target.y - 34;
    const height = 34;

    if (x >= left && x <= left + width && y >= top && y <= top + height) {
      return target;
    }
  }

  return null;
}

function getElementSize(element: HTMLElement | null) {
  if (!element) {
    return { w: 1, h: 1 };
  }

  const rect = element.getBoundingClientRect();
  return {
    w: Math.max(1, Math.floor(rect.width || element.clientWidth || 1)),
    h: Math.max(1, Math.floor(rect.height || element.clientHeight || 1)),
  };
}

function getCanvasElementSize(canvas: HTMLCanvasElement | null) {
  if (!canvas) {
    return { w: 1, h: 1 };
  }

  const rect = canvas.getBoundingClientRect();
  return {
    w: Math.max(1, Math.floor(rect.width || canvas.clientWidth || 1)),
    h: Math.max(1, Math.floor(rect.height || canvas.clientHeight || 1)),
  };
}

function drawGrid(context: CanvasRenderingContext2D, job: RenderJob) {
  const pixelsPerBlock = getPixelsPerBlock({
    offsetX: job.offsetX,
    offsetY: job.offsetY,
    zoom: job.blockSize / TILE_SIZE,
    sampleScale: job.sampleScale,
    canvasWidth: job.canvasWidth,
    canvasHeight: job.canvasHeight,
  });
  const gridSize = getGridSpacing(pixelsPerBlock);
  const emphasisEvery = gridSize >= 16 ? 4 : 8;
  const startWorldX = Math.floor((-job.offsetX / pixelsPerBlock) / gridSize) * gridSize;
  const endWorldX = Math.ceil((job.canvasWidth - job.offsetX) / pixelsPerBlock / gridSize) * gridSize;
  const startWorldZ = Math.floor((-job.offsetY / pixelsPerBlock) / gridSize) * gridSize;
  const endWorldZ = Math.ceil((job.canvasHeight - job.offsetY) / pixelsPerBlock / gridSize) * gridSize;

  context.lineWidth = 1;

  for (let worldX = startWorldX; worldX <= endWorldX; worldX += gridSize) {
    const screenX = worldX * pixelsPerBlock + job.offsetX;
    if (screenX < -1 || screenX > job.canvasWidth + 1) {
      continue;
    }

    const isChunkBoundary = worldX % 16 === 0;
    const isMajorBoundary = worldX % (gridSize * emphasisEvery) === 0;
    context.strokeStyle = isChunkBoundary
      ? "rgba(0,0,0,0.26)"
      : isMajorBoundary
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.045)";

    context.beginPath();
    context.moveTo(screenX, 0);
    context.lineTo(screenX, job.canvasHeight);
    context.stroke();
  }

  for (let worldZ = startWorldZ; worldZ <= endWorldZ; worldZ += gridSize) {
    const screenY = worldZ * pixelsPerBlock + job.offsetY;
    if (screenY < -1 || screenY > job.canvasHeight + 1) {
      continue;
    }

    const isChunkBoundary = worldZ % 16 === 0;
    const isMajorBoundary = worldZ % (gridSize * emphasisEvery) === 0;
    context.strokeStyle = isChunkBoundary
      ? "rgba(0,0,0,0.26)"
      : isMajorBoundary
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.045)";

    context.beginPath();
    context.moveTo(0, screenY);
    context.lineTo(job.canvasWidth, screenY);
    context.stroke();
  }
}

function drawAxisLabels(
  context: CanvasRenderingContext2D,
  job: RenderJob,
  settings: MapSettingsState
) {
  const pixelsPerBlock = getPixelsPerBlock({
    offsetX: job.offsetX,
    offsetY: job.offsetY,
    zoom: job.blockSize / TILE_SIZE,
    sampleScale: job.sampleScale,
    canvasWidth: job.canvasWidth,
    canvasHeight: job.canvasHeight,
  });
  const visibleWorldWidth = Math.ceil(job.canvasWidth / pixelsPerBlock);
  const visibleWorldHeight = Math.ceil(job.canvasHeight / pixelsPerBlock);
  const worldLabelStep = getAxisLabelStep(pixelsPerBlock);
  const startWorldX = Math.floor(-job.offsetX / pixelsPerBlock);
  const startWorldZ = Math.floor(-job.offsetY / pixelsPerBlock);
  const firstLabelX = Math.ceil(startWorldX / worldLabelStep) * worldLabelStep;
  const firstLabelZ = Math.ceil(startWorldZ / worldLabelStep) * worldLabelStep;

  context.font = "11px Inter, sans-serif";

  for (let worldX = firstLabelX; worldX <= startWorldX + visibleWorldWidth + worldLabelStep; worldX += worldLabelStep) {
    const screenX = worldX * pixelsPerBlock + job.offsetX;
    if (screenX < -40 || screenX > job.canvasWidth + 40) {
      continue;
    }

    drawAxisChip(
      context,
      formatWorldCoordinate(worldX, settings),
      screenX,
      job.canvasHeight - 8,
      "bottom"
    );
  }

  for (let worldZ = firstLabelZ; worldZ <= startWorldZ + visibleWorldHeight + worldLabelStep; worldZ += worldLabelStep) {
    const screenY = worldZ * pixelsPerBlock + job.offsetY;
    if (screenY < -22 || screenY > job.canvasHeight + 22) {
      continue;
    }

    drawAxisChip(
      context,
      formatWorldCoordinate(worldZ, settings),
      job.canvasWidth - 8,
      screenY,
      "right"
    );
  }

  if (!job.drawChunkAxis) {
    return;
  }

  const chunkLabelStep = getChunkLabelStep(pixelsPerBlock);
  const firstChunkX = Math.ceil(startWorldX / 16 / chunkLabelStep) * chunkLabelStep;
  const firstChunkZ = Math.ceil(startWorldZ / 16 / chunkLabelStep) * chunkLabelStep;

  for (let chunkX = firstChunkX; chunkX <= Math.ceil((startWorldX + visibleWorldWidth) / 16) + chunkLabelStep; chunkX += chunkLabelStep) {
    const screenX = chunkX * 16 * pixelsPerBlock + job.offsetX;
    if (screenX < -28 || screenX > job.canvasWidth + 28) {
      continue;
    }

    drawAxisChip(context, `[${chunkX}]`, screenX, 8, "top");
  }

  for (let chunkZ = firstChunkZ; chunkZ <= Math.ceil((startWorldZ + visibleWorldHeight) / 16) + chunkLabelStep; chunkZ += chunkLabelStep) {
    const screenY = chunkZ * 16 * pixelsPerBlock + job.offsetY;
    if (screenY < -18 || screenY > job.canvasHeight + 18) {
      continue;
    }

    drawAxisChip(context, `[${chunkZ}]`, 8, screenY, "left");
  }
}

function detectLowEndDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const hardwareThreads = navigator.hardwareConcurrency ?? 8;
  const memory = "deviceMemory" in navigator
    ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8)
    : 8;
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return hardwareThreads <= 4 || memory <= 4 || prefersReducedMotion;
}

function getSampleScale(mode: RenderMode, zoom: number, lowEndDevice: boolean): number {
  const baseScale = Math.max(1, Math.round(4 / zoom));
  const lowEndMultiplier = lowEndDevice && zoom < 0.85 ? 2 : 1;
  const interactionMultiplier = mode === "interaction" ? 2 : 1;
  return baseScale * lowEndMultiplier * interactionMultiplier;
}

function getFrameBudget(mode: RenderMode, lowEndDevice: boolean): number {
  if (mode === "interaction") {
    return lowEndDevice ? 4 : 6;
  }

  if (mode === "generation") {
    return lowEndDevice ? 5 : 8;
  }

  return lowEndDevice ? 6 : 10;
}

function clampZoom(zoom: number): number {
  return Math.max(0.1, Math.min(20, zoom));
}

function snapZoomLevel(zoom: number): number {
  const exponent = Math.round(Math.log2(Math.max(zoom, 0.1)));
  return 2 ** exponent;
}

function getGridSpacing(pixelsPerBlock: number) {
  if (pixelsPerBlock >= 16) return 1;
  if (pixelsPerBlock >= 8) return 2;
  if (pixelsPerBlock >= 4) return 4;
  if (pixelsPerBlock >= 2) return 8;
  return 16;
}

function getAxisLabelStep(pixelsPerBlock: number) {
  if (pixelsPerBlock >= 12) return 16;
  if (pixelsPerBlock >= 6) return 32;
  if (pixelsPerBlock >= 3) return 64;
  return 128;
}

function getChunkLabelStep(pixelsPerBlock: number) {
  const chunkPixels = pixelsPerBlock * 16;
  if (chunkPixels >= 64) return 1;
  if (chunkPixels >= 36) return 2;
  if (chunkPixels >= 20) return 4;
  return 8;
}

function drawAxisChip(
  context: CanvasRenderingContext2D,
  label: string,
  anchorX: number,
  anchorY: number,
  side: "top" | "bottom" | "left" | "right"
) {
  context.save();
  context.font = "11px Inter, sans-serif";
  const paddingX = 8;
  const height = 26;
  const width = Math.max(34, Math.ceil(context.measureText(label).width + paddingX * 2));
  let x = anchorX;
  let y = anchorY;

  if (side === "top") {
    x = anchorX - width / 2;
    y = anchorY;
  } else if (side === "bottom") {
    x = anchorX - width / 2;
    y = anchorY - height;
  } else if (side === "left") {
    x = anchorX;
    y = anchorY - height / 2;
  } else {
    x = anchorX - width;
    y = anchorY - height / 2;
  }

  // Dark pill with subtle border
  context.fillStyle = "rgba(8,12,22,0.90)";
  roundRectPath(context, x, y, width, height, 9);
  context.fill();
  context.strokeStyle = "rgba(52,211,153,0.22)";
  context.lineWidth = 1;
  roundRectPath(context, x + 0.5, y + 0.5, width - 1, height - 1, 8.5);
  context.stroke();
  // Accent green label text
  context.fillStyle = "rgba(196,232,210,0.94)";
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.fillText(label, x + width / 2, y + height / 2 + 0.5);
  context.restore();
}

function roundRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const limitedRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + limitedRadius, y);
  context.arcTo(x + width, y, x + width, y + height, limitedRadius);
  context.arcTo(x + width, y + height, x, y + height, limitedRadius);
  context.arcTo(x, y + height, x, y, limitedRadius);
  context.arcTo(x, y, x + width, y, limitedRadius);
  context.closePath();
}

function brightenChannel(value: number, amount: number) {
  return Math.min(255, value + amount);
}

function applyTerrainStyle({
  biome,
  red,
  green,
  blue,
  terrain,
  terrainEstimation,
  contourLines,
  biomesAtElevation,
}: {
  biome: Biome;
  red: number;
  green: number;
  blue: number;
  terrain: TerrainSample;
  terrainEstimation: boolean;
  contourLines: boolean;
  biomesAtElevation: boolean;
}) {
  let nextRed = red;
  let nextGreen = green;
  let nextBlue = blue;
  const water = isWaterBiome(biome);
  const altitude = clamp01((terrain.height - 0.46) / 0.54);
  const depth = clamp01((0.46 - terrain.height) / 0.46);

  if (terrainEstimation) {
    if (water) {
      // Deeper water = darker + more blue-shifted; shallow = slightly lighter/cyan
      const brightness = 0.68 + terrain.light * 0.24 - depth * 0.36;
      nextRed *= brightness * 0.82;
      nextGreen *= brightness * 0.90;
      nextBlue = nextBlue * (0.94 + terrain.light * 0.20) + depth * 18;
      // Shallow water gets subtle cyan warmth
      const shallowBlend = smoothstep(0.22, 0, depth);
      nextBlue = mixChannel(nextBlue, nextBlue + 14, shallowBlend * 0.4);
    } else {
      // Stronger hillshading: doubled light contrast for visible ridges/valleys
      const brightness = 0.58 + altitude * 0.22 + terrain.light * 0.52 - terrain.slope * 0.18;
      nextRed *= brightness;
      nextGreen *= brightness;
      nextBlue *= brightness * 0.97;

      // Cool ambient tint in deep shadows
      const shadowBlend = clamp01(1 - brightness);
      nextBlue = mixChannel(nextBlue, nextBlue + 8, shadowBlend * 0.3);

      // Rocky stone blend starts earlier on steep/high terrain
      const rockyBlend = smoothstep(0.36, 0.82, altitude)
        * smoothstep(0.08, 0.62, terrain.slope + altitude * 0.36);
      if (rockyBlend > 0) {
        const rockTone = isDryBiome(biome)
          ? { red: 158, green: 138, blue: 106 }
          : { red: 124, green: 122, blue: 118 };
        nextRed = mixChannel(nextRed, rockTone.red, rockyBlend * 0.76);
        nextGreen = mixChannel(nextGreen, rockTone.green, rockyBlend * 0.72);
        nextBlue = mixChannel(nextBlue, rockTone.blue, rockyBlend * 0.74);
      }

      if (biomesAtElevation) {
        const alpineBlend = smoothstep(0.56, 0.92, altitude);
        if (alpineBlend > 0) {
          if (isColdBiome(biome)) {
            nextRed = mixChannel(nextRed, 236, alpineBlend * 0.72);
            nextGreen = mixChannel(nextGreen, 240, alpineBlend * 0.72);
            nextBlue = mixChannel(nextBlue, 244, alpineBlend * 0.76);
          } else if (!isDryBiome(biome)) {
            nextRed = mixChannel(nextRed, 164, alpineBlend * 0.32);
            nextGreen = mixChannel(nextGreen, 168, alpineBlend * 0.34);
            nextBlue = mixChannel(nextBlue, 160, alpineBlend * 0.28);
          }
        }
      }
    }
  }

  if (contourLines) {
    const contourStrength = getContourStrength(terrain.height, terrain.slope, water);
    const contourShade = 1 - contourStrength * (water ? 0.20 : 0.52);
    nextRed *= contourShade;
    nextGreen *= contourShade;
    nextBlue *= contourShade;
  }

  return {
    red: clampChannel(nextRed),
    green: clampChannel(nextGreen),
    blue: clampChannel(nextBlue),
  };
}

function getContourStrength(height: number, slope: number, water: boolean) {
  // Tighter spacing = more contour lines = more topographic detail
  const spacing = water ? 0.035 : 0.019;
  const wrapped = positiveFraction(height / spacing);
  const distanceToLine = Math.min(wrapped, 1 - wrapped);
  const line = 1 - smoothstep(0.018, 0.09, distanceToLine);
  const terrainWeight = water
    ? 0.10 + slope * 0.28
    : 0.22 + slope * 0.88 + clamp01((height - 0.46) / 0.54) * 0.18;
  return clamp01(line * terrainWeight);
}

function isWaterBiome(biome: Biome) {
  return biome === Biome.River
    || biome === Biome.FrozenRiver
    || biome === Biome.Ocean
    || biome === Biome.DeepOcean
    || biome === Biome.LukewarmOcean
    || biome === Biome.WarmOcean
    || biome === Biome.ColdOcean
    || biome === Biome.FrozenOcean
    || biome === Biome.DeepColdOcean
    || biome === Biome.DeepFrozenOcean
    || biome === Biome.DeepLukewarmOcean;
}

function isColdBiome(biome: Biome) {
  return biome === Biome.SnowyPlains
    || biome === Biome.SnowyTaiga
    || biome === Biome.FrozenRiver
    || biome === Biome.FrozenOcean
    || biome === Biome.DeepFrozenOcean
    || biome === Biome.DeepColdOcean
    || biome === Biome.SnowyBeach
    || biome === Biome.SnowySlopes
    || biome === Biome.FrozenPeaks
    || biome === Biome.JaggedPeaks
    || biome === Biome.IceSpikes
    || biome === Biome.Grove;
}

function isDryBiome(biome: Biome) {
  return biome === Biome.Desert
    || biome === Biome.Badlands
    || biome === Biome.ErodedBadlands
    || biome === Biome.Savanna
    || biome === Biome.SavannaPlateau
    || biome === Biome.Beach;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1;
  }

  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function positiveFraction(value: number) {
  return ((value % 1) + 1) % 1;
}

function mixChannel(from: number, to: number, amount: number) {
  return from + (to - from) * clamp01(amount);
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}
