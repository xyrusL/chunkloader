import type { Metadata } from "next";
import ExploreApp from "@/components/explore-app";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Explore Minecraft Seed Maps",
  canonicalPath: "/explore",
  imagePath: "/explore/opengraph-image",
  imageAlt: "ChunkLoader explore page preview image for interactive Minecraft seed maps.",
});

export default function ExplorePage() {
  return <ExploreApp />;
}
