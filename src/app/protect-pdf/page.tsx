"use client";

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Download, Eye, EyeOff, FilePlus2, GripVertical, KeyRound, Lock, LockKeyhole, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/Button";
import { FileConversionSummary, type ConversionOutput, formatFileSize } from "../components/FileConversionSummary";
import { ToolExplanation } from "../components/ToolExplanation";
import { protectPdfs } from "../services/pdfService";

type PdfItem = { id: string; file: File };

function PdfRow({ item, index, remove }: { item: PdfItem; index: number; remove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  return <motion.div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 rounded-2xl border border-[#D0C1A9]/70 bg-white p-3.5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#0C3B2E]">
    <button type="button" {...attributes} {...listeners} className="cursor-grab rounded-lg p-2 text-slate-400 hover:bg-[#D0C1A9]/25 dark:hover:bg-[#6D9773]/20" aria-label={`Move ${item.file.name}`}><GripVertical size={18} /></button>
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#D0C1A9]/40 font-semibold text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]">{index + 1}</div>
    <div className="min-w-0 flex-1"><p className="truncate font-medium text-[#2F180B] dark:text-white">{item.file.name}</p><p className="text-sm text-slate-500 dark:text-white/60">{formatFileSize(item.file.size)} · PDF document</p></div>
    <button type="button" onClick={remove} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Remove ${item.file.name}`}><Trash2 size={17} /></button>
  </motion.div>;
}

export default function ProtectPdfPage() {
  const counter = useRef(0);
  const [files, setFiles] = useState<PdfItem[]>([]);
  const [mergeAll, setMergeAll] = useState(true);
  const [compress, setCompress] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ConversionOutput | null>(null);
  const resetResult = () => { setOutput(null); setError(null); };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] }, multiple: true, noClick: files.length > 0, maxSize: 50 * 1024 * 1024,
    onDrop: (accepted) => { resetResult(); setFiles((current) => [...current, ...accepted.map((file) => ({ id: `${Date.now()}-${++counter.current}-${file.name}`, file }))]); },
    onDropRejected: () => setError("Choose PDF files up to 50 MB each."),
  });
  const reorder = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setFiles((current) => arrayMove(current, current.findIndex(({ id }) => id === active.id), current.findIndex(({ id }) => id === over.id)));
    setOutput(null);
  };
  const passwordError = !password ? "Enter a password." : password.length < 6 ? "Use at least 6 characters." : password !== confirmPassword ? "Passwords do not match." : null;

  const process = async () => {
    if (!files.length || passwordError) { setError(passwordError); return; }
    setWorking(true); setError(null);
    try {
      const result = await protectPdfs(files.map(({ file }) => file), { password, mergeAll: files.length > 1 && mergeAll, compress, compressionQuality: 70 });
      setOutput({ name: result.fileName, size: result.blob.size });
      const url = URL.createObjectURL(result.blob);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = result.fileName;
      document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to protect these PDFs."); }
    finally { setWorking(false); }
  };

  return <main className="min-h-[calc(100vh-4rem)] bg-[#E2E1DF] px-5 py-10 dark:bg-[#0C3B2E] sm:px-8 lg:px-10">
    <header className="mx-auto mb-8 max-w-6xl">
      <Link href="/#tools" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#5C341E] dark:text-white/60 dark:hover:text-[#FFBA00]"><ArrowLeft size={16} /> Back to tools</Link>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#D0C1A9]/45 px-3 py-1.5 text-sm font-medium text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><Lock size={15} /> PDF security</div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#2F180B] dark:text-white">Protect PDF with a password</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/65">Secure one or more PDFs. Optionally merge multiple files before applying one password.</p>
      </div><div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60"><LockKeyhole size={16} className="text-emerald-500" /> Secure processing</div></div>
    </header>

    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
      <section {...getRootProps()} className={isDragActive ? "rounded-3xl ring-4 ring-[#D0C1A9]" : ""}><input {...getInputProps()} />
        {!files.length ? <div className="cursor-pointer rounded-3xl border-2 border-dashed border-[#D0C1A9] bg-white p-10 text-center shadow-sm hover:border-[#5C341E] dark:border-[#6D9773] dark:bg-[#173F35] dark:hover:border-[#FFBA00] sm:p-16">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#D0C1A9]/40 text-[#5C341E] dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><FilePlus2 size={29} /></div>
          <h2 className="text-xl font-semibold text-[#2F180B] dark:text-white">{isDragActive ? "Drop PDFs here" : "Choose PDF files to protect"}</h2><p className="mt-2 text-sm text-slate-500 dark:text-white/60">One or multiple PDFs, up to 50 MB each</p>
          <span className="mt-6 inline-block rounded-xl bg-[#5C341E] px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#FFBA00] dark:text-[#0C3B2E]">Choose PDFs</span>
        </div> : <div className="rounded-3xl border border-[#D0C1A9]/70 bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] sm:p-7">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-[#2F180B] dark:text-white">Your PDFs</h2><p className="text-sm text-slate-500 dark:text-white/60">{files.length} {files.length === 1 ? "file" : "files"} · Drag to reorder</p></div><button type="button" onClick={open} className="inline-flex items-center gap-2 rounded-xl border border-[#D0C1A9] px-3.5 py-2 text-sm font-semibold text-[#2F180B] hover:border-[#5C341E] dark:border-[#6D9773] dark:text-white dark:hover:border-[#FFBA00]"><FilePlus2 size={16} /> Add more</button></div>
          <DndContext collisionDetection={closestCenter} onDragEnd={reorder}><SortableContext items={files.map(({ id }) => id)} strategy={verticalListSortingStrategy}><div className="space-y-3"><AnimatePresence>{files.map((item, index) => <PdfRow key={item.id} item={item} index={index} remove={() => { resetResult(); setFiles((current) => current.filter(({ id }) => id !== item.id)); }} />)}</AnimatePresence></div></SortableContext></DndContext>
        </div>}
      </section>

      <aside className="rounded-3xl border border-[#D0C1A9]/70 bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] lg:sticky lg:top-24">
        <h2 className="mb-5 flex items-center gap-2 font-semibold text-[#2F180B] dark:text-white"><Settings2 size={19} className="text-[#5C341E] dark:text-[#FFBA00]" /> Protection settings</h2>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Password</label><div className="relative"><KeyRound size={17} className="absolute left-3 top-3 text-slate-400" /><input id="password" type={showPassword ? "text" : "password"} maxLength={127} value={password} onChange={(event) => { setPassword(event.target.value); resetResult(); }} className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-11 text-gray-900 focus:ring-2 focus:ring-[#D0C1A9] dark:border-[#6D9773] dark:bg-[#0C3B2E] dark:text-white" /><button type="button" onClick={() => setShowPassword((shown) => !shown)} className="absolute right-2 top-1.5 grid h-8 w-8 place-items-center text-slate-400" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <label htmlFor="confirmPassword" className="mb-1 mt-4 block text-sm font-medium text-slate-600 dark:text-white/70">Confirm password</label><input id="confirmPassword" type={showPassword ? "text" : "password"} maxLength={127} value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); resetResult(); }} onKeyDown={(event) => { if (event.key === "Enter" && !passwordError) void process(); }} className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:ring-2 focus:ring-[#D0C1A9] dark:border-[#6D9773] dark:bg-[#0C3B2E] dark:text-white" />
        <p className="mt-2 text-xs text-slate-500 dark:text-white/50">Use at least 6 characters. DevPour cannot recover forgotten passwords.</p>
        <hr className="my-4 border-[#D0C1A9]/60 dark:border-[#6D9773]/35" />
        <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={files.length > 1 && mergeAll} disabled={files.length <= 1} onChange={(event) => { setMergeAll(event.target.checked); resetResult(); }} className="mt-0.5 h-5 w-5 rounded accent-[#5C341E] disabled:opacity-50 dark:accent-[#FFBA00]" /><span><span className="block text-sm font-medium text-[#2F180B] dark:text-white">Merge all PDFs into one</span><span className="mt-0.5 block text-xs text-slate-500 dark:text-white/55">{files.length > 1 ? "One protected PDF will be downloaded" : "Add another PDF to enable merging"}</span></span></label>
        <hr className="my-4 border-[#D0C1A9]/60 dark:border-[#6D9773]/35" />
        <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={compress} onChange={(event) => { setCompress(event.target.checked); resetResult(); }} className="mt-0.5 h-5 w-5 rounded accent-[#5C341E] dark:accent-[#FFBA00]" /><span><span className="block text-sm font-medium text-[#2F180B] dark:text-white">Compress output</span><span className="mt-0.5 block text-xs text-slate-500 dark:text-white/55">Enabled by default</span></span></label>
      </aside>
    </div>

    <div className="mx-auto mt-5 flex max-w-6xl flex-col items-end gap-3"><div className="w-full"><FileConversionSummary files={files.map(({ file }) => file)} output={output} /></div>{error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}{files.length > 0 && <Button onClick={process} disabled={working || Boolean(passwordError)} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg"><Download size={18} /> {working ? "Protecting PDFs..." : files.length > 1 && !mergeAll ? "Protect and download ZIP" : "Protect and download PDF"}</Button>}</div>
    <ToolExplanation title="What the Protect PDF tool does" description="Require a password whenever someone opens the generated PDF." details={[
      { title: "Choose one or more PDFs", description: "Reorder multiple files and decide whether to combine them before protection." },
      { title: "Set one password", description: "Confirm the password to prevent typing mistakes before processing begins." },
      { title: "Download protected output", description: "Receive one protected PDF, or a ZIP of individually protected PDFs when merge is disabled." },
    ]} />
  </main>;
}
