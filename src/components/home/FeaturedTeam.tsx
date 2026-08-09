import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { LinkedInGlyph } from "@/components/icons/SocialGlyphs";
import type { TeamMember } from "@/lib/types";

export function FeaturedTeam({ team }: { team: TeamMember[] }) {
  const featured = team.filter((m) => m.featured).slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <section className="container-page py-20 sm:py-28">
      <SectionReveal className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Meet the Executives</h2>
        <p className="text-body text-lg">The team leading IEEE Babcock SB this term.</p>
      </SectionReveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((member, i) => (
          <SectionReveal key={member.id} delay={i * 0.08} className="group text-center">
            <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="text-white font-semibold">{member.name}</h3>
            <p className="text-sm text-ieee-blue-light">{member.role}</p>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="mt-2 inline-flex text-body hover:text-white transition-colors"
              >
                <LinkedInGlyph size={16} />
              </a>
            )}
          </SectionReveal>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition-all hover:border-white hover:bg-white/5"
        >
          Meet the Team <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
