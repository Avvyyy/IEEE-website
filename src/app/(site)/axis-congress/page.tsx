import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { Calendar, MapPin, Flame, Clock } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { getAxis } from "@/lib/content";
import { CongressRegisterButton } from "@/components/axis/CongressRegisterButton";
import { PaymentStatusBanner } from "@/components/axis/PaymentStatusBanner";

export const metadata: Metadata = {
  title: "AXIS Congress 2026 — Advancing the Future through Innovation",
  description: "AXIS Congress 2026 — IEEE Babcock Student Branch's flagship annual technology congress. November 10–12, 2026 at Babcock University.",
  alternates: { canonical: "/axis-congress" },
};

const SCHEDULE = [
  {
    day: "Tuesday, November 10, 2026",
    theme: "Innovating the Future: Building a Smart Campus",
    subtitle: "The Vision & Connection Day",
    sessions: [
      { time: "9:30 AM – 10:00 AM", title: "Registration & Arrival", venue: "BBS Auditorium A" },
      { time: "10:00 AM – 10:20 AM", title: "Opening Ceremony", venue: "BBS Auditorium A", detail: "Prayer by IEEE BUSB Vice Chair · Welcome address by IEEE BUSB Chair · Remarks by IEEE BUSB Councillor" },
      { time: "10:20 AM – 10:30 AM", title: "Sponsor Brand Introductions", venue: "BBS Auditorium A" },
      { time: "10:30 AM – 11:05 AM", title: "Keynote Seminar — Navigating the Tech Landscape", venue: "BBS Auditorium A", speaker: "Space Point representatives" },
      { time: "11:10 AM – 12:55 PM", title: "Interactive Panel: Nigeria's Next Decade in Technology", venue: "BBS Auditorium A", detail: "Space, AI, and the Infrastructure We Need to Build — a bigger-picture policy/vision conversation" },
      { time: "12:55 PM – 1:10 PM", title: "Networking Mixer & Refreshments", venue: "BBS Auditorium A", detail: "Students meet IEEE student branch leadership and speakers informally." },
      { time: "1:15 PM – 3:00 PM", title: "Inter-Branch Quiz Competition", venue: "BBS Auditorium A", detail: "Short, competitive rounds between invited student branches" },
    ],
  },
  {
    day: "Wednesday, November 11, 2026",
    theme: "IoT for Social Good",
    subtitle: "An Introduction into Embedded Systems and Arduino Technology",
    sessions: [
      { time: "9:30 AM – 10:00 AM", title: "Registration & Arrival", venue: "BBS Auditorium A" },
      { time: "10:00 AM – 10:10 AM", title: "Opening Ceremony", venue: "BBS Auditorium A", detail: "Prayer by IEEE BUSB Vice Chair · Welcome address by IEEE BUSB Treasurer · Remarks by IEEE BUSB Secretary" },
      { time: "10:10 AM – 11:00 AM", title: "Building a Career as an Embedded Systems Engineer", venue: "BBS Auditorium A", speaker: "ETIA Representative", detail: "A talk on getting started in IoT and what the job entails." },
      { time: "11:00 AM – 1:00 PM", title: "Building Session", venue: "BBS C101–C106", detail: "Students build sensors and microcontrollers for environmental sensing, grouped into 5 teams with an IEEE member as director for each. Topics: mini smart-home simulation, air quality monitor + alert, smart attendance system, door/room access logger." },
      { time: "1:00 PM – 3:00 PM", title: "Pitching Session", venue: "BBS C101–C106", detail: "Teams of 2 pitch original IoT ideas to a panel of 2–3 judges, covering importance, target audience, SDG focus, and software/hardware implementation." },
    ],
  },
  {
    day: "Thursday, November 12, 2026",
    theme: "Field Trip",
    subtitle: "",
    sessions: [
      { time: "7:00 AM", title: "Departure", venue: "Off-site", detail: "Only participants who have been selected and registered will be permitted to attend the trip. Field trip attendance requires the optional add-on fee." },
    ],
  },
];

const REGISTRATION_FEES = [
  { category: "Student Member (Babcock, IEEE)", standard: "₦5,000", earlyBird: "₦3,500" },
  { category: "Non-Member (Babcock Student)", standard: "₦7,000", earlyBird: "₦5,500" },
  { category: "Non-Babcock Student", standard: "₦7,000", earlyBird: "₦5,500" },
  { category: "Field Trip Add-on (Day 3)", standard: "+₦4,000", earlyBird: "+₦4,000 (no discount)" },
];

export default async function AxisCongressPage() {
  const axis = await getAxis();

  return (
    <>
      <Suspense fallback={null}>
        <PaymentStatusBanner />
      </Suspense>

      {/* ── Hero ── */}
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
            <p className="text-sm text-white/60 mb-2 italic">
              A.X.I.S. — Advancement, eXploration, Innovation, Skills
            </p>
            <p className="flex items-center gap-2 text-body mb-1">
              <Calendar size={16} /> {axis.date}
            </p>
            <p className="flex items-center gap-2 text-body mb-8">
              <MapPin size={16} /> {axis.venue}
            </p>
            <CongressRegisterButton />
          </SectionReveal>
        </div>
      </section>

      {/* ── About ── */}
      <section className="container-page py-20 max-w-3xl mx-auto text-center">
        <SectionReveal>
          <h2 className="text-3xl font-bold mb-6">About AXIS Congress</h2>
          <p className="text-body text-lg leading-relaxed mb-4">{axis.description}</p>
          <p className="text-body leading-relaxed">
            The theme for 2026 is <strong className="text-white">&ldquo;Advancing the Future through Innovation&rdquo;</strong> —
            three days of keynotes, interactive panels, hands-on workshops, and networking bringing
            together students, industry leaders, and IEEE members from across Region 8.
          </p>
        </SectionReveal>
      </section>

      {/* ── AXIS Ignite pre-congress promo ── */}
      <section className="border-y border-white/10 bg-surface/40">
        <div className="container-page py-14">
          <SectionReveal>
            <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-accent-gold/20 bg-accent-gold/5 p-6 sm:p-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-gold/15">
                <Flame size={28} className="text-accent-gold" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-bold tracking-widest text-accent-gold uppercase mb-1">Pre-Congress Series</p>
                <h3 className="text-xl font-bold text-white mb-1">AXIS Ignite</h3>
                <p className="text-sm text-body leading-relaxed">
                  Four Pillars. Eight Weeks. Get primed for Congress with our exclusive pre-congress
                  webinar series led by industry experts.
                </p>
              </div>
              <a
                href="/axis-congress/ignite"
                className="shrink-0 rounded-full border border-accent-gold/50 px-5 py-2.5 text-sm font-semibold text-accent-gold hover:bg-accent-gold hover:text-deep transition-all duration-200"
              >
                Explore AXIS Ignite →
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 3-Day Programme ── */}
      <section className="container-page py-20">
        <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Programme</h2>
          <p className="text-body leading-relaxed">
            Three days. Three themes. One unforgettable congress.
          </p>
        </SectionReveal>

        <div className="max-w-3xl mx-auto space-y-12">
          {SCHEDULE.map((day, di) => (
            <SectionReveal key={day.day} delay={di * 0.1}>
              <div className="rounded-2xl border border-white/10 bg-surface/60 overflow-hidden">
                {/* Day header */}
                <div className="px-6 py-4 bg-surface-alt border-b border-white/5">
                  <p className="text-xs font-bold tracking-widest text-accent-gold uppercase mb-1">
                    {day.day}
                  </p>
                  <h3 className="text-lg font-bold text-white">{day.theme}</h3>
                  {day.subtitle && (
                    <p className="text-sm text-body/70 mt-0.5">{day.subtitle}</p>
                  )}
                </div>

                {/* Sessions */}
                <div className="divide-y divide-white/5">
                  {day.sessions.map((s, si) => (
                    <div key={si} className="flex gap-4 px-6 py-4">
                      <div className="flex items-start gap-2 w-40 shrink-0">
                        <Clock size={13} className="text-accent-gold mt-0.5 shrink-0" />
                        <p className="text-xs font-semibold text-accent-gold leading-snug">{s.time}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{s.title}</p>
                        {s.speaker && (
                          <p className="text-xs text-body/70 mt-0.5">{s.speaker}</p>
                        )}
                        {s.detail && (
                          <p className="text-xs text-body/60 mt-1 leading-relaxed">{s.detail}</p>
                        )}
                        <p className="text-[11px] text-body/40 mt-1">📍 {s.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ── Registration Fees ── */}
      <section className="border-y border-white/10 bg-surface/40">
        <div className="container-page py-20">
          <SectionReveal className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Registration Fees</h2>
            <p className="text-body leading-relaxed">
              Registration is tiered. Early-bird pricing (₦1,500 off standard rates) applies for a limited window to be announced. Day 1 &amp; 2 are free with registration. Day 3 (Field Trip) requires an optional add-on fee.
            </p>
          </SectionReveal>

          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-surface/60 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 px-6 py-3 bg-surface-alt border-b border-white/5 text-xs font-bold tracking-widest text-body/60 uppercase">
                <div>Category</div>
                <div className="text-center">Standard</div>
                <div className="text-center">Early Bird</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {REGISTRATION_FEES.map((f) => (
                  <div key={f.category} className="grid grid-cols-3 gap-4 px-6 py-4">
                    <p className="text-sm text-white font-medium">{f.category}</p>
                    <p className="text-sm text-body text-center">{f.standard}</p>
                    <p className="text-sm text-accent-gold text-center font-semibold">{f.earlyBird}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-body/50 mt-4 text-center">
              Early-bird discount excludes the Field Trip add-on.
            </p>
          </div>
        </div>
      </section>

      {/* ── Registration CTA band ── */}
      <section className="border-y border-ieee-blue/20 bg-ieee-blue/5">
        <div className="container-page py-16 text-center">
          <SectionReveal className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to join us?</h2>
            <p className="text-body mb-8 leading-relaxed">
              Secure your spot at AXIS Congress 2026. Day 1 &amp; 2 are included with registration. Day 3 (Field Trip) requires a separate ₦4,000 payment — complete it after registration via Paystack.
            </p>
            <CongressRegisterButton />
          </SectionReveal>
        </div>
      </section>

      {/* ── Sponsors ── */}
      <section className="border-y border-white/10 bg-surface/40">
        <div className="container-page py-16">
          <SectionReveal className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Sponsors &amp; Partners</h2>
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

      {/* ── Gallery ── */}
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
