"use client";

import { ArrowLeft, CodeXml, Download, Eye, FileUp, LockKeyhole, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { FileConversionSummary, type ConversionOutput } from "../components/FileConversionSummary";
import { Select, type SelectOption } from "../components/Select";
import { htmlToPdf } from "../services/pdfService";

type PageSize = "A4" | "Letter" | "Legal";
type Orientation = "portrait" | "landscape";

const starter = `<main style="font-family: Arial, sans-serif; color: #2F180B;">
  <h1 style="margin-bottom: 8px;">Document title</h1>
  <p style="line-height: 1.6;">Paste your HTML here, or upload an HTML file.</p>
  <section style="margin-top: 24px; padding: 20px; background: #E2E1DF; border-radius: 12px;">
    <strong>Print-ready HTML</strong>
    <p>Inline CSS, tables, data-URL images and multi-page content are supported.</p>
  </section>
</main>`;

export default function HtmlToPdfPage() {
  const uploadRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(starter);
  const [fileName, setFileName] = useState("converted.pdf");
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [marginMm, setMarginMm] = useState(12);
  const [compress, setCompress] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState("HTML content");
  const [output, setOutput] = useState<ConversionOutput | null>(null);

  const loadFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 1_500_000) {
      setError("HTML file must be smaller than 1.5 MB.");
      return;
    }
    setHtml(await file.text());
    setSourceName(file.name);
    setOutput(null);
    setFileName(`${file.name.replace(/\.html?$/i, "")}.pdf`);
    setError(null);
  };

  const convert = async () => {
    if (!html.trim()) return;
    setWorking(true);
    setError(null);
    try {
      const result = await htmlToPdf({
        html, fileName, pageSize, orientation, marginMm,
        compress, compressionQuality: 70,
      });
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
      setError(reason instanceof Error ? reason.message : "Unable to convert this HTML.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E2E1DF] px-5 py-10 dark:bg-[#0C3B2E] sm:px-8 lg:px-10">
      <header className="mx-auto mb-8 max-w-7xl">
        <Link href="/#tools" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-white/60 dark:hover:text-[#FFBA00]"><ArrowLeft size={16} /> Back to tools</Link>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><CodeXml size={15} /> Document renderer</div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#2F180B] dark:text-white">Convert HTML to PDF</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/65">Create a print-ready PDF from HTML and inline CSS, rendered by Chromium.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60"><LockKeyhole size={16} className="text-emerald-500" /> Scripts and external requests are blocked</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[1fr_1fr_300px] xl:items-start">
        <section className="overflow-hidden rounded-3xl border border-[#D0C1A9] bg-white shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]">
          <div className="flex items-center justify-between border-b border-[#D0C1A9] px-5 py-4 dark:border-[#6D9773]/35">
            <div className="flex items-center gap-2 font-semibold text-[#2F180B] dark:text-white"><CodeXml size={18} /> HTML</div>
            <button type="button" onClick={() => uploadRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-[#D0C1A9] px-3 py-2 text-sm font-semibold text-[#2F180B] hover:border-[#5C341E] dark:border-[#6D9773] dark:text-white dark:hover:border-[#FFBA00]"><FileUp size={15} /> Upload .html</button>
            <input ref={uploadRef} type="file" accept=".html,.htm,text/html" className="hidden" onChange={(event) => loadFile(event.target.files?.[0])} />
          </div>
          <textarea value={html} onChange={(event) => { setHtml(event.target.value); setOutput(null); }} spellCheck={false} aria-label="HTML content" className="h-[520px] w-full resize-y bg-white p-5 font-mono text-sm leading-6 text-slate-800 outline-none dark:bg-[#0C3B2E] dark:text-white" />
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#D0C1A9] bg-white shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]">
          <div className="flex items-center gap-2 border-b border-[#D0C1A9] px-5 py-4 font-semibold text-[#2F180B] dark:border-[#6D9773]/35 dark:text-white"><Eye size={18} /> Safe preview</div>
          <iframe title="HTML preview" srcDoc={html} sandbox="" className="h-[520px] w-full bg-white" />
        </section>

        <aside className="rounded-3xl border border-[#D0C1A9] bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] xl:sticky xl:top-24">
          <h2 className="mb-5 flex items-center gap-2 font-semibold text-[#2F180B] dark:text-white"><Settings2 size={19} className="text-indigo-600 dark:text-[#FFBA00]" /> PDF settings</h2>
          <label htmlFor="outputName" className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Output filename</label>
          <input id="outputName" value={fileName} onChange={(event) => setFileName(event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:ring-2 focus:ring-indigo-400 dark:border-[#6D9773] dark:bg-[#0C3B2E] dark:text-white" />
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

      <div className="mx-auto mt-5 flex max-w-7xl flex-col items-end gap-3">
        <div className="w-full"><FileConversionSummary files={[{ name: sourceName, size: new Blob([html]).size }]} output={output} /></div>
        {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        <Button onClick={convert} disabled={working || !html.trim()} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg"><Download size={18} /> {working ? "Rendering PDF..." : "Convert and download"}</Button>
      </div>
    </main>
  );
}
