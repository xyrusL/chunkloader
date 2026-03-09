"use client";

import { BIOME_COLORS, Biome } from "@/lib/biome-colors";
import { formatWorldCoordinate, type CoordinateFormatOptions } from "@/lib/coordinate-format";

interface MapInfoBarProps {
  biome: string;
  x: number;
  z: number;
  version: string;
  edition: string;
  seed: string;
  settings: CoordinateFormatOptions;
}

export default function MapInfoBar({ biome, x, z, version, edition, seed, settings }: MapInfoBarProps) {
  const biomeColor = BIOME_COLORS[biome as Biome];

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-white/5 bg-[var(--theme-bg-header)] px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4">
      <div className="min-w-0 flex items-center gap-3 text-[var(--theme-text-muted)]">
        {seed && (
          <>
            <span className="block truncate text-[var(--theme-text-faint)]">
              {version}-{edition[0].toUpperCase() + edition.slice(1)} / <span className="font-mono">{seed}</span>
            </span>
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-[var(--theme-text-muted)]">
        {biome && (
          <>
            <div className="flex min-w-0 items-center gap-1.5">
              {biomeColor && (
                <span
                  className="inline-block w-3 h-3 rounded-sm border border-white/20"
                  style={{ backgroundColor: `rgb(${biomeColor.r},${biomeColor.g},${biomeColor.b})` }}
                />
              )}
            <span className="truncate font-medium text-[var(--theme-text-secondary)]">{biome}</span>
            </div>
            <span>
              x: <span className="font-mono text-[var(--theme-text-secondary)]">{formatWorldCoordinate(x, settings)}</span>
            </span>
            <span>
              z: <span className="font-mono text-[var(--theme-text-secondary)]">{formatWorldCoordinate(z, settings)}</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
