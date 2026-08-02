import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles, Zap } from "lucide-react";
import Card from "./components/Card";
import { cardConfig } from "./components/cardConfig";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(92,52,30,0.14),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(208,193,169,0.72),transparent_34%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(109,151,115,0.30),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(255,186,0,0.12),transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.08fr_.92fr] lg:px-10 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Sparkles size={15} />
              A growing toolkit for everyday documents
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-[#2F180B] dark:text-white">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-[#5C341E] to-[#D0C1A9] bg-clip-text text-transparent dark:from-[#FFBA00] dark:to-[#BB8A52]">
                work smarter with files.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Convert, organize, compress and transform documents with fast, focused tools.
              No complicated software and no unnecessary steps.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#tools"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5C341E] px-5 py-3 font-semibold text-white shadow-lg shadow-[#5C341E]/20 transition hover:-translate-y-0.5 hover:bg-[#452615] dark:bg-[#FFBA00] dark:text-[#0C3B2E] dark:shadow-[#FFBA00]/15 dark:hover:bg-[#BB8A52]"
              >
                Explore all tools <ArrowRight size={18} />
              </Link>
              <Link
                href="/jpeg-to-pdf"
                className="inline-flex items-center justify-center rounded-xl border border-[#D0C1A9] bg-white/80 px-5 py-3 font-semibold text-[#2F180B] transition hover:border-[#5C341E] hover:text-[#5C341E] dark:border-[#6D9773] dark:bg-[#173F35] dark:text-white dark:hover:border-[#FFBA00] dark:hover:text-[#FFBA00]"
              >
                Try JPEG to PDF
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
              {["No sign-up", "Simple workflows", "Privacy focused"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[#5C341E]/20 to-[#D0C1A9]/35 blur-2xl dark:from-[#6D9773]/30 dark:to-[#FFBA00]/15" />
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-[#6D9773]/40 dark:bg-[#173F35]/90">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Your document workspace</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">One place for every file task</p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <Sparkles size={24} />
                </div>
              </div>
              <div className="my-5 grid grid-cols-2 gap-3">
                {cardConfig.slice(0, 6).map(({ Icon, title, link }, index) => {
                  const tones = [
                    "bg-[#5C341E]/10 text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]",
                    "bg-amber-50 text-amber-700 dark:bg-[#BB8A52]/20 dark:text-[#FFBA00]",
                    "bg-emerald-50 text-emerald-700 dark:bg-[#6D9773]/20 dark:text-[#9AC3A0]",
                  ];
                  return (
                    <Link
                      key={title}
                      href={link}
                      className="group flex items-center gap-3 rounded-2xl border border-[#D0C1A9]/70 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-[#5C341E] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#5C341E]/30 dark:border-[#6D9773]/40 dark:bg-[#0C3B2E] dark:hover:border-[#FFBA00]"
                    >
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[index % tones.length]}`}>
                        <Icon size={18} />
                      </div>
                      <p className="min-w-0 text-sm font-semibold leading-5 text-slate-700 group-hover:text-[#5C341E] dark:text-slate-200 dark:group-hover:text-[#FFBA00]">{title}</p>
                    </Link>
                  );
                })}
              </div>
              <Link href="#tools" className="group flex items-center justify-between rounded-xl bg-[#D0C1A9]/20 px-4 py-3 text-sm transition hover:bg-[#D0C1A9]/35 dark:bg-[#0C3B2E] dark:hover:bg-[#0C3B2E]/70">
                <span className="font-medium text-slate-600 dark:text-slate-300">{cardConfig.length} tools ready to use</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#5C341E] dark:text-[#FFBA00]">View all <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-9 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Document tools</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Do more with every file</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Choose the tool you need today. New document workflows will appear here as they are released.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cardConfig.map((card) => <Card key={card.title} {...card} />)}
        </div>
      </section>

      <section className="border-y border-[#D0C1A9] bg-[#D0C1A9]/20 dark:border-[#6D9773]/40 dark:bg-[#173F35]/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-10">
          {[
            { icon: Zap, title: "Fast by design", text: "A focused workflow gets you from images to a finished PDF without friction." },
            { icon: LockKeyhole, title: "Privacy conscious", text: "Your files are used only to complete the conversion you request." },
            { icon: Sparkles, title: "Professional output", text: "Choose page size, orientation and margins for a clean, consistent result." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                <Icon size={21} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
