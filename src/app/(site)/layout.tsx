import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getEvents, getSiteConfig } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, events] = await Promise.all([getSiteConfig(), getEvents()]);
  const nextEvent = events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <>
      <Navbar site={site} />
      <main className="flex-1 pt-20 sm:pt-24">{children}</main>
      <Footer site={site} nextEvent={nextEvent} />
    </>
  );
}
