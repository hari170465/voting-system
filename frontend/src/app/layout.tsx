import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voting App",
  description: "Next.js + Express + Postgres",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* force light mode styles */}
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <nav className="w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
            <a href="/" className="font-semibold text-gray-900">Voting App</a>
            <div className="ml-auto flex gap-4 text-sm text-gray-700">
              <a className="hover:text-gray-900" href="/vote">Vote</a>
              <a className="hover:text-gray-900" href="/results">Results</a>
              <a className="hover:text-gray-900" href="/admin">Admin</a>
              <a className="hover:text-gray-900" href="/login">Login</a>
              <a className="hover:text-gray-900" href="/signup">Signup</a>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-6">{children}</main>
        {/* Floating Chat button */}
        <a
          href="/chat"
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            background: "#2563eb",
            color: "#fff",
            padding: "0.6rem 0.9rem",
            borderRadius: 999,
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            fontWeight: 600,
          }}
        >
          Chat
        </a>
      </body>
    </html>
  );
}
