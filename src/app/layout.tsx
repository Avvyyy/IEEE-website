import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ieeebabcock.org";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.branchName} — ${site.tagline}`,
      template: `%s | ${site.shortName}`,
    },
    description: site.aboutSnippet,
    keywords: ["IEEE", "Babcock University", "Student Branch", "Region 8", "AXIS Congress", "engineering", "technology"],
    openGraph: {
      title: site.branchName,
      description: site.aboutSnippet,
      url: SITE_URL,
      siteName: site.shortName,
      images: [{ url: "/images/placeholder-axis-banner.svg", width: 1920, height: 1080 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: site.branchName,
      description: site.aboutSnippet,
      images: ["/images/placeholder-axis-banner.svg"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0A0F1E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
