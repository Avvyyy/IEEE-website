"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { DbPartner } from "@/lib/db";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { FormField, TextInput, Select } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Spinner, TableSkeleton } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";

const EMPTY: Omit<DbPartner, "id" | "created_at"> = {
  name: "", logo_url: "", website_url: "", type: "partner", sort_order: 0,
};

export default function PartnersPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<DbPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DbPartner | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/partners");
      if (!res.ok) throw new Error("Failed to load partners");
      setItems(await res.json());
    } catch { setError("Failed to load partners."); } finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(item: DbPartner) { setEditing(item); setForm({ name: item.name, logo_url: item.logo_url ?? "", website_url: item.website_url ?? "", type: item.type, sort_order: item.sort_order }); setModalOpen(true); }

  async function onSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/partners/${editing.id}` : "/api/admin/partners";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed to save"); }
      setModalOpen(false); toast("success", editing ? "Partner updated." : "Partner added."); load();
    } catch (e) { toast("error", e instanceof Error ? e.message : "Failed to save"); } finally { setSaving(false); }
  }

  async function onDelete(item: DbPartner) {
    if (!confirm(`Remove "${item.name}"?`)) return;
    setDeleting(item.id);
    try {
      const res = await fetch(`/api/admin/partners/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast("success", "Partner removed."); load();
    } catch { toast("error", "Failed to remove partner."); } finally { setDeleting(null); }
  }

  const columns: Column<DbPartner>[] = [
    { key: "logo_url", label: "", render: (p) => p.logo_url ? <Image src={p.logo_url} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-white p-0.5" /> : <div className="w-8 h-8 rounded bg-white/10" /> },
    { key: "name", label: "Name" },
    { key: "type", label: "Type", render: (p) => (
      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${p.type === "sponsor" ? "bg-accent-gold/15 text-accent-gold" : "bg-ieee-blue/15 text-ieee-blue-light"}`}>{p.type}</span>
    )},
    { key: "sort_order", label: "Order" },
  ];

  return (
    <div className="max-w-5xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-white mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Partners & Sponsors</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-5 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light">
          <Plus size={16} /> Add Partner
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-ieee-red/30 bg-ieee-red/10 px-4 py-3 text-sm text-ieee-red flex items-center justify-between">
          <span>{error}</span><button onClick={load} className="text-xs underline hover:text-red-300">Retry</button>
        </div>
      )}

      {loading ? <TableSkeleton rows={4} cols={4} /> : (
        <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={onDelete} emptyMessage="No partners yet." />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-xl bg-surface border border-white/10 px-6 py-4 shadow-xl">
            <Spinner size={18} className="text-ieee-blue-light" /><span className="text-sm text-white">Removing...</span>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Partner" : "Add Partner"}>
        <div className="space-y-4">
          <FormField label="Name" htmlFor="name"><TextInput id="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Organization name" required /></FormField>
          <FormField label="Type" htmlFor="type"><Select id="type" value={form.type} onChange={(v) => setForm({ ...form, type: v as "partner" | "sponsor" })} options={[{ value: "partner", label: "Partner" }, { value: "sponsor", label: "Sponsor" }]} /></FormField>
          <FormField label="Website URL" htmlFor="website_url"><TextInput id="website_url" value={form.website_url ?? ""} onChange={(v) => setForm({ ...form, website_url: v })} placeholder="https://..." /></FormField>
          <FormField label="Logo"><ImageUpload value={form.logo_url ?? ""} onChange={(v) => setForm({ ...form, logo_url: v })} label="Logo" /></FormField>
          <FormField label="Sort Order" htmlFor="sort_order"><TextInput id="sort_order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} /></FormField>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm text-body hover:text-white border border-white/10 hover:border-white/20 transition-colors">Cancel</button>
            <button onClick={onSave} disabled={saving || !form.name}
              className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-6 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light disabled:opacity-60">
              {saving ? <><Spinner size={14} /> Saving...</> : <><Save size={16} /> {editing ? "Update" : "Create"}</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
