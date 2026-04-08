import type { ReactElement, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BoneIcon,
  BoxesIcon,
  Building2Icon,
  CastleIcon,
  ChevronDownIcon as LucideChevronDownIcon,
  ChevronLeftIcon as LucideChevronLeftIcon,
  ChevronRightIcon as LucideChevronRightIcon,
  ChevronsLeftRightEllipsisIcon,
  ClipboardIcon as LucideClipboardIcon,
  CoffeeIcon as LucideCoffeeIcon,
  CompassIcon,
  DicesIcon,
  ExternalLinkIcon,
  FootprintsIcon,
  GemIcon,
  Globe2Icon,
  Grid2x2Icon,
  HashIcon as LucideHashIcon,
  HouseIcon,
  InfoIcon as LucideInfoIcon,
  LandmarkIcon,
  Layers3Icon,
  LeafIcon as LucideLeafIcon,
  Link2Icon,
  LoaderCircleIcon,
  MapIcon as LucideMapIcon,
  MapPinnedIcon,
  Maximize2Icon,
  MessageSquareIcon,
  Minimize2Icon,
  MountainIcon as LucideMountainIcon,
  PackageIcon as LucidePackageIcon,
  PickaxeIcon,
  PlusIcon as LucidePlusIcon,
  PyramidIcon,
  RulerDimensionLineIcon,
  ScanSearchIcon,
  SearchIcon as LucideSearchIcon,
  Settings2Icon,
  ShieldIcon,
  ShipWheelIcon,
  SparklesIcon as LucideSparklesIcon,
  SproutIcon,
  SquareCheckBigIcon,
  SquareIcon as LucideSquareIcon,
  StoreIcon,
  TelescopeIcon,
  TentIcon,
  TowerControlIcon,
  TriangleAlertIcon,
  TreesIcon,
  UserRoundIcon,
  VaultIcon,
  WavesIcon as LucideWavesIcon,
  XIcon,
} from "lucide-react";

type IconProps = SVGProps<SVGSVGElement>;

function withDefaults(Icon: LucideIcon, defaultClassName = "h-5 w-5") {
  return function IconComponent({ className = defaultClassName, ...props }: IconProps) {
    return <Icon aria-hidden="true" className={className} strokeWidth={1.8} {...props} />;
  };
}

export const AppLogoIcon = withDefaults(PickaxeIcon);
export const CoffeeIcon = withDefaults(LucideCoffeeIcon);
export const LayersIcon = withDefaults(Layers3Icon);
export const DiceIcon = withDefaults(DicesIcon);
export const MapIcon = withDefaults(LucideMapIcon);
export const CompassRoseIcon = withDefaults(CompassIcon);
export const VillagerHeadIcon = withDefaults(UserRoundIcon);
export const GlobeIcon = withDefaults(Globe2Icon);
export const ClipboardIcon = withDefaults(LucideClipboardIcon);
export const PackageIcon = withDefaults(LucidePackageIcon);
export const InfoIcon = withDefaults(LucideInfoIcon);
export const SeedIcon = withDefaults(SproutIcon);
export const SettingsIcon = withDefaults(Settings2Icon);
export const SearchIcon = withDefaults(LucideSearchIcon);
export const PinIcon = withDefaults(MapPinnedIcon);
export const LeafIcon = withDefaults(LucideLeafIcon);
export const MountainIcon = withDefaults(LucideMountainIcon);
export const WavesIcon = withDefaults(LucideWavesIcon);
export const RulerIcon = withDefaults(RulerDimensionLineIcon);
export const GridIcon = withDefaults(Grid2x2Icon);
export const HashIcon = withDefaults(LucideHashIcon);
export const MessageIcon = withDefaults(MessageSquareIcon);
export const CheckSquareIcon = withDefaults(SquareCheckBigIcon);
export const SquareIcon = withDefaults(LucideSquareIcon);
export const ShareIcon = withDefaults(ExternalLinkIcon);
export const CopyLinkIcon = withDefaults(Link2Icon);
export const SparklesIcon = withDefaults(LucideSparklesIcon);
export const ChevronLeftIcon = withDefaults(LucideChevronLeftIcon);
export const ChevronRightIcon = withDefaults(LucideChevronRightIcon);
export const ChevronsHorizontalIcon = withDefaults(ChevronsLeftRightEllipsisIcon);
export const ChevronDownIcon = withDefaults(LucideChevronDownIcon);
export const SpinnerIcon = withDefaults(LoaderCircleIcon, "h-4 w-4 animate-spin");
export const WarningIcon = withDefaults(TriangleAlertIcon);
export const CloseIcon = withDefaults(XIcon);
export const ExpandIcon = withDefaults(Maximize2Icon, "h-4 w-4");
export const CollapseIcon = withDefaults(Minimize2Icon, "h-4 w-4");
export const PlusIcon = withDefaults(LucidePlusIcon, "h-3.5 w-3.5");

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

function structureIcon(Icon: LucideIcon, className: string) {
  return <Icon aria-hidden="true" className={className} strokeWidth={1.8} />;
}

export function StructureIcon({ name, className = "h-4 w-4" }: { name: StructureIconName; className?: string }) {
  const icons: Record<StructureIconName, ReactElement> = {
    village: <VillagerHeadIcon className={className} />,
    ocean_monument: structureIcon(LandmarkIcon, className),
    shipwreck: structureIcon(ShipWheelIcon, className),
    mineshaft: structureIcon(PickaxeIcon, className),
    ancient_city: structureIcon(Building2Icon, className),
    amethyst_geode: structureIcon(GemIcon, className),
    woodland_mansion: structureIcon(HouseIcon, className),
    desert_pyramid: structureIcon(PyramidIcon, className),
    jungle_temple: structureIcon(TreesIcon, className),
    igloo: structureIcon(TentIcon, className),
    pillager_outpost: structureIcon(TowerControlIcon, className),
    ruined_portal: structureIcon(ScanSearchIcon, className),
    buried_treasure: structureIcon(VaultIcon, className),
    swamp_hut: structureIcon(HouseIcon, className),
    stronghold: structureIcon(ShieldIcon, className),
    ocean_ruin: structureIcon(LucideWavesIcon, className),
    trail_ruin: structureIcon(FootprintsIcon, className),
    trial_chambers: structureIcon(BoxesIcon, className),
    nether_fortress: structureIcon(CastleIcon, className),
    bastion_remnant: structureIcon(StoreIcon, className),
    nether_fossil: structureIcon(BoneIcon, className),
    end_city: structureIcon(TelescopeIcon, className),
  };

  return icons[name];
}
