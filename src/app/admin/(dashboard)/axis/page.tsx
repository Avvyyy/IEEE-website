"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import type { DbAxisCongress, DbAxisIgnite } from "@/lib/db";
import { Modal } from "@/components/admin/Modal";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormField, TextInput, TextArea } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Spinner, TableSkeleton } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";

interface CongressDay {
  label: string;
  date: string;
  time: string;
  venue: string;
}

export default function AxisPage() {
  const { toast } = useToast();
  const [congress, setCongress] = useState<DbAxisCongress | null>(null);
  const [ignite, setIgnite] = useState<DbAxisIgnite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [congressForm, setCongressForm] = useState({
    edition: "",
    theme: "",
    event_date: "",
    end_date: "",
    event_time: "",
    location: "",
    description: "",
    banner_url: "",
    flier_url: "",
    registration_url: "",
    days: [] as CongressDay[],
  });
  const [igniteModalOpen, setIgniteModalOpen] = useState(false);
  const [editingIgnite, setEditingIgnite] = useState<DbAxisIgnite | null>(null);
  const [igniteForm, setIgniteForm] = useState({ week_number: 0, title: "", event_date: "", event_time: "", speaker: "", speaker_title: "", description: "", meet_link: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [cRes, iRes] = await Promise.all([fetch("/api/admin/axis"), fetch("/api/admin/axis/ignite")]);
      if (!cRes.ok || !iRes.ok) throw new Error("Failed to load");
      const cData = await cRes.json();
      setCongress(cData);
      if (cData) setCongressForm({
        edition: cData.edition ?? "",
        theme: cData.theme ?? "",
        event_date: cData.event_date ?? "",
        end_date: cData.end_date ?? "",
        event_time: cData.event_time ?? "",
        location: cData.location ?? "",
        description: cData.description ?? "",
        banner_url: cData.banner_url ?? "",
        flier_url: cData.flier_url ?? "",
        registration_url: cData.registration_url ?? "",
        days: (cData.days ?? []).map((d: CongressDay) => ({ label: d.label ?? "", date: d.date ?? "", time: d.time ?? "", venue: d.venue ?? "" })),
      });
      setIgnite(await iRes.json());
    } catch { setError("Failed to load AXIS data."); } finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  async function saveCongress() {
    setSaving(true);
    try {
      const payload = congress ? { ...congressForm, id: congress.id } : congressForm;
      const res = await fetch("/api/admin/axis", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed to save"); }
      toast("success", "Congress details saved."); load();
    } catch (e) { toast("error", e instanceof Error ? e.message : "Failed to save"); } finally { setSaving(false); }
  }

  function addDay() {
    const n = congressForm.days.length + 1;
    setCongressForm({
      ...congressForm,
      days: [...congressForm.days, { label: `Day ${n}`, date: "", time: "", venue: "" }],
    });
  }

  function updateDay(idx: number, field: keyof CongressDay, value: string) {
    const updated = congressForm.days.map((d, i) => (i === idx ? { ...d, [field]: value } : d));
    setCongressForm({ ...congressForm, days: updated });
  }

  function removeDay(idx: number) {
    setCongressForm({ ...congressForm, days: congressForm.days.filter((_, i) => i !== idx) });
  }

  function openCreateIgnite() { setEditingIgnite(null); setIgniteForm({ week_number: 0, title: "", event_date: "", event_time: "", speaker: "", speaker_title: "", description: "", meet_link: "" }); setIgniteModalOpen(true); }

  function openEditIgnite(item: DbAxisIgnite) {
    setEditingIgnite(item);
    setIgniteForm({ week_number: item.week_number ?? 0, title: item.title, event_date: item.event_date ?? "", event_time: item.event_time ?? "", speaker: item.speaker ?? "", speaker_title: item.speaker_title ?? "", description: item.description ?? "", meet_link: item.meet_link ?? "" });
    setIgniteModalOpen(true);
  }

  async function saveIgnite() {
    setSaving(true);
    try {
      const payload = { ...igniteForm, congress_id: congress?.id ?? "" };
      const url = editingIgnite ? `/api/admin/axis/ignite/${editingIgnite.id}` : "/api/admin/axis/ignite";
      const res = await fetch(url, { method: editingIgnite ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed to save"); }
      setIgniteModalOpen(false); toast("success", editingIgnite ? "Webinar updated." : "Webinar added."); load();
    } catch (e) { toast("error", e instanceof Error ? e.message : "Failed to save"); } finally { setSaving(false); }
  }

  async function deleteIgnite(item: DbAxisIgnite) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeleting(item.id);
    try {
      const res = await fetch(`/api/admin/axis/ignite/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast("success", "Webinar deleted."); load();
    } catch { toast("error", "Failed to delete webinar."); } finally { setDeleting(null); }
  }

  const igniteColumns: Column<DbAxisIgnite>[] = [
    { key: "week_number", label: "Week" }, { key: "title", label: "Title" }, { key: "speaker", label: "Speaker" },
    { key: "event_date", label: "Date", render: (i) => i.event_date ? new Date(i.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—" },
  ];

  if (loading) return <div className="max-w-5xl"><TableSkeleton rows={3} cols={4} /></div>;

  return (
    <div className="max-w-5xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-body hover:text-white mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-8">AXIS Congress</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-ieee-red/30 bg-ieee-red/10 px-4 py-3 text-sm text-ieee-red flex items-center justify-between">
          <span>{error}</span><button onClick={load} className="text-xs underline hover:text-red-300">Retry</button>
        </div>
      )}

      <section className="rounded-xl border border-white/10 bg-surface/50 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Congress Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Edition" htmlFor="edition"><TextInput id="edition" value={congressForm.edition} onChange={(v) => setCongressForm({ ...congressForm, edition: v })} placeholder="e.g. 2026" /></FormField>
            <FormField label="Theme" htmlFor="theme"><TextInput id="theme" value={congressForm.theme} onChange={(v) => setCongressForm({ ...congressForm, theme: v })} placeholder="Congress theme" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" htmlFor="event_date"><TextInput id="event_date" type="date" value={congressForm.event_date} onChange={(v) => setCongressForm({ ...congressForm, event_date: v })} /></FormField>
            <FormField label="End Date" htmlFor="end_date"><TextInput id="end_date" type="date" value={congressForm.end_date} onChange={(v) => setCongressForm({ ...congressForm, end_date: v })} /></FormField>
          </div>
          <FormField label="Registration URL" htmlFor="registration_url"><TextInput id="registration_url" value={congressForm.registration_url} onChange={(v) => setCongressForm({ ...congressForm, registration_url: v })} placeholder="https://..." /></FormField>
          <FormField label="Description" htmlFor="description"><TextArea id="description" value={congressForm.description} onChange={(v) => setCongressForm({ ...congressForm, description: v })} /></FormField>

          {/* Banner */}
          <FormField label="Banner Image" hint="Shown in the hero section on the public page.">
            <ImageUpload value={congressForm.banner_url} onChange={(v) => setCongressForm({ ...congressForm, banner_url: v })} label="Banner" />
          </FormField>

          {/* Flier */}
          <FormField label="Event Flier" hint="Optional downloadable/viewable event flier.">
            <ImageUpload value={congressForm.flier_url} onChange={(v) => setCongressForm({ ...congressForm, flier_url: v })} label="Flier" />
          </FormField>

          {/* 3-Day Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Event Timeline (3-Day Schedule)</h3>
              <button type="button" onClick={addDay}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-body hover:text-white hover:bg-white/10 transition-colors">
                <Plus size={12} /> Add Day
              </button>
            </div>
            {congressForm.days.length === 0 && (
              <p className="text-xs text-body/50 border border-dashed border-white/10 rounded-xl p-4 text-center">No days added yet. Click &quot;Add Day&quot; to build the timeline.</p>
            )}
            <div className="space-y-3">
              {congressForm.days.map((day, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-white/10 bg-deep/50 p-4">
                  <div className="flex-1 space-y-2">
                    <TextInput value={day.label} onChange={(v) => updateDay(idx, "label", v)} placeholder="e.g. Day 1, Day 2, Day 3" />
                    <div className="grid grid-cols-3 gap-2">
                      <TextInput type="date" value={day.date} onChange={(v) => updateDay(idx, "date", v)} />
                      <TextInput value={day.time} onChange={(v) => updateDay(idx, "time", v)} placeholder="e.g. 9:00 AM" />
                      <TextInput value={day.venue} onChange={(v) => updateDay(idx, "venue", v)} placeholder="Venue" />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeDay(idx)}
                    className="shrink-0 mt-1 p-1.5 rounded-lg text-body/40 hover:text-ieee-red hover:bg-ieee-red/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={saveCongress} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-6 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light disabled:opacity-60">
              {saving ? <><Spinner size={14} /> Saving...</> : <><Save size={16} /> Save Congress Details</>}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">AXIS Ignite Webinars</h2>
          <button onClick={openCreateIgnite} className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-5 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light">
            <Plus size={16} /> Add Webinar
          </button>
        </div>
        <DataTable columns={igniteColumns} data={ignite} onEdit={openEditIgnite} onDelete={deleteIgnite} emptyMessage="No webinars yet." />
      </section>

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-xl bg-surface border border-white/10 px-6 py-4 shadow-xl">
            <Spinner size={18} className="text-ieee-blue-light" /><span className="text-sm text-white">Deleting...</span>
          </div>
        </div>
      )}

      <Modal open={igniteModalOpen} onClose={() => setIgniteModalOpen(false)} title={editingIgnite ? "Edit Webinar" : "Add Webinar"}>
        <div className="space-y-4">
          <FormField label="Title" htmlFor="ignite_title"><TextInput id="ignite_title" value={igniteForm.title} onChange={(v) => setIgniteForm({ ...igniteForm, title: v })} placeholder="Webinar title" required /></FormField>
          <FormField label="Week Number" htmlFor="week_number"><TextInput id="week_number" type="number" value={String(igniteForm.week_number)} onChange={(v) => setIgniteForm({ ...igniteForm, week_number: parseInt(v) || 0 })} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date" htmlFor="ignite_date"><TextInput id="ignite_date" type="date" value={igniteForm.event_date} onChange={(v) => setIgniteForm({ ...igniteForm, event_date: v })} /></FormField>
            <FormField label="Time" htmlFor="ignite_time"><TextInput id="ignite_time" value={igniteForm.event_time} onChange={(v) => setIgniteForm({ ...igniteForm, event_time: v })} placeholder="e.g. 2:00 PM" /></FormField>
          </div>
          <FormField label="Speaker" htmlFor="speaker"><TextInput id="speaker" value={igniteForm.speaker} onChange={(v) => setIgniteForm({ ...igniteForm, speaker: v })} placeholder="Speaker name" /></FormField>
          <FormField label="Speaker Title" htmlFor="speaker_title"><TextInput id="speaker_title" value={igniteForm.speaker_title} onChange={(v) => setIgniteForm({ ...igniteForm, speaker_title: v })} placeholder="Speaker title/role" /></FormField>
          <FormField label="Description" htmlFor="ignite_desc"><TextArea id="ignite_desc" value={igniteForm.description} onChange={(v) => setIgniteForm({ ...igniteForm, description: v })} /></FormField>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIgniteModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm text-body hover:text-white border border-white/10 hover:border-white/20 transition-colors">Cancel</button>
            <button onClick={saveIgnite} disabled={saving || !igniteForm.title}
              className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-6 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-ieee-blue-light disabled:opacity-60">
              {saving ? <><Spinner size={14} /> Saving...</> : <><Save size={16} /> {editingIgnite ? "Update" : "Create"}</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
