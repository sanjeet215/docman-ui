"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/#tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Sign in" },
  { href: "/stats", label: "Stats" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex min-w-0 items-center gap-6 sm:gap-10" aria-label="Main navigation">
      <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="DevPour home">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#5C341E] to-[#D0C1A9] text-sm font-bold text-white shadow-md shadow-[#5C341E]/20 dark:from-[#FFBA00] dark:to-[#BB8A52] dark:text-[#0C3B2E]">
          DP
        </span>
        <span className="hidden text-lg font-semibold tracking-tight text-slate-950 sm:block dark:text-white">DevPour</span>
      </Link>
      <ul className="flex min-w-0 items-center gap-1 overflow-x-auto">
        {links.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : href === "/#tools" ? false : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`block whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition sm:px-3 ${
                  active
                    ? "bg-indigo-50 text-[#2F180B] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"
                    : "text-[#2F180B]/75 hover:bg-[#D0C1A9]/35 hover:text-[#2F180B] dark:text-white/70 dark:hover:bg-[#6D9773]/25 dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
