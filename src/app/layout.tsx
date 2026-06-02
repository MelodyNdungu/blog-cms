import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlogCMS",
  description: "A simple blog site with CMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-body)" }}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--border)] bg-[var(--bg-navbar)] text-center text-xs text-slate-400 py-5 mt-16">
            © {new Date().getFullYear()} BlogCMS · Built with Next.js &amp; Tailwind
          </footer>
        </body>
    </html>
  );
}
