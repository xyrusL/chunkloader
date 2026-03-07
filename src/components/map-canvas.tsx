"use client";

import { useEffect, useRef, useState } from "react";
import type { MapSettingsState } from "@/components/panels/map-settings-panel";
import { MapIcon } from "@/components/ui/icons";
import { BiomeGenerator } from "@/lib/biome-generator";
import { BIOME_PALETTE, BIOME_VALUES } from "@/lib/biome-colors";
import type { Edition } from "@/lib/minecraft-versions";

interface MapCanvasProps {
  seed: string;
  edition: Edition;
  isGenerating: boolean;
  settings: MapSettingsState;
  onBiomeHover: (biome: string, x: number, z: number) => void;
  onGenerationComplete: () => void;
}

type RenderMode = "generation" | "settled" | "interaction";

interface RenderJob {
  token: number;
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
  offsetX: number;
  offsetY: number;
}

const TILE_SIZE = 4;
const SETTLE_DELAY_MS = 120;

export default function MapCanvas({
  seed,
  edition,
  isGenerating,
  settings,
  onBiomeHover,
  onGenerationComplete,
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<BiomeGenerator | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
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

  useEffect(() => {
    lowEndDeviceRef.current = detectLowEndDevice();
  }, []);

  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      setCanvasSize({ w: Math.max(1, Math.floor(rect.width)), h: Math.max(1, Math.floor(rect.height)) });
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!isGenerating || !seed) {
      return;
    }

    generatorRef.current = new BiomeGenerator(seed, edition);
    generationCompletePendingRef.current = true;
    offsetRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    scheduleRender("generation", true);
  }, [edition, isGenerating, seed]);

  useEffect(() => {
    if (!generatorRef.current) {
      return;
    }

    scheduleRender("settled");
  }, [canvasSize, settings]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(prepareFrameRef.current);
      cancelAnimationFrame(renderFrameRef.current);
      window.clearTimeout(settleTimeoutRef.current);
    };
  }, []);

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

    const { w, h } = canvasSize;
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
      drawGrid: settings.showGrid && mode === "settled" && zoom >= (lowEndDeviceRef.current ? 3 : 2),
      drawAxis: mode === "settled" && zoom >= (lowEndDeviceRef.current ? 2.5 : 1.75),
      offsetX: offsetRef.current.x,
      offsetY: offsetRef.current.y,
    };

    setIsRenderingMap(true);
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
        const biomeIndex = generator.getBiomeIndexFromTile(sampleX, sampleZ, job.sampleScale);
        const paletteOffset = biomeIndex * 4;
        const pixelOffset = (row * job.cols + col) * 4;

        data[pixelOffset] = BIOME_PALETTE[paletteOffset];
        data[pixelOffset + 1] = BIOME_PALETTE[paletteOffset + 1];
        data[pixelOffset + 2] = BIOME_PALETTE[paletteOffset + 2];
        data[pixelOffset + 3] = 255;
      }
      job.rowsRendered += 1;
    }

    job.offscreenContext.putImageData(job.imageData, 0, 0);
    drawFrame(job);

    if (job.rowsRendered < job.rows) {
      renderFrameRef.current = requestAnimationFrame(() => continueRender(token));
      return;
    }

    renderJobRef.current = null;
    setIsRenderingMap(false);

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

    context.clearRect(0, 0, job.canvasWidth, job.canvasHeight);
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
    isDraggingRef.current = true;
    lastMouseRef.current = { x: event.clientX, y: event.clientY };
    if (containerRef.current) {
      containerRef.current.style.cursor = "grabbing";
    }
  }

  function handleMouseMove(event: React.MouseEvent) {
    if (generatorRef.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const hoverScale = getSampleScale("settled", zoomRef.current, lowEndDeviceRef.current);
      const blockSize = Math.max(1, TILE_SIZE * zoomRef.current);
      const worldX = Math.floor((px - offsetRef.current.x) / blockSize) * hoverScale;
      const worldZ = Math.floor((py - offsetRef.current.y) / blockSize) * hoverScale;
      const biomeIndex = generatorRef.current.getBiomeIndexFromTile(worldX, worldZ, hoverScale);
      onBiomeHover(BIOME_VALUES[biomeIndex], worldX, worldZ);
    }

    if (!isDraggingRef.current) {
      return;
    }

    const dx = event.clientX - lastMouseRef.current.x;
    const dy = event.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: event.clientX, y: event.clientY };
    offsetRef.current.x += dx;
    offsetRef.current.y += dy;

    scheduleRender("interaction");
    queueSettledRender();
  }

  function handleMouseUp() {
    isDraggingRef.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
    queueSettledRender();
  }

  function handleWheel(event: React.WheelEvent) {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? 1.15 : 0.87;
    const oldZoom = zoomRef.current;
    const unclampedZoom = oldZoom * zoomFactor;
    const newZoom = clampZoom(settings.snapZoom ? snapZoomLevel(unclampedZoom) : unclampedZoom);
    const rect = canvasRef.current?.getBoundingClientRect();

    if (rect) {
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      offsetRef.current.x = mouseX - (mouseX - offsetRef.current.x) * (newZoom / oldZoom);
      offsetRef.current.y = mouseY - (mouseY - offsetRef.current.y) * (newZoom / oldZoom);
    }

    zoomRef.current = newZoom;
    scheduleRender("interaction");
    queueSettledRender();
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#1a1a2e] select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: generatorRef.current ? "grab" : "default" }}
    >
      <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h} className="block h-full w-full" />

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

function drawGrid(context: CanvasRenderingContext2D, job: RenderJob) {
  context.strokeStyle = "rgba(255,255,255,0.06)";
  context.lineWidth = 1;

  for (let col = 0; col < job.cols; col++) {
    const screenX = (job.startCellX + col) * job.blockSize + job.offsetX;
    if (screenX < 0 || screenX > job.canvasWidth) {
      continue;
    }
    context.beginPath();
    context.moveTo(screenX, 0);
    context.lineTo(screenX, job.canvasHeight);
    context.stroke();
  }

  for (let row = 0; row < job.rows; row++) {
    const screenY = (job.startCellZ + row) * job.blockSize + job.offsetY;
    if (screenY < 0 || screenY > job.canvasHeight) {
      continue;
    }
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
  context.font = "11px Inter, sans-serif";
  context.fillStyle = "rgba(255,255,255,0.55)";
  context.strokeStyle = "rgba(255,255,255,0.14)";
  context.lineWidth = 1;

  const visibleWorldWidth = Math.ceil(job.canvasWidth / job.blockSize) * job.sampleScale;
  const visibleWorldHeight = Math.ceil(job.canvasHeight / job.blockSize) * job.sampleScale;
  const labelStep = roundToNice(Math.max(job.sampleScale, Math.round(180 / job.blockSize) * job.sampleScale));
  const startWorldX = Math.floor(-job.offsetX / job.blockSize) * job.sampleScale;
  const startWorldZ = Math.floor(-job.offsetY / job.blockSize) * job.sampleScale;
  const firstLabelX = Math.ceil(startWorldX / labelStep) * labelStep;
  const firstLabelZ = Math.ceil(startWorldZ / labelStep) * labelStep;

  for (let worldX = firstLabelX; worldX <= startWorldX + visibleWorldWidth + labelStep; worldX += labelStep) {
    const screenX = (worldX / job.sampleScale) * job.blockSize + job.offsetX;
    if (screenX < 0 || screenX > job.canvasWidth) {
      continue;
    }

    const label = formatCoord(worldX, settings);
    context.fillText(label, screenX + 3, job.canvasHeight - 4);
    context.beginPath();
    context.moveTo(screenX, job.canvasHeight - 16);
    context.lineTo(screenX, job.canvasHeight);
    context.stroke();
  }

  for (let worldZ = firstLabelZ; worldZ <= startWorldZ + visibleWorldHeight + labelStep; worldZ += labelStep) {
    const screenY = (worldZ / job.sampleScale) * job.blockSize + job.offsetY;
    if (screenY < 0 || screenY > job.canvasHeight) {
      continue;
    }

    const label = formatCoord(worldZ, settings);
    context.fillText(label, job.canvasWidth - context.measureText(label).width - 4, screenY - 2);
    context.beginPath();
    context.moveTo(job.canvasWidth - 16, screenY);
    context.lineTo(job.canvasWidth, screenY);
    context.stroke();
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

function roundToNice(value: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(Math.abs(value) || 1));
  const normalized = value / magnitude;
  if (normalized <= 1) {
    return magnitude;
  }
  if (normalized <= 2) {
    return 2 * magnitude;
  }
  if (normalized <= 5) {
    return 5 * magnitude;
  }
  return 10 * magnitude;
}

function formatCoord(value: number, settings: MapSettingsState): string {
  if (settings.chunkCoordinates) {
    return `${Math.round(value / 16)}c`;
  }

  if (settings.binaryCoordinates) {
    return `0b${Math.round(value).toString(2)}`;
  }

  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }

  return String(Math.round(value));
}
