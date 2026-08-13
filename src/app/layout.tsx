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
    keywords: [
      "IEEE",
      "Babcock University",
      "Student Branch",
      "Region 8",
      "AXIS Congress",
      "engineering",
      "technology",
      "Nigeria tech community",
      "student engineers",
      "IEEE membership",
    ],
    authors: [{ name: site.shortName, url: SITE_URL }],
    creator: site.shortName,
    publisher: site.branchName,
    category: "technology",
    referrer: "origin-when-cross-origin",
    applicationName: site.shortName,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
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

function OrganizationJsonLd({ site }: { site: Awaited<ReturnType<typeof getSiteConfig>> }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.branchName,
    alternateName: site.shortName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-ieee-babcock.svg`,
    description: site.aboutSnippet,
    email: site.email,
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.location,
    },
    sameAs: [site.socials.linkedin, site.socials.instagram, site.socials.twitter].filter(Boolean),
    parentOrganization: {
      "@type": "Organization",
      name: "IEEE",
      url: "https://www.ieee.org",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export const viewport: Viewport = {
  themeColor: "#0A0F1E",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteConfig();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <OrganizationJsonLd site={site} />
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="glow-orb glow-orb-blue h-[32rem] w-[32rem] -top-40 -left-32 opacity-40 animate-glow-pulse" />
          <div
            className="glow-orb glow-orb-gold h-[26rem] w-[26rem] top-1/3 -right-32 opacity-20 animate-glow-pulse"
            style={{ animationDelay: "-2s" }}
          />
          <div
            className="glow-orb glow-orb-blue h-[30rem] w-[30rem] bottom-0 left-1/4 opacity-20 animate-drift"
            style={{ animationDelay: "-6s" }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
