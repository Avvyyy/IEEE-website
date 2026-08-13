import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const site = await getSiteConfig();

  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Use" />
      <section className="container-page py-20 max-w-3xl mx-auto space-y-6 text-body leading-relaxed">
        <p>
          [PLACEHOLDER — replace with terms reviewed by Babcock University / IEEE guidance before
          launch.] This website is maintained by {site.branchName} for informational purposes.
          Content is provided &quot;as is&quot; without warranty of any kind.
        </p>
        <p>
          Event registrations, project links, and third-party resources referenced on this site
          are subject to the terms of their respective providers (e.g. IEEE vTools, Luma, GitHub).
        </p>
        <p>
          Questions about these terms can be directed to{" "}
          <a href={`mailto:${site.email}`} className="text-ieee-blue-light hover:underline">
            {site.email}
          </a>
          .
        </p>
      </section>
    </>
  );
}
