"use client";

import type { ReactNode } from "react";
import type { Dimension, Edition } from "@/lib/minecraft-versions";
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
  dimension: Dimension;
  onDimensionChange: (dimension: Dimension) => void;
}

const DIMENSION_OPTIONS: Array<{ id: Dimension; label: string; accent: string }> = [
  { id: "overworld", label: "Overworld", accent: "text-sky-300" },
  { id: "nether", label: "Nether", accent: "text-red-300" },
  { id: "end", label: "End", accent: "text-violet-200" },
];

export default function SeedVersionPanel({
  seed,
  version,
  edition,
  dimension,
  onDimensionChange,
}: SeedVersionPanelProps) {
  const numericSeed = seed && !isNaN(Number(seed)) ? seed : "";
  const hexSeed = numericSeed
    ? BigInt(numericSeed).toString(16).toUpperCase().replace(/(.{4})/g, "$1 ").trim()
    : "";

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <h3 className="text-base font-semibold text-white mb-4">Seed and version</h3>
        <div className="space-y-3">
          <InfoRow label="Version" value={`Minecraft ${edition === "java" ? "Java" : "Bedrock"} ${version}`} />
          <DimensionRow dimension={dimension} onDimensionChange={onDimensionChange} />
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

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
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

function DimensionRow({
  dimension,
  onDimensionChange,
}: {
  dimension: Dimension;
  onDimensionChange: (dimension: Dimension) => void;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm text-gray-400 w-24 shrink-0 pt-2">Dimension:</span>
      <div className="flex-1 rounded-lg border border-white/5 bg-white/5 p-1">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
          {DIMENSION_OPTIONS.map((option) => {
            const active = option.id === dimension;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onDimensionChange(option.id)}
                className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-[#171b31] text-white ring-1 ring-white/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <GlobeIcon className={`h-4 w-4 ${active ? option.accent : "text-gray-500"}`} />
                <span>{option.label}</span>
              </button>
            );
          })}
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
            type="button"
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
