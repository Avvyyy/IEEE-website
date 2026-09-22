"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, Loader2, AlertCircle, ExternalLink, Info } from "lucide-react";
import { useState, useEffect, useId } from "react";
import { cn } from "@/lib/utils";

const LEVELS = ["100L", "200L", "300L", "400L", "500L", "Postgraduate"] as const;

type Status = "idle" | "submitting" | "success" | "error";

interface SuccessData {
  registrationId: string;
  attendingDay3: boolean;
  paystackUrl: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CongressRegistrationModal({ open, onClose }: Props) {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    school: "",
    course: "",
    level: "" as (typeof LEVELS)[number] | "",
    attendingDay3: false,
    company: "", // honeypot
  });

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("idle");
      setError(null);
      setSuccessData(null);
      setPaying(false);
      setPayError(null);
      setForm({ name: "", email: "", school: "", course: "", level: "", attendingDay3: false, company: "" });
    }
  }, [open]);

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
      const res = await fetch("/api/axis/congress/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSuccessData({
        registrationId: data.registrationId,
        attendingDay3: data.attendingDay3,
        paystackUrl: data.paystackUrl,
      });
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  async function handleDay3Payment() {
    if (!successData?.registrationId || paying) return;
    setPaying(true);
    setPayError(null);

    try {
      const res = await fetch("/api/axis/congress/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: successData.registrationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not initialize payment.");

      // Redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setPaying(false);
    }
  }

  function field(
    id: string,
    label: string,
    key: "name" | "email" | "school" | "course",
    type = "text"
  ) {
    return (
      <div>
        <label htmlFor={`${formId}-${id}`} className="block text-sm font-medium text-white/80 mb-1.5">
          {label} <span className="text-accent-gold">*</span>
        </label>
        <input
          id={`${formId}-${id}`}
          type={type}
          required
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
            key="cg-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="cg-modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            className="fixed inset-x-4 bottom-0 top-[4vh] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-[70] overflow-y-auto rounded-2xl border border-white/10 bg-surface shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold tracking-widest text-ieee-blue-light uppercase mb-2">
                IEEE Babcock Student Branch
              </p>
              <h2 className="text-2xl font-bold text-white mb-1">Register for AXIS Congress</h2>
              <p className="text-sm text-body mb-6">
                November 10–12, 2026 · Babcock University
              </p>

              {/* ---- SUCCESS STATE ---- */}
              {status === "success" && successData ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6 gap-4"
                >
                  <CheckCircle2 size={52} className="text-green-400" strokeWidth={1.5} />
                  <div>
                    <p className="text-lg font-bold text-white mb-2">Registration confirmed!</p>
                    <p className="text-sm text-body leading-relaxed mb-4">
                      A confirmation email has been sent to <strong className="text-white">{form.email}</strong>.
                    </p>
                  </div>

                  {/* Day 3 payment CTA */}
                  {successData.attendingDay3 && (
                    <div className="w-full rounded-2xl border border-accent-gold/30 bg-accent-gold/5 p-5 text-left">
                      <p className="text-sm font-bold text-accent-gold mb-2 flex items-center gap-2">
                        <Info size={16} />
                        Complete your Day 3 payment
                      </p>
                      <p className="text-xs text-body leading-relaxed mb-4">
                        Day 3 (Field Trip) is a paid event — ₦4,000. Your spot is reserved but only confirmed once payment is received.
                      </p>

                      {payError && (
                        <div className="flex items-start gap-2 rounded-lg bg-ieee-red/10 border border-ieee-red/20 p-2.5 mb-3">
                          <AlertCircle size={14} className="text-ieee-red mt-0.5 shrink-0" />
                          <p className="text-xs text-red-300">{payError}</p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleDay3Payment}
                        disabled={paying}
                        className="inline-flex items-center gap-2 rounded-full bg-accent-gold px-6 py-2.5 text-sm font-bold text-deep hover:bg-yellow-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {paying ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Redirecting to Paystack…
                          </>
                        ) : (
                          <>
                            Pay for Day 3 <ExternalLink size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                /* ---- FORM STATE ---- */
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Honeypot */}
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

                  {/* Level */}
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

                  {/* Day 3 checkbox */}
                  <label
                    htmlFor={`${formId}-day3`}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors",
                      form.attendingDay3
                        ? "border-accent-gold/40 bg-accent-gold/5"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    )}
                  >
                    <input
                      id={`${formId}-day3`}
                      type="checkbox"
                      checked={form.attendingDay3}
                      onChange={(e) => setForm((f) => ({ ...f, attendingDay3: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 accent-amber-400 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        I want to attend Day 3 —{" "}
                        <span className="text-accent-gold">Field Trip</span>
                      </p>
                      <p className="text-xs text-body mt-0.5 leading-relaxed">
                        Day 3 is a paid event — ₦4,000. After registering, you&apos;ll be directed to complete payment via Paystack. Access is confirmed only after payment.
                      </p>
                    </div>
                  </label>

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
                      "Register for AXIS Congress"
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
