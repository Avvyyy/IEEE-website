import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const site = await getSiteConfig();

  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <section className="container-page py-20 max-w-3xl mx-auto space-y-6 text-body leading-relaxed">
        <p>
          [PLACEHOLDER — replace with a policy reviewed by Babcock University / IEEE guidance
          before launch.] {site.shortName} collects only the information you voluntarily submit
          through this site&apos;s contact and newsletter forms — your name, email address, and
          message content.
        </p>
        <p>
          This information is used solely to respond to inquiries and to send occasional updates
          about branch events and activities. We do not sell or share your information with third
          parties outside of IEEE and Babcock University administration where required.
        </p>
        <p>
          You may request that your data be removed at any time by emailing{" "}
          <a href={`mailto:${site.email}`} className="text-ieee-blue-light hover:underline">
            {site.email}
          </a>
          .
        </p>
      </section>
    </>
  );
}
