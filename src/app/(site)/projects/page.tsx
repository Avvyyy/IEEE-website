import type { Metadata } from "next";
import Image from "next/image";
import { Globe } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { GithubGlyph } from "@/components/icons/SocialGlyphs";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Technical projects built by IEEE Babcock University Student Branch members, including GhostCipher AI.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="Projects"
        description="Technical projects built by branch members — from AI research to embedded systems."
      />

      <section className="container-page py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <SectionReveal key={project.id} delay={i * 0.06}>
              <Card className="h-full flex flex-col p-0 overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={project.image} alt={project.title} fill className="object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{project.title}</h3>
                  <p className="text-xs text-ieee-blue-light mb-3">{project.team}</p>
                  <p className="text-sm text-body leading-relaxed mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-body"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-auto">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-white transition-colors"
                      >
                        <GithubGlyph size={16} /> GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ieee-blue-light hover:text-white transition-colors"
                      >
                        <Globe size={16} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </SectionReveal>
          ))}
        </div>
      </section>
    </>
  );
}
