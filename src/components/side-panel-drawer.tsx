"use client";

import type { ReactNode } from "react";
import { PANEL_TABS } from "@/components/panel-tabs";
import { CloseIcon } from "@/components/ui/icons";

interface SidePanelDrawerProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onClose: () => void;
  children: ReactNode;
}

export default function SidePanelDrawer({
  activeTab,
  onTabChange,
  onClose,
  children,
}: SidePanelDrawerProps) {
  const currentTab = PANEL_TABS.find((tab) => tab.id === activeTab) ?? PANEL_TABS[0];

  return (
    <div className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 flex justify-end sm:top-[3.8125rem] md:pointer-events-none">
      <button
        type="button"
        className="flex-1 bg-black/24 backdrop-blur-[1px] md:hidden"
        aria-label="Close settings drawer"
        onClick={onClose}
      />
      <aside className="pointer-events-auto flex h-full w-full max-w-[min(var(--theme-drawer-width),100vw)] flex-col border-l border-white/10 bg-[var(--theme-bg-panel)] shadow-[var(--theme-shadow-panel)]">
        <div className="border-b border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-3 pt-2">
          <div className="flex items-center gap-1">
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pb-2">
              {PANEL_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeTab;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`relative flex h-11 min-w-11 items-center justify-center rounded-xl px-3 transition-all ${
                      isActive
                        ? "bg-[var(--theme-bg-panel-active)] text-[var(--theme-accent)]"
                        : "text-[var(--theme-text-muted)] hover:bg-white/[0.04] hover:text-[var(--theme-text-primary)]"
                    }`}
                    title={tab.drawerTitle}
                  >
                    <Icon className="h-5 w-5" />
                    {isActive && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--theme-accent)]" />
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--theme-text-muted)] transition-colors hover:border-[var(--theme-border-strong)] hover:text-[var(--theme-text-primary)]"
              title="Close side panel"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-white/6 px-5 py-4">
          <h2 className="text-[2rem] font-medium tracking-tight text-[var(--theme-text-primary)]">
            {currentTab.drawerTitle}
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </aside>
    </div>
  );
}
