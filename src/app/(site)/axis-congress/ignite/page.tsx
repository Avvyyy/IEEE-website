import type { Metadata } from "next";
import Image from "next/image";
import { Calendar, User, Flame, ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { getAxis } from "@/lib/content";
import { IgniteWebinarGrid } from "@/components/axis/IgniteWebinarGrid";

export const metadata: Metadata = {
  title: "AXIS Ignite — The Countdown Series",
  description:
    "AXIS Ignite is IEEE Babcock SB's pre-congress webinar series — eight weeks of deep-dive technical sessions leading up to AXIS Congress 2026. Four Pillars. Eight Weeks. One Mission.",
  alternates: { canonical: "/axis-congress/ignite" },
};

export default async function AxisIgnitePage() {
  const axis = await getAxis();
  const { ignite } = axis;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[65vh] min-h-[440px] w-full overflow-hidden">
        <Image src={ignite.bannerImage} alt="AXIS Ignite" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/50 via-deep/70 to-deep" />

        {/* Ambient glow */}
        <div className="glow-orb glow-orb-blue animate-glow-pulse absolute -top-24 right-1/4 h-96 w-96 opacity-40" />
        <div className="glow-orb glow-orb-gold absolute bottom-0 left-1/3 h-64 w-64 opacity-25" />

        <div className="relative z-10 h-full container-page flex flex-col justify-center">
          <SectionReveal>
            <p className="text-accent-gold font-semibold tracking-widest uppercase text-sm mb-4">
              AXIS Congress 2026 Pre-Series
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient max-w-3xl mb-4">
              AXIS Ignite
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 mb-2 max-xl font-medium italic">
              &ldquo;Four Pillars. Eight Weeks. One Mission — AXIS 2026.&rdquo;
            </p>
            <p className="text-lg text-white/60 mb-6 max-w-xl">
              {ignite.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <Calendar size={15} className="text-accent-gold" />
                <span className="text-white/80">Sundays, Sep 20 – Nov 8, 2026</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <Flame size={15} className="text-accent-gold" />
                <span className="text-white/80">6:30 PM WAT</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <User size={15} className="text-accent-gold" />
                <span className="text-white/80">Industry Experts</span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── About the series ── */}
      <section className="container-page py-20 max-w-3xl mx-auto text-center">
        <SectionReveal>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-gold/15">
              <Flame size={20} className="text-accent-gold" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Countdown to AXIS Congress</h2>
          <p className="text-body text-lg leading-relaxed mb-6">
            AXIS Ignite is an eight-week webinar series designed to serve as the official countdown to
            AXIS Congress 2026. Rather than promoting AXIS only once registration opens, this series
            builds a connected, escalating journey — <strong className="text-white">Advance, eXplore, Innovate, Skill Up</strong> —
            that educates students, showcases partners, and converts sustained engagement into registrations.
          </p>
          <p className="text-body leading-relaxed">
            Each session is a chapter in one continuous story rather than a standalone event. By the
            time registration opens, attendees will already know the AXIS brand, have built relationships
            with its partners, and have accumulated small commitments that make registering the natural
            next step.
          </p>
        </SectionReveal>
      </section>

      {/* ── Pillars ── */}
      <section className="border-y border-white/10 bg-surface/40">
        <div className="container-page py-16">
          <SectionReveal className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Four Pillars</h2>
            <p className="text-body leading-relaxed">
              Two weeks per pillar. Each builds on the last. The series spells out A.X.I.S. itself.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Advance", weeks: "1–2", desc: "Career foundations & growth through IEEE", icon: "↗", color: "text-blue-400 border-blue-400/30 bg-blue-400/5" },
              { name: "eXplore", weeks: "3–4", desc: "Emerging tech & inter-branch collaboration", icon: "◎", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5" },
              { name: "Innovate", weeks: "5–6", desc: "From engineering ideas to real systems", icon: "💡", color: "text-amber-400 border-amber-400/30 bg-amber-400/5" },
              { name: "Skill Up", weeks: "7–8", desc: "Hands-on skills & the AXIS launch", icon: "⚙", color: "text-purple-400 border-purple-400/30 bg-purple-400/5" },
            ].map((p) => (
              <div key={p.name} className={`rounded-2xl border p-6 ${p.color}`}>
                <p className="text-xs font-bold tracking-widest uppercase mb-2 opacity-70">Weeks {p.weeks}</p>
                <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                <p className="text-sm text-body/70">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Webinar Cards ── */}
      <section className="container-page py-20">
        <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Programme</h2>
          <p className="text-body leading-relaxed">
            Every Sunday until November, we&apos;re pulling back the curtain on the people shaping tech
          </p>
        </SectionReveal>

        <IgniteWebinarGrid webinars={ignite.webinars} />
      </section>

      {/* ── Pre-Congress CTA ── */}
      <section className="border-t border-white/10 bg-surface/40">
        <div className="container-page py-16 text-center">
          <SectionReveal className="max-w-xl mx-auto">
            <p className="text-accent-gold text-sm font-semibold tracking-widest uppercase mb-3">
              After Ignite
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready for the main event?</h2>
            <p className="text-body mb-8 leading-relaxed">
              AXIS Ignite leads directly into AXIS Congress 2026 — three days of keynotes,
              workshops, and networking at Babcock University (November 10–12).
            </p>
            <a
              href="/axis-congress"
              className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-8 py-4 text-base font-semibold text-white shadow-lg shadow-ieee-blue/30 hover:bg-ieee-blue-light transition-colors"
            >
              View AXIS Congress <ArrowRight size={18} />
            </a>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
