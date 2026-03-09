import type { Metadata } from "next";
import Link from "next/link";
import LandingScreen from "@/components/landing-screen";
import { FAQS } from "@/lib/faqs";
import { createPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Minecraft Seed Map Generator",
  description:
    "Free online Minecraft seed map generator for Java and Bedrock editions. Explore biomes, find structures, inspect terrain, and share interactive maps — no download or account needed.",
  canonicalPath: "/",
  imagePath: "/opengraph-image",
  imageAlt: "ChunkLoader — interactive Minecraft seed map generator showing biome colors and terrain.",
});

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  description:
    "Free online Minecraft seed map generator for Java and Bedrock editions. Explore biomes, find structures, and share interactive maps.",
  url: getSiteUrl(),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Minecraft seed map generation",
    "Biome highlighting and filtering",
    "Java and Bedrock edition support",
    "Structure previews (villages, temples, monuments)",
    "Interactive terrain with topographic shading",
    "Shareable map links",
    "Overworld, Nether, and End dimensions",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
