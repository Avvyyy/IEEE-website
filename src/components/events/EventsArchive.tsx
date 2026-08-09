"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

export function EventsArchive({ events }: { events: EventItem[] }) {
  const years = useMemo(() => {
    const set = new Set(events.map((e) => new Date(e.date).getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [events]);

  const [year, setYear] = useState<number | "all">("all");

  const filtered = events.filter(
    (e) => year === "all" || new Date(e.date).getFullYear() === year
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setYear("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            year === "all" ? "bg-ieee-blue text-white" : "bg-surface text-body hover:text-white"
          }`}
        >
          All Years
        </button>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              year === y ? "bg-ieee-blue text-white" : "bg-surface text-body hover:text-white"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event) => (
          <Card key={event.id} className="h-full flex flex-col p-0 overflow-hidden opacity-90">
            <div className="relative h-40 w-full grayscale">
              <Image src={event.image} alt={event.title} fill className="object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-xs text-body mb-2">{formatDate(event.date)}</p>
              <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
              <p className="flex items-center gap-2 text-xs text-body mb-3">
                <MapPin size={14} /> {event.location}
              </p>
              <p className="text-sm text-body leading-relaxed line-clamp-3">{event.description}</p>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-body col-span-full text-center py-12">No events found for this year.</p>
        )}
      </div>
    </div>
  );
}
