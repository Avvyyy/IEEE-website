"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Link from "next/link";
import type { DbOpportunity } from "@/lib/db";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { FormField, TextInput, TextArea, Select, Toggle } from "@/components/admin/FormField";
import { Spinner, TableSkeleton } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";

const EMPTY: Omit<DbOpportunity, "id" | "created_at"> = {
  title: "", description: "", type: "", link: "", deadline: "", is_active: true,
};

export default function OpportunitiesPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<DbOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DbOpportunity | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/opportunities");
      if (!res.ok) throw new Error("Failed to load opportunities");
      setItems(await res.json());
    } catch { setError("Failed to load opportunities."); } finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(item: DbOpportunity) { setEditing(item); setForm({ title: item.title, description: item.description ?? "", type: item.type ?? "", link: item.link ?? "", deadline: item.deadline ?? "", is_active: item.is_active }); setModalOpen(true); }

  async function onSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/opportunities/${editing.id}` : "/api/admin/opportunities";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed to save"); }
      setModalOpen(false); toast("success", editing ? "Opportunity updated." : "Opportunity added."); load();
    } catch (e) { toast("error", e instanceof Error ? e.message : "Failed to save"); } finally { setSaving(false); }
  }

  async function onDelete(item: DbOpportunity) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeleting(item.id);
    try {
      const res = await fetch(`/api/admin/opportunities/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast("success", "Opportunity deleted."); load();
    } catch { toast("error", "Failed to delete opportunity."); } finally { setDeleting(null); }
  }

  const columns: Column<DbOpportunity>[] = [
    { key: "title", label: "Title" },
    { key: "type", label: "Type", render: (o) => o.type ? <span className="inline-block rounded-full bg-ieee-blue/15 text-ieee-blue-light px-2 py-0.5 text-xs font-medium capitalize">{o.type}</span> : "—" },
    { key: "deadline", label: "Deadline", render: (o) => o.deadline ? new Date(o.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
    { key: "is_active", label: "Status", render: (o) => o.is_active ? <span className="text-green-400 text-xs font-medium">Active</span> : <span className="text-body/40 text-xs">Inactive</span> },
  ];

  return (
    <div className="max-w-5xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-white mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Opportunities</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-5 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light">
          <Plus size={16} /> Add Opportunity
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-ieee-red/30 bg-ieee-red/10 px-4 py-3 text-sm text-ieee-red flex items-center justify-between">
          <span>{error}</span><button onClick={load} className="text-xs underline hover:text-red-300">Retry</button>
        </div>
      )}

      {loading ? <TableSkeleton rows={4} cols={4} /> : (
        <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={onDelete} emptyMessage="No opportunities yet." />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-xl bg-surface border border-white/10 px-6 py-4 shadow-xl">
            <Spinner size={18} className="text-ieee-blue-light" /><span className="text-sm text-white">Deleting...</span>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Opportunity" : "New Opportunity"}>
        <div className="space-y-4">
          <FormField label="Title" htmlFor="title"><TextInput id="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Opportunity title" required /></FormField>
          <FormField label="Type" htmlFor="type"><Select id="type" value={form.type ?? ""} onChange={(v) => setForm({ ...form, type: v })} options={[{ value: "", label: "Select type..." }, { value: "internship", label: "Internship" }, { value: "competition", label: "Competition" }, { value: "research", label: "Research" }, { value: "scholarship", label: "Scholarship" }, { value: "other", label: "Other" }]} /></FormField>
          <FormField label="Description" htmlFor="description"><TextArea id="description" value={form.description ?? ""} onChange={(v) => setForm({ ...form, description: v })} placeholder="Description or details" /></FormField>
          <FormField label="Link" htmlFor="link"><TextInput id="link" value={form.link ?? ""} onChange={(v) => setForm({ ...form, link: v })} placeholder="https://..." /></FormField>
          <FormField label="Deadline" htmlFor="deadline"><TextInput id="deadline" type="date" value={form.deadline ?? ""} onChange={(v) => setForm({ ...form, deadline: v })} /></FormField>
          <Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Active (visible on public site)" />
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm text-body hover:text-white border border-white/10 hover:border-white/20 transition-colors">Cancel</button>
            <button onClick={onSave} disabled={saving || !form.title}
              className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-6 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light disabled:opacity-60">
              {saving ? <><Spinner size={14} /> Saving...</> : <><Save size={16} /> {editing ? "Update" : "Create"}</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
