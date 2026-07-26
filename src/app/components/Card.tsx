import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type CardProps = {
  title: string;
  content: string;
  link: string;
  Icon: LucideIcon;
  available: boolean;
};

export default function Card({ title, content, link, Icon, available }: CardProps) {
  const inner = (
    <div className={`group h-full rounded-2xl border bg-white p-6 transition dark:bg-[#173F35] ${
      available
        ? "border-[#D0C1A9]/70 shadow-sm hover:-translate-y-1 hover:border-[#5C341E] hover:shadow-xl hover:shadow-[#2F180B]/5 dark:border-[#6D9773]/40 dark:hover:border-[#FFBA00]/60"
        : "border-[#D0C1A9]/50 opacity-70 dark:border-[#6D9773]/30"
    }`}>
      <div className="flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]">
          <Icon size={23} />
        </div>
        {available ? (
          <ArrowUpRight size={20} className="text-slate-400 transition group-hover:text-indigo-600" />
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">Coming soon</span>
        )}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{content}</p>
    </div>
  );

  return available ? <Link href={link}>{inner}</Link> : inner;
}
