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

export function CompassRoseIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" className={props.className ?? "h-5 w-5"} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="#2A2A2A" stroke="#9A9A9A" />
      <circle cx="8" cy="8" r="4.5" fill="#111111" stroke="#D0D0D0" />
      <path d="m8 3 2 4-2 1-2-1 2-4Z" fill="#E74343" />
      <path d="m8 13-2-4 2-1 2 1-2 4Z" fill="#E5E7EB" />
      <circle cx="8" cy="8" r="1.2" fill="#F9FAFB" />
    </svg>
  );
}

export function VillagerHeadIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" className={props.className ?? "h-5 w-5"} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1.5" width="12" height="13" rx="2" fill="#8F6A46" stroke="#5E4630" />
      <rect x="4" y="4" width="3" height="3" fill="#88B04B" />
      <rect x="9" y="4" width="3" height="3" fill="#88B04B" />
      <rect x="5" y="9" width="6" height="2" fill="#65452E" />
      <rect x="6.5" y="6" width="3" height="5" rx="1" fill="#C49A6C" />
      <rect x="4" y="2" width="8" height="2" fill="#B98C5E" />
    </svg>
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
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.75v2.5" />
      <path d="M12 18.75v2.5" />
      <path d="m4.93 4.93 1.77 1.77" />
      <path d="m17.3 17.3 1.77 1.77" />
      <path d="M2.75 12h2.5" />
      <path d="M18.75 12h2.5" />
      <path d="m4.93 19.07 1.77-1.77" />
      <path d="m17.3 6.7 1.77-1.77" />
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

export function ShareIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.7 13.3C8.9 12.9 9 12.5 9 12s-.1-.9-.3-1.3" />
      <path d="M8.7 13.3a3 3 0 1 1 0-2.6" />
      <path d="m8.7 13.3 6.6 3.3" />
      <path d="m8.7 10.7 6.6-3.3" />
      <path d="M18.3 5.4A3 3 0 1 1 21 8.1a3 3 0 0 1-2.7-2.7Z" />
      <path d="M18.3 18.6A3 3 0 1 1 21 21.3a3 3 0 0 1-2.7-2.7Z" />
    </IconBase>
  );
}

export function CopyLinkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 13a5 5 0 0 0 7.1 0l2.1-2.1a5 5 0 0 0-7.1-7.1L10.8 5" />
      <path d="M14 11a5 5 0 0 0-7.1 0l-2.1 2.1a5 5 0 0 0 7.1 7.1L13.2 19" />
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

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
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
  | "trial_chambers"
  | "nether_fortress"
  | "bastion_remnant"
  | "nether_fossil"
  | "end_city";

export function StructureIcon({ name, className = "h-4 w-4" }: { name: StructureIconName; className?: string }) {
  const icons: Record<StructureIconName, ReactElement> = {
    village: <VillagerHeadIcon className={className} />,
    ocean_monument: <OceanMonumentPixelIcon className={className} />,
    shipwreck: <ShipwreckPixelIcon className={className} />,
    mineshaft: <MineshaftPixelIcon className={className} />,
    ancient_city: <AncientCityPixelIcon className={className} />,
    amethyst_geode: <AmethystGeodePixelIcon className={className} />,
    woodland_mansion: <WoodlandMansionPixelIcon className={className} />,
    desert_pyramid: <DesertPyramidPixelIcon className={className} />,
    jungle_temple: <JungleTemplePixelIcon className={className} />,
    igloo: <IglooPixelIcon className={className} />,
    pillager_outpost: <PillagerOutpostPixelIcon className={className} />,
    ruined_portal: <RuinedPortalPixelIcon className={className} />,
    buried_treasure: <BuriedTreasurePixelIcon className={className} />,
    swamp_hut: <SwampHutPixelIcon className={className} />,
    stronghold: <StrongholdPixelIcon className={className} />,
    ocean_ruin: <OceanRuinPixelIcon className={className} />,
    trail_ruin: <TrailRuinPixelIcon className={className} />,
    trial_chambers: <TrialChambersPixelIcon className={className} />,
    nether_fortress: <NetherFortressPixelIcon className={className} />,
    bastion_remnant: <BastionRemnantPixelIcon className={className} />,
    nether_fossil: <NetherFossilPixelIcon className={className} />,
    end_city: <EndCityPixelIcon className={className} />,
  };

  return icons[name];
}

function PixelIconBase({ className = "h-4 w-4", viewBox = "0 0 16 16", children }: IconBaseProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox={viewBox}
      fill="none"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

function OceanMonumentPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="1" y="3" width="14" height="11" rx="1" fill="#7A8E8A" />
      <rect x="3" y="2" width="10" height="2" fill="#C98372" />
      <rect x="4" y="5" width="2" height="7" fill="#D5E3DB" />
      <rect x="7" y="5" width="2" height="7" fill="#D5E3DB" />
      <rect x="10" y="5" width="2" height="7" fill="#D5E3DB" />
      <rect x="2" y="13" width="12" height="1" fill="#D5E3DB" />
      <rect x="6" y="7" width="4" height="3" fill="#6CCED8" />
    </PixelIconBase>
  );
}

function ShipwreckPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="6" y="2" width="1" height="7" fill="#F2F2F2" />
      <rect x="7" y="3" width="4" height="3" fill="#F2F2F2" />
      <rect x="3" y="10" width="10" height="3" fill="#7A4B21" />
      <rect x="2" y="9" width="12" height="1" fill="#A56B31" />
      <rect x="4" y="13" width="8" height="1" fill="#5A3415" />
      <rect x="5" y="8" width="1" height="1" fill="#A56B31" />
      <rect x="10" y="8" width="1" height="1" fill="#A56B31" />
    </PixelIconBase>
  );
}

function MineshaftPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="1" width="12" height="14" rx="1" fill="#B9905C" />
      <rect x="3" y="2" width="10" height="12" fill="#6D4A2A" />
      <rect x="4" y="4" width="8" height="1" fill="#D8C6A0" />
      <rect x="4" y="7" width="8" height="1" fill="#D8C6A0" />
      <rect x="4" y="10" width="8" height="1" fill="#D8C6A0" />
      <rect x="5" y="3" width="1" height="10" fill="#C7B08B" />
      <rect x="10" y="3" width="1" height="10" fill="#C7B08B" />
    </PixelIconBase>
  );
}

function AncientCityPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="12" height="12" rx="1" fill="#233447" />
      <rect x="4" y="4" width="8" height="8" fill="#0F1621" />
      <rect x="6" y="3" width="4" height="2" fill="#61D8FF" />
      <rect x="5" y="6" width="6" height="4" fill="#47A6E5" />
      <rect x="7" y="5" width="2" height="6" fill="#A9F1FF" />
      <rect x="6" y="10" width="4" height="2" fill="#123C53" />
    </PixelIconBase>
  );
}

function AmethystGeodePixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="5" y="2" width="6" height="2" fill="#CFA7FF" />
      <rect x="4" y="4" width="8" height="3" fill="#B277FF" />
      <rect x="3" y="7" width="10" height="3" fill="#8E53D6" />
      <rect x="4" y="10" width="8" height="3" fill="#D9C4FF" />
      <rect x="6" y="4" width="1" height="7" fill="#F6ECFF" />
      <rect x="9" y="5" width="1" height="6" fill="#F6ECFF" />
    </PixelIconBase>
  );
}

function WoodlandMansionPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="5" width="12" height="9" fill="#5E4126" />
      <rect x="4" y="3" width="8" height="3" fill="#A67C52" />
      <rect x="3" y="6" width="10" height="1" fill="#D8C6A0" />
      <rect x="4" y="8" width="3" height="3" fill="#F4E7C5" />
      <rect x="9" y="8" width="3" height="3" fill="#F4E7C5" />
      <rect x="7" y="9" width="2" height="5" fill="#3B2614" />
    </PixelIconBase>
  );
}

function DesertPyramidPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="4" y="2" width="8" height="2" fill="#E8D7B5" />
      <rect x="3" y="4" width="10" height="2" fill="#E3D0A6" />
      <rect x="2" y="6" width="12" height="3" fill="#DCC58F" />
      <rect x="1" y="9" width="14" height="4" fill="#D1B977" />
      <rect x="7" y="7" width="2" height="2" fill="#C98344" />
      <rect x="6" y="10" width="4" height="3" fill="#F1E4C8" />
    </PixelIconBase>
  );
}

function JungleTemplePixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="3" width="12" height="11" fill="#6C7F58" />
      <rect x="3" y="4" width="10" height="9" fill="#8BA172" />
      <rect x="5" y="6" width="6" height="2" fill="#B3C39A" />
      <rect x="6" y="8" width="4" height="5" fill="#738861" />
      <rect x="2" y="2" width="12" height="1" fill="#BCC7A7" />
      <rect x="1" y="1" width="2" height="2" fill="#6DA84B" />
      <rect x="13" y="2" width="2" height="2" fill="#5A8B3B" />
    </PixelIconBase>
  );
}

function IglooPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="4" y="3" width="8" height="2" fill="#FFFFFF" />
      <rect x="3" y="5" width="10" height="3" fill="#F2F7FF" />
      <rect x="2" y="8" width="12" height="4" fill="#E4EEFF" />
      <rect x="6" y="9" width="4" height="3" fill="#B9D4FF" />
      <rect x="11" y="9" width="2" height="3" fill="#D8E7FF" />
    </PixelIconBase>
  );
}

function PillagerOutpostPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="3" y="1" width="10" height="14" fill="#3B2818" />
      <rect x="4" y="2" width="8" height="2" fill="#6E4A29" />
      <rect x="4" y="5" width="8" height="1" fill="#90643B" />
      <rect x="5" y="7" width="6" height="1" fill="#7A532F" />
      <rect x="5" y="9" width="6" height="1" fill="#7A532F" />
      <rect x="5" y="11" width="6" height="1" fill="#7A532F" />
      <rect x="6" y="13" width="4" height="1" fill="#B48C61" />
    </PixelIconBase>
  );
}

function RuinedPortalPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="3" y="2" width="10" height="12" fill="#6E6E6E" />
      <rect x="4" y="3" width="8" height="10" fill="#A05CFF" />
      <rect x="2" y="1" width="2" height="4" fill="#4A4A4A" />
      <rect x="12" y="11" width="2" height="4" fill="#4A4A4A" />
      <rect x="2" y="12" width="3" height="2" fill="#3F8E4C" />
      <rect x="5" y="12" width="2" height="1" fill="#57B55F" />
    </PixelIconBase>
  );
}

function BuriedTreasurePixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="4" width="12" height="9" rx="1" fill="#8B551C" />
      <rect x="2" y="4" width="12" height="2" fill="#C7822B" />
      <rect x="7" y="6" width="2" height="4" fill="#D9C27A" />
      <rect x="3" y="6" width="10" height="1" fill="#5B3612" />
      <rect x="4" y="10" width="8" height="2" fill="#9F5F1E" />
    </PixelIconBase>
  );
}

function SwampHutPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="3" y="5" width="10" height="7" fill="#8C8C8C" />
      <rect x="4" y="3" width="8" height="2" fill="#D7E16E" />
      <rect x="5" y="7" width="2" height="2" fill="#F0F0F0" />
      <rect x="9" y="7" width="2" height="2" fill="#F0F0F0" />
      <rect x="7" y="9" width="2" height="3" fill="#2F2015" />
      <rect x="3" y="12" width="1" height="2" fill="#5A4426" />
      <rect x="12" y="12" width="1" height="2" fill="#5A4426" />
    </PixelIconBase>
  );
}

function StrongholdPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="12" height="12" rx="6" fill="#D7D7D7" />
      <rect x="3" y="3" width="10" height="10" rx="5" fill="#294B2A" />
      <rect x="5" y="5" width="6" height="6" rx="3" fill="#7AE16F" />
      <rect x="6" y="6" width="4" height="4" rx="2" fill="#101418" />
      <rect x="7" y="7" width="2" height="2" fill="#A2F69D" />
    </PixelIconBase>
  );
}

function OceanRuinPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="12" height="12" fill="#DDE5E8" />
      <rect x="3" y="3" width="10" height="10" fill="#89A8A4" />
      <rect x="4" y="5" width="3" height="3" fill="#62E59E" />
      <rect x="8" y="5" width="4" height="3" fill="#8AF0C9" />
      <rect x="4" y="9" width="8" height="2" fill="#476965" />
      <rect x="6" y="11" width="4" height="1" fill="#2B4341" />
    </PixelIconBase>
  );
}

function TrailRuinPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="10" width="9" height="3" rx="1" transform="rotate(-30 2 10)" fill="#EED7C0" />
      <rect x="3" y="9" width="8" height="1" transform="rotate(-30 3 9)" fill="#F7EBDD" />
      <rect x="8" y="6" width="2" height="5" transform="rotate(-30 8 6)" fill="#A46B41" />
    </PixelIconBase>
  );
}

function TrialChambersPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="12" height="12" fill="#394C5A" />
      <rect x="3" y="3" width="10" height="10" fill="#D7D7D7" />
      <rect x="4" y="4" width="8" height="8" fill="#202E38" />
      <rect x="6" y="6" width="4" height="4" fill="#345E7B" />
      <rect x="7" y="7" width="2" height="2" fill="#D28F3F" />
      <rect x="4" y="11" width="8" height="1" fill="#A6B6BF" />
    </PixelIconBase>
  );
}

function NetherFortressPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="4" width="12" height="8" fill="#3A1E1E" />
      <rect x="1" y="11" width="14" height="2" fill="#221011" />
      <rect x="3" y="2" width="2" height="10" fill="#5C2D2D" />
      <rect x="11" y="2" width="2" height="10" fill="#5C2D2D" />
      <rect x="6" y="5" width="4" height="3" fill="#7A3A3A" />
      <rect x="6" y="8" width="1" height="3" fill="#D6A15A" />
      <rect x="9" y="8" width="1" height="3" fill="#D6A15A" />
    </PixelIconBase>
  );
}

function BastionRemnantPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="3" width="12" height="10" fill="#302122" />
      <rect x="3" y="4" width="10" height="8" fill="#4A3234" />
      <rect x="5" y="2" width="6" height="2" fill="#5E4346" />
      <rect x="4" y="6" width="2" height="5" fill="#C89B3C" />
      <rect x="10" y="6" width="2" height="5" fill="#C89B3C" />
      <rect x="7" y="5" width="2" height="6" fill="#1D1314" />
      <rect x="6" y="11" width="4" height="1" fill="#7D5C2F" />
    </PixelIconBase>
  );
}

function NetherFossilPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="10" width="12" height="2" fill="#E5D7BD" />
      <rect x="3" y="8" width="2" height="2" fill="#E5D7BD" />
      <rect x="11" y="8" width="2" height="2" fill="#E5D7BD" />
      <rect x="5" y="6" width="1" height="5" fill="#D5C5A7" />
      <rect x="10" y="6" width="1" height="5" fill="#D5C5A7" />
      <rect x="7" y="5" width="2" height="6" fill="#F2E9D8" />
      <rect x="6" y="4" width="4" height="1" fill="#C7B79A" />
    </PixelIconBase>
  );
}

function EndCityPixelIcon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="4" y="2" width="8" height="12" fill="#D6C8DB" />
      <rect x="5" y="3" width="6" height="10" fill="#B08BC0" />
      <rect x="6" y="1" width="4" height="2" fill="#EFE6C4" />
      <rect x="6" y="5" width="4" height="2" fill="#F2E8FF" />
      <rect x="7" y="7" width="2" height="6" fill="#6F4A84" />
      <rect x="3" y="13" width="10" height="1" fill="#8B72A0" />
    </PixelIconBase>
  );
}
