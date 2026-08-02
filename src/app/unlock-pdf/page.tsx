"use client";

import { ArrowLeft, Download, Eye, EyeOff, FilePlus2, KeyRound, LockKeyhole, LockOpen, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/Button";
import { FileConversionSummary, type ConversionOutput, formatFileSize } from "../components/FileConversionSummary";
import { ToolExplanation } from "../components/ToolExplanation";
import { PdfPasswordRequiredError, unlockPdf } from "../services/pdfService";

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [compress, setCompress] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ConversionOutput | null>(null);

  const resetResult = () => { setOutput(null); setError(null); };
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] }, multiple: false, noClick: Boolean(file), maxSize: 50 * 1024 * 1024,
    onDrop: ([accepted]) => {
      if (accepted) {
        setFile(accepted); setPassword(""); setPasswordRequired(false); setOutput(null); setError(null);
      }
    },
    onDropRejected: () => setError("Choose one PDF file smaller than 50 MB."),
  });

  const process = async () => {
    if (!file) return;
    setWorking(true); setError(null);
    try {
      const result = await unlockPdf(file, { password, compress, compressionQuality: 70 });
      setPasswordRequired(false);
      setOutput({ name: result.fileName, size: result.blob.size });
      const url = URL.createObjectURL(result.blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = result.fileName;
      document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
    } catch (reason) {
      if (reason instanceof PdfPasswordRequiredError) {
        setPasswordRequired(true);
        setError(password ? "That password is incorrect. Please try again." : reason.message);
      } else {
        setError(reason instanceof Error ? reason.message : "Unable to unlock this PDF.");
      }
    } finally { setWorking(false); }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E2E1DF] px-5 py-10 dark:bg-[#0C3B2E] sm:px-8 lg:px-10">
      <header className="mx-auto mb-8 max-w-6xl">
        <Link href="/#tools" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#5C341E] dark:text-white/60 dark:hover:text-[#FFBA00]"><ArrowLeft size={16} /> Back to tools</Link>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#D0C1A9]/45 px-3 py-1.5 text-sm font-medium text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><LockOpen size={15} /> PDF security</div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#2F180B] dark:text-white">Unlock PDF</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/65">Remove password protection from a PDF you are authorized to open and download an accessible copy.</p>
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
              <h2 className="text-xl font-semibold text-[#2F180B] dark:text-white">{isDragActive ? "Drop PDF here" : "Choose a PDF to unlock"}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-white/60">One PDF document, up to 50 MB</p>
              <span className="mt-6 inline-block rounded-xl bg-[#5C341E] px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#FFBA00] dark:text-[#0C3B2E]">Choose PDF</span>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#D0C1A9] bg-white p-6 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#D0C1A9]/40 text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><LockOpen size={24} /></div>
                <div className="min-w-0 flex-1"><p className="truncate font-semibold text-[#2F180B] dark:text-white">{file.name}</p><p className="text-sm text-slate-500 dark:text-white/60">{formatFileSize(file.size)} · Ready to check</p></div>
                <button type="button" onClick={() => { setFile(null); setPassword(""); setPasswordRequired(false); resetResult(); }} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove PDF"><Trash2 size={18} /></button>
              </div>
              <button type="button" onClick={open} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#D0C1A9] px-3.5 py-2 text-sm font-semibold text-[#2F180B] hover:border-[#5C341E] dark:border-[#6D9773] dark:text-white dark:hover:border-[#FFBA00]"><FilePlus2 size={16} /> Choose a different PDF</button>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-[#D0C1A9] bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] lg:sticky lg:top-24">
          <h2 className="mb-5 flex items-center gap-2 font-semibold text-[#2F180B] dark:text-white"><Settings2 size={19} className="text-[#5C341E] dark:text-[#FFBA00]" /> Unlock settings</h2>
          {passwordRequired ? <>
            <label htmlFor="pdfPassword" className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">PDF password</label>
            <div className="relative">
              <KeyRound size={17} className="absolute left-3 top-3 text-slate-400" />
              <input id="pdfPassword" autoFocus type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); resetResult(); }} onKeyDown={(event) => { if (event.key === "Enter" && password) void process(); }} className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-11 text-gray-900 focus:ring-2 focus:ring-[#D0C1A9] dark:border-[#6D9773] dark:bg-[#0C3B2E] dark:text-white" />
              <button type="button" onClick={() => setShowPassword((shown) => !shown)} className="absolute right-2 top-1.5 grid h-8 w-8 place-items-center text-slate-400" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-white/55">The password is sent only to unlock this document.</p>
            <hr className="my-4 border-[#D0C1A9] dark:border-[#6D9773]/35" />
          </> : <p className="mb-4 text-sm leading-6 text-slate-500 dark:text-white/60">Choose a PDF first. If it is protected, the password field will appear automatically.</p>}
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700 dark:text-white/75">
            <input type="checkbox" checked={compress} onChange={(event) => { setCompress(event.target.checked); resetResult(); }} className="h-5 w-5 rounded accent-[#5C341E] dark:accent-[#FFBA00]" /> Compress output PDF
          </label>
          <p className="ml-8 mt-1 text-xs text-slate-500 dark:text-white/50">Enabled by default</p>
        </aside>
      </div>

      <div className="mx-auto mt-5 flex max-w-6xl flex-col items-end gap-3">
        <div className="w-full"><FileConversionSummary files={file ? [file] : []} output={output} /></div>
        {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        {file && <Button onClick={process} disabled={working || (passwordRequired && !password)} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg"><Download size={18} /> {working ? "Processing PDF..." : passwordRequired ? "Unlock and download" : "Check and download"}</Button>}
      </div>
      <ToolExplanation title="What the Unlock PDF tool does" description="Create an unrestricted copy of a PDF when you know its current password." details={[
        { title: "Detect protection", description: "Unprotected PDFs continue immediately; protected files prompt for their password." },
        { title: "Remove the password", description: "The output opens normally without asking for the original password." },
        { title: "Compress the result", description: "Optional compression is enabled by default to help reduce the downloaded file size." },
      ]} />
    </main>
  );
}
