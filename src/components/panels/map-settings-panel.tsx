"use client";

import type { ReactNode } from "react";
import {
  GridIcon,
  HashIcon,
  MessageIcon,
  MountainIcon,
  RulerIcon,
  SearchIcon,
  WavesIcon,
} from "@/components/ui/icons";

export interface MapSettingsState {
  terrainEstimation: boolean;
  contourLines: boolean;
  biomesAtElevation: boolean;
  showGrid: boolean;
  binaryCoordinates: boolean;
  chunkCoordinates: boolean;
  snapZoom: boolean;
  floatingTooltip: boolean;
}

interface MapSettingsPanelProps {
  settings: MapSettingsState;
  onSettingsChange: (settings: MapSettingsState) => void;
  compact?: boolean;
  hideTitle?: boolean;
}

export const DEFAULT_MAP_SETTINGS: MapSettingsState = {
  terrainEstimation: true,
  contourLines: true,
  biomesAtElevation: false,
  showGrid: true,
  binaryCoordinates: false,
  chunkCoordinates: false,
  snapZoom: false,
  floatingTooltip: false,
};

export default function MapSettingsPanel({
  settings,
  onSettingsChange,
  compact = false,
  hideTitle = false,
}: MapSettingsPanelProps) {
  const toggle = (key: keyof MapSettingsState) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-6">
      {!hideTitle && <h3 className="mb-5 text-base font-semibold text-white">Map settings</h3>}

      <div className={`grid grid-cols-1 gap-4 ${compact ? "" : "lg:grid-cols-2 2xl:grid-cols-3"}`}>
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Image</h4>
          <div className="space-y-3">
            <ToggleRow
              label="Terrain estimation"
              icon={<MountainIcon className="h-4 w-4" />}
              checked={settings.terrainEstimation}
              onChange={() => toggle("terrainEstimation")}
              badge="zoom in"
              compact={compact}
            />
            <ToggleRow
              label="Contour lines"
              icon={<WavesIcon className="h-4 w-4" />}
              checked={settings.contourLines}
              onChange={() => toggle("contourLines")}
              compact={compact}
            />
            <ToggleRow
              label="Biomes at elevation Y=320"
              icon={<RulerIcon className="h-4 w-4" />}
              checked={settings.biomesAtElevation}
              onChange={() => toggle("biomesAtElevation")}
              compact={compact}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Grid</h4>
          <div className="space-y-3">
            <ToggleRow
              label="Show grid"
              icon={<GridIcon className="h-4 w-4" />}
              checked={settings.showGrid}
              onChange={() => toggle("showGrid")}
              compact={compact}
            />
            <ToggleRow
              label="Binary coordinates"
              icon={<HashIcon className="h-4 w-4" />}
              checked={settings.binaryCoordinates}
              onChange={() => toggle("binaryCoordinates")}
              compact={compact}
            />
            <ToggleRow
              label="Chunk coordinates"
              icon={<RulerIcon className="h-4 w-4" />}
              checked={settings.chunkCoordinates}
              onChange={() => toggle("chunkCoordinates")}
              disabled={!settings.showGrid}
              compact={compact}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Other</h4>
          <div className="space-y-3">
            <ToggleRow
              label="Snap zoom level to 2ⁿ:1"
              icon={<SearchIcon className="h-4 w-4" />}
              checked={settings.snapZoom}
              onChange={() => toggle("snapZoom")}
              compact={compact}
            />
            <ToggleRow
              label="Floating tooltip"
              icon={<MessageIcon className="h-4 w-4" />}
              checked={settings.floatingTooltip}
              onChange={() => toggle("floatingTooltip")}
              compact={compact}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  icon,
  checked,
  onChange,
  disabled,
  badge,
  compact,
}: {
  label: string;
  icon: ReactNode;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  badge?: string;
  compact?: boolean;
}) {
  return (
    <label
      className={`group flex items-start justify-between gap-4 rounded-xl border border-white/6 bg-black/10 px-3 py-3 ${
        disabled ? "cursor-not-allowed opacity-40" : "hover:border-white/12 hover:bg-white/[0.025]"
      }`}
    >
      <div className="min-w-0 flex flex-1 items-start gap-3">
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-gray-300">{icon}</span>
        <div className="min-w-0">
          <span className={`block text-sm transition-colors ${checked ? "text-gray-200" : "text-gray-400"} group-hover:text-gray-200`}>
            {label}
          </span>
          {badge && checked && (
            <span className="mt-1 inline-flex rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
              {badge}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={disabled ? undefined : onChange}
        className={`relative mt-0.5 h-5 w-10 shrink-0 rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-white/10"
        } ${disabled ? "pointer-events-none" : ""} ${compact ? "" : ""}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </label>
  );
}
