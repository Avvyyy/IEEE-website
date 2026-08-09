import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

export function LatestNews({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null;

  return (
    <section className="container-page py-20 sm:py-28">
      <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Latest News & Highlights</h2>
        <p className="text-body text-lg">Updates from the branch and our members.</p>
      </SectionReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 3).map((item, i) => (
          <SectionReveal key={item.id} delay={i * 0.08}>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
              <Card className="h-full flex flex-col p-0 overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-body mb-2">{formatDate(item.date)}</p>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-start gap-1.5">
                    {item.title}
                    <ArrowUpRight size={16} className="mt-1 shrink-0 text-ieee-blue-light" />
                  </h3>
                  <p className="text-sm text-body leading-relaxed line-clamp-3">{item.excerpt}</p>
                </div>
              </Card>
            </a>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
