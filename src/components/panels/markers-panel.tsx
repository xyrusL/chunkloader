"use client";

import { useState } from "react";
import { STRUCTURE_TYPES } from "@/lib/biome-data";
import { CheckSquareIcon, SquareIcon, StructureIcon, WarningIcon } from "@/components/ui/icons";

export default function MarkersPanel() {
  const [spawnPoint, setSpawnPoint] = useState(true);
  const [slimeChunks, setSlimeChunks] = useState(false);
  const [structuresEnabled, setStructuresEnabled] = useState(true);
  const [selectedStructures, setSelectedStructures] = useState<Set<string>>(new Set(["village"]));

  const toggleStructure = (id: string) => {
    setSelectedStructures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedStructures(new Set(STRUCTURE_TYPES.map((s) => s.id)));
  };

  const clearAll = () => {
    setSelectedStructures(new Set());
  };

  return (
    <div className="p-5">
      <h3 className="text-base font-semibold text-white mb-4">Markers</h3>

      {/* Top toggles */}
      <div className="flex items-center gap-6 mb-5">
        <ToggleSwitch label="Spawn point" checked={spawnPoint} onChange={() => setSpawnPoint(!spawnPoint)} />
        <ToggleSwitch label="Slime chunks" checked={slimeChunks} onChange={() => setSlimeChunks(!slimeChunks)} />
      </div>

      {/* Structures section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <ToggleSwitch
            label={`Structures (selected: ${selectedStructures.size})`}
            checked={structuresEnabled}
            onChange={() => setStructuresEnabled(!structuresEnabled)}
          />
        </div>

        {structuresEnabled && (
          <>
            {/* Select all / Clear */}
            <div className="flex items-center gap-2 mb-3">
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

            {/* Structure grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                    <span className="flex h-4 w-4 items-center justify-center">
                      <StructureIcon name={structure.icon} className="h-4 w-4" />
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
    <label className="flex items-center gap-2 cursor-pointer">
      <button
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
