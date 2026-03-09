import { createSocialImage, socialImageContentType, socialImageSize } from "@/lib/create-social-image";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "ChunkLoader explore page social preview image";

export default function ExploreOpenGraphImage() {
  return createSocialImage({
    eyebrow: "Explore seed maps",
    title: "Inspect Minecraft seeds with live biome maps and overlays.",
    subtitle:
      "Open ChunkLoader to preview structures, highlight biomes, and navigate Java or Bedrock seeds interactively.",
  });
}
