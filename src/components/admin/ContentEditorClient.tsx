"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { JsonField, type JsonValue } from "@/components/admin/JsonEditor";

export function ContentEditorClient({
  type,
  label,
  initialData,
}: {
  type: string;
  label: string;
  initialData: JsonValue;
}) {
  const [data, setData] = useState<JsonValue>(initialData);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSave() {
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/admin/content/${type}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to save");
    }
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-white mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{label}</h1>
        <button
          onClick={onSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-6 py-2.5 font-semibold text-white transition-colors hover:bg-ieee-blue-light disabled:opacity-60"
        >
          <Save size={16} />
          {status === "saving" ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {status === "saved" && (
        <p className="mb-6 rounded-lg bg-accent-gold/10 border border-accent-gold/30 px-4 py-2.5 text-sm text-accent-gold">
          Saved successfully.
        </p>
      )}
      {status === "error" && (
        <p className="mb-6 rounded-lg bg-ieee-red/10 border border-ieee-red/30 px-4 py-2.5 text-sm text-ieee-red">
          {errorMsg}
        </p>
      )}

      <JsonField value={data} onChange={setData} />
    </div>
  );
}
