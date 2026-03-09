import type { ComponentType, SVGProps } from "react";
import { LeafIcon, PinIcon, SearchIcon, SeedIcon, SettingsIcon } from "@/components/ui/icons";

export interface PanelTab {
  id: string;
  label: string;
  drawerTitle: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const PANEL_TABS: PanelTab[] = [
  { id: "seed", label: "SEED AND VERSION", drawerTitle: "Seed and version", icon: SeedIcon },
  { id: "settings", label: "MAP SETTINGS", drawerTitle: "Map settings", icon: SettingsIcon },
  { id: "finder", label: "SEED FINDER", drawerTitle: "Seed finder", icon: SearchIcon },
  { id: "markers", label: "MARKERS", drawerTitle: "Markers", icon: PinIcon },
  { id: "biomes", label: "BIOMES", drawerTitle: "Biomes", icon: LeafIcon },
];
