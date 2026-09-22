"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Name"
          id="name"
          type="text"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          required
        />
        <Field
          label="Email"
          id="email"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          required
        />
      </div>
      <Field
        label="Subject"
        id="subject"
        type="text"
        value={form.subject}
        onChange={(v) => setForm({ ...form, subject: v })}
        required
      />
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
          Message
        </label>
        <textarea
          id="message"
          required
          minLength={10}
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl border border-white/15 bg-surface px-4 py-3 text-white placeholder:text-body/50 focus:border-ieee-blue-light outline-none resize-none"
          placeholder="How can we help?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto rounded-full bg-ieee-blue px-8 py-3 font-semibold text-white transition-colors hover:bg-ieee-blue-light disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-accent-gold text-sm">Thanks for reaching out — we&apos;ll be in touch soon.</p>
      )}
      {status === "error" && <p className="text-ieee-red text-sm">{errorMsg}</p>}
    </form>
  );
}

function Field({
  label,
  id,
  type,
  value,
  onChange,
  required,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-surface px-4 py-3 text-white placeholder:text-body/50 focus:border-ieee-blue-light outline-none"
      />
    </div>
  );
}
