import type { Metadata } from "next";
import Image from "next/image";
import { Award, Target, Eye, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { getAbout, getSiteConfig, getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about IEEE Babcock University Student Branch — our history, mission, vision, and leadership.",
};

export default async function AboutPage() {
  const [about, site, team] = await Promise.all([getAbout(), getSiteConfig(), getTeam()]);

  const executives = team.filter((m) => m.category === "Executive");
  const leads = team.filter((m) => m.category !== "Executive");

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title={site.branchName}
        description={`Chartered in ${site.founded} · ${site.region}`}
      />

      <section className="container-page py-20 grid md:grid-cols-2 gap-12">
        <SectionReveal>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our History</h2>
          <p className="text-body leading-relaxed">{about.history}</p>
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">What is IEEE?</h2>
          <p className="text-body leading-relaxed">{about.ieeeContext}</p>
        </SectionReveal>
      </section>

      <section className="border-y border-white/10 bg-surface/40">
        <div className="container-page py-20 grid sm:grid-cols-3 gap-6">
          <SectionReveal>
            <Card className="h-full">
              <Target className="text-ieee-blue-light mb-4" size={28} />
              <h3 className="text-xl font-semibold text-white mb-2">Mission</h3>
              <p className="text-sm text-body leading-relaxed">{about.mission}</p>
            </Card>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <Card className="h-full">
              <Eye className="text-ieee-blue-light mb-4" size={28} />
              <h3 className="text-xl font-semibold text-white mb-2">Vision</h3>
              <p className="text-sm text-body leading-relaxed">{about.vision}</p>
            </Card>
          </SectionReveal>
          <SectionReveal delay={0.16}>
            <Card className="h-full">
              <Users className="text-ieee-blue-light mb-4" size={28} />
              <h3 className="text-xl font-semibold text-white mb-2">Values</h3>
              <ul className="text-sm text-body space-y-1">
                {about.values.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </Card>
          </SectionReveal>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Leadership Structure</h2>
          <p className="text-body text-lg">How the branch is organized.</p>
        </SectionReveal>

        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-4">
            {executives.map((exec) => (
              <div
                key={exec.id}
                className="rounded-xl border border-ieee-blue/40 bg-ieee-blue/10 px-6 py-3 text-center"
              >
                <p className="text-white font-semibold">{exec.name}</p>
                <p className="text-xs text-ieee-blue-light">{exec.role}</p>
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="flex flex-wrap justify-center gap-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-xl border border-white/10 bg-surface px-6 py-3 text-center"
              >
                <p className="text-white font-semibold">{lead.name}</p>
                <p className="text-xs text-body">{lead.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface/40">
        <div className="container-page py-20 grid sm:grid-cols-[auto_1fr] gap-8 items-center max-w-3xl mx-auto">
          <SectionReveal>
            <div className="relative h-32 w-32 rounded-2xl overflow-hidden border border-white/10 mx-auto">
              <Image src={about.advisor.photo} alt={about.advisor.name} fill className="object-cover" />
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="text-sm uppercase tracking-widest text-accent-gold mb-2">
              Faculty Counselor
            </p>
            <h3 className="text-2xl font-bold text-white mb-1">{about.advisor.name}</h3>
            <p className="text-ieee-blue-light mb-3">{about.advisor.title}</p>
            <p className="text-body leading-relaxed">{about.advisor.bio}</p>
          </SectionReveal>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Awards & Recognition</h2>
        </SectionReveal>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {about.awards.map((award, i) => (
            <SectionReveal key={award.id} delay={i * 0.08}>
              <Card className="h-full flex gap-4">
                <Award className="text-accent-gold shrink-0" size={28} />
                <div>
                  <h3 className="text-white font-semibold">{award.title}</h3>
                  <p className="text-xs text-body mb-2">{award.year}</p>
                  <p className="text-sm text-body leading-relaxed">{award.description}</p>
                </div>
              </Card>
            </SectionReveal>
          ))}
        </div>
      </section>
    </>
  );
}
