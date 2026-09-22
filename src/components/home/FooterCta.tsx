"use client";

import { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { SiteConfig } from "@/lib/types";

export function FooterCta({ site }: { site: SiteConfig }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ieee-blue/20 via-surface to-surface border-y border-white/10">
      <div className="container-page py-20 text-center">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-body text-lg max-w-xl mx-auto mb-8">
            Get updates on events, workshops, and AXIS Congress — or join IEEE to become
            part of our global engineering community.
          </p>

          <form onSubmit={onSubmit} className="mx-auto flex max-w-md flex-col sm:flex-row gap-3 mb-6">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-white/20 bg-deep px-5 py-3 text-white placeholder:text-body/60 focus:border-ieee-blue-light outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-ieee-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-ieee-blue-light disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
          {status === "success" && (
            <p className="text-sm text-accent-gold mb-6">You&apos;re subscribed — thanks!</p>
          )}
          {status === "error" && (
            <p className="text-sm text-ieee-red mb-6">Something went wrong. Please try again.</p>
          )}

          <a
            href={site.joinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition-all hover:border-white hover:bg-white/5"
          >
            Join IEEE Today
          </a>
        </SectionReveal>
      </div>
    </section>
  );
}
