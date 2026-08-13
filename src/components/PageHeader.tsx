import { SectionReveal } from "@/components/ui/SectionReveal";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-surface to-deep">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="glow-orb glow-orb-blue h-96 w-96 -top-32 left-1/4 opacity-25 animate-glow-pulse" />
        <div
          className="glow-orb glow-orb-gold h-72 w-72 top-1/2 -right-16 opacity-15 animate-glow-pulse"
          style={{ animationDelay: "-3s" }}
        />
      </div>
      <div className="container-page py-24 sm:py-32 text-center relative">
        <SectionReveal>
          {eyebrow && (
            <p className="text-accent-gold font-semibold tracking-widest uppercase text-sm mb-4">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-6">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl mx-auto text-lg text-body leading-relaxed">
              {description}
            </p>
          )}
        </SectionReveal>
      </div>
    </section>
  );
}
