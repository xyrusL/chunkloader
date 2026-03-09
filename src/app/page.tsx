import type { Metadata } from "next";
import Link from "next/link";
import LandingScreen from "@/components/landing-screen";
import { createPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Minecraft Seed Map Generator",
  canonicalPath: "/",
  imagePath: "/opengraph-image",
  imageAlt: "ChunkLoader homepage preview image showing Minecraft seed map branding.",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  description: SITE_DESCRIPTION,
  url: getSiteUrl(),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Minecraft seed map generation",
    "Biome highlighting",
    "Java and Bedrock support",
    "Structure previews",
    "Interactive biome exploration",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingScreen
        cta={
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--theme-accent-strong),var(--theme-accent))] px-6 py-3.5 text-sm font-semibold text-[#04110b] shadow-[var(--theme-shadow-accent)] transition-transform hover:scale-[1.01]"
          >
            Start Exploring
          </Link>
        }
      />
    </>
  );
}
