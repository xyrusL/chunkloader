import { createSocialImage, socialImageContentType, socialImageSize } from "@/lib/create-social-image";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "ChunkLoader social preview image";

export default function OpenGraphImage() {
  return createSocialImage({
    eyebrow: "Minecraft seed map generator",
    title: "Generate and explore Minecraft biome maps from any seed.",
    subtitle:
      "ChunkLoader helps you inspect biomes, preview structures, and explore Java and Bedrock seed maps in the browser.",
  });
}
