"use client";

import { STRUCTURE_TYPES } from "@/lib/biome-data";
import type { MarkerSettingsState } from "@/lib/map-overlays";
import { CheckSquareIcon, SquareIcon, StructureIcon, WarningIcon } from "@/components/ui/icons";

interface MarkersPanelProps {
  settings: MarkerSettingsState;
  onSettingsChange: (settings: MarkerSettingsState) => void;
  compact?: boolean;
  hideTitle?: boolean;
}

export default function MarkersPanel({
  settings,
  onSettingsChange,
  compact = false,
  hideTitle = false,
}: MarkersPanelProps) {
  const { spawnPoint, slimeChunks, structuresEnabled, selectedStructures } = settings;

  const update = (patch: Partial<MarkerSettingsState>) => {
    onSettingsChange({ ...settings, ...patch });
  };

  const toggleStructure = (id: string) => {
    const next = new Set(selectedStructures);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    update({ selectedStructures: next });
  };

  const selectAll = () => {
    update({ selectedStructures: new Set(STRUCTURE_TYPES.map((s) => s.id)) });
  };

  const clearAll = () => {
    update({ selectedStructures: new Set() });
  };

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-6">
      {!hideTitle && <h3 className="mb-4 text-base font-semibold text-white">Markers</h3>}

      <div className={`mb-5 grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-2 lg:max-w-2xl"}`}>
        <ToggleSwitch label="Spawn point" checked={spawnPoint} onChange={() => update({ spawnPoint: !spawnPoint })} />
        <ToggleSwitch label="Slime chunks" checked={slimeChunks} onChange={() => update({ slimeChunks: !slimeChunks })} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <ToggleSwitch
            label={`Structures (selected: ${selectedStructures.size})`}
            checked={structuresEnabled}
            onChange={() => update({ structuresEnabled: !structuresEnabled })}
          />
        </div>

        {structuresEnabled && (
          <>
            {/* Select all / Clear */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                onClick={selectAll}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs 
                           text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <CheckSquareIcon className="h-3.5 w-3.5" />
                <span>Select all</span>
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs 
                           text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <SquareIcon className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>

            <div className={`grid gap-2 ${compact ? "grid-cols-1" : "md:grid-cols-2 xl:grid-cols-3"}`}>
              {STRUCTURE_TYPES.map((structure) => {
                const isSelected = selectedStructures.has(structure.id);
                return (
                  <button
                    key={structure.id}
                    onClick={() => toggleStructure(structure.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                        : "bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-black/20 ring-1 ring-white/5">
                      <StructureIcon name={structure.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <span className="truncate">{structure.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Zoom warning */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-white/[0.02] p-3 rounded-lg border border-white/5">
              <span className="text-amber-400">
                <WarningIcon className="h-4 w-4" />
              </span>
              <span>Zoom in more to see all selected structures!</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 cursor-pointer">
      <button
        type="button"
        onClick={onChange}
        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
          checked ? "bg-emerald-500" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );
}
