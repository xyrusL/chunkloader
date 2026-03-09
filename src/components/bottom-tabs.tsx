"use client";

import { PANEL_TABS } from "@/components/panel-tabs";

interface BottomTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  return (
    <nav className="border-b border-white/8 bg-[var(--theme-bg-tabs)]/80">
      <div className="mx-auto flex w-full gap-2 overflow-x-auto px-3 py-3 sm:px-4 lg:max-w-5xl lg:px-6">
        {PANEL_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex min-w-[10.5rem] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-center transition-all lg:min-w-0 lg:flex-1 ${
                activeTab === tab.id
                  ? "border-[var(--theme-border-strong)] bg-[var(--theme-bg-panel-active)] text-[var(--theme-accent)] shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
                  : "border-white/6 bg-white/[0.02] text-gray-300 hover:border-white/12 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {activeTab === tab.id && (
                <span className="absolute inset-x-4 top-0 h-[2px] rounded-b-full bg-[var(--theme-accent)]" />
              )}
              <span className="flex h-5 items-center justify-center">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.16em]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
