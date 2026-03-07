"use client";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: "seed", label: "SEED AND VERSION", icon: "🌱" },
  { id: "settings", label: "MAP SETTINGS", icon: "⚙️" },
  { id: "finder", label: "SEED FINDER", icon: "🔍" },
  { id: "markers", label: "MARKERS", icon: "📍" },
  { id: "biomes", label: "BIOMES", icon: "🌿" },
];

interface BottomTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  return (
    <nav className="bg-[#0d0d1a] border-t border-white/5">
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 relative transition-all
              ${activeTab === tab.id
                ? "text-emerald-400 bg-emerald-500/5 border-t-2 border-emerald-400"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border-t-2 border-transparent"
              }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] font-medium tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
