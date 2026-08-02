"use client";

import { ArrowLeft, Download, FilePlus2, LockKeyhole, Settings2, Stamp, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/Button";
import { FileConversionSummary, type ConversionOutput, formatFileSize } from "../components/FileConversionSummary";
import { ToolExplanation } from "../components/ToolExplanation";
import { Select, type SelectOption } from "../components/Select";
import { watermarkPdf } from "../services/pdfService";

type Position = "center" | "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [position, setPosition] = useState<Position>("center");
  const [fontSize, setFontSize] = useState(48);
  const [angle, setAngle] = useState(-35);
  const [opacity, setOpacity] = useState(25);
  const [color, setColor] = useState("#6B7280");
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
    if (!file || !text.trim()) return;
    setWorking(true);
    setError(null);
    try {
      const result = await watermarkPdf(file, {
        watermarkText: text.trim(),
        watermarkFontSize: fontSize,
        watermarkPosition: position,
        watermarkAngle: angle,
        watermarkOpacity: String(opacity / 100),
        watermarkColor: color,
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
      setError(reason instanceof Error ? reason.message : "Unable to add this watermark.");
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#D0C1A9]/45 px-3 py-1.5 text-sm font-medium text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><Stamp size={15} /> PDF branding</div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#2F180B] dark:text-white">Add watermark to PDF</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/65">Place a custom text watermark consistently across every page of your document.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60"><LockKeyhole size={16} className="text-emerald-500" /> Secure processing</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_330px] lg:items-start">
        <section {...getRootProps()} className={isDragActive ? "rounded-3xl ring-4 ring-[#D0C1A9]" : ""}>
          <input {...getInputProps()} />
          {!file ? (
            <div className="cursor-pointer rounded-3xl border-2 border-dashed border-[#D0C1A9] bg-white p-10 text-center shadow-sm hover:border-[#5C341E] dark:border-[#6D9773] dark:bg-[#173F35] dark:hover:border-[#FFBA00] sm:p-16">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#D0C1A9]/40 text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><FilePlus2 size={29} /></div>
              <h2 className="text-xl font-semibold text-[#2F180B] dark:text-white">{isDragActive ? "Drop PDF here" : "Choose a PDF to watermark"}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-white/60">One PDF document, up to 50 MB</p>
              <span className="mt-6 inline-block rounded-xl bg-[#5C341E] px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#FFBA00] dark:text-[#0C3B2E]">Choose PDF</span>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#D0C1A9] bg-white p-6 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#D0C1A9]/40 text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><Stamp size={24} /></div>
                <div className="min-w-0 flex-1"><p className="truncate font-semibold text-[#2F180B] dark:text-white">{file.name}</p><p className="text-sm text-slate-500 dark:text-white/60">{formatFileSize(file.size)} · Ready for watermarking</p></div>
                <button type="button" onClick={() => { setFile(null); setOutput(null); }} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove PDF"><Trash2 size={18} /></button>
              </div>
              <button type="button" onClick={open} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#D0C1A9] px-3.5 py-2 text-sm font-semibold text-[#2F180B] hover:border-[#5C341E] dark:border-[#6D9773] dark:text-white dark:hover:border-[#FFBA00]"><FilePlus2 size={16} /> Choose a different PDF</button>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-[#D0C1A9] bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] lg:sticky lg:top-24">
          <h2 className="mb-5 flex items-center gap-2 font-semibold text-[#2F180B] dark:text-white"><Settings2 size={19} className="text-[#5C341E] dark:text-[#FFBA00]" /> Watermark settings</h2>
          <label htmlFor="watermarkText" className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Watermark text</label>
          <input id="watermarkText" maxLength={100} value={text} onChange={(event) => { setText(event.target.value); setOutput(null); }} className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:ring-2 focus:ring-[#D0C1A9] dark:border-[#6D9773] dark:bg-[#0C3B2E] dark:text-white" />
          <hr className="my-4 border-[#D0C1A9] dark:border-[#6D9773]/35" />
          <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Position</label>
          <Select value={position} onChange={(value) => { setPosition(value); setOutput(null); }} options={[
            { value: "center", label: "Center" }, { value: "top-left", label: "Top left" }, { value: "top-center", label: "Top center" }, { value: "top-right", label: "Top right" },
            { value: "bottom-left", label: "Bottom left" }, { value: "bottom-center", label: "Bottom center" }, { value: "bottom-right", label: "Bottom right" },
          ] as SelectOption<Position>[]} />
          <hr className="my-4 border-[#D0C1A9] dark:border-[#6D9773]/35" />
          <label htmlFor="fontSize" className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Text size: {fontSize}px</label>
          <input id="fontSize" type="range" min={12} max={120} value={fontSize} onChange={(event) => { setFontSize(Number(event.target.value)); setOutput(null); }} className="w-full accent-[#5C341E] dark:accent-[#FFBA00]" />
          <label htmlFor="opacity" className="mb-1 mt-4 block text-sm font-medium text-slate-600 dark:text-white/70">Opacity: {opacity}%</label>
          <input id="opacity" type="range" min={5} max={100} value={opacity} onChange={(event) => { setOpacity(Number(event.target.value)); setOutput(null); }} className="w-full accent-[#5C341E] dark:accent-[#FFBA00]" />
          <label htmlFor="angle" className="mb-1 mt-4 block text-sm font-medium text-slate-600 dark:text-white/70">Rotation: {angle}°</label>
          <input id="angle" type="range" min={-90} max={90} value={angle} onChange={(event) => { setAngle(Number(event.target.value)); setOutput(null); }} className="w-full accent-[#5C341E] dark:accent-[#FFBA00]" />
          <div className="mt-4 flex items-center justify-between"><label htmlFor="color" className="text-sm font-medium text-slate-600 dark:text-white/70">Text color</label><input id="color" type="color" value={color} onChange={(event) => { setColor(event.target.value); setOutput(null); }} className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent" /></div>
        </aside>
      </div>

      <div className="mx-auto mt-5 flex max-w-6xl flex-col items-end gap-3">
        <div className="w-full"><FileConversionSummary files={file ? [file] : []} output={output} /></div>
        {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        {file && <Button onClick={process} disabled={working || !text.trim()} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg"><Download size={18} /> {working ? "Adding watermark..." : "Add watermark and download"}</Button>}
      </div>
      <ToolExplanation title="What the Watermark PDF tool does" description="Apply a consistent text mark to every page for branding, review status or document handling." details={[
        { title: "Create custom text", description: "Use labels such as Confidential, Draft, Approved or your organization name." },
        { title: "Style the watermark", description: "Control its position, size, opacity, rotation and color." },
        { title: "Protect the original", description: "The tool generates a new watermarked PDF and leaves the uploaded file unchanged." },
      ]} />
    </main>
  );
}
