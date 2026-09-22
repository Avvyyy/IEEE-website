import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CRUD_SECTIONS } from "@/lib/admin-sections";
import {
  dbGetEvents,
  dbGetTeamMembers,
  dbGetNews,
  dbGetPartners,
  dbGetOpportunities,
  dbGetPrograms,
} from "@/lib/db";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [events, team, news, partners, opportunities, programs] =
    await Promise.all([
      dbGetEvents().catch(() => []),
      dbGetTeamMembers().catch(() => []),
      dbGetNews().catch(() => []),
      dbGetPartners().catch(() => []),
      dbGetOpportunities().catch(() => []),
      dbGetPrograms().catch(() => []),
    ]);

  const stats = [
    { label: "Events", value: events.length, href: "/admin/events" },
    { label: "Team Members", value: team.length, href: "/admin/team" },
    { label: "News Items", value: news.length, href: "/admin/news" },
    { label: "Partners", value: partners.length, href: "/admin/partners" },
    { label: "Programs", value: programs.length, href: "/admin/team" },
    {
      label: "Opportunities",
      value: opportunities.length,
      href: "/admin/opportunities",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-body mb-8">Manage IEEE Babcock SB website content.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-white/10 bg-surface/50 p-5 transition-colors hover:border-ieee-blue/50"
          >
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-body">{s.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CRUD_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-xl border border-white/10 bg-surface/50 p-5 transition-colors hover:border-ieee-blue/50"
          >
            <h3 className="font-semibold text-white mb-1 flex items-center justify-between">
              {section.label}
              <ArrowRight
                size={16}
                className="text-body group-hover:text-white transition-colors"
              />
            </h3>
            <p className="text-sm text-body">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
