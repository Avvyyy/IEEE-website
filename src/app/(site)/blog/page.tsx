import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { getNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog & News",
  description: "Technical articles, event recaps, and updates from IEEE Babcock University Student Branch.",
};

export default async function BlogPage() {
  const posts = await getNews();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="News & Articles"
        description="Recaps, technical write-ups, and updates from the branch — with links out to our Medium and LinkedIn pages."
      />

      <section className="container-page py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <SectionReveal key={post.id} delay={i * 0.06}>
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <Card className="h-full flex flex-col p-0 overflow-hidden">
                  <div className="relative h-44 w-full">
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-body mb-2">{formatDate(post.date)}</p>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-start gap-1.5">
                      {post.title}
                      <ArrowUpRight size={16} className="mt-1 shrink-0 text-ieee-blue-light" />
                    </h3>
                    <p className="text-sm text-body leading-relaxed">{post.excerpt}</p>
                  </div>
                </Card>
              </a>
            </SectionReveal>
          ))}
          {posts.length === 0 && (
            <p className="text-body col-span-full text-center py-12">No articles published yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
