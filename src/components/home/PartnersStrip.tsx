import Image from "next/image";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Marquee } from "@/components/ui/Marquee";
import type { Partner } from "@/lib/types";

export function PartnersStrip({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <section className="py-16 border-y border-white/10 bg-surface/30">
      <SectionReveal className="container-page text-center mb-8">
        <p className="text-sm uppercase tracking-widest text-body">
          In Partnership With
        </p>
      </SectionReveal>
      <Marquee>
        {partners.map((partner) => (
          <div key={partner.id} className="flex h-16 w-40 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            <Image
              src={partner.logo}
              alt={partner.name}
              width={140}
              height={64}
              className="max-h-16 w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
