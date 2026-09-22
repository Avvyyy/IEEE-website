import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getTeamFromDb, getTeamSessionsFromDb } from "@/lib/content";
import { TeamPageClient } from "./TeamPageClient";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the executives and committee leads of IEEE Babcock University Student Branch.",
  alternates: { canonical: "/team" },
};

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: activeSession } = await searchParams;
  const sessions = await getTeamSessionsFromDb();
  const latestSession = sessions[0] ?? "2025/2026";
  const filterSession = activeSession ?? latestSession;

  const team = await getTeamFromDb(filterSession);

  return (
    <>
      <PageHeader
        eyebrow="Our People"
        title="Meet the Team"
        description="The students leading workshops, events, and projects across IEEE Babcock SB."
      />

      <TeamPageClient
        sessions={sessions}
        activeSession={filterSession}
        team={team}
      />
    </>
  );
}
