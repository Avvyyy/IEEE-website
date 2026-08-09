import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { DynamicIcon } from "@/components/IconMap";
import type { Pillar } from "@/lib/types";

export function Pillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <section className="container-page py-20 sm:py-28">
      <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Focus Areas</h2>
        <p className="text-body text-lg">
          Technical pillars that shape our workshops, projects, and events.
        </p>
      </SectionReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, i) => (
          <SectionReveal key={pillar.id} delay={i * 0.08}>
            <Card className="h-full">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ieee-blue/15 text-ieee-blue-light">
                <DynamicIcon name={pillar.icon} size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{pillar.title}</h3>
              <p className="text-sm text-body leading-relaxed">{pillar.description}</p>
            </Card>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
