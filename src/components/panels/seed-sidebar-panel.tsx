"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getVersionsForEdition } from "@/lib/minecraft-versions";
import type { Dimension, Edition, MinecraftVersion } from "@/lib/minecraft-versions";
import {
  ChevronDownIcon,
  ClipboardIcon,
  CoffeeIcon,
  DiceIcon,
  GlobeIcon,
  LayersIcon,
  MapIcon,
  PackageIcon,
  SpinnerIcon,
} from "@/components/ui/icons";

interface SeedSidebarPanelProps {
  seed: string;
  version: string;
  edition: Edition;
  dimension: Dimension;
  isGenerating: boolean;
  onGenerate: (seed: string, version: MinecraftVersion, edition: Edition) => void;
  onDimensionChange: (dimension: Dimension) => void;
}

const DIMENSION_OPTIONS: Array<{ id: Dimension; label: string; accent: string }> = [
  { id: "overworld", label: "Overworld", accent: "text-sky-300" },
  { id: "nether", label: "Nether", accent: "text-red-300" },
  { id: "end", label: "End", accent: "text-violet-200" },
];

export default function SeedSidebarPanel({
  seed,
  version,
  edition,
  dimension,
  isGenerating,
  onGenerate,
  onDimensionChange,
}: SeedSidebarPanelProps) {
  const [localSeed, setLocalSeed] = useState(seed);
  const [localEdition, setLocalEdition] = useState<Edition>(edition);
  const versions = getVersionsForEdition(localEdition);
  const [selectedVersion, setSelectedVersion] = useState(
    versions.find((candidate) => candidate.id === version) ?? versions[0]
  );

  useEffect(() => {
    setLocalSeed(seed);
  }, [seed]);

  useEffect(() => {
    setLocalEdition(edition);
  }, [edition]);

  useEffect(() => {
    const nextVersions = getVersionsForEdition(localEdition);
    setSelectedVersion(nextVersions.find((candidate) => candidate.id === version) ?? nextVersions[0]);
  }, [localEdition, version]);

  const numericSeed = useMemo(
    () => (/^[+-]?\d+$/.test(localSeed.trim()) ? localSeed.trim() : ""),
    [localSeed]
  );
  const hexSeed = useMemo(
    () => (numericSeed ? BigInt(numericSeed).toString(16).toUpperCase().replace(/(.{4})/g, "$1 ").trim() : ""),
    [numericSeed]
  );

  const handleEditionChange = (nextEdition: Edition) => {
    setLocalEdition(nextEdition);
    const nextVersions = getVersionsForEdition(nextEdition);
    setSelectedVersion(nextVersions[0]);
  };

  const handleRandom = () => {
    const randomSeed = String(Math.floor(Math.random() * 9999999999) - 4999999999);
    setLocalSeed(randomSeed);
  };

  const handleGenerate = () => {
    const nextSeed = localSeed.trim() || String(Math.floor(Math.random() * 9999999999) - 4999999999);
    setLocalSeed(nextSeed);
    onGenerate(nextSeed, selectedVersion, localEdition);
  };

  return (
    <div className="space-y-7 p-5">
      <section className="space-y-4">
        <div className="flex rounded-2xl border border-white/10 bg-black/10 p-1">
          <EditionButton
            active={localEdition === "java"}
            label="Java"
            icon={<CoffeeIcon className="h-4 w-4" />}
            onClick={() => handleEditionChange("java")}
          />
          <EditionButton
            active={localEdition === "bedrock"}
            label="Bedrock"
            icon={<LayersIcon className="h-4 w-4" />}
            onClick={() => handleEditionChange("bedrock")}
          />
        </div>

        <Field label="Version">
          <div className="relative">
            <select
              value={selectedVersion.id}
              onChange={(event) => {
                const next = versions.find((candidate) => candidate.id === event.target.value);
                if (next) {
                  setSelectedVersion(next);
                }
              }}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-10 text-sm font-medium text-[var(--theme-text-primary)] outline-none transition-colors hover:border-white/20 focus:border-[var(--theme-border-strong)]"
            >
              {versions.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.edition === "java" ? "Java" : "Bedrock"} {candidate.id}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-text-faint)]" />
          </div>
        </Field>

        <Field label="Dimension">
          <div className="grid grid-cols-1 gap-2">
            {DIMENSION_OPTIONS.map((option) => {
              const active = option.id === dimension;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onDimensionChange(option.id)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                    active
                      ? "border-[var(--theme-border-strong)] bg-[var(--theme-accent-soft)] text-[var(--theme-text-primary)]"
                      : "border-white/10 bg-white/[0.03] text-[var(--theme-text-secondary)] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-black/20 ${active ? option.accent : "text-[var(--theme-text-faint)]"}`}>
                    <GlobeIcon className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Seed">
          <div className="flex gap-2">
            <input
              type="text"
              value={localSeed}
              onChange={(event) => setLocalSeed(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleGenerate();
                }
              }}
              placeholder="Enter seed number or text"
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-[var(--theme-text-primary)] outline-none transition-colors placeholder:text-[var(--theme-text-faint)] hover:border-white/20 focus:border-[var(--theme-border-strong)]"
            />
            <IconActionButton title="Random seed" onClick={handleRandom}>
              <DiceIcon className="h-4 w-4" />
            </IconActionButton>
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--theme-accent-strong),var(--theme-accent))] px-4 py-3 text-sm font-semibold text-[#04110b] shadow-[var(--theme-shadow-accent)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? <SpinnerIcon className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
            <span>{isGenerating ? "Generating" : "Generate"}</span>
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(localSeed)}
            disabled={!localSeed}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-[var(--theme-text-secondary)] transition-colors hover:border-white/20 hover:text-[var(--theme-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ClipboardIcon className="h-4 w-4" />
            <span>Copy seed</span>
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <InfoCard label="Number" value={numericSeed || "—"} copyable={Boolean(numericSeed)} mono />
        <InfoCard label="Hex" value={hexSeed || "—"} copyable={Boolean(hexSeed)} mono />
      </section>

      <section className="rounded-[1.4rem] border border-dashed border-white/12 bg-black/10 p-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] text-[var(--theme-text-faint)]">
          <PackageIcon className="h-7 w-7" />
        </div>
        <p className="mt-4 text-base text-[var(--theme-text-secondary)]">Drag a worldgen datapack ZIP here</p>
        <p className="mt-2 text-sm text-[var(--theme-text-faint)]">or click to select a file...</p>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-3">
      <label className="text-sm text-[var(--theme-text-secondary)] sm:pt-3">{label}:</label>
      <div>{children}</div>
    </div>
  );
}

function EditionButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-[1rem] px-4 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]"
          : "text-[var(--theme-text-muted)] hover:bg-white/[0.04] hover:text-[var(--theme-text-primary)]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function IconActionButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-[3.125rem] w-[3.125rem] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--theme-text-muted)] transition-colors hover:border-white/20 hover:text-[var(--theme-text-primary)]"
    >
      {children}
    </button>
  );
}

function InfoCard({
  label,
  value,
  mono,
  copyable,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:gap-3">
      <span className="text-sm text-[var(--theme-text-secondary)]">{label}:</span>
      <div
        className={`min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[var(--theme-text-primary)] ${
          mono ? "font-mono" : ""
        }`}
      >
        <span className="block truncate">{value}</span>
      </div>
      {copyable && (
        <IconActionButton title={`Copy ${label}`} onClick={() => navigator.clipboard.writeText(value)}>
          <ClipboardIcon className="h-4 w-4" />
        </IconActionButton>
      )}
    </div>
  );
}
