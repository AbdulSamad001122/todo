import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logoutAction } from "@/app/actions/authActions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AetherTodo — Productivity Dashboard",
  description: "A sleek, minimal task management application built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  let username = "";

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { username: true },
    });
    if (user) {
      username = user.username;
    }
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white text-xs font-bold font-mono">✓</span>
              </div>
              <span className="font-semibold text-lg tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                AetherTodo
              </span>
            </div>
            <nav className="flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                    user: <span className="text-zinc-300 font-semibold">{username}</span>
                  </span>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="text-xs px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-zinc-400 font-mono cursor-pointer transition-all active:scale-95"
                    >
                      logout
                    </button>
                  </form>
                </div>
              ) : (
                <span className="text-xs px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 font-mono">
                  v1.0.0
                </span>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
          {children}
        </main>

        <footer className="border-t border-zinc-900 py-6">
          <div className="max-w-4xl mx-auto px-4 text-center text-xs text-zinc-600 font-mono">
            &copy; {new Date().getFullYear()} AetherTodo. Designed for visual excellence.
          </div>
        </footer>
      </body>
    </html>
  );
}
