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
      <div className="container-page py-24 sm:py-32 text-center">
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
