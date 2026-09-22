"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface/60 p-8">
        <Image
          src="/images/logo-ieee-babcock.png"
          alt="IEEE Babcock SB"
          width={160}
          height={40}
          className="h-9 w-auto mb-8 mx-auto"
        />
        <h1 className="text-xl font-semibold text-white text-center mb-6">Admin Sign In</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-body mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-deep px-4 py-3 text-white outline-none focus:border-ieee-blue-light"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm text-body mb-2">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-deep px-4 py-3 text-white outline-none focus:border-ieee-blue-light"
            />
          </div>
          {error && <p className="text-sm text-ieee-red">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ieee-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-ieee-blue-light disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
