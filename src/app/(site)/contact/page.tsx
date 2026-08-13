import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/contact/ContactForm";
import { InstagramGlyph, LinkedInGlyph, XGlyph } from "@/components/icons/SocialGlyphs";
import { getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with IEEE Babcock University Student Branch.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const site = await getSiteConfig();

  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Questions about membership, events, or partnerships? Send us a message."
      />

      <section className="container-page py-20 grid lg:grid-cols-[1fr_1.4fr] gap-10">
        <SectionReveal>
          <Card className="h-full flex flex-col gap-6">
            <div>
              <p className="flex items-center gap-2 text-sm uppercase tracking-widest text-body mb-2">
                <Mail size={16} /> Email
              </p>
              <a href={`mailto:${site.email}`} className="text-white hover:text-ieee-blue-light transition-colors">
                {site.email}
              </a>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm uppercase tracking-widest text-body mb-2">
                <MapPin size={16} /> Location
              </p>
              <p className="text-white">{site.location}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-body mb-3">Follow Us</p>
              <div className="flex items-center gap-4">
                <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-body hover:text-white transition-colors">
                  <LinkedInGlyph size={22} />
                </a>
                <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-body hover:text-white transition-colors">
                  <InstagramGlyph size={22} />
                </a>
                <a href={site.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="text-body hover:text-white transition-colors">
                  <XGlyph size={22} />
                </a>
              </div>
            </div>
            <div className="mt-auto overflow-hidden rounded-xl border border-white/10">
              <iframe
                title="IEEE Babcock SB location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(site.location)}&z=14&output=embed`}
                className="h-48 w-full grayscale contrast-125 invert-[0.92]"
                loading="lazy"
              />
            </div>
          </Card>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <Card>
            <ContactForm />
          </Card>
        </SectionReveal>
      </section>
    </>
  );
}
