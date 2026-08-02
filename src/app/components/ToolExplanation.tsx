import { CheckCircle2 } from "lucide-react";

export type ToolDetail = {
  title: string;
  description: string;
};

export function ToolExplanation({
  title,
  description,
  details,
  maxWidth = "max-w-6xl",
}: {
  title: string;
  description: string;
  details: ToolDetail[];
  maxWidth?: string;
}) {
  return (
    <section className={`mx-auto mt-12 ${maxWidth} rounded-3xl border border-[#D0C1A9]/80 bg-white/70 p-6 dark:border-[#6D9773]/35 dark:bg-[#173F35]/75 sm:p-8`}>
      <h2 className="text-xl font-semibold text-[#2F180B] dark:text-white">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-white/65">{description}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {details.map((detail) => (
          <article key={detail.title} className="flex items-start gap-3">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#5C341E] dark:text-[#FFBA00]" />
            <div>
              <h3 className="text-sm font-semibold text-[#2F180B] dark:text-white">{detail.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-white/55">{detail.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
