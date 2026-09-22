"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Link from "next/link";
import type { DbNews } from "@/lib/db";
import { MAX_FEATURED_NEWS } from "@/lib/db";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { FormField, TextInput, TextArea, Toggle } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Spinner, TableSkeleton } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";

const EMPTY: Omit<DbNews, "id" | "created_at"> = {
  title: "", description: "", image_url: "", is_featured: false, published_at: "",
};

export default function NewsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<DbNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DbNews | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/news");
      if (!res.ok) throw new Error("Failed to load news");
      setItems(await res.json());
    } catch { setError("Failed to load news items."); } finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }

  function openEdit(item: DbNews) {
    setEditing(item);
    setForm({ title: item.title, description: item.description ?? "", image_url: item.image_url ?? "", is_featured: item.is_featured, published_at: item.published_at ?? "" });
    setModalOpen(true);
  }

  async function onSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/news/${editing.id}` : "/api/admin/news";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed to save"); }
      setModalOpen(false); toast("success", editing ? "News updated." : "News created."); load();
    } catch (e) { toast("error", e instanceof Error ? e.message : "Failed to save"); } finally { setSaving(false); }
  }

  async function onDelete(item: DbNews) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeleting(item.id);
    try {
      const res = await fetch(`/api/admin/news/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast("success", "News deleted."); load();
    } catch { toast("error", "Failed to delete news."); } finally { setDeleting(null); }
  }

  const featuredCount = items.filter((n) => n.is_featured).length;

  const columns: Column<DbNews>[] = [
    { key: "title", label: "Title" },
    { key: "published_at", label: "Published", render: (n) => n.published_at ? new Date(n.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
    { key: "is_featured", label: "Featured", render: (n) => n.is_featured ? <span className="text-accent-gold text-xs font-medium">Featured</span> : <span className="text-body/40 text-xs">No</span> },
  ];

  return (
    <div className="max-w-5xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-white mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">News & Highlights</h1>
          <p className="text-sm text-body/60 mt-1">{featuredCount}/{MAX_FEATURED_NEWS} featured slots used</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-5 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light">
          <Plus size={16} /> Add News
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-ieee-red/30 bg-ieee-red/10 px-4 py-3 text-sm text-ieee-red flex items-center justify-between">
          <span>{error}</span><button onClick={load} className="text-xs underline hover:text-red-300">Retry</button>
        </div>
      )}

      {loading ? <TableSkeleton rows={4} cols={3} /> : (
        <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={onDelete} emptyMessage="No news items yet." />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-xl bg-surface border border-white/10 px-6 py-4 shadow-xl">
            <Spinner size={18} className="text-ieee-blue-light" /><span className="text-sm text-white">Deleting...</span>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit News" : "New News Item"}>
        <div className="space-y-4">
          <FormField label="Title" htmlFor="title">
            <TextInput id="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="News headline" required />
          </FormField>
          <FormField label="Description" htmlFor="description">
            <TextArea id="description" value={form.description ?? ""} onChange={(v) => setForm({ ...form, description: v })} placeholder="Summary or full text" />
          </FormField>
          <FormField label="Published Date" htmlFor="published_at">
            <TextInput id="published_at" type="date" value={form.published_at ?? ""} onChange={(v) => setForm({ ...form, published_at: v })} />
          </FormField>
          <FormField label="Image">
            <ImageUpload value={form.image_url ?? ""} onChange={(v) => setForm({ ...form, image_url: v })} />
          </FormField>
          <Toggle checked={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} label={`Featured on homepage (max ${MAX_FEATURED_NEWS})`} />
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
