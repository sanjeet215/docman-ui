"use client";

import { ArrowLeft, Download, FilePlus2, LockKeyhole, Scissors, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/Button";
import { FileConversionSummary, type ConversionOutput } from "../components/FileConversionSummary";
import { splitPdf } from "../services/pdfService";

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState("");
  const [separateFiles, setSeparateFiles] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ConversionOutput | null>(null);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    noClick: Boolean(file),
    maxSize: 50 * 1024 * 1024,
    onDrop: ([accepted]) => {
      if (accepted) {
        setFile(accepted);
        setOutput(null);
        setError(null);
      }
    },
    onDropRejected: () => setError("Choose one PDF file smaller than 50 MB."),
  });

  const process = async () => {
    if (!file) return;
    setWorking(true);
    setError(null);
    try {
      const result = await splitPdf(file, { pages, separateFiles });
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
      setError(reason instanceof Error ? reason.message : "Unable to split this PDF.");
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#D0C1A9]/45 px-3 py-1.5 text-sm font-medium text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><Scissors size={15} /> PDF organizer</div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#2F180B] dark:text-white">Split PDF file</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/65">Separate one page or a whole set for easy conversion into independent PDF files.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60"><LockKeyhole size={16} className="text-emerald-500" /> Secure processing</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
        <section {...getRootProps()} className={isDragActive ? "rounded-3xl ring-4 ring-[#D0C1A9]" : ""}>
          <input {...getInputProps()} />
          {!file ? (
            <div className="cursor-pointer rounded-3xl border-2 border-dashed border-[#D0C1A9] bg-white p-10 text-center shadow-sm hover:border-[#5C341E] dark:border-[#6D9773] dark:bg-[#173F35] dark:hover:border-[#FFBA00] sm:p-16">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#D0C1A9]/40 text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><FilePlus2 size={29} /></div>
              <h2 className="text-xl font-semibold text-[#2F180B] dark:text-white">{isDragActive ? "Drop PDF here" : "Choose a PDF to split"}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-white/60">One PDF document, up to 50 MB</p>
              <span className="mt-6 inline-block rounded-xl bg-[#5C341E] px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#FFBA00] dark:text-[#0C3B2E]">Choose PDF</span>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#D0C1A9] bg-white p-6 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#D0C1A9]/40 text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><Scissors size={24} /></div>
                <div className="min-w-0 flex-1"><p className="truncate font-semibold text-[#2F180B] dark:text-white">{file.name}</p><p className="text-sm text-slate-500 dark:text-white/60">{formatSize(file.size)} · Ready to split</p></div>
                <button type="button" onClick={() => { setFile(null); setOutput(null); }} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove PDF"><Trash2 size={18} /></button>
              </div>
              <button type="button" onClick={open} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#D0C1A9] px-3.5 py-2 text-sm font-semibold text-[#2F180B] hover:border-[#5C341E] dark:border-[#6D9773] dark:text-white dark:hover:border-[#FFBA00]"><FilePlus2 size={16} /> Choose a different PDF</button>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-[#D0C1A9] bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] lg:sticky lg:top-24">
          <h2 className="mb-5 flex items-center gap-2 font-semibold text-[#2F180B] dark:text-white"><Settings2 size={19} className="text-[#5C341E] dark:text-[#FFBA00]" /> Split settings</h2>
          <label htmlFor="pages" className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Pages to extract</label>
          <input id="pages" value={pages} onChange={(event) => setPages(event.target.value)} placeholder="Example: 1, 3-5, 8" className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:ring-2 focus:ring-[#D0C1A9] dark:border-[#6D9773] dark:bg-[#0C3B2E] dark:text-white" />
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-white/55">Leave blank to split every page. Page numbers begin at 1.</p>
          <hr className="my-4 border-[#D0C1A9] dark:border-[#6D9773]/35" />
          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-medium text-slate-600 dark:text-white/70">Output</legend>
            <label className="flex cursor-pointer items-start gap-3"><input type="radio" checked={separateFiles} onChange={() => setSeparateFiles(true)} className="mt-1 accent-[#5C341E] dark:accent-[#FFBA00]" /><span><span className="block text-sm font-medium text-[#2F180B] dark:text-white">Separate PDF files</span><span className="text-xs text-slate-500 dark:text-white/55">One PDF per page, downloaded as ZIP</span></span></label>
            <label className="flex cursor-pointer items-start gap-3"><input type="radio" checked={!separateFiles} onChange={() => setSeparateFiles(false)} className="mt-1 accent-[#5C341E] dark:accent-[#FFBA00]" /><span><span className="block text-sm font-medium text-[#2F180B] dark:text-white">One extracted PDF</span><span className="text-xs text-slate-500 dark:text-white/55">Keep all selected pages together</span></span></label>
          </fieldset>
        </aside>
      </div>

      <div className="mx-auto mt-5 flex max-w-6xl flex-col items-end gap-3">
        <div className="w-full"><FileConversionSummary files={file ? [file] : []} output={output} /></div>
        {error && <p role="alert" className="max-w-xl text-right text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        {file && <Button onClick={process} disabled={working} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg"><Download size={18} /> {working ? "Splitting PDF..." : "Split and download"}</Button>}
      </div>
    </main>
  );
}
