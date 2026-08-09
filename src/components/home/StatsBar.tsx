import { SectionReveal } from "@/components/ui/SectionReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { StatItem } from "@/lib/types";

export function StatsBar({ stats }: { stats: StatItem[] }) {
  return (
    <section className="border-y border-white/10 bg-surface/40">
      <div className="container-page py-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <SectionReveal key={stat.id} delay={i * 0.08} className="text-center">
            <p className="text-4xl sm:text-5xl font-bold text-white">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm sm:text-base text-body uppercase tracking-wide">
              {stat.label}
            </p>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
