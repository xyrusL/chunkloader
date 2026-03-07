"use client";

import type { ReactNode } from "react";
import type { Edition } from "@/lib/minecraft-versions";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsHorizontalIcon,
  ClipboardIcon,
  GlobeIcon,
  InfoIcon,
  PackageIcon,
} from "@/components/ui/icons";

interface SeedVersionPanelProps {
  seed: string;
  version: string;
  edition: Edition;
}

export default function SeedVersionPanel({ seed, version, edition }: SeedVersionPanelProps) {
  const numericSeed = seed && !isNaN(Number(seed)) ? seed : "";
  const hexSeed = numericSeed
    ? BigInt(numericSeed).toString(16).toUpperCase().replace(/(.{4})/g, "$1 ").trim()
    : "";

  return (
    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Seed and version info */}
      <div>
        <h3 className="text-base font-semibold text-white mb-4">Seed and version</h3>
        <div className="space-y-3">
          <InfoRow label="Version" value={`Minecraft ${edition === "java" ? "Java" : "Bedrock"} ${version}`} />
          <InfoRow label="Dimension" value="Overworld" icon={<GlobeIcon className="h-4 w-4 text-sky-400" />} />
          <InfoRow label="Seed" value={seed || "—"} mono copyable />
          {numericSeed && <InfoRow label="Number" value={numericSeed} mono copyable />}
          {hexSeed && <InfoRow label="Hex" value={hexSeed} mono copyable />}

          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-gray-400 w-24 shrink-0">Sister seeds:</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs">
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs">
                <ChevronsHorizontalIcon className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs">
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Datapacks placeholder */}
      <div>
        <h3 className="text-base font-semibold text-white mb-4">Datapacks</h3>
        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-gray-400">
            <PackageIcon className="h-6 w-6" />
          </span>
          <p className="text-sm text-gray-400">Drag a worldgen datapack ZIP here</p>
          <p className="text-xs text-gray-500">or click to select a file...</p>
        </div>
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
          <span className="mt-0.5 shrink-0 text-sky-400">
            <InfoIcon className="h-4 w-4" />
          </span>
          <p>
            Seed map for datapacks is an <span className="font-semibold text-gray-400">experimental feature</span> that may have
            inaccuracies. It only works with datapacks that use Minecraft&apos;s default multi-noise biome generator.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
  copyable,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
  icon?: ReactNode;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400 w-24 shrink-0">{label}:</span>
      <div className="flex-1 flex items-center gap-2">
        <span
          className={`text-sm bg-white/5 rounded-lg px-3 py-1.5 flex-1 text-gray-200 border border-white/5 ${
            mono ? "font-mono" : ""
          } flex items-center gap-2`}
        >
          {icon}
          {value}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
            title="Copy"
          >
            <ClipboardIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
