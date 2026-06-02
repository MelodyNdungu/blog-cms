import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-navbar)" }}>
      <div className="max-w-6xl mx-auto px-4 h-15 h-[3.75rem] flex items-center justify-between">
        <Link href="/" aria-label="BlogCMS home">
          <Logo variant="light" />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/admin"
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-500 transition-colors font-semibold"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
