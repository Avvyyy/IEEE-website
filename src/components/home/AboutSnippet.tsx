import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { SiteConfig } from "@/lib/types";

export function AboutSnippet({ site }: { site: SiteConfig }) {
  return (
    <section className="container-page py-20 sm:py-28">
      <SectionReveal className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Who We Are</h2>
        <p className="text-lg text-body leading-relaxed">{site.aboutSnippet}</p>
        <Link
          href="/about"
          className="mt-8 inline-flex items-center gap-2 text-ieee-blue-light font-semibold hover:text-white transition-colors"
        >
          Read More <ArrowRight size={18} />
        </Link>
      </SectionReveal>
    </section>
  );
}
