import Image from "next/image";
import type { ReactNode } from "react";
import {
  AppLogoIcon,
  CompassRoseIcon,
  DiceIcon,
  GlobeIcon,
  LayersIcon,
  LeafIcon,
  MapIcon,
  PinIcon,
  SearchIcon,
  SeedIcon,
} from "@/components/ui/icons";

interface LandingScreenProps {
  cta: ReactNode;
}

const FEATURE_CARDS = [
  {
    title: "Biome mapping in one view",
    body: "Render the world around a seed instantly and inspect biome color fields, hover coordinates, and terrain context without leaving the browser.",
    icon: MapIcon,
    tone: "from-emerald-500/20 via-emerald-500/8 to-transparent",
  },
  {
    title: "Version-aware exploration",
    body: "Switch between Java and Bedrock releases, compare dimensions, and keep the map aligned with the version rules you actually care about.",
    icon: GlobeIcon,
    tone: "from-sky-500/20 via-sky-500/8 to-transparent",
  },
  {
    title: "Markers, structures, overlays",
    body: "Highlight biomes, filter structures, turn on grid tools, and refine what the map shows instead of working with a flat screenshot.",
    icon: PinIcon,
    tone: "from-amber-500/20 via-amber-500/8 to-transparent",
  },
];

const SIGNALS = [
  {
    label: "Live map focus",
    value: "Biome-first",
    detail: "Inspect the world visually before you commit to a route or base location.",
  },
  {
    label: "Editions",
    value: "Java + Bedrock",
    detail: "Move between editions and keep the same exploration workflow.",
  },
  {
    label: "Map tools",
    value: "Markers + overlays",
    detail: "Structures, coordinates, highlight filters, and configurable map details.",
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Enter a seed",
    body: "Start from any Minecraft seed, then lock the edition, version, and dimension you want to inspect.",
    icon: SeedIcon,
  },
  {
    step: "02",
    title: "Shape the map",
    body: "Turn on overlays, markers, grid tools, and biome highlighting while the world stays visible.",
    icon: LayersIcon,
  },
  {
    step: "03",
    title: "Scout faster",
    body: "Use the map to compare spawn areas, locate structures, and share the exact view with someone else.",
    icon: CompassRoseIcon,
  },
];

const SURFACE_TILES = [
  {
    eyebrow: "Fast seed scouting",
    title: "A cleaner way to search for good starts.",
    body: "Use the landing page to frame the product like a real exploration tool, not a utility screen dropped onto the web.",
  },
  {
    eyebrow: "Map-first workflow",
    title: "Settings stay close to the visual result.",
    body: "The product is strongest when users can tune dimensions, markers, and overlays while still reading the map.",
  },
  {
    eyebrow: "Built for sharing",
    title: "Share the same map state, not just the homepage.",
    body: "Useful metadata, social previews, and persistent state make the tool more discoverable and easier to pass around.",
  },
];

export default function LandingScreen({ cta }: LandingScreenProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--theme-bg-app)] text-[var(--theme-text-primary)]">
      <div className="absolute inset-0">
        <Image
          src="/landing/chunkloader-hero-bg.svg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(52,211,153,0.22),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(73,104,232,0.18),transparent_28%),radial-gradient(circle_at_50%_76%,rgba(249,115,22,0.12),transparent_24%),linear-gradient(180deg,rgba(4,8,18,0.28),rgba(4,8,18,0.78)_40%,rgba(4,8,18,0.96)_100%)]" />
      </div>

      <div className="pointer-events-none absolute left-[-10rem] top-[12rem] h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-[22rem] h-[30rem] w-[30rem] rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[118rem] px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[var(--theme-accent)] shadow-[var(--theme-shadow-accent)]">
              <AppLogoIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--theme-accent)]">ChunkLoader</p>
              <p className="text-sm text-[var(--theme-text-muted)]">Minecraft seed map explorer</p>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--theme-text-muted)] lg:block">
            Browser-based world scouting
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:gap-16 lg:py-14">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-border-strong)] bg-[var(--theme-accent-soft)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--theme-accent)]">
              <LeafIcon className="h-4 w-4" />
              Explore Minecraft worlds faster
            </div>

            <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-[6.3rem]">
              Navigate seeds like a world atlas, not a spreadsheet.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--theme-text-secondary)] sm:text-lg">
              ChunkLoader turns raw Minecraft seeds into interactive biome maps with coordinates, overlays,
              structure previews, dimension switching, and shareable map views built for actual exploration.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="inline-flex">
                {cta}
              </div>
              <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-[var(--theme-text-muted)]">
                No install. Open a seed and inspect immediately.
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {SIGNALS.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[var(--theme-shadow-panel)] backdrop-blur-xl"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--theme-text-faint)]">{item.label}</p>
                  <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--theme-text-secondary)]">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-[2rem] border border-white/10 bg-emerald-400/10 blur-2xl lg:block" />
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,24,44,0.88),rgba(10,16,32,0.76))] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-5">
              <div className="rounded-[1.5rem] border border-white/8 bg-[#0b1322]/90 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Map preview</p>
                    <p className="mt-2 text-2xl font-semibold text-white">Interactive seed control deck</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-right">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--theme-text-faint)]">Seed</p>
                    <p className="mt-1 font-mono text-sm text-white">-4653970845219756904</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.4rem] border border-white/8 bg-[linear-gradient(160deg,#0b1930,#10172b_45%,#14293d)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--theme-text-secondary)]">
                        <MapIcon className="h-4 w-4 text-[var(--theme-accent)]" />
                        Overworld biome map
                      </div>
                      <div className="text-xs text-[var(--theme-text-muted)]">x: 9638 / z: -16099</div>
                    </div>

                    <div className="mt-4 grid grid-cols-6 gap-2">
                      {[
                        "#1AA56E",
                        "#20386C",
                        "#0E3042",
                        "#F58A31",
                        "#89C95F",
                        "#2AD5C5",
                        "#1F5C4E",
                        "#F2D96A",
                        "#253067",
                        "#7C66FF",
                        "#1A7F78",
                        "#DDE4F2",
                        "#10203B",
                        "#2E8B57",
                        "#24468D",
                        "#C77634",
                        "#3A6D41",
                        "#264563",
                        "#E5E7EB",
                        "#0D1730",
                        "#7E8BFF",
                        "#3FBF88",
                        "#6C5240",
                        "#1E90AA",
                      ].map((color, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-[0.9rem] border border-white/6"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                        Highlighted beach biome
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[var(--theme-text-secondary)]">
                        Structures enabled
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[var(--theme-text-secondary)]">
                        Grid overlay active
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <article className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300">
                          <DiceIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">Version + edition</p>
                          <p className="mt-1 text-sm text-[var(--theme-text-secondary)]">Java 1.21.5, switchable to Bedrock</p>
                        </div>
                      </div>
                    </article>

                    <article className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/12 text-sky-300">
                          <SearchIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">Seed finder</p>
                          <p className="mt-1 text-sm text-[var(--theme-text-secondary)]">Hunt for biomes and structures with less guesswork.</p>
                        </div>
                      </div>
                    </article>

                    <article className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/12 text-amber-300">
                          <LayersIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">Overlay stack</p>
                          <p className="mt-1 text-sm text-[var(--theme-text-secondary)]">Biomes, markers, coordinates, and map settings stay close to the canvas.</p>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 pb-8 pt-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:items-start">
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className={`rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[var(--theme-shadow-panel)] backdrop-blur-xl`}
                >
                  <div className={`rounded-[1.25rem] bg-gradient-to-br ${card.tone} p-3`}>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-[var(--theme-accent)]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-white">{card.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--theme-text-secondary)]">{card.body}</p>
                </article>
              );
            })}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Workflow</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Designed for map-first iteration.</h2>
              </div>
              <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--theme-text-secondary)] sm:inline-flex">
                Fast to learn
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {WORKFLOW.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.step}
                    className="grid gap-4 rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4 sm:grid-cols-[auto_1fr]"
                  >
                    <div className="flex items-center gap-3 sm:block">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="mt-3 block text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-[var(--theme-text-faint)]">
                        Step {item.step}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--theme-text-secondary)]">{item.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-5 pb-8 pt-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(12,20,35,0.9),rgba(7,12,23,0.8))] p-6 shadow-[var(--theme-shadow-panel)]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Why it feels better</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The interface is meant to feel like world scouting, not form filling.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
              That means large visual anchors, clear version context, controlled side settings, and a map that stays central
              instead of being buried behind disconnected menus.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--theme-text-faint)]">Interaction mode</p>
                <p className="mt-3 text-lg font-semibold text-white">Inspect while editing</p>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-text-secondary)]">The strongest map tools stay useful only if users can see the result while changing them.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--theme-text-faint)]">Search intent</p>
                <p className="mt-3 text-lg font-semibold text-white">Useful before the first click</p>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-text-secondary)]">The landing page explains what the tool does before users even open the map view.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {SURFACE_TILES.map((tile) => (
              <article
                key={tile.title}
                className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-5 shadow-[var(--theme-shadow-panel)]"
              >
                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">{tile.eyebrow}</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{tile.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--theme-text-secondary)]">{tile.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-8 pt-8">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(9,20,30,0.96),rgba(14,33,50,0.9)_48%,rgba(12,17,35,0.96))] px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.42)] sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute -right-12 top-[-4rem] h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[28%] h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Start exploring</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Open the map, drop in a seed, and scout your world with more context.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
                  ChunkLoader is built for players who want faster biome reading, cleaner structure hunting, and a better way
                  to understand a world before loading into it.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <div className="inline-flex">{cta}</div>
                <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-[var(--theme-text-muted)]">
                  Shareable links. Version-aware maps. Browser only.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
