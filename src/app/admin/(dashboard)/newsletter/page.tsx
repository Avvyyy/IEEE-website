import { getNewsletterSignups } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Newsletter Signups" };
export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const signups = await getNewsletterSignups();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Newsletter Signups</h1>
      <p className="text-body mb-8">Emails collected from the homepage newsletter form.</p>

      {signups.length === 0 ? (
        <p className="text-body">No signups yet.</p>
      ) : (
        <div className="rounded-xl border border-white/10 bg-surface/50 divide-y divide-white/10">
          {signups.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3">
              <p className="text-white">{s.email}</p>
              <p className="text-xs text-body">{formatDate(s.receivedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
