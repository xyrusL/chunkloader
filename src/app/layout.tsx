import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import {
  getAbsoluteUrl,
  getBingSiteVerification,
  getGoogleSiteVerification,
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site-config";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const bingSiteVerification = getBingSiteVerification();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Minecraft Seed Map Generator & Biome Finder",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  category: "games",
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: getAbsoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    title: "Minecraft Seed Map Generator & Biome Finder",
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    url: getSiteUrl(),
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minecraft Seed Map Generator & Biome Finder",
    description: SITE_DESCRIPTION,
  },
  verification: {
    google: getGoogleSiteVerification(),
    other: bingSiteVerification ? { "msvalidate.01": bingSiteVerification } : undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${mono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
