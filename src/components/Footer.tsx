import Link from "next/link";
import Image from "next/image";
import type { EventItem, SiteConfig } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { InstagramGlyph, LinkedInGlyph, XGlyph } from "@/components/icons/SocialGlyphs";

export function Footer({
  site,
  nextEvent,
}: {
  site: SiteConfig;
  nextEvent?: EventItem;
}) {
  return (
    <footer className="border-t border-white/10 bg-surface/40 ">
      <div className="container-page py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <Image
            src="/images/logo-ieee-babcock.png"
            alt={`${site.shortName} logo`}
            width={160}
            height={40}
            className="h-9 w-auto mb-4"
          />
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Upcoming Event</h3>
          {nextEvent ? (
            <div className="text-sm text-body space-y-1">
              <p className="text-accent-gold font-medium">{formatDate(nextEvent.date)}</p>
              <p className="text-white">{nextEvent.title}</p>
              <p>{nextEvent.location}</p>
              <Link href="/events" className="inline-block mt-2 text-ieee-blue-light hover:underline">
                View all events →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-body">Check back soon for upcoming events.</p>
          )}
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Connect</h3>
          <div className="flex items-center gap-4 mb-4">
            <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-body hover:text-white transition-colors">
              <LinkedInGlyph size={20} />
            </a>
            <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-body hover:text-white transition-colors">
              <InstagramGlyph size={20} />
            </a>
            <a href={site.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="text-body hover:text-white transition-colors">
              <XGlyph size={20} />
            </a>
          </div>
          <a
            href={site.joinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-ieee-blue px-5 py-2 text-sm font-semibold text-white hover:bg-ieee-blue-light transition-colors"
          >
            Join IEEE
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-body">
          <p>
            © {new Date().getFullYear()} {site.branchName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
