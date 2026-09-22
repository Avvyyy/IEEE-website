import type { Metadata } from "next";
import { Briefcase, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { getOpportunitiesFromDb } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Internships, competitions, research opportunities, and more for IEEE Babcock SB members.",
  alternates: { canonical: "/opportunities" },
};

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunitiesFromDb();
  const active = opportunities.filter((o) => o.is_active);

  return (
    <>
      <PageHeader
        eyebrow="Opportunities"
        title="Grow Your Career"
        description="Internships, competitions, research openings, and scholarships curated for IEEE Babcock SB members."
      />

      <section className="container-page py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((opp, i) => (
            <SectionReveal key={opp.id} delay={i * 0.06}>
              <Card className="h-full flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ieee-blue/15">
                    <Briefcase size={20} className="text-ieee-blue-light" />
                  </div>
                  <div>
                    {opp.type && (
                      <span className="inline-block rounded-full bg-ieee-blue/15 text-ieee-blue-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1">
                        {opp.type}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-white">{opp.title}</h3>
                  </div>
                </div>

                {opp.description && (
                  <p className="text-sm text-body leading-relaxed mb-4 flex-1">
                    {opp.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-body/60 mt-auto pt-4 border-t border-white/5">
                  {opp.deadline && (
                    <span>Deadline: {formatDate(opp.deadline)}</span>
                  )}
                  {opp.link && (
                    <a
                      href={opp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-ieee-blue-light hover:text-white transition-colors font-medium"
                    >
                      Apply <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </Card>
            </SectionReveal>
          ))}
          {active.length === 0 && (
            <p className="text-body col-span-full text-center py-12">
              No opportunities available right now — check back soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
