"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { DbTeamMember } from "@/lib/db";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { FormField, TextInput, TextArea } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Spinner, TableSkeleton } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";

const EMPTY: Omit<DbTeamMember, "id" | "created_at"> = {
  name: "", title: "", bio: "", image_url: "", linkedin: "", session: "", sort_order: 0,
};

export default function TeamPage() {
  const { toast } = useToast();
  const [members, setMembers] = useState<DbTeamMember[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterSession, setFilterSession] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DbTeamMember | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/team/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        if (data.length > 0 && !filterSession) setFilterSession(data[0]);
      }
    } catch { /* ignore */ }
  }, [filterSession]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = filterSession ? `?session=${encodeURIComponent(filterSession)}` : "";
      const res = await fetch(`/api/admin/team${params}`);
      if (!res.ok) throw new Error("Failed to load team");
      setMembers(await res.json());
    } catch { setError("Failed to load team members."); } finally { setLoading(false); }
  }, [filterSession]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadSessions(); }, [loadSessions]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm({ ...EMPTY, session: filterSession }); setModalOpen(true); }

  function openEdit(m: DbTeamMember) {
    setEditing(m);
    setForm({ name: m.name, title: m.title, bio: m.bio ?? "", image_url: m.image_url ?? "", linkedin: m.linkedin ?? "", session: m.session, sort_order: m.sort_order });
    setModalOpen(true);
  }

  async function onSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/team/${editing.id}` : "/api/admin/team";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed to save"); }
      setModalOpen(false);
      toast("success", editing ? "Member updated." : "Member added.");
      loadSessions();
      load();
    } catch (e) { toast("error", e instanceof Error ? e.message : "Failed to save"); } finally { setSaving(false); }
  }

  async function onDelete(m: DbTeamMember) {
    if (!confirm(`Remove "${m.name}"?`)) return;
    setDeleting(m.id);
    try {
      const res = await fetch(`/api/admin/team/${m.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast("success", "Member removed.");
      loadSessions();
      load();
    } catch { toast("error", "Failed to remove member."); } finally { setDeleting(null); }
  }

  const columns: Column<DbTeamMember>[] = [
    { key: "image_url", label: "", render: (m) => m.image_url ? <Image src={m.image_url} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-white/10" /> },
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "sort_order", label: "Order" },
  ];

  return (
    <div className="max-w-5xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-white mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Core Team</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-5 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {sessions.length > 0 && (
        <div className="flex gap-2 mb-6">
          {sessions.map((s) => (
            <button key={s} onClick={() => setFilterSession(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterSession === s ? "bg-ieee-blue text-white" : "bg-white/5 text-body hover:bg-white/10"}`}>
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-ieee-red/30 bg-ieee-red/10 px-4 py-3 text-sm text-ieee-red flex items-center justify-between">
          <span>{error}</span>
          <button onClick={load} className="text-xs underline hover:text-red-300">Retry</button>
        </div>
      )}

      {loading ? <TableSkeleton rows={5} cols={4} /> : (
        <DataTable columns={columns} data={members} onEdit={openEdit} onDelete={onDelete} emptyMessage="No team members for this session." />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-xl bg-surface border border-white/10 px-6 py-4 shadow-xl">
            <Spinner size={18} className="text-ieee-blue-light" />
            <span className="text-sm text-white">Removing member...</span>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Member" : "Add Member"}>
        <div className="space-y-4">
          <FormField label="Name" htmlFor="name">
            <TextInput id="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Full name" required />
          </FormField>
          <FormField label="Title / Role" htmlFor="title">
            <TextInput id="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Chair, Vice Chair" required />
          </FormField>
          <FormField label="Academic Session" htmlFor="session" hint="Enter any session — it will appear in the filter once members exist for it.">
            <TextInput id="session" value={form.session} onChange={(v) => setForm({ ...form, session: v })} placeholder="e.g. 2025/2026" />
          </FormField>
          <FormField label="Bio" htmlFor="bio">
            <TextArea id="bio" value={form.bio ?? ""} onChange={(v) => setForm({ ...form, bio: v })} placeholder="Short bio" />
          </FormField>
          <FormField label="LinkedIn URL" htmlFor="linkedin">
            <TextInput id="linkedin" value={form.linkedin ?? ""} onChange={(v) => setForm({ ...form, linkedin: v })} placeholder="https://linkedin.com/in/..." />
          </FormField>
          <FormField label="Photo">
            <ImageUpload value={form.image_url ?? ""} onChange={(v) => setForm({ ...form, image_url: v })} />
          </FormField>
          <FormField label="Sort Order" htmlFor="sort_order">
            <TextInput id="sort_order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} />
          </FormField>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm text-body hover:text-white border border-white/10 hover:border-white/20 transition-colors">Cancel</button>
            <button onClick={onSave} disabled={saving || !form.name || !form.title}
              className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-6 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light disabled:opacity-60">
              {saving ? <><Spinner size={14} /> Saving...</> : <><Save size={16} /> {editing ? "Update" : "Create"}</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
