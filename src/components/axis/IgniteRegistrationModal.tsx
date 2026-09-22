"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect, useId } from "react";
import { cn } from "@/lib/utils";
import type { AxisIgniteWebinar } from "@/lib/types";

const LEVELS = ["100L", "200L", "300L", "400L", "500L", "Postgraduate"] as const;

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  webinar: AxisIgniteWebinar;
  open: boolean;
  onClose: () => void;
}

export function IgniteRegistrationModal({ webinar, open, onClose }: Props) {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    school: "",
    course: "",
    level: "" as (typeof LEVELS)[number] | "",
    company: "", // honeypot
  });

  // Reset when re-opened for a new webinar
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("idle");
      setError(null);
      setForm({ name: "", email: "", school: "", course: "", level: "", company: "" });
    }
  }, [open, webinar.id]);

  // Trap scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/axis/ignite/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, webinarId: webinar.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  function field(
    id: string,
    label: string,
    key: keyof typeof form,
    type = "text",
    required = true
  ) {
    return (
      <div>
        <label htmlFor={`${formId}-${id}`} className="block text-sm font-medium text-white/80 mb-1.5">
          {label} {required && <span className="text-accent-gold">*</span>}
        </label>
        <input
          id={`${formId}-${id}`}
          type={type}
          required={required}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className={cn(
            "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30",
            "focus:outline-none focus:ring-2 focus:ring-ieee-blue transition-colors",
            "border-white/10 hover:border-white/20"
          )}
          placeholder={`Your ${label.toLowerCase()}`}
        />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            className="fixed inset-x-4 bottom-0 top-[5vh] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md z-[70] overflow-y-auto rounded-2xl border border-white/10 bg-surface shadow-2xl"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-8">
              {/* Week badge */}
              <span className="inline-block rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-bold text-accent-gold tracking-widest uppercase mb-3">
                Week {webinar.week}
              </span>
              <h2 className="text-xl font-bold text-white mb-1 pr-8">{webinar.title}</h2>
              <p className="text-sm text-body mb-6">
                {webinar.date !== "TBC" ? webinar.date : "Date TBA"}{" "}
                {webinar.time !== "TBC" && `· ${webinar.time}`}
              </p>

              {/* ---- SUCCESS STATE ---- */}
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-8 gap-4"
                >
                  <CheckCircle2 size={52} className="text-green-400" strokeWidth={1.5} />
                  <div>
                    <p className="text-lg font-bold text-white mb-2">You&apos;re registered! 🎉</p>
                    <p className="text-sm text-body leading-relaxed">
                      A confirmation email has been sent to <strong className="text-white">{form.email}</strong>.
                      We&apos;ll send you the webinar link closer to the date.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 rounded-full bg-ieee-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-ieee-blue-light transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                /* ---- FORM STATE ---- */
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="absolute opacity-0 w-0 h-0 pointer-events-none"
                  />

                  {field("name", "Full Name", "name")}
                  {field("email", "Email Address", "email", "email")}
                  {field("school", "School / Faculty", "school")}
                  {field("course", "Course of Study", "course")}

                  {/* Level select */}
                  <div>
                    <label htmlFor={`${formId}-level`} className="block text-sm font-medium text-white/80 mb-1.5">
                      Level <span className="text-accent-gold">*</span>
                    </label>
                    <select
                      id={`${formId}-level`}
                      required
                      value={form.level}
                      onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as typeof form.level }))}
                      className={cn(
                        "w-full rounded-xl border bg-surface-alt px-4 py-3 text-sm text-white",
                        "focus:outline-none focus:ring-2 focus:ring-ieee-blue transition-colors",
                        "border-white/10 hover:border-white/20",
                        !form.level && "text-white/30"
                      )}
                    >
                      <option value="" disabled className="text-white/30">Select your level</option>
                      {LEVELS.map((l) => (
                        <option key={l} value={l} className="text-white bg-surface-alt">{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Error */}
                  {status === "error" && error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-2 rounded-xl bg-ieee-red/10 border border-ieee-red/20 p-3"
                    >
                      <AlertCircle size={16} className="text-ieee-red mt-0.5 shrink-0" />
                      <p className="text-sm text-red-300">{error}</p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={cn(
                      "w-full rounded-full py-3.5 text-sm font-semibold text-white transition-all",
                      "bg-ieee-blue hover:bg-ieee-blue-light shadow-lg shadow-ieee-blue/20",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Registering…
                      </>
                    ) : (
                      "Register for this Webinar"
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
