"use client";

import type { ReactElement } from "react";
import { LeafIcon, PinIcon, SearchIcon, SeedIcon, SettingsIcon } from "@/components/ui/icons";

interface Tab {
  id: string;
  label: string;
  icon: ReactElement;
}

const TABS: Tab[] = [
  { id: "seed", label: "SEED AND VERSION", icon: <SeedIcon className="h-5 w-5" /> },
  { id: "settings", label: "MAP SETTINGS", icon: <SettingsIcon className="h-5 w-5" /> },
  { id: "finder", label: "SEED FINDER", icon: <SearchIcon className="h-5 w-5" /> },
  { id: "markers", label: "MARKERS", icon: <PinIcon className="h-5 w-5" /> },
  { id: "biomes", label: "BIOMES", icon: <LeafIcon className="h-5 w-5" /> },
];

interface BottomTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  return (
    <nav className="bg-[#080818] border-t border-white/5 border-b border-white/8">
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 px-2 relative text-center transition-all
              ${activeTab === tab.id
                ? "text-emerald-300 bg-[#0c1a25]"
                : "text-gray-300 hover:text-white hover:bg-white/[0.04]"
              }`}
          >
            {/* Active top indicator */}
            {activeTab === tab.id && (
              <span className="absolute top-0 left-3 right-3 h-[2px] bg-emerald-400 rounded-b" />
            )}
            <span className="flex h-5 items-center justify-center">
              {tab.icon}
            </span>
            <span className="text-[11px] font-semibold tracking-[0.16em]">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
