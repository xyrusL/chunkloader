import type { ReactElement, ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
type IconBaseProps = IconProps & { children?: ReactNode };

function IconBase({ children, className = "h-5 w-5", viewBox = "0 0 24 24", ...props }: IconBaseProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox={viewBox}
      {...props}
    >
      {children}
    </svg>
  );
}

export function AppLogoIcon(props: IconProps) {
  return (
    <IconBase {...props} viewBox="0 0 24 24">
      <path d="M5 19 15 5" />
      <path d="m8 5 6 2 3 4-6-2-3-4Z" />
      <path d="m4 18 6 2 1.5-4.5-6-2L4 18Z" />
    </IconBase>
  );
}

export function CoffeeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 8h10v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
      <path d="M15 9h1.5a2.5 2.5 0 0 1 0 5H15" />
      <path d="M7 4c0 1 .8 1.5.8 2.5S7 8 7 8" />
      <path d="M10 4c0 1 .8 1.5.8 2.5S10 8 10 8" />
    </IconBase>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 4 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 16 8 4 8-4" />
    </IconBase>
  );
}

export function DiceIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function MapIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </IconBase>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </IconBase>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="7" y="5" width="10" height="15" rx="2" />
      <path d="M9 5.5h6" />
      <path d="M10 3.5h4a1 1 0 0 1 1 1V6H9V4.5a1 1 0 0 1 1-1Z" />
    </IconBase>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 8 4.5v9L12 21 4 16.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </IconBase>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v5" />
      <path d="M12 7h.01" />
    </IconBase>
  );
}

export function SeedIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 19v-8" />
      <path d="M12 11c0-2 1.5-4 4-5 0 2.5-1.5 4.5-4 5Z" />
      <path d="M12 13c0-2-1.5-4-4-5 0 2.5 1.5 4.5 4 5Z" />
    </IconBase>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
      <path d="m19.4 15 .8 1.4-1.6 2.7-1.6-.4a7.7 7.7 0 0 1-1.5.9L15 21h-3l-.5-1.4a7.7 7.7 0 0 1-1.5-.9l-1.6.4-1.6-2.7.8-1.4a7 7 0 0 1 0-1.8l-.8-1.4 1.6-2.7 1.6.4c.5-.4 1-.6 1.5-.9L12 3h3l.5 1.4c.5.2 1 .5 1.5.9l1.6-.4 1.6 2.7-.8 1.4a7 7 0 0 1 0 1.8Z" />
    </IconBase>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
    </IconBase>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </IconBase>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 5c-6 0-11 4-11 10 0 2 1 4 3 5 6 0 10-5 10-11 0-1.5-.5-3-2-4Z" />
      <path d="M8 20c2-3 5-6 9-8" />
    </IconBase>
  );
}

export function MountainIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3 18 6.5-10 3 4 2-3 6.5 9" />
      <path d="m9.5 8 1.5 2" />
    </IconBase>
  );
}

export function WavesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 10c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M3 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
    </IconBase>
  );
}

export function RulerIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 19 14-14" />
      <path d="m7 17 2 2" />
      <path d="m10 14 2 2" />
      <path d="m13 11 2 2" />
      <path d="m16 8 2 2" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </IconBase>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M12 4v16M4 12h16" />
    </IconBase>
  );
}

export function HashIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 3 7 21" />
      <path d="M17 3 15 21" />
      <path d="M4 9h18" />
      <path d="M3 15h18" />
    </IconBase>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    </IconBase>
  );
}

export function CheckSquareIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m8 12 2.5 2.5L16 9" />
    </IconBase>
  );
}

export function SquareIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </IconBase>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 4 1.4 3.6L17 9l-3.6 1.4L12 14l-1.4-3.6L7 9l3.6-1.4L12 4Z" />
      <path d="m18.5 14 .8 2 .2.5 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
      <path d="m5.5 14 .8 2 .2.5 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
    </IconBase>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m15 18-6-6 6-6" />
    </IconBase>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  );
}

export function ChevronsHorizontalIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m8 7-4 5 4 5" />
      <path d="m16 7 4 5-4 5" />
    </IconBase>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" className={props.className ?? "h-4 w-4 animate-spin"} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" className="opacity-20" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4 3 20h18L12 4Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </IconBase>
  );
}

export type StructureIconName =
  | "village"
  | "ocean_monument"
  | "shipwreck"
  | "mineshaft"
  | "ancient_city"
  | "amethyst_geode"
  | "woodland_mansion"
  | "desert_pyramid"
  | "jungle_temple"
  | "igloo"
  | "pillager_outpost"
  | "ruined_portal"
  | "buried_treasure"
  | "swamp_hut"
  | "stronghold"
  | "ocean_ruin"
  | "trail_ruin"
  | "trial_chambers";

export function StructureIcon({ name, className = "h-4 w-4" }: { name: StructureIconName; className?: string }) {
  const icons: Record<StructureIconName, ReactElement> = {
    village: <HomeIcon className={className} />,
    ocean_monument: <TempleIcon className={className} />,
    shipwreck: <ShipIcon className={className} />,
    mineshaft: <PickaxeIcon className={className} />,
    ancient_city: <CityIcon className={className} />,
    amethyst_geode: <GemIcon className={className} />,
    woodland_mansion: <MansionIcon className={className} />,
    desert_pyramid: <PyramidIcon className={className} />,
    jungle_temple: <TempleIcon className={className} />,
    igloo: <SnowflakeIcon className={className} />,
    pillager_outpost: <TowerIcon className={className} />,
    ruined_portal: <PortalIcon className={className} />,
    buried_treasure: <ChestIcon className={className} />,
    swamp_hut: <HutIcon className={className} />,
    stronghold: <FortIcon className={className} />,
    ocean_ruin: <RuinsIcon className={className} />,
    trail_ruin: <MapIcon className={className} />,
    trial_chambers: <SwordsIcon className={className} />,
  };

  return icons[name];
}

function HomeIcon(props: IconProps) {
  return <IconBase {...props}><path d="M4 11 12 5l8 6" /><path d="M6 10v9h12v-9" /></IconBase>;
}
function TempleIcon(props: IconProps) {
  return <IconBase {...props}><path d="M4 9h16" /><path d="M6 9v8M10 9v8M14 9v8M18 9v8" /><path d="M3 19h18M12 4l8 4H4l8-4Z" /></IconBase>;
}
function ShipIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5 16h14l-2 3H7l-2-3Z" /><path d="M10 16V6l5 3v7" /><path d="M10 6H7" /></IconBase>;
}
function PickaxeIcon(props: IconProps) {
  return <IconBase {...props}><path d="m5 19 6-6" /><path d="m9 5 6 2 3 4-6-2-3-4Z" /><path d="m4 18 2 2" /></IconBase>;
}
function CityIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5 19V9l4-2v12" /><path d="M11 19V5l4 2v12" /><path d="M17 19v-8l2 1v7" /></IconBase>;
}
function GemIcon(props: IconProps) {
  return <IconBase {...props}><path d="m7 7 2-3h6l2 3-5 12-5-12Z" /><path d="M7 7h10" /><path d="m9 4 3 3 3-3" /></IconBase>;
}
function MansionIcon(props: IconProps) {
  return <IconBase {...props}><path d="M4 19V9l8-4 8 4v10" /><path d="M8 19v-5h8v5" /></IconBase>;
}
function PyramidIcon(props: IconProps) {
  return <IconBase {...props}><path d="m4 19 8-12 8 12H4Z" /><path d="m9 19 3-5 3 5" /></IconBase>;
}
function SnowflakeIcon(props: IconProps) {
  return <IconBase {...props}><path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" /></IconBase>;
}
function TowerIcon(props: IconProps) {
  return <IconBase {...props}><path d="M9 20h6l-1-12h-4L9 20Z" /><path d="M8 8h8l-2-4h-4l-2 4Z" /></IconBase>;
}
function PortalIcon(props: IconProps) {
  return <IconBase {...props}><rect x="7" y="4" width="10" height="16" rx="2" /><path d="M10 8h4M10 12h4M10 16h4" /></IconBase>;
}
function ChestIcon(props: IconProps) {
  return <IconBase {...props}><rect x="4" y="8" width="16" height="10" rx="2" /><path d="M4 11h16M12 11v7" /></IconBase>;
}
function HutIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5 19h14l-2-8H7l-2 8Z" /><path d="m4 11 8-6 8 6" /></IconBase>;
}
function FortIcon(props: IconProps) {
  return <IconBase {...props}><path d="M4 19V7h16v12" /><path d="M8 7V4h2v3M14 7V4h2v3M9 19v-5h6v5" /></IconBase>;
}
function RuinsIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5 19h14" /><path d="M7 19v-6l3-2v8" /><path d="M12 19V9l5 3v7" /></IconBase>;
}
function SwordsIcon(props: IconProps) {
  return <IconBase {...props}><path d="m8 6 8 8" /><path d="m16 6-8 8" /><path d="m7 5 2 2M15 5l2 2M7 17l2-2M15 17l2-2" /></IconBase>;
}
