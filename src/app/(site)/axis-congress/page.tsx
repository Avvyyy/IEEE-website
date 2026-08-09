import type { Metadata } from "next";
import Image from "next/image";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { getAxis } from "@/lib/content";

export const metadata: Metadata = {
  title: "AXIS Congress",
  description: "AXIS Congress — IEEE Babcock Student Branch's flagship annual technology congress.",
};

export default async function AxisCongressPage() {
  const axis = await getAxis();

  return (
    <>
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image src={axis.bannerImage} alt="AXIS Congress" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/60 via-deep/70 to-deep" />
        <div className="relative z-10 h-full container-page flex flex-col justify-center">
          <SectionReveal>
            <p className="text-accent-gold font-semibold tracking-widest uppercase text-sm mb-4">
              IEEE Babcock SB Flagship Event
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient max-w-3xl mb-6">
              AXIS Congress
            </h1>
            <p className="text-xl text-white/90 mb-2">{axis.theme}</p>
            <p className="flex items-center gap-2 text-body mb-1">
              <Calendar size={16} /> {axis.date}
            </p>
            <p className="flex items-center gap-2 text-body mb-8">
              <MapPin size={16} /> {axis.venue}
            </p>
            <a
              href={axis.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-8 py-4 text-base font-semibold text-white shadow-lg shadow-ieee-blue/30 hover:bg-ieee-blue-light transition-colors"
            >
              Register Now <ExternalLink size={18} />
            </a>
          </SectionReveal>
        </div>
      </section>

      <section className="container-page py-20 max-w-3xl mx-auto text-center">
        <SectionReveal>
          <h2 className="text-3xl font-bold mb-6">About AXIS Congress</h2>
          <p className="text-body text-lg leading-relaxed">{axis.description}</p>
        </SectionReveal>
      </section>

      <section className="border-y border-white/10 bg-surface/40">
        <div className="container-page py-20">
          <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Speakers & Panelists</h2>
          </SectionReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {axis.speakers.map((speaker, i) => (
              <SectionReveal key={speaker.id} delay={i * 0.08} className="text-center">
                <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border border-white/10">
                  <Image src={speaker.photo} alt={speaker.name} fill className="object-cover" />
                </div>
                <h3 className="text-white font-semibold">{speaker.name}</h3>
                <p className="text-sm text-body">{speaker.title}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Programme</h2>
        </SectionReveal>
        <div className="max-w-2xl mx-auto space-y-4">
          {axis.schedule.map((item, i) => (
            <SectionReveal key={item.id} delay={i * 0.06}>
              <div className="flex gap-4 rounded-xl border border-white/10 bg-surface/60 p-5">
                <p className="w-32 shrink-0 text-sm font-semibold text-accent-gold">{item.time}</p>
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  {item.speaker && <p className="text-sm text-body">{item.speaker}</p>}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface/40">
        <div className="container-page py-16">
          <SectionReveal className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Sponsors & Partners</h2>
          </SectionReveal>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {axis.sponsors.map((sponsor) => (
              <div key={sponsor.id} className="flex h-16 w-40 items-center justify-center opacity-80">
                <Image src={sponsor.logo} alt={sponsor.name} width={140} height={64} className="max-h-16 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Gallery from Previous Editions</h2>
        </SectionReveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {axis.gallery.map((src, i) => (
            <SectionReveal key={src + i} delay={i * 0.06}>
              <Card className="p-0 overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image src={src} alt={`AXIS Congress gallery photo ${i + 1}`} fill className="object-cover" />
                </div>
              </Card>
            </SectionReveal>
          ))}
        </div>
      </section>
    </>
  );
}
