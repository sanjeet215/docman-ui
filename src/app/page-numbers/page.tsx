"use client";

import { ArrowLeft, Download, FilePlus2, ListOrdered, LockKeyhole, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/Button";
import { FileConversionSummary, type ConversionOutput } from "../components/FileConversionSummary";
import { ToolExplanation } from "../components/ToolExplanation";
import { Select, type SelectOption } from "../components/Select";
import { addPageNumbers } from "../services/pdfService";

type Position = "bottom-left" | "bottom-center" | "bottom-right" | "top-left" | "top-center" | "top-right";
type FontSize = "9" | "11" | "14";

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState<FontSize>("11");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ConversionOutput | null>(null);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    noClick: Boolean(file),
    onDrop: ([accepted]) => {
      if (accepted) {
        setFile(accepted);
        setOutput(null);
        setError(null);
      }
    },
  });

  const process = async () => {
    if (!file) return;
    setWorking(true);
    setError(null);
    try {
      const result = await addPageNumbers(file, {
        position,
        startNumber,
        fontSize: Number(fontSize),
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
      setError(reason instanceof Error ? reason.message : "Unable to add page numbers.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E2E1DF] px-5 py-10 dark:bg-[#0C3B2E] sm:px-8 lg:px-10">
      <header className="mx-auto mb-8 max-w-6xl">
        <Link href="/#tools" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-white/60 dark:hover:text-[#FFBA00]">
          <ArrowLeft size={16} /> Back to tools
        </Link>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]">
              <ListOrdered size={15} /> PDF organizer
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#2F180B] dark:text-white">Add page numbers to PDF</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/65">Number every page consistently and choose exactly where the numbers appear.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60"><LockKeyhole size={16} className="text-emerald-500" /> Secure processing</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_310px] lg:items-start">
        <section {...getRootProps()} className={isDragActive ? "rounded-3xl ring-4 ring-indigo-200 dark:ring-[#FFBA00]/20" : ""}>
          <input {...getInputProps()} />
          {!file ? (
            <div className="cursor-pointer rounded-3xl border-2 border-dashed border-indigo-200 bg-white p-10 text-center shadow-sm hover:border-indigo-400 dark:border-[#6D9773] dark:bg-[#173F35] dark:hover:border-[#FFBA00] sm:p-16">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><FilePlus2 size={29} /></div>
              <h2 className="text-xl font-semibold text-[#2F180B] dark:text-white">{isDragActive ? "Drop PDF here" : "Choose a PDF to number"}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-white/60">One PDF document, up to 50 MB</p>
              <span className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#FFBA00] dark:text-[#0C3B2E]">Choose PDF</span>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#D0C1A9] bg-white p-6 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><ListOrdered size={24} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#2F180B] dark:text-white">{file.name}</p>
                  <p className="text-sm text-slate-500 dark:text-white/60">{formatSize(file.size)} · Ready for numbering</p>
                </div>
                <button type="button" onClick={() => { setFile(null); setOutput(null); }} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove PDF"><Trash2 size={18} /></button>
              </div>
              <button type="button" onClick={open} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#D0C1A9] px-3.5 py-2 text-sm font-semibold text-[#2F180B] hover:border-[#5C341E] dark:border-[#6D9773] dark:text-white dark:hover:border-[#FFBA00]"><FilePlus2 size={16} /> Choose a different PDF</button>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-[#D0C1A9] bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] lg:sticky lg:top-24">
          <h2 className="mb-5 flex items-center gap-2 font-semibold text-[#2F180B] dark:text-white"><Settings2 size={19} className="text-indigo-600 dark:text-[#FFBA00]" /> Number settings</h2>
          <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Position</label>
          <Select value={position} onChange={setPosition} options={[
            { value: "bottom-left", label: "Bottom left" }, { value: "bottom-center", label: "Bottom center" }, { value: "bottom-right", label: "Bottom right" },
            { value: "top-left", label: "Top left" }, { value: "top-center", label: "Top center" }, { value: "top-right", label: "Top right" },
          ] as SelectOption<Position>[]} />
          <hr className="my-4 border-[#D0C1A9] dark:border-[#6D9773]/35" />
          <label htmlFor="startNumber" className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Start numbering at</label>
          <input id="startNumber" type="number" min={0} max={9999} value={startNumber} onChange={(event) => setStartNumber(Math.max(0, Number(event.target.value)))} className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:ring-2 focus:ring-indigo-400 dark:border-[#6D9773] dark:bg-[#0C3B2E] dark:text-white" />
          <hr className="my-4 border-[#D0C1A9] dark:border-[#6D9773]/35" />
          <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Number size</label>
          <Select value={fontSize} onChange={setFontSize} options={[
            { value: "9", label: "Small" }, { value: "11", label: "Medium" }, { value: "14", label: "Large" },
          ] as SelectOption<FontSize>[]} />
        </aside>
      </div>

      <div className="mx-auto mt-5 flex max-w-6xl flex-col items-end gap-3">
        <div className="w-full"><FileConversionSummary files={file ? [file] : []} output={output} /></div>
        {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        {file && <Button onClick={process} disabled={working} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg"><Download size={18} /> {working ? "Adding page numbers..." : "Add page numbers"}</Button>}
      </div>
      <ToolExplanation title="What the Page Numbers tool does" description="Add consistent, readable numbering to every page while preserving the original PDF content." details={[
        { title: "Choose the placement", description: "Position numbers at the top or bottom and align them left, center or right." },
        { title: "Set the numbering", description: "Choose the first displayed number and a suitable text size." },
        { title: "Receive a numbered copy", description: "Your original file stays unchanged; a new numbered PDF is downloaded." },
      ]} />
    </main>
  );
}
