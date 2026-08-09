import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ADMIN_SECTIONS } from "@/lib/admin-sections";
import {
  getEvents,
  getNewsletterSignups,
  getSubmissions,
  getTeam,
} from "@/lib/content";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [events, team, submissions, newsletter] = await Promise.all([
    getEvents(),
    getTeam(),
    getSubmissions(),
    getNewsletterSignups(),
  ]);

  const stats = [
    { label: "Events", value: events.length },
    { label: "Team Members", value: team.length },
    { label: "Contact Submissions", value: submissions.length },
    { label: "Newsletter Signups", value: newsletter.length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-body mb-8">Manage IEEE Babcock SB website content.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-surface/50 p-5">
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-body">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Content Sections</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADMIN_SECTIONS.map((section) => (
          <Link
            key={section.type}
            href={`/admin/content/${section.type}`}
            className="group rounded-xl border border-white/10 bg-surface/50 p-5 transition-colors hover:border-ieee-blue/50"
          >
            <h3 className="font-semibold text-white mb-1 flex items-center justify-between">
              {section.label}
              <ArrowRight size={16} className="text-body group-hover:text-white transition-colors" />
            </h3>
            <p className="text-sm text-body">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
