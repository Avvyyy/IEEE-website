"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { LinkedInGlyph } from "@/components/icons/SocialGlyphs";
import type { TeamMember } from "@/lib/types";

const CATEGORY_ORDER: TeamMember["category"][] = ["Executive", "Technical", "Creative", "Outreach"];

export function TeamPageClient({
  sessions,
  activeSession,
  team,
}: {
  sessions: string[];
  activeSession: string;
  team: TeamMember[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setSession(session: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("session", session);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="container-page py-10">
      {sessions.length > 1 && (
        <div className="flex gap-2 mb-12 justify-center">
          {sessions.map((s) => (
            <button
              key={s}
              onClick={() => setSession(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeSession === s
                  ? "bg-ieee-blue text-white"
                  : "bg-white/5 text-body hover:bg-white/10 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-20">
        {CATEGORY_ORDER.map((category) => {
          const members = team.filter((m) => m.category === category);
          if (members.length === 0) return null;
          return (
            <section key={category}>
              <SectionReveal>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 border-l-4 border-ieee-blue pl-4">
                  {category}
                </h2>
              </SectionReveal>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map((member, i) => (
                  <SectionReveal key={member.id} delay={i * 0.05}>
                    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-semibold">{member.name}</h3>
                        <p className="text-xs text-ieee-blue-light mb-2">{member.role}</p>
                        <p className="text-xs text-body leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-24 overflow-hidden transition-all duration-300">
                          {member.bio}
                        </p>
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on LinkedIn`}
                            className="mt-2 inline-flex text-white/80 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <LinkedInGlyph size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </section>
          );
        })}
        {team.length === 0 && (
          <p className="text-body text-center py-12">No team members for this session.</p>
        )}
      </div>
    </div>
  );
}
