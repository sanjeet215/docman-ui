"use client";

import { ArrowLeft, Download, FileText, FileUp, LockKeyhole, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { FileConversionSummary, type ConversionOutput } from "../components/FileConversionSummary";
import { Select, type SelectOption } from "../components/Select";
import { rtfToPdf } from "../services/pdfService";

type PageSize = "A4" | "Letter" | "Legal";
type Orientation = "portrait" | "landscape";

export default function RtfToPdfPage() {
  const uploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("converted.pdf");
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [marginMm, setMarginMm] = useState(12);
  const [compress, setCompress] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ConversionOutput | null>(null);

  const chooseFile = (selected?: File) => {
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".rtf")) return setError("Please select an RTF file.");
    if (selected.size > 1_000_000) return setError("RTF file must be smaller than 1 MB.");
    setFile(selected);
    setOutput(null);
    setFileName(`${selected.name.replace(/\.rtf$/i, "")}.pdf`);
    setError(null);
  };

  const convert = async () => {
    if (!file) return;
    setWorking(true);
    setError(null);
    try {
      const result = await rtfToPdf(file, { fileName, pageSize, orientation, marginMm, compress, compressionQuality: 70 });
      setOutput({ name: result.fileName, size: result.blob.size });
      const url = URL.createObjectURL(result.blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to convert this RTF file.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E2E1DF] px-5 py-10 dark:bg-[#0C3B2E] sm:px-8 lg:px-10">
      <header className="mx-auto mb-8 max-w-6xl">
        <Link href="/#tools" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#5C341E] dark:text-white/60 dark:hover:text-[#FFBA00]"><ArrowLeft size={16} /> Back to tools</Link>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#D0C1A9]/45 px-3 py-1.5 text-sm font-medium text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><FileText size={15} /> Document converter</div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#2F180B] dark:text-white">Convert RTF to PDF</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/65">Turn Rich Text Format documents into clean PDFs while preserving standard document formatting.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60"><LockKeyhole size={16} className="text-emerald-500" /> Processed privately on your server</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
        <section className="rounded-3xl border border-[#D0C1A9] bg-white p-6 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]">
          <button type="button" onClick={() => uploadRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }} className="flex min-h-[360px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D0C1A9] bg-[#E2E1DF]/35 p-8 text-center transition hover:border-[#5C341E] hover:bg-[#D0C1A9]/25 dark:border-[#6D9773]/60 dark:bg-[#0C3B2E]/45 dark:hover:border-[#FFBA00]">
            <span className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#5C341E] text-white shadow-lg dark:bg-[#FFBA00] dark:text-[#2F180B]"><FileUp size={30} /></span>
            <span className="text-lg font-semibold text-[#2F180B] dark:text-white">{file ? file.name : "Drop your RTF file here"}</span>
            <span className="mt-2 text-sm text-slate-500 dark:text-white/55">{file ? `${(file.size / 1024).toFixed(1)} KB · Ready to convert` : "or click to browse · maximum 1 MB"}</span>
          </button>
          <input ref={uploadRef} type="file" accept=".rtf,application/rtf,text/rtf" className="hidden" onChange={(event) => chooseFile(event.target.files?.[0])} />
        </section>

        <aside className="rounded-3xl border border-[#D0C1A9] bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] lg:sticky lg:top-24">
          <h2 className="mb-5 flex items-center gap-2 font-semibold text-[#2F180B] dark:text-white"><Settings2 size={19} className="text-[#5C341E] dark:text-[#FFBA00]" /> PDF settings</h2>
          <label htmlFor="outputName" className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Output filename</label>
          <input id="outputName" value={fileName} onChange={(event) => setFileName(event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:ring-2 focus:ring-[#D0C1A9] dark:border-[#6D9773] dark:bg-[#0C3B2E] dark:text-white" />
          <hr className="my-4 border-[#D0C1A9] dark:border-[#6D9773]/35" />
          <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Page size</label>
          <Select value={pageSize} onChange={setPageSize} options={[{ value: "A4", label: "A4" }, { value: "Letter", label: "Letter" }, { value: "Legal", label: "Legal" }] as SelectOption<PageSize>[]} />
          <div className="mt-4"><label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Orientation</label><Select value={orientation} onChange={setOrientation} options={[{ value: "portrait", label: "Portrait" }, { value: "landscape", label: "Landscape" }] as SelectOption<Orientation>[]} /></div>
          <hr className="my-4 border-[#D0C1A9] dark:border-[#6D9773]/35" />
          <label htmlFor="margin" className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Margins: {marginMm} mm</label>
          <input id="margin" type="range" min={0} max={30} value={marginMm} onChange={(event) => setMarginMm(Number(event.target.value))} className="w-full accent-[#5C341E] dark:accent-[#FFBA00]" />
          <hr className="my-4 border-[#D0C1A9] dark:border-[#6D9773]/35" />
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={compress} onChange={(event) => setCompress(event.target.checked)} className="h-5 w-5 rounded accent-[#5C341E] dark:accent-[#FFBA00]" />
            <span><span className="block text-sm font-medium text-[#2F180B] dark:text-white">Compress output PDF</span><span className="text-xs text-slate-500 dark:text-white/55">Enabled by default</span></span>
          </label>
        </aside>
      </div>

      <div className="mx-auto mt-5 flex max-w-6xl flex-col items-end gap-3">
        <div className="w-full"><FileConversionSummary files={file ? [file] : []} output={output} /></div>
        {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        <Button onClick={convert} disabled={working || !file} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg"><Download size={18} /> {working ? "Converting PDF..." : "Convert and download"}</Button>
      </div>
    </main>
  );
}
