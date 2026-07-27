import { CheckCircle2, FileInput, FileOutput } from "lucide-react";

export type ConversionOutput = {
  name: string;
  size: number;
};

type InputFile = { name: string; size: number };

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function FileConversionSummary({
  files,
  output,
}: {
  files: InputFile[];
  output?: ConversionOutput | null;
}) {
  if (!files.length) return null;
  const inputSize = files.reduce((total, file) => total + file.size, 0);
  const difference = inputSize - (output?.size ?? 0);
  const percentage = inputSize > 0 ? Math.abs(difference / inputSize) * 100 : 0;
  const names = files.map(({ name }) => name).join(", ");

  return (
    <section aria-label="File details" className="rounded-2xl border border-[#D0C1A9] bg-white p-4 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex min-w-0 items-start gap-3">
          <FileInput size={19} className="mt-0.5 shrink-0 text-[#5C341E] dark:text-[#FFBA00]" />
          <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-white/50">Input files</p><p className="mt-1 font-semibold text-[#2F180B] dark:text-white">{files.length} {files.length === 1 ? "file" : "files"}</p><p title={names} className="mt-0.5 truncate text-xs text-slate-500 dark:text-white/55">{names}</p></div>
        </div>
        <div className="flex items-start gap-3">
          <FileInput size={19} className="mt-0.5 shrink-0 text-[#5C341E] dark:text-[#FFBA00]" />
          <div><p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-white/50">Original size</p><p className="mt-1 font-semibold text-[#2F180B] dark:text-white">{formatFileSize(inputSize)}</p></div>
        </div>
        <div className="flex min-w-0 items-start gap-3">
          {output ? <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-emerald-500" /> : <FileOutput size={19} className="mt-0.5 shrink-0 text-slate-400" />}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-white/50">{output ? "Output file" : "After conversion"}</p>
            {output ? <>
              <p title={output.name} className="mt-1 truncate font-semibold text-[#2F180B] dark:text-white">{output.name}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-white/55">{formatFileSize(output.size)} · {difference >= 0 ? `${percentage.toFixed(1)}% smaller` : `${percentage.toFixed(1)}% larger`}</p>
            </> : <p className="mt-1 text-sm text-slate-500 dark:text-white/55">Result details will appear here</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
