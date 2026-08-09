import { getSubmissions } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Contact Submissions" };
export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Contact Submissions</h1>
      <p className="text-body mb-8">Messages sent through the /contact form.</p>

      {submissions.length === 0 ? (
        <p className="text-body">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-xl border border-white/10 bg-surface/50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className="font-semibold text-white">
                  {s.name} <span className="text-body font-normal">· {s.email}</span>
                </p>
                <p className="text-xs text-body">{formatDate(s.receivedAt)}</p>
              </div>
              <p className="text-sm text-ieee-blue-light mb-1">{s.subject}</p>
              <p className="text-sm text-body whitespace-pre-wrap">{s.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
