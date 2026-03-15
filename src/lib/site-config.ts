export const SITE_NAME = "ChunkLoader";
export const SITE_DOMAIN = "chunkloader.deze.me";
export const SITE_DESCRIPTION =
  "Free online Minecraft seed map generator and biome finder for Java and Bedrock. Explore biomes, structures, and coordinates in shareable maps with no download required.";
export const HOMEPAGE_LAST_MODIFIED = "2026-03-15T00:00:00.000Z";

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

export function getGoogleSiteVerification(): string | undefined {
  return process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined;
}

export function getBingSiteVerification(): string | undefined {
  return process.env.BING_SITE_VERIFICATION?.trim() || undefined;
}
