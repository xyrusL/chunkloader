"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaTelegram,
  FaTumblr,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import {
  AppLogoIcon,
  CollapseIcon,
  CopyLinkIcon,
  ExpandIcon,
  ShareIcon,
  SettingsIcon,
} from "@/components/ui/icons";

interface TopBarProps {
  seed: string;
  version: string;
  edition: string;
  dimension: string;
  isMapExpanded: boolean;
  isSettingsPanelOpen: boolean;
  onToggleSettingsPanel: () => void;
  onToggleMapExpanded: () => void;
}

interface ShareTarget {
  id: string;
  label: string;
  href: string;
  icon: IconType;
}

export default function TopBar({
  seed,
  version,
  edition,
  dimension,
  isMapExpanded,
  isSettingsPanelOpen,
  onToggleSettingsPanel,
  onToggleMapExpanded,
}: TopBarProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const shareUrl = typeof window === "undefined" ? "" : window.location.href;
  const shareText = seed
    ? `Explore this ${edition} ${version} ${dimension} seed in ChunkLoader: ${seed}`
    : "Explore Minecraft biome maps with ChunkLoader";
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const shareTargets: ShareTarget[] = [
    { id: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, icon: FaXTwitter },
    { id: "reddit", label: "Reddit", href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`, icon: FaRedditAlien },
    { id: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: FaFacebookF },
    { id: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: FaLinkedinIn },
    { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, icon: FaWhatsapp },
    { id: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, icon: FaTelegram },
    { id: "tumblr", label: "Tumblr", href: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&caption=${encodedText}`, icon: FaTumblr },
    { id: "pinterest", label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`, icon: FaPinterestP },
  ];

  useEffect(() => {
    if (!shareOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!shareRef.current?.contains(event.target as Node)) {
        setShareOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShareOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shareOpen]);

  const handleCopyLink = async () => {
    if (!shareUrl || typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/5 bg-[var(--theme-bg-header)] px-3 py-2.5 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Logo — links back to landing page */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-[var(--theme-accent)] transition-transform duration-300 group-hover:scale-110">
            <AppLogoIcon className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold tracking-tight text-[var(--theme-text-primary)]">
            Chunk<span className="text-[var(--theme-accent)]">Loader</span>
          </h1>
        </Link>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-white/10 sm:block" />

        {/* Active seed info */}
        {seed && (
          <div className="min-w-0 items-center gap-2 text-sm sm:flex">
            <span className="mb-1 inline-flex rounded bg-[var(--theme-accent-soft)] px-2 py-0.5 text-xs font-medium uppercase text-[var(--theme-accent)] sm:mb-0">
              {edition} {version}
            </span>
            <span className="block truncate font-mono text-[var(--theme-text-muted)]">{seed}</span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <div className="relative" ref={shareRef}>
          <button
            className="rounded-lg p-2 text-[var(--theme-text-faint)] transition-colors hover:bg-[var(--theme-surface-soft)] hover:text-[var(--theme-text-secondary)]"
            title="Share map"
            onClick={() => setShareOpen((current) => !current)}
            aria-expanded={shareOpen}
            aria-haspopup="menu"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
          {shareOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-[min(20rem,calc(100vw-1rem))] rounded-2xl border border-[var(--theme-border-strong)] bg-[var(--theme-bg-overlay)] p-3 shadow-[var(--theme-shadow-panel)] backdrop-blur-xl sm:w-80">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--theme-accent)]">Share map</p>
                  <p className="mt-1 text-sm text-[var(--theme-text-secondary)]">
                    Send the current ChunkLoader view to popular and niche networks.
                  </p>
                </div>
                {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                  <button
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-[var(--theme-text-secondary)] transition-colors hover:border-[var(--theme-border-strong)] hover:text-[var(--theme-text-primary)]"
                    onClick={() => navigator.share({ title: "ChunkLoader", text: shareText, url: shareUrl })}
                  >
                    Native
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {shareTargets.map((target) => {
                  const Icon = target.icon;
                  return (
                    <a
                      key={target.id}
                      href={target.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-[var(--theme-text-secondary)] transition-all hover:border-[var(--theme-border-strong)] hover:bg-[var(--theme-accent-soft)] hover:text-[var(--theme-text-primary)]"
                      onClick={() => setShareOpen(false)}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--theme-surface-soft)] text-[var(--theme-accent)]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span>{target.label}</span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/8 bg-black/20 p-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--theme-text-faint)]">Share URL</p>
                  <p className="truncate text-xs text-[var(--theme-text-secondary)]">{shareUrl || "Generate a map to create a share link"}</p>
                </div>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[var(--theme-accent)] transition-colors hover:border-[var(--theme-border-strong)] hover:text-[var(--theme-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleCopyLink}
                  disabled={!shareUrl}
                  title={copied ? "Copied" : "Copy link"}
                >
                  <CopyLinkIcon className="h-4 w-4" />
                </button>
              </div>
              {copied && <p className="mt-2 text-xs text-[var(--theme-accent)]">Link copied.</p>}
            </div>
          )}
        </div>
        <button
          className="rounded-lg p-2 text-[var(--theme-text-faint)] transition-colors hover:bg-[var(--theme-surface-soft)] hover:text-[var(--theme-text-secondary)]"
          title={isSettingsPanelOpen ? "Close side settings" : "Open side settings"}
          onClick={onToggleSettingsPanel}
        >
          <SettingsIcon className="h-4 w-4" />
        </button>
        <button
          className="rounded-lg p-2 text-[var(--theme-text-faint)] transition-colors hover:bg-[var(--theme-surface-soft)] hover:text-[var(--theme-text-secondary)]"
          title={isMapExpanded ? "Exit expanded map" : "Expand map"}
          onClick={onToggleMapExpanded}
        >
          {isMapExpanded ? <CollapseIcon /> : <ExpandIcon />}
        </button>
      </div>
    </header>
  );
}
