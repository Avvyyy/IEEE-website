import { Hero } from "@/components/home/Hero";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { StatsBar } from "@/components/home/StatsBar";
import { Pillars } from "@/components/home/Pillars";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { FeaturedTeam } from "@/components/home/FeaturedTeam";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { LatestNews } from "@/components/home/LatestNews";
import { FooterCta } from "@/components/home/FooterCta";
import {
  getEvents,
  getNews,
  getPartners,
  getPillars,
  getSiteConfig,
  getStats,
  getTeam,
} from "@/lib/content";

export default async function Home() {
  const [site, stats, pillars, events, team, partners, news] = await Promise.all([
    getSiteConfig(),
    getStats(),
    getPillars(),
    getEvents(),
    getTeam(),
    getPartners(),
    getNews(),
  ]);

  return (
    <>
      <Hero site={site} />
      <AboutSnippet site={site} />
      <StatsBar stats={stats} />
      <Pillars pillars={pillars} />
      <UpcomingEvents events={events} />
      <FeaturedTeam team={team} />
      <PartnersStrip partners={partners} />
      <LatestNews news={news} />
      <FooterCta site={site} />
    </>
  );
}
