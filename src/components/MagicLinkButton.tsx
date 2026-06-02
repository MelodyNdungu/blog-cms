"use client";

import { useState } from "react";

export default function MagicLinkButton() {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setLink(null);
    const res = await fetch("/api/auth/magic-link", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setLink(data.link);
    }
    setLoading(false);
  }

  async function copyLink() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-2">
      <button
        onClick={generate}
        disabled={loading}
        className="text-sm font-medium px-3 py-1.5 rounded-lg border disabled:opacity-60 transition-colors"
        style={{ color: "var(--accent)", borderColor: "#C7D2FE", backgroundColor: "transparent" }}
      >
        {loading ? "Generating…" : "Generate Magic Link"}
      </button>
      {link && (
        <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xs font-mono text-gray-800 truncate flex-1">{link}</span>
          <button
            onClick={copyLink}
            className="text-xs px-2.5 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shrink-0 transition-colors font-medium"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      {link && (
        <p className="text-xs text-gray-600">Valid for 15 minutes — share this link to grant one-time admin access.</p>
      )}
    </div>
  );
}
