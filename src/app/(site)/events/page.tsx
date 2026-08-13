import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { EventsArchive } from "@/components/events/EventsArchive";
import { formatDate } from "@/lib/utils";
import { getEvents, getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past events hosted by IEEE Babcock University Student Branch.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const [events, site] = await Promise.all([getEvents(), getSiteConfig()]);

  const featured = events.find((e) => e.featured);
  const upcoming = events
    .filter((e) => e.status === "upcoming" && e.id !== featured?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = events.filter((e) => e.status === "past");

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="What's Happening"
        description="From technical workshops to our flagship congress — see what IEEE Babcock SB has planned."
      />

      {featured && (
        <section className="container-page py-16">
          <SectionReveal>
            <div className="relative overflow-hidden rounded-3xl border border-ieee-blue/30">
              <div className="relative h-64 sm:h-80 w-full">
                <Image src={featured.image} alt={featured.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/60 to-deep/20" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
                <p className="text-accent-gold font-semibold uppercase tracking-widest text-sm mb-2">
                  Featured Event
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{featured.title}</h2>
                <p className="flex items-center gap-2 text-body mb-1">
                  <Calendar size={16} /> {formatDate(featured.date)}
                </p>
                <p className="flex items-center gap-2 text-body mb-6">
                  <MapPin size={16} /> {featured.location}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/axis-congress"
                    className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-6 py-3 font-semibold text-white hover:bg-ieee-blue-light transition-colors"
                  >
                    View AXIS Congress Page
                  </Link>
                  {featured.registrationUrl && (
                    <a
                      href={featured.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:border-white hover:bg-white/5 transition-colors"
                    >
                      Register <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SectionReveal>
        </section>
      )}

      <section className="container-page py-16">
        <SectionReveal className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Upcoming Events</h2>
          <p className="text-body text-lg">
            Registration links are also posted on our{" "}
            <a href={site.vtoolsUrl} target="_blank" rel="noopener noreferrer" className="text-ieee-blue-light hover:underline">
              IEEE vTools calendar
            </a>
            .
          </p>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((event, i) => (
            <SectionReveal key={event.id} delay={i * 0.06}>
              <Card className="h-full flex flex-col p-0 overflow-hidden">
                <div className="relative h-44 w-full">
                  <Image src={event.image} alt={event.title} fill className="object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="flex items-center gap-2 text-sm text-accent-gold font-medium mb-2">
                    <Calendar size={14} /> {formatDate(event.date)}
                  </p>
                  <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                  <p className="flex items-center gap-2 text-xs text-body mb-3">
                    <MapPin size={14} /> {event.location}
                  </p>
                  <p className="text-sm text-body leading-relaxed line-clamp-3 mb-4 flex-1">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {event.registrationUrl && (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-ieee-blue-light hover:text-white transition-colors"
                      >
                        Register →
                      </a>
                    )}
                    {event.vtoolsUrl && (
                      <a
                        href={event.vtoolsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-body hover:text-white transition-colors"
                      >
                        vTools →
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </SectionReveal>
          ))}
          {upcoming.length === 0 && (
            <p className="text-body col-span-full text-center py-12">
              No upcoming events right now — check back soon.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 bg-surface/40">
        <div className="container-page py-16">
          <SectionReveal className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Past Events Archive</h2>
            <p className="text-body text-lg">Browse our event history by year.</p>
          </SectionReveal>
          <EventsArchive events={past} />
        </div>
      </section>
    </>
  );
}
