"use client";

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Download, FilePlus2, GripVertical, LockKeyhole, Minimize2, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/Button";
import { Select, type SelectOption } from "../components/Select";
import { compressPdfs } from "../services/pdfService";

type PdfItem = { id: string; file: File };
type PageSize = "A4" | "Letter" | "Legal";
type Quality = "40" | "60" | "80";

function fileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function PdfRow({ item, index, remove }: { item: PdfItem; index: number; remove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-center gap-3 rounded-2xl border border-[#D0C1A9]/70 bg-white p-3.5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#0C3B2E]"
    >
      <button type="button" {...attributes} {...listeners} className="cursor-grab rounded-lg p-2 text-slate-400 hover:bg-[#D0C1A9]/25 dark:hover:bg-[#6D9773]/20" aria-label={`Move ${item.file.name}`}>
        <GripVertical size={18} />
      </button>
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 font-semibold text-indigo-600 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]">{index + 1}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[#2F180B] dark:text-white">{item.file.name}</p>
        <p className="text-sm text-slate-500 dark:text-white/60">{fileSize(item.file.size)} · PDF document</p>
      </div>
      <button type="button" onClick={remove} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Remove ${item.file.name}`}>
        <Trash2 size={17} />
      </button>
    </motion.div>
  );
}

export default function CompressPdfPage() {
  const counter = useRef(0);
  const [files, setFiles] = useState<PdfItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [quality, setQuality] = useState<Quality>("60");
  const [mergeAll, setMergeAll] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    noClick: files.length > 0,
    onDrop: (accepted) => {
      setError(null);
      setFiles((current) => [...current, ...accepted.map((file) => ({ id: `${Date.now()}-${++counter.current}-${file.name}`, file }))]);
    },
  });

  const reorder = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setFiles((current) => arrayMove(current, current.findIndex(({ id }) => id === active.id), current.findIndex(({ id }) => id === over.id)));
  };

  const compress = async () => {
    if (!files.length) return;
    setWorking(true);
    setError(null);
    try {
      const result = await compressPdfs(files.map(({ file }) => file), {
        pageSize,
        compressionQuality: Number(quality),
        mergeAll: files.length > 1 && mergeAll,
      });
      const url = URL.createObjectURL(result.blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to compress these PDFs.");
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
              <Minimize2 size={15} /> PDF optimizer
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#2F180B] dark:text-white">Compress PDF files</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/65">Reduce image-heavy PDF file sizes while preserving text and document structure.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60"><LockKeyhole size={16} className="text-emerald-500" /> Secure processing</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_310px] lg:items-start">
        <section {...getRootProps()} className={isDragActive ? "rounded-3xl ring-4 ring-indigo-200 dark:ring-[#FFBA00]/20" : ""}>
          <input {...getInputProps()} />
          {!files.length ? (
            <div className="cursor-pointer rounded-3xl border-2 border-dashed border-indigo-200 bg-white p-10 text-center shadow-sm hover:border-indigo-400 dark:border-[#6D9773] dark:bg-[#173F35] dark:hover:border-[#FFBA00] sm:p-16">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]"><FilePlus2 size={29} /></div>
              <h2 className="text-xl font-semibold text-[#2F180B] dark:text-white">{isDragActive ? "Drop PDFs here" : "Choose PDF files to compress"}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-white/60">One or multiple PDF documents</p>
              <span className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#FFBA00] dark:text-[#0C3B2E]">Choose PDFs</span>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#D0C1A9]/70 bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div><h2 className="font-semibold text-[#2F180B] dark:text-white">Your PDFs</h2><p className="text-sm text-slate-500 dark:text-white/60">{files.length} files · Drag to reorder</p></div>
                <button type="button" onClick={open} className="inline-flex items-center gap-2 rounded-xl border border-[#D0C1A9] px-3.5 py-2 text-sm font-semibold text-[#2F180B] hover:border-[#5C341E] dark:border-[#6D9773] dark:text-white dark:hover:border-[#FFBA00]"><FilePlus2 size={16} /> Add more</button>
              </div>
              <DndContext collisionDetection={closestCenter} onDragEnd={reorder}>
                <SortableContext items={files.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3"><AnimatePresence>{files.map((item, index) => <PdfRow key={item.id} item={item} index={index} remove={() => setFiles((current) => current.filter(({ id }) => id !== item.id))} />)}</AnimatePresence></div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-[#D0C1A9]/70 bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] lg:sticky lg:top-24">
          <h2 className="mb-5 flex items-center gap-2 font-semibold text-[#2F180B] dark:text-white"><Settings2 size={19} className="text-indigo-600 dark:text-[#FFBA00]" /> Compression settings</h2>
          <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Compression level</label>
          <Select value={quality} onChange={setQuality} options={[
            { value: "40", label: "Maximum compression" },
            { value: "60", label: "Recommended" },
            { value: "80", label: "High quality" },
          ] as SelectOption<Quality>[]} />
          <hr className="my-4 border-[#D0C1A9]/60 dark:border-[#6D9773]/35" />
          <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/70">Page size reference</label>
          <Select value={pageSize} onChange={setPageSize} options={[
            { value: "A4", label: "A4" }, { value: "Letter", label: "Letter" }, { value: "Legal", label: "Legal" },
          ] as SelectOption<PageSize>[]} />
          <hr className="my-4 border-[#D0C1A9]/60 dark:border-[#6D9773]/35" />
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={files.length > 1 && mergeAll}
              disabled={files.length <= 1}
              onChange={(event) => setMergeAll(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 accent-[#5C341E] disabled:cursor-not-allowed disabled:opacity-50 dark:accent-[#FFBA00]"
            />
            <span>
              <span className="block text-sm font-medium text-[#2F180B] dark:text-white">Merge all PDFs into one PDF</span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-white/55">
                {files.length > 1 ? "Enabled by default for multiple files" : "Add another PDF to enable merging"}
              </span>
            </span>
          </label>
        </aside>
      </div>

      <div className="mx-auto mt-5 flex max-w-6xl flex-col items-end gap-3">
        {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        {files.length > 0 && <Button onClick={compress} disabled={working} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg"><Download size={18} /> {working ? "Compressing PDFs..." : `Compress ${files.length} ${files.length === 1 ? "PDF" : "PDFs"}`}</Button>}
      </div>
    </main>
  );
}
