"use client";

import { BIOME_COLORS, Biome } from "@/lib/biome-colors";

interface MapInfoBarProps {
  biome: string;
  x: number;
  z: number;
  version: string;
  edition: string;
  seed: string;
}

export default function MapInfoBar({ biome, x, z, version, edition, seed }: MapInfoBarProps) {
  const biomeColor = BIOME_COLORS[biome as Biome];

  return (
    <div className="bg-[#0d0d1a]/80 backdrop-blur-sm border-b border-white/5 px-4 py-1.5 flex items-center justify-between text-xs">
      <div className="flex items-center gap-3 text-gray-400">
        {seed && (
          <>
            <span className="text-gray-500">
              {version}-{edition[0].toUpperCase() + edition.slice(1)} / <span className="font-mono">{seed}</span>
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 text-gray-400">
        {biome && (
          <>
            <div className="flex items-center gap-1.5">
              {biomeColor && (
                <span
                  className="inline-block w-3 h-3 rounded-sm border border-white/20"
                  style={{ backgroundColor: `rgb(${biomeColor.r},${biomeColor.g},${biomeColor.b})` }}
                />
              )}
              <span className="text-gray-200 font-medium">{biome}</span>
            </div>
            <span>
              x: <span className="text-gray-200 font-mono">{x}</span>
            </span>
            <span>
              z: <span className="text-gray-200 font-mono">{z}</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
