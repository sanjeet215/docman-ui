import type { Metadata } from "next";
import "./styles/globals.css";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Navbar from "./components/NavBar";

export const metadata: Metadata = {
  title: {
    default: "DevPour — Simple document tools",
    template: "%s | DevPour",
  },
  description: "Fast, private and easy-to-use tools for converting, organizing and working with documents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#E2E1DF] text-[#2F180B] dark:bg-[#0C3B2E] dark:text-white">
        <header className="sticky top-0 z-50 border-b border-[#D0C1A9] bg-white/90 backdrop-blur-xl dark:border-[#6D9773]/40 dark:bg-[#0C3B2E]/90">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
            <Navbar />
            <ThemeSwitcher />
          </div>
        </header>
        {children}
        <footer className="border-t border-[#D0C1A9] bg-white dark:border-[#6D9773]/40 dark:bg-[#0C3B2E]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <p>© {new Date().getFullYear()} DevPour. Simple tools for everyday documents.</p>
            <div className="flex gap-5">
              <a href="/about" className="hover:text-indigo-600">About</a>
              <a href="/contact" className="hover:text-indigo-600">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
