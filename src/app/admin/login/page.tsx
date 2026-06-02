"use client";

import { Suspense } from "react";
import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";
  const magicToken = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!magicToken) return;
    setLoading(true);
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: magicToken }),
    })
      .then(async (res) => {
        if (res.ok) {
          router.push(from);
          router.refresh();
        } else {
          setError("Magic link is invalid or has expired.");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      });
  }, [magicToken, from, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Invalid password.");
    }
  }

  if (magicToken) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {loading ? "Signing you in via magic link\u2026" : error}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        {/* Logo centred above card */}
        <div className="flex justify-center mb-8">
          <Logo variant="dark" />
        </div>

        <div
          className="rounded-2xl p-8 shadow-sm"
          style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <h1
            className="text-xl font-bold text-center mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Admin Sign In
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: "var(--text-secondary)" }}>
            Enter your password to access the CMS
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C" }}
              >
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-page)",
                }}
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {loading ? "Signing in\u2026" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:underline transition-colors" style={{ color: "var(--text-secondary)" }}>
            \u2190 Back to Blog
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading\u2026</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
