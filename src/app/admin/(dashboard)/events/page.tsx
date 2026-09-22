"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Link from "next/link";
import type { DbEvent } from "@/lib/db";
import { computeStatus } from "@/lib/db";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { FormField, TextInput, TextArea, Toggle } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Spinner } from "@/components/admin/Skeleton";
import { TableSkeleton } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";

const EMPTY: Omit<DbEvent, "id" | "created_at"> = {
  title: "",
  start_date: "",
  end_date: "",
  event_time: "",
  duration: "",
  description: "",
  image_url: "",
  location: "",
  registration_url: "",
  vtools_url: "",
  featured: false,
};

export default function EventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DbEvent | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error("Failed to load events");
      setEvents(await res.json());
    } catch {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }

  function openEdit(e: DbEvent) {
    setEditing(e);
    setForm({
      title: e.title, start_date: e.start_date, end_date: e.end_date ?? "",
      event_time: e.event_time ?? "", duration: e.duration ?? "",
      description: e.description ?? "", image_url: e.image_url ?? "",
      location: e.location ?? "", registration_url: e.registration_url ?? "",
      vtools_url: e.vtools_url ?? "", featured: e.featured,
    });
    setModalOpen(true);
  }

  async function onSave() {
    setSaving(true);
    try {
      const payload = { ...form, status: computeStatus({ ...form, id: "", created_at: "" } as DbEvent) };
      const url = editing ? `/api/admin/events/${editing.id}` : "/api/admin/events";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed to save"); }
      setModalOpen(false);
      toast("success", editing ? "Event updated." : "Event created.");
      load();
    } catch (e) { toast("error", e instanceof Error ? e.message : "Failed to save"); } finally { setSaving(false); }
  }

  async function onDelete(e: DbEvent) {
    if (!confirm(`Delete "${e.title}"?`)) return;
    setDeleting(e.id);
    try {
      const res = await fetch(`/api/admin/events/${e.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast("success", "Event deleted.");
      load();
    } catch { toast("error", "Failed to delete event."); } finally { setDeleting(null); }
  }

  const columns: Column<DbEvent>[] = [
    { key: "title", label: "Title" },
    { key: "start_date", label: "Date", render: (e) => new Date(e.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
    { key: "location", label: "Location" },
    { key: "status", label: "Status", render: (e) => (
      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${computeStatus(e) === "upcoming" ? "bg-green-500/15 text-green-400" : "bg-white/10 text-body/60"}`}>
        {computeStatus(e)}
      </span>
    )},
    { key: "featured", label: "Featured", render: (e) => e.featured ? <span className="text-accent-gold text-xs font-medium">Yes</span> : <span className="text-body/40 text-xs">No</span> },
  ];

  return (
    <div className="max-w-5xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-white mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Events</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-5 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-ieee-red/30 bg-ieee-red/10 px-4 py-3 text-sm text-ieee-red flex items-center justify-between">
          <span>{error}</span>
          <button onClick={load} className="text-xs underline hover:text-red-300">Retry</button>
        </div>
      )}

      {loading ? <TableSkeleton rows={5} cols={5} /> : (
        <DataTable columns={columns} data={events} onEdit={openEdit} onDelete={onDelete}
          emptyMessage="No events yet. Create your first event." />
      )}

      {events.some((e) => deleting === e.id) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-xl bg-surface border border-white/10 px-6 py-4 shadow-xl">
            <Spinner size={18} className="text-ieee-blue-light" />
            <span className="text-sm text-white">Deleting...</span>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Event" : "New Event"}>
        <div className="space-y-4">
          <FormField label="Title" htmlFor="title">
            <TextInput id="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Event title" required />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" htmlFor="start_date">
              <TextInput id="start_date" type="date" value={form.start_date} onChange={(v) => setForm({ ...form, start_date: v })} required />
            </FormField>
            <FormField label="End Date" htmlFor="end_date">
              <TextInput id="end_date" type="date" value={form.end_date ?? ""} onChange={(v) => setForm({ ...form, end_date: v })} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Time" htmlFor="event_time">
              <TextInput id="event_time" value={form.event_time ?? ""} onChange={(v) => setForm({ ...form, event_time: v })} placeholder="e.g. 10:00 AM" />
            </FormField>
            <FormField label="Duration" htmlFor="duration">
              <TextInput id="duration" value={form.duration ?? ""} onChange={(v) => setForm({ ...form, duration: v })} placeholder="e.g. 3 hours" />
            </FormField>
          </div>
          <FormField label="Location" htmlFor="location">
            <TextInput id="location" value={form.location ?? ""} onChange={(v) => setForm({ ...form, location: v })} placeholder="Venue or online" />
          </FormField>
          <FormField label="Description" htmlFor="description">
            <TextArea id="description" value={form.description ?? ""} onChange={(v) => setForm({ ...form, description: v })} placeholder="Event description" />
          </FormField>
          <FormField label="Registration URL" htmlFor="registration_url">
            <TextInput id="registration_url" value={form.registration_url ?? ""} onChange={(v) => setForm({ ...form, registration_url: v })} placeholder="https://..." />
          </FormField>
          <FormField label="Image">
            <ImageUpload value={form.image_url ?? ""} onChange={(v) => setForm({ ...form, image_url: v })} />
          </FormField>
          <Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Featured on homepage" />
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm text-body hover:text-white border border-white/10 hover:border-white/20 transition-colors">Cancel</button>
            <button onClick={onSave} disabled={saving || !form.title || !form.start_date}
              className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-6 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light disabled:opacity-60">
              {saving ? <><Spinner size={14} /> Saving...</> : <><Save size={16} /> {editing ? "Update" : "Create"}</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
