"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { BiomeGenerator } from "@/lib/biome-generator";
import { BIOME_COLORS, Biome } from "@/lib/biome-colors";
import type { Edition } from "@/lib/minecraft-versions";

interface MapCanvasProps {
  seed: string;
  edition: Edition;
  isGenerating: boolean;
  onBiomeHover: (biome: string, x: number, z: number) => void;
  onGenerationComplete: () => void;
}

const TILE_SIZE = 4; // pixels per block at base zoom

export default function MapCanvas({
  seed,
  edition,
  isGenerating,
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
  const animFrameRef = useRef<number>(0);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });

  // Resize canvas to fill container
  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ w: rect.width, h: rect.height });
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Render the biome map onto the canvas
  const renderMap = useCallback(() => {
    const canvas = canvasRef.current;
    const gen = generatorRef.current;
    if (!canvas || !gen) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = canvasSize;
    const zoom = zoomRef.current;
    const offset = offsetRef.current;
    const blockSize = TILE_SIZE * zoom;

    // How many blocks fit on screen
    const blocksW = Math.ceil(w / blockSize) + 2;
    const blocksH = Math.ceil(h / blockSize) + 2;

    // World offset in blocks
    const worldOffsetX = Math.floor(-offset.x / blockSize);
    const worldOffsetZ = Math.floor(-offset.y / blockSize);

    // Sub-pixel offset for smooth scrolling
    const subX = (offset.x % blockSize + blockSize) % blockSize;
    const subY = (offset.y % blockSize + blockSize) % blockSize;

    // Scale determines how many world blocks each pixel-block represents
    const scale = Math.max(1, Math.round(4 / zoom));

    // Create image buffer
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let bz = -1; bz < blocksH; bz++) {
      for (let bx = -1; bx < blocksW; bx++) {
        const worldX = (worldOffsetX + bx) * scale;
        const worldZ = (worldOffsetZ + bz) * scale;

        const biome = gen.getBiomeAt(worldX, worldZ);
        const color = BIOME_COLORS[biome];

        // Screen position
        const screenX = Math.floor(bx * blockSize + subX);
        const screenZ = Math.floor(bz * blockSize + subY);
        const size = Math.ceil(blockSize);

        // Fill the block rectangle
        for (let py = Math.max(0, screenZ); py < Math.min(h, screenZ + size); py++) {
          for (let px = Math.max(0, screenX); px < Math.min(w, screenX + size); px++) {
            const idx = (py * w + px) * 4;
            data[idx] = color.r;
            data[idx + 1] = color.g;
            data[idx + 2] = color.b;
            data[idx + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw grid lines at low zoom
    if (zoom >= 2) {
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let bx = 0; bx < blocksW; bx++) {
        const sx = Math.floor(bx * blockSize + subX);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
        ctx.stroke();
      }
      for (let bz = 0; bz < blocksH; bz++) {
        const sz = Math.floor(bz * blockSize + subY);
        ctx.beginPath();
        ctx.moveTo(0, sz);
        ctx.lineTo(w, sz);
        ctx.stroke();
      }
    }

    // Draw axis labels
    drawAxisLabels(ctx, w, h, offset, zoom, scale, blockSize);
  }, [canvasSize]);

  // Draw coordinate axis labels
  function drawAxisLabels(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    offset: { x: number; y: number },
    zoom: number,
    scale: number,
    blockSize: number
  ) {
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";

    const step = Math.max(1, Math.round(200 / blockSize)) * scale;
    const roundedStep = roundToNice(step);

    // X axis (bottom)
    const startBlockX = Math.floor(-offset.x / blockSize) * scale;
    const firstX = Math.ceil(startBlockX / roundedStep) * roundedStep;
    for (let worldX = firstX; worldX < startBlockX + Math.ceil(w / blockSize) * scale + roundedStep; worldX += roundedStep) {
      const screenX = (worldX / scale - Math.floor(-offset.x / blockSize)) * blockSize + (offset.x % blockSize + blockSize) % blockSize;
      if (screenX >= 0 && screenX <= w) {
        const label = formatCoord(worldX);
        ctx.fillText(label, screenX + 2, h - 4);

        // tick
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(screenX, h - 18);
        ctx.lineTo(screenX, h);
        ctx.stroke();
      }
    }

    // Z axis (right)
    const startBlockZ = Math.floor(-offset.y / blockSize) * scale;
    const firstZ = Math.ceil(startBlockZ / roundedStep) * roundedStep;
    for (let worldZ = firstZ; worldZ < startBlockZ + Math.ceil(h / blockSize) * scale + roundedStep; worldZ += roundedStep) {
      const screenZ = (worldZ / scale - Math.floor(-offset.y / blockSize)) * blockSize + (offset.y % blockSize + blockSize) % blockSize;
      if (screenZ >= 0 && screenZ <= h) {
        const label = formatCoord(worldZ);
        ctx.fillText(label, w - ctx.measureText(label).width - 4, screenZ - 2);

        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w - 18, screenZ);
        ctx.lineTo(w, screenZ);
        ctx.stroke();
      }
    }

    // Origin crosshair
    const originScreenX = offset.x + w / 2;
    const originScreenZ = offset.y + h / 2;
    // Only draw if visible — but our offset system starts at 0,0 in corner, not center
    // Draw axis label
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText("x", w / 2, h - 4);
    ctx.fillText("z", w - 10, h / 2);
  }

  // Trigger generation when seed changes
  useEffect(() => {
    if (!isGenerating || !seed) return;

    generatorRef.current = new BiomeGenerator(seed, edition);
    offsetRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;

    renderMap();
    onGenerationComplete();
  }, [isGenerating, seed, edition, renderMap, onGenerationComplete]);

  // Re-render on canvas size change
  useEffect(() => {
    if (generatorRef.current) {
      renderMap();
    }
  }, [canvasSize, renderMap]);

  // Mouse handlers for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update biome hover info
    if (generatorRef.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const zoom = zoomRef.current;
      const blockSize = TILE_SIZE * zoom;
      const scale = Math.max(1, Math.round(4 / zoom));
      const worldX = Math.floor((px - offsetRef.current.x) / blockSize) * scale;
      const worldZ = Math.floor((py - offsetRef.current.y) / blockSize) * scale;
      const biome = generatorRef.current.getBiomeAt(worldX, worldZ);
      onBiomeHover(biome, worldX, worldZ);
    }

    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    offsetRef.current.x += dx;
    offsetRef.current.y += dy;

    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(renderMap);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  };

  // Wheel handler for zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const oldZoom = zoomRef.current;
    const newZoom = Math.max(0.1, Math.min(20, oldZoom * zoomFactor));

    // Zoom towards mouse position
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      offsetRef.current.x = mouseX - (mouseX - offsetRef.current.x) * (newZoom / oldZoom);
      offsetRef.current.y = mouseY - (mouseY - offsetRef.current.y) * (newZoom / oldZoom);
    }

    zoomRef.current = newZoom;
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(renderMap);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 bg-[#1a1a2e] overflow-hidden cursor-grab select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        className="block"
      />

      {!generatorRef.current && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">🗺️</div>
            <p className="text-gray-400 text-lg">
              Enter a seed and click <span className="text-emerald-400 font-semibold">Generate Map</span> to start
            </p>
            <p className="text-gray-500 text-sm">
              Drag to pan • Scroll to zoom
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function roundToNice(n: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(Math.abs(n) || 1)));
  const norm = n / pow;
  if (norm <= 1) return pow;
  if (norm <= 2) return 2 * pow;
  if (norm <= 5) return 5 * pow;
  return 10 * pow;
}

function formatCoord(n: number): string {
  if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;
  return String(Math.round(n));
}
