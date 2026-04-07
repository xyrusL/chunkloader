import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CompassRoseIcon,
  GlobeIcon,
  InfoIcon,
  LeafIcon,
  MapIcon,
  MountainIcon,
  PinIcon,
  SearchIcon,
  SeedIcon,
  WarningIcon,
} from "@/components/ui/icons";
import { createPageMetadata } from "@/lib/page-metadata";

type StepAccent = "emerald" | "sky" | "teal" | "amber" | "violet" | "pink";

type StoryStep = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  quickView: [string, string, string];
  icon: (props: { className?: string }) => ReactNode;
  accent: StepAccent;
};

export const metadata: Metadata = createPageMetadata({
  title: "How ChunkLoader Works",
  description:
    "Simple guide to how ChunkLoader builds Minecraft seed maps, picks biomes, estimates terrain, places overlays, and what accuracy to expect.",
  canonicalPath: "/how-it-works",
  imagePath: "/opengraph-image",
  imageAlt: "ChunkLoader guide page explaining how the Minecraft seed map engine works.",
});

const STORY_STEPS: StoryStep[] = [
  {
    id: "seed",
    eyebrow: "Step 1",
    title: "The seed is the starting code",
    body:
      "A seed is just the starting input. It can be a number or text. ChunkLoader turns it into one repeatable number, and that number becomes the starting point for the whole map.",
    note: "Same seed in, same map out.",
    quickView: ["Seed text or number", "Hash into one repeatable value", "Stable starting code"],
    icon: SeedIcon,
    accent: "emerald",
  },
  {
    id: "signals",
    eyebrow: "Step 2",
    title: "The app builds invisible world signals",
    body:
      "From that seed, the engine builds soft noise maps. You can think of them like weather maps spread over the world: hot or cold, wet or dry, ocean or land, rough or smooth.",
    note: "These signals change slowly, so the world feels natural instead of random.",
    quickView: ["Seed value", "Build climate signals", "Temperature, humidity, land shape"],
    icon: GlobeIcon,
    accent: "sky",
  },
  {
    id: "biomes",
    eyebrow: "Step 3",
    title: "Those signals are turned into biomes",
    body:
      "At each spot, ChunkLoader reads the signal values and checks biome rules. Cold places can become snowy. Hot and dry places can become desert. Far-out low land can become ocean.",
    note: "That is how the app decides what biome should be at each position.",
    quickView: ["Climate values", "Check biome rules", "Biome picked for that spot"],
    icon: LeafIcon,
    accent: "teal",
  },
  {
    id: "terrain",
    eyebrow: "Step 4",
    title: "Then it estimates the land shape",
    body:
      "The app also makes a terrain estimate from extra noise layers. That helps it show hills, ridges, valleys, and flatter land, even though it is not loading real Minecraft chunks.",
    note: "This is why the map feels easier to read than a flat color image.",
    quickView: ["Biome area", "Estimate height and slope", "Readable terrain shading"],
    icon: MountainIcon,
    accent: "amber",
  },
  {
    id: "tiles",
    eyebrow: "Step 5",
    title: "It only draws the part you can see",
    body:
      "The map is split into tiles. When you drag or zoom, the app keeps what it already has and renders the next visible tiles. That keeps the map fast and smooth.",
    note: "It does not rebuild the whole world every time you move.",
    quickView: ["Current viewport", "Render only visible tiles", "Smooth map movement"],
    icon: MapIcon,
    accent: "violet",
  },
  {
    id: "helpers",
    eyebrow: "Step 6",
    title: "Finally it adds helpers on top",
    body:
      "After the base map is ready, the app draws extra helpers like structure markers, slime chunks, biome labels, and coordinate tools. These are added from the seed and the current view.",
    note: "Helpers are overlays, not saved-world data.",
    quickView: ["Rendered map", "Add helper overlays", "Markers, labels, coordinates"],
    icon: PinIcon,
    accent: "pink",
  },
];

const BIOME_RULES = [
  "Very low continentalness usually means ocean.",
  "High continentalness with low erosion usually means mountains or peaks.",
  "Low temperature usually means snowy or frozen biomes.",
  "High temperature with low humidity usually means dry biomes.",
];

const EXPECT_GOOD = [
  "Fast high-level scouting",
  "Comparing different parts of the same seed",
  "Reading broad biome layout",
  "Sharing the same view with another player",
];

const EXPECT_LIMITS = [
  "Not a full chunk-for-chunk rebuild of Minecraft",
  "Not every structure edge case will match perfectly",
  "Not every datapack or custom generator will match",
  "Important exact spots should still be checked in-game",
];

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--theme-bg-app)] text-[var(--theme-text-primary)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(52,211,153,0.14),transparent_18%),radial-gradient(circle_at_84%_10%,rgba(56,189,248,0.10),transparent_22%),radial-gradient(circle_at_50%_74%,rgba(249,115,22,0.08),transparent_20%),linear-gradient(180deg,rgba(5,10,18,0.92),rgba(5,10,18,0.98))]" />
      <div className="pointer-events-none absolute left-[-7rem] top-[9rem] h-[20rem] w-[20rem] rounded-full bg-emerald-400/8 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-[20rem] h-[24rem] w-[24rem] rounded-full bg-sky-500/8 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[112rem] px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[var(--theme-accent)] shadow-[var(--theme-shadow-accent)]">
              <CompassRoseIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--theme-accent)]">ChunkLoader</p>
              <p className="text-sm text-[var(--theme-text-muted)]">How the map engine works</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              Back Home
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--theme-accent-strong),var(--theme-accent))] px-5 py-2.5 text-sm font-semibold text-[#04110b] shadow-[var(--theme-shadow-accent)] transition-transform hover:scale-[1.01]"
            >
              Open Seed Map
            </Link>
          </div>
        </header>

        <section className="pb-10 pt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:items-center">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-none border-2 border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[var(--theme-accent)] mc-badge">
                <InfoIcon className="h-4 w-4" />
                Easy To Read
              </div>
              <h1 className="mt-5 max-w-5xl text-[2.6rem] font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-[5.6rem]">
                How ChunkLoader turns a seed into a map you can understand.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--theme-text-secondary)] sm:text-lg">
                This page is made to feel simple. You do not need to know hard math. You only need to know the
                story: the seed becomes signals, the signals become biomes, the map is drawn in small pieces,
                and helper layers are added on top.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <AnchorChip href="#story">Start with the story</AnchorChip>
                <AnchorChip href="#biomes">See how biomes are picked</AnchorChip>
                <AnchorChip href="#accuracy">Check accuracy and limits</AnchorChip>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,24,44,0.88),rgba(10,16,32,0.76))] p-5 shadow-[0_26px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/8 bg-[#0b1322]/90 p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Quick Answer</p>
                <p className="mt-3 text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
                  If you only want the simple meaning of the main words, read this box first.
                </p>
                <div className="mt-4 space-y-3">
                  <FlowPill
                    icon={<SeedIcon className="h-4 w-4" />}
                    label="What is a seed?"
                    body="The starting value that decides how the world begins."
                    tone="emerald"
                  />
                  <FlowPill
                    icon={<GlobeIcon className="h-4 w-4" />}
                    label="What are signals?"
                    body="Invisible climate maps the engine reads under the hood."
                    tone="sky"
                  />
                  <FlowPill
                    icon={<LeafIcon className="h-4 w-4" />}
                    label="What is a biome here?"
                    body="The world type picked from those climate values."
                    tone="teal"
                  />
                  <FlowPill
                    icon={<MapIcon className="h-4 w-4" />}
                    label="What does the map show?"
                    body="A fast preview of the visible seed area, not live chunks."
                    tone="violet"
                  />
                </div>
                <div className="mt-4 rounded-[1.3rem] border border-emerald-400/20 bg-emerald-400/8 p-4 text-sm leading-7 text-emerald-100">
                  The biggest idea is simple: the same seed always gives the same preview inside the app.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="pb-8 pt-4">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">The Story</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[3.55rem]">
              Follow the map engine step by step
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
              Read from top to bottom. Each block answers one simple question.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl space-y-5">
            {STORY_STEPS.map((step, index) => (
              <StoryStepCard
                key={step.id}
                step={index + 1}
                eyebrow={step.eyebrow}
                title={step.title}
                body={step.body}
                note={step.note}
                quickView={step.quickView}
                icon={step.icon}
                accent={step.accent}
              />
            ))}
          </div>
        </section>

        <section id="biomes" className="grid gap-6 pb-8 pt-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(19rem,0.92fr)]">
          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                <SearchIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Biomes</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  How the app decides which biome belongs in one spot
                </h2>
              </div>
            </div>
            <div className="mt-5 max-w-4xl space-y-4 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              <p>
                ChunkLoader does not pick biomes randomly. It checks the climate signals at one world position,
                then it applies biome rules. Think of it like a sorting system: cold values go one way, hot and
                dry values go another way, and ocean-like values go another way.
              </p>
              <p>
                The signals change smoothly across the world. That is why the map feels like big regions and
                natural transitions instead of random dots.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {BIOME_RULES.map((rule) => (
                <div
                  key={rule}
                  className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-[var(--theme-text-secondary)]"
                >
                  {rule}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-sky-300">Math Without Pain</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              The very short math version
            </h2>
            <p className="mt-4 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              The engine mixes big waves, medium waves, and small waves together. That gives large continents,
              smaller regions, and little local detail at the same time.
            </p>
            <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-[#0b1322]/90 p-4">
              <code className="block text-sm leading-7 text-emerald-100">
                map value = big waves + medium waves + small waves
              </code>
            </div>
            <p className="mt-5 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              It also compares nearby height values. That helps the app estimate slopes, so the shading looks
              like hills and valleys instead of one flat sheet of color.
            </p>
          </article>
        </section>

        <section className="grid gap-6 pb-8 pt-8 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-amber-300">Speed</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Why the map can keep moving
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              <p>
                The world is split into small cached pieces called tiles. When you move the map, the app keeps
                old tiles and renders the new visible ones. That is why the world can appear step by step while
                still feeling responsive.
              </p>
              <p>
                In other words, the app only spends time on what you are actually looking at.
              </p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-pink-300">Structures And Helpers</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              How markers, coordinates, and helpers are shown
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              <p>
                Spawn, structure markers, slime chunks, and coordinate tools are overlay layers on top of the
                map. They are calculated from the seed and the current view.
              </p>
              <p>
                The app is not opening your saved world and reading hidden chunk files. It is using its own
                deterministic rules to place helper information in a repeatable way.
              </p>
            </div>
          </article>
        </section>

        <section className="pb-8 pt-8">
          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-white">
                <InfoIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Credit And Inspiration</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Where the idea comes from, and what this site actually uses
                </h2>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
                  ChunkLoader is inspired by the wider Minecraft seed-tool world and by the general idea of
                  fast seed scouting. One clear reference already mentioned in this project is
                  <span className="font-medium text-white"> Cubiomes Viewer</span>, which is known for fast
                  biome and seed searching. That tool helped shape the idea that seed maps should be quick to
                  explore and useful for planning before loading the world in-game.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
                  What ChunkLoader uses from that inspiration is the
                  <span className="font-medium text-white"> product idea and exploration flow</span>:
                  seeded world preview, biome scouting, structure helpers, and fast map reading in one place.
                  What it does
                  <span className="font-medium text-white"> not </span>
                  claim is direct reuse of a full external worldgen engine here. The browser map logic in this
                  site is its own TypeScript implementation built in files like
                  <span className="font-mono text-white"> noise.ts</span>,
                  <span className="font-mono text-white"> biome-generator.ts</span>, and
                  <span className="font-mono text-white"> map-overlays.ts</span>.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-[1.4rem] border border-emerald-400/15 bg-emerald-400/8 p-5 text-sm leading-8 text-emerald-100 sm:text-base">
              The inspiration comes from Minecraft seed tools and seed-scouting workflows,
              but the map engine on this site is a custom browser-side approximation rather than a
              direct copy of a
              full external generator.
            </div>
          </article>
        </section>

        <section id="accuracy" className="pb-8 pt-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <CompareCard
              title="What ChunkLoader is great for"
              eyebrow="Accuracy"
              accent="emerald"
              icon={<CompassRoseIcon className="h-5 w-5" />}
              intro="Use it as a fast scouting and planning tool. It is strong at high-level understanding."
              items={EXPECT_GOOD}
            />
            <CompareCard
              title="What still has limits"
              eyebrow="Keep In Mind"
              accent="red"
              icon={<WarningIcon className="h-5 w-5" />}
              intro="It is not trying to be a perfect full rebuild of every Minecraft world rule."
              items={EXPECT_LIMITS}
            />
          </div>
        </section>

        <section className="pb-12 pt-8">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(9,20,30,0.96),rgba(14,33,50,0.9)_48%,rgba(12,17,35,0.96))] px-5 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.42)] sm:px-8 sm:py-12">
            <div className="pointer-events-none absolute -right-12 top-[-4rem] h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[28%] h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Try It Live</p>
                <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Read the guide, then test a seed yourself.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
                  The page should now feel more like a story and less like a dashboard. When you are ready,
                  jump back into the live map and try a seed.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--theme-accent-strong),var(--theme-accent))] px-6 py-3.5 text-sm font-semibold text-[#04110b] shadow-[var(--theme-shadow-accent)] transition-transform hover:scale-[1.01]"
                >
                  Open Seed Map Generator
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-[var(--theme-text-muted)] transition-colors duration-200 hover:border-white/20"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AnchorChip({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-[var(--theme-text-secondary)] transition-colors hover:border-[var(--theme-border-strong)] hover:bg-white/[0.08] hover:text-white"
    >
      {children}
    </a>
  );
}

function FlowPill({
  icon,
  label,
  body,
  tone,
}: {
  icon: ReactNode;
  label: string;
  body: string;
  tone: "emerald" | "sky" | "teal" | "violet";
}) {
  const toneStyles = {
    emerald: "bg-emerald-500/8 border-emerald-400/14",
    sky: "bg-sky-500/8 border-sky-400/14",
    teal: "bg-teal-500/8 border-teal-400/14",
    violet: "bg-violet-500/8 border-violet-400/14",
  }[tone];

  return (
    <div className={`grid gap-3 rounded-[1.1rem] border px-4 py-3 ${toneStyles} md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:items-center`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-[var(--theme-accent)]">
          {icon}
        </span>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
      <span className="text-sm text-[var(--theme-text-secondary)] md:text-left">{body}</span>
    </div>
  );
}

function StoryStepCard({
  step,
  eyebrow,
  title,
  body,
  note,
  quickView,
  icon: Icon,
  accent,
}: {
  step: number;
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  quickView: [string, string, string];
  icon: (props: { className?: string }) => ReactNode;
  accent: string;
}) {
  const accentStyles = {
    emerald: "bg-emerald-500/10 text-emerald-300",
    sky: "bg-sky-500/10 text-sky-300",
    teal: "bg-teal-500/10 text-teal-300",
    amber: "bg-amber-500/10 text-amber-300",
    violet: "bg-violet-500/10 text-violet-200",
    pink: "bg-pink-500/10 text-pink-300",
  }[accent];

  return (
    <article className="card-hover rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-lg font-semibold text-white">
          {step}
        </span>
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentStyles}`}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-text-faint)]">{eyebrow}</p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h3>
          <p className="mt-4 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">{body}</p>
        </div>
        <div className="self-start rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-3.5">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--theme-text-faint)]">Quick view</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[var(--theme-text-secondary)]">
            <QuickViewChip label={quickView[0]} />
            <QuickViewArrow />
            <QuickViewChip label={quickView[1]} />
            <QuickViewArrow />
            <QuickViewChip label={quickView[2]} />
          </div>
          <p className="mt-3 text-xs leading-6 text-[var(--theme-text-secondary)]">{note}</p>
        </div>
      </div>
    </article>
  );
}

function QuickViewChip({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-white/8 bg-black/20 px-3 py-1.5 text-xs leading-5 text-white/90">
      {label}
    </div>
  );
}

function QuickViewArrow() {
  return (
    <div className="flex justify-center text-white/30">
      <span className="text-sm">↓</span>
    </div>
  );
}

function CompareCard({
  eyebrow,
  title,
  intro,
  items,
  icon,
  accent,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: string[];
  icon: ReactNode;
  accent: "emerald" | "red";
}) {
  const accentStyles = accent === "emerald"
    ? "bg-emerald-500/10 text-emerald-300"
    : "bg-red-500/10 text-red-300";
  const eyebrowStyles = accent === "emerald"
    ? "text-emerald-300"
    : "text-red-300";
  const bgStyles = accent === "emerald"
    ? "bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))]"
    : "bg-[linear-gradient(180deg,rgba(33,18,18,0.82),rgba(21,12,12,0.9))]";

  return (
    <article className={`rounded-[2rem] border border-white/10 ${bgStyles} p-6 shadow-[var(--theme-shadow-panel)]`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentStyles}`}>
          {icon}
        </span>
        <div>
          <p className={`text-[0.72rem] uppercase tracking-[0.24em] ${eyebrowStyles}`}>{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        </div>
      </div>
      <p className="mt-5 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">{intro}</p>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-[var(--theme-text-secondary)]"
          >
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}
