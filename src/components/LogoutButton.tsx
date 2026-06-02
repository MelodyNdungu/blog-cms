"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors"
      style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#FEF2F2";
        e.currentTarget.style.color = "#B91C1C";
        e.currentTarget.style.borderColor = "#FECACA";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "";
        e.currentTarget.style.color = "var(--text-secondary)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      Sign out
    </button>
  );
}
