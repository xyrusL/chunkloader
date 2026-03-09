import type { Metadata } from "next";
import { socialImageContentType, socialImageSize } from "@/lib/create-social-image";
import { getAbsoluteUrl, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from "@/lib/site-config";

type PageMetadataOptions = {
  title: string;
  description?: string;
  canonicalPath: string;
  imagePath: string;
  imageAlt: string;
};

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  canonicalPath,
  imagePath,
  imageAlt,
}: PageMetadataOptions): Metadata {
  const image = {
    url: getAbsoluteUrl(imagePath),
    width: socialImageSize.width,
    height: socialImageSize.height,
    alt: imageAlt,
    type: socialImageContentType,
  };

  return {
    title,
    description,
    keywords: SITE_KEYWORDS,
    alternates: {
      canonical: getAbsoluteUrl(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: getAbsoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
