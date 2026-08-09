import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

export function UpcomingEvents({ events }: { events: EventItem[] }) {
  const upcoming = events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="container-page py-20 sm:py-28">
      <SectionReveal className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Upcoming Events</h2>
          <p className="text-body text-lg">Join us at our next workshops and events.</p>
        </div>
        <Link href="/events" className="flex items-center gap-2 text-ieee-blue-light font-semibold hover:text-white transition-colors">
          View All <ArrowRight size={18} />
        </Link>
      </SectionReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcoming.map((event, i) => (
          <SectionReveal key={event.id} delay={i * 0.08}>
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
                <p className="text-sm text-body leading-relaxed line-clamp-3">{event.description}</p>
              </div>
            </Card>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
