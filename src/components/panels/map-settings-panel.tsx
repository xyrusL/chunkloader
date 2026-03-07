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

export default function MapSettingsPanel({ settings, onSettingsChange }: MapSettingsPanelProps) {
  const toggle = (key: keyof MapSettingsState) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="p-5">
      <h3 className="text-base font-semibold text-white mb-5">Map settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Image</h4>
          <div className="space-y-3">
            <ToggleRow
              label="Terrain estimation"
              icon={<MountainIcon className="h-4 w-4" />}
              checked={settings.terrainEstimation}
              onChange={() => toggle("terrainEstimation")}
              badge="zoom in"
            />
            <ToggleRow
              label="Contour lines"
              icon={<WavesIcon className="h-4 w-4" />}
              checked={settings.contourLines}
              onChange={() => toggle("contourLines")}
            />
            <ToggleRow
              label="Biomes at elevation Y=320"
              icon={<RulerIcon className="h-4 w-4" />}
              checked={settings.biomesAtElevation}
              onChange={() => toggle("biomesAtElevation")}
            />
          </div>
        </div>

        {/* Grid Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Grid</h4>
          <div className="space-y-3">
            <ToggleRow
              label="Show grid"
              icon={<GridIcon className="h-4 w-4" />}
              checked={settings.showGrid}
              onChange={() => toggle("showGrid")}
            />
            <ToggleRow
              label="Binary coordinates"
              icon={<HashIcon className="h-4 w-4" />}
              checked={settings.binaryCoordinates}
              onChange={() => toggle("binaryCoordinates")}
            />
            <ToggleRow
              label="Chunk coordinates"
              icon={<RulerIcon className="h-4 w-4" />}
              checked={settings.chunkCoordinates}
              onChange={() => toggle("chunkCoordinates")}
              disabled={!settings.showGrid}
            />
          </div>
        </div>

        {/* Other Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Other</h4>
          <div className="space-y-3">
            <ToggleRow
              label="Snap zoom level to 2ⁿ:1"
              icon={<SearchIcon className="h-4 w-4" />}
              checked={settings.snapZoom}
              onChange={() => toggle("snapZoom")}
            />
            <ToggleRow
              label="Floating tooltip"
              icon={<MessageIcon className="h-4 w-4" />}
              checked={settings.floatingTooltip}
              onChange={() => toggle("floatingTooltip")}
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
}: {
  label: string;
  icon: ReactNode;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer group ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      {/* Toggle switch */}
      <button
        onClick={disabled ? undefined : onChange}
        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
          checked ? "bg-emerald-500" : "bg-white/10"
        } ${disabled ? "pointer-events-none" : ""}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>

      <span className="flex h-4 w-4 items-center justify-center text-gray-300">{icon}</span>
      <span className={`text-sm ${checked ? "text-gray-200" : "text-gray-400"} group-hover:text-gray-200 transition-colors`}>
        {label}
      </span>
      {badge && checked && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
          {badge}
        </span>
      )}
    </label>
  );
}
