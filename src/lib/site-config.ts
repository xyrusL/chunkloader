export const SITE_NAME = "ChunkLoader";
export const SITE_DOMAIN = "chunkloader.deze.me";
export const SITE_DESCRIPTION =
  "Minecraft seed map generator and biome explorer for Java and Bedrock. Generate biome maps, inspect coordinates, preview structures, and highlight specific biomes.";
export const SITE_KEYWORDS = [
  "minecraft seed map",
  "minecraft biome finder",
  "minecraft seed viewer",
  "minecraft biome map generator",
  "minecraft seed map generator",
  "java seed map",
  "bedrock seed map",
  "minecraft structure finder",
  "minecraft biome explorer",
  "chunkloader",
];

function normalizeSiteUrl(url: string): string | null {
  const normalizedInput = url.includes("://") ? url : `https://${url}`;

  try {
    const parsedUrl = new URL(normalizedInput);

    if (parsedUrl.hostname === "deze.me" || parsedUrl.hostname === "www.deze.me") {
      parsedUrl.hostname = SITE_DOMAIN;
    }

    parsedUrl.protocol = "https:";
    parsedUrl.pathname = "";
    parsedUrl.search = "";
    parsedUrl.hash = "";

    return parsedUrl.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    const normalizedEnvUrl = normalizeSiteUrl(envUrl);
    if (normalizedEnvUrl) {
      return normalizedEnvUrl;
    }
  }

  return `https://${SITE_DOMAIN}`;
}

export function getAbsoluteUrl(path = "/"): string {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
