"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
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
import { FAQS } from "@/lib/faqs";

interface LandingScreenProps {
  cta: ReactNode;
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    targets.forEach((target) => io.observe(target));

    return () => io.disconnect();
  }, []);

  return ref;
}

const FEATURE_CARDS = [
  {
    title: "Biome mapping in one view",
    body: "Render the world around a seed instantly and inspect biome color fields, hover coordinates, and terrain context without leaving the browser.",
    icon: MapIcon,
    tone: "from-emerald-500/20 via-emerald-500/8 to-transparent",
    accent: "text-emerald-300",
  },
  {
    title: "Version-aware exploration",
    body: "Switch between Java and Bedrock releases, compare dimensions, and keep the map aligned with the version rules you actually care about.",
    icon: GlobeIcon,
    tone: "from-sky-500/20 via-sky-500/8 to-transparent",
    accent: "text-sky-300",
  },
  {
    title: "Markers, structures, overlays",
    body: "Highlight biomes, filter structures, turn on grid tools, and refine what the map shows instead of working with a flat screenshot.",
    icon: PinIcon,
    tone: "from-amber-500/20 via-amber-500/8 to-transparent",
    accent: "text-amber-300",
  },
  {
    title: "Dimension switching",
    body: "Jump between the Overworld, Nether, and The End without losing your seed context. Each dimension renders its own biome layout instantly.",
    icon: LayersIcon,
    tone: "from-violet-500/20 via-violet-500/8 to-transparent",
    accent: "text-violet-300",
  },
  {
    title: "Shareable map links",
    body: "Copy a URL that preserves the exact seed, version, overlay state, and map position. Send a link and your friend sees the exact same world view.",
    icon: CompassRoseIcon,
    tone: "from-pink-500/20 via-pink-500/8 to-transparent",
    accent: "text-pink-300",
  },
  {
    title: "Instant seed access",
    body: "No download, no account, no install. Paste any Minecraft seed into the browser and explore the world map within seconds.",
    icon: SeedIcon,
    tone: "from-teal-500/20 via-teal-500/8 to-transparent",
    accent: "text-teal-300",
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
  {
    label: "Dimensions",
    value: "3 worlds",
    detail: "Overworld, Nether, and The End all accessible from the same seed.",
  },
  {
    label: "Render speed",
    value: "Instant",
    detail: "No download needed. Open the browser and the map is live in seconds.",
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Enter a seed",
    body: "Start from any Minecraft seed, whether it is a word, phrase, or number. Lock the edition, version, and dimension you want to inspect.",
    icon: SeedIcon,
  },
  {
    step: "02",
    title: "Shape the map",
    body: "Turn on overlays, markers, grid tools, and biome highlighting while the world stays visible. Tune everything without losing the visual context.",
    icon: LayersIcon,
  },
  {
    step: "03",
    title: "Scout faster",
    body: "Use the map to compare spawn areas, locate structures, and share the exact view with your team. No guesswork, no loading into the wrong world.",
    icon: CompassRoseIcon,
  },
];

const BIOMES = [
  { label: "Forest", color: "#1AA56E" },
  { label: "Ocean", color: "#20386C" },
  { label: "Desert", color: "#F58A31" },
  { label: "Snowy Plains", color: "#DDE4F2" },
  { label: "Mushroom Island", color: "#7C66FF" },
  { label: "Swamp", color: "#1F5C4E" },
  { label: "Savanna", color: "#C77634" },
  { label: "Jungle", color: "#2E8B57" },
  { label: "Badlands", color: "#C25A1B" },
  { label: "Deep Ocean", color: "#0E3042" },
  { label: "Taiga", color: "#3A6D41" },
  { label: "Nether Wastes", color: "#7F1717" },
];

export default function LandingScreen({ cta }: LandingScreenProps) {
  const pageRef = useScrollReveal();

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-[var(--theme-bg-app)] text-[var(--theme-text-primary)]"
    >
      <div className="absolute inset-0">
        <Image
          src="/landing/chunkloader-hero-bg.svg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(52,211,153,0.22),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(73,104,232,0.18),transparent_28%),radial-gradient(circle_at_50%_76%,rgba(249,115,22,0.12),transparent_24%),linear-gradient(180deg,rgba(4,8,18,0.28),rgba(4,8,18,0.78)_40%,rgba(4,8,18,0.96)_100%)]" />
      </div>

      <div className="pointer-events-none absolute left-[-10rem] top-[12rem] h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-[22rem] h-[30rem] w-[30rem] rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[118rem] px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
        <header className="flex items-center justify-between animate-fade-up" style={{ animationDelay: "0ms" }}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[var(--theme-accent)] shadow-[var(--theme-shadow-accent)] transition-transform duration-300 hover:scale-110">
              <AppLogoIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--theme-accent)]">ChunkLoader</p>
              <p className="text-xs text-[var(--theme-text-muted)] sm:text-sm">Minecraft seed map explorer</p>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--theme-text-muted)] lg:block">
            Browser-based world scouting
          </div>
        </header>

        <section className="grid min-h-[calc(100svh-5rem)] items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:gap-14 lg:py-14">
          <div className="max-w-4xl">
            <div
              className="inline-flex items-center gap-2 rounded-none border-2 border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[var(--theme-accent)] mc-badge animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              <LeafIcon className="h-4 w-4" />
              Free online Minecraft seed map
            </div>

            <h1
              className="mt-5 text-[2.6rem] font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-[6.3rem] animate-fade-up"
              style={{ animationDelay: "160ms" }}
            >
              Minecraft Seed Map Generator{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                and Biome Finder
              </span>{" "}
              for Java and Bedrock.
            </h1>

            <p
              className="mt-5 max-w-2xl text-base leading-7 text-[var(--theme-text-secondary)] sm:text-lg animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              ChunkLoader is a free online Minecraft seed map generator built for Java and Bedrock players who
              want to inspect biomes, structures, and coordinates in shareable maps with no download. Paste a
              seed, open the map, and scout the world in your browser before you load into the game.
            </p>

            <div
              className="mt-7 flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: "320ms" }}
            >
              <div className="cta-btn-wrap inline-flex">{cta}</div>
              <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-[var(--theme-text-muted)] transition-colors duration-300 hover:border-white/20">
                No download. Open a seed map and inspect it immediately.
              </div>
            </div>

            <div
              className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 animate-fade-up"
              style={{ animationDelay: "400ms" }}
            >
              {SIGNALS.map((item, i) => (
                <article
                  key={item.label}
                  className={`stat-card rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[var(--theme-shadow-panel)] backdrop-blur-xl stagger-${i + 1}`}
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--theme-text-faint)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white sm:text-xl">{item.value}</p>
                  <p className="mt-1.5 text-xs leading-5 text-[var(--theme-text-secondary)] sm:text-sm sm:leading-6">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative animate-scale-up" style={{ animationDelay: "200ms" }}>
            <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-[2rem] border border-white/10 bg-emerald-400/10 blur-2xl lg:block" />
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,24,44,0.88),rgba(10,16,32,0.76))] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_32px_100px_rgba(0,0,0,0.5)] sm:p-5">
              <div className="rounded-[1.5rem] border border-white/8 bg-[#0b1322]/90 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">
                      Map preview
                    </p>
                    <p className="mt-1.5 text-lg font-semibold text-white sm:text-2xl">
                      Interactive seed control deck
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-right">
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--theme-text-faint)]">
                      Seed
                    </p>
                    <p className="mt-1 font-mono text-xs text-white sm:text-sm">-4653970845219756904</p>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-white/10">
                  <div className="relative h-44 w-full sm:h-52">
                    <Image
                      src="/landing/minecraft-hero-map.png"
                      alt="Minecraft biome seed map preview"
                      fill
                      className="object-cover img-reveal"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1322]/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 text-xs">
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-emerald-200 backdrop-blur-sm transition-colors duration-200 hover:bg-emerald-400/20">
                        Highlighted biome
                      </span>
                      <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[var(--theme-text-secondary)] backdrop-blur-sm">
                        Structures enabled
                      </span>
                      <span className="hidden rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[var(--theme-text-secondary)] backdrop-blur-sm sm:inline-flex">
                        Grid overlay active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    {
                      icon: DiceIcon,
                      label: "Version",
                      sub: "Java 1.21.5",
                      color: "text-emerald-300 bg-emerald-400/12",
                    },
                    {
                      icon: SearchIcon,
                      label: "Finder",
                      sub: "Seed + biome",
                      color: "text-sky-300 bg-sky-400/12",
                    },
                    {
                      icon: LayersIcon,
                      label: "Overlays",
                      sub: "Markers + grid",
                      color: "text-amber-300 bg-amber-400/12",
                    },
                  ].map(({ icon: Icon, label, sub, color }) => (
                    <article
                      key={label}
                      className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-3 transition-colors duration-200 hover:border-white/16 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-white">{label}</p>
                          <p className="truncate text-[0.65rem] text-[var(--theme-text-secondary)]">{sub}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-8 pt-2">
          <div className="reveal overflow-hidden rounded-[2rem] border border-white/10 shadow-[var(--theme-shadow-panel)] transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="relative h-56 w-full sm:h-72 md:h-80">
              <Image
                src="/landing/minecraft-biome-showcase.png"
                alt="Minecraft biome showcase: forest, ocean, desert, snow, mushroom island and more"
                fill
                className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                style={{ imageRendering: "pixelated" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a14]/60 via-transparent to-[#0a0a14]/60" />

              <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                <span className="mc-badge rounded-none border-2 border-[var(--theme-accent)] bg-black/50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--theme-accent)] backdrop-blur-sm">
                  Biome Library
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <p className="mb-2.5 text-sm font-semibold text-white sm:text-base">
                  {BIOMES.length} supported biomes, all rendered in real-time
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {BIOMES.map((biome) => (
                    <span
                      key={biome.label}
                      className="biome-chip flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-white backdrop-blur-sm"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-sm border border-white/20"
                        style={{ backgroundColor: biome.color }}
                      />
                      {biome.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-8 pt-6">
          <div className="reveal mb-6 text-center sm:mb-8">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Features</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Browse biomes, structures, and coordinates in one map.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--theme-text-secondary)]">
              ChunkLoader puts the main Minecraft seed map tools in one browser tab so you can read a world
              quickly without extra setup.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className={`reveal card-glow-hover rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[var(--theme-shadow-panel)] backdrop-blur-xl stagger-${i + 1}`}
                >
                  <div className={`rounded-[1.25rem] bg-gradient-to-br ${card.tone} p-3`}>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20 ${card.accent}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white sm:text-xl">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--theme-text-secondary)]">{card.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 pb-8 pt-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-start">
          <div className="reveal rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-5 shadow-[var(--theme-shadow-panel)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Workflow</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Find the right Minecraft seed faster.
                </h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--theme-text-secondary)]">
                Fast to learn
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {WORKFLOW.map((item, i) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.step}
                    className={`card-hover grid gap-4 rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4 sm:grid-cols-[auto_1fr] stagger-${i + 1}`}
                  >
                    <div className="flex items-center gap-3 sm:block">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="mt-2 hidden text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--theme-text-faint)] sm:block">
                        Step {item.step}
                      </span>
                      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--theme-text-faint)] sm:hidden">
                        Step {item.step}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white sm:text-lg">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--theme-text-secondary)]">{item.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="reveal rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-5 shadow-[var(--theme-shadow-panel)] sm:p-6">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">
              Why it feels better
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              A Minecraft biome finder that stays readable while you explore.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--theme-text-secondary)]">
              Large visual anchors, clear version context, controlled side settings, and a map that stays central
              instead of being buried behind disconnected menus.
            </p>

            <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-white/10">
              <div className="relative h-48 w-full sm:h-56">
                <Image
                  src="/landing/minecraft-seed-explorer.png"
                  alt="Minecraft seed explorer UI showing a biome map with panels"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1322]/70 to-transparent" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Interaction mode",
                  title: "Inspect while editing",
                  body: "Map tools stay useful only when you can see the result while changing them.",
                },
                {
                  label: "Search intent",
                  title: "Useful before the first click",
                  body: "The landing page explains what the tool does before you open the map view.",
                },
              ].map((box) => (
                <div
                  key={box.label}
                  className="card-hover rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4"
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--theme-text-faint)]">
                    {box.label}
                  </p>
                  <p className="mt-3 text-base font-semibold text-white sm:text-lg">{box.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--theme-text-secondary)]">{box.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-8 pt-6">
          <div className="mx-auto max-w-3xl">
            <div className="reveal mb-6 text-center sm:mb-8">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">FAQ</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--theme-text-secondary)]">
                Everything you need to know about ChunkLoader and how it works.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {FAQS.map((faq, i) => (
                <details
                  key={faq.question}
                  className={`reveal faq-item group rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] backdrop-blur-xl stagger-${i + 1}`}
                >
                  <summary className="faq-summary flex list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-white hover:text-[var(--theme-accent)] sm:px-6 sm:py-5 sm:text-base">
                    {faq.question}
                    <span className="faq-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[var(--theme-accent)] sm:h-8 sm:w-8">
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M7 1v12M1 7h12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="faq-body">
                    <div className="faq-content px-5 pb-4 pt-0 text-sm leading-7 text-[var(--theme-text-secondary)] sm:px-6 sm:pb-5">
                      {faq.answer}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-8 pt-6">
          <div className="reveal relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(9,20,30,0.96),rgba(14,33,50,0.9)_48%,rgba(12,17,35,0.96))] px-5 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.42)] transition-shadow duration-500 hover:shadow-[0_40px_100px_rgba(0,0,0,0.56)] sm:px-8 sm:py-12">
            <div className="pointer-events-none absolute -right-12 top-[-4rem] h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[28%] h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="accent-line pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400/40 via-emerald-400/10 to-transparent" />

            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">
                  Start exploring
                </p>
                <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Open the Minecraft seed map generator and scout your world with more context.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
                  ChunkLoader helps you check biomes, structures, and coordinates before you commit to a world,
                  then share the same map view with anyone else on your seed.
                </p>
                <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 transition-colors duration-200 hover:border-white/20">
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--theme-text-faint)]">
                    Try seed
                  </span>
                  <span className="font-mono text-sm text-[var(--theme-accent)]">-4653970845219756904</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <div className="cta-btn-wrap inline-flex">{cta}</div>
                <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-[var(--theme-text-muted)] transition-colors duration-200 hover:border-white/20">
                  Shareable maps. Version-aware seed tools. Browser only.
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-10 pt-2">
          <div className="reveal flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-5 py-5 shadow-[var(--theme-shadow-panel)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Learn More</p>
              <p className="mt-2 text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
                Want the simple version of the engine? Read how the map works, what the math is doing,
                and what kind of accuracy you should expect.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-[var(--theme-border-strong)] hover:bg-white/[0.08]"
              >
                How It Works
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--theme-accent-strong),var(--theme-accent))] px-5 py-3 text-sm font-semibold text-[#04110b] shadow-[var(--theme-shadow-accent)] transition-transform hover:scale-[1.01]"
              >
                Start Exploring
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
