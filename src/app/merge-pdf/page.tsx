"use client";

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Download, FilePlus2, Files, GripVertical, LockKeyhole, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/Button";
import { FileConversionSummary, type ConversionOutput } from "../components/FileConversionSummary";
import { mergePdfs } from "../services/pdfService";

type PdfItem = {
  id: string;
  file: File;
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SortablePdf({ item, index, onRemove }: {
  item: PdfItem;
  index: number;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex items-center gap-3 rounded-2xl border border-[#D0C1A9]/70 bg-white p-3.5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#0C3B2E]"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab rounded-lg p-2 text-slate-400 hover:bg-slate-100 active:cursor-grabbing dark:hover:bg-slate-700"
        aria-label={`Move ${item.file.name}`}
      >
        <GripVertical size={18} />
      </button>
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 font-semibold text-indigo-600 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]">
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-800 dark:text-slate-100">{item.file.name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{formatSize(item.file.size)} · PDF document</p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
        aria-label={`Remove ${item.file.name}`}
      >
        <Trash2 size={17} />
      </button>
    </motion.div>
  );
}

export default function MergePdfPage() {
  const counter = useRef(0);
  const [files, setFiles] = useState<PdfItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ConversionOutput | null>(null);

  const onDrop = (accepted: File[]) => {
    setError(null);
    setOutput(null);
    const additions = accepted.map((file) => ({
      id: `${Date.now()}-${++counter.current}-${file.name}`,
      file,
    }));
    setFiles((current) => [...current, ...additions]);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    noClick: files.length > 0,
    onDrop,
  });

  const reorder = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setFiles((current) => {
      const from = current.findIndex((item) => item.id === active.id);
      const to = current.findIndex((item) => item.id === over.id);
      return from < 0 || to < 0 ? current : arrayMove(current, from, to);
    });
  };

  const merge = async () => {
    if (files.length < 2) return;
    setIsMerging(true);
    setError(null);
    try {
      const blob = await mergePdfs(files.map(({ file }) => file));
      setOutput({ name: "merged.pdf", size: blob.size });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "merged.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to merge these PDF files.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E2E1DF] px-5 py-10 dark:bg-[#0C3B2E] sm:px-8 lg:px-10">
      <header className="mx-auto mb-8 max-w-5xl">
        <Link href="/#tools" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400">
          <ArrowLeft size={16} /> Back to tools
        </Link>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]">
              <Files size={15} /> PDF organizer
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#2F180B] sm:text-4xl dark:text-white">Merge PDF files</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Combine multiple PDFs into one document. Arrange them in exactly the order you want.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <LockKeyhole size={16} className="text-emerald-500" /> Secure processing
          </div>
        </div>
      </header>

      <section
        {...getRootProps()}
        className={`mx-auto max-w-5xl rounded-3xl transition ${
          isDragActive ? "ring-4 ring-indigo-200 dark:ring-indigo-500/20" : ""
        }`}
      >
        <input {...getInputProps()} />
        {files.length === 0 ? (
          <div className="cursor-pointer rounded-3xl border-2 border-dashed border-indigo-200 bg-white p-10 text-center shadow-sm hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-[#6D9773] dark:bg-[#173F35] dark:hover:border-[#FFBA00] sm:p-16">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]">
              <FilePlus2 size={29} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {isDragActive ? "Drop PDFs here" : "Choose PDF files to merge"}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Select at least two PDF documents</p>
            <span className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 dark:bg-[#FFBA00] dark:text-[#0C3B2E]">Choose PDFs</span>
          </div>
        ) : (
          <div className="rounded-3xl border border-[#D0C1A9]/70 bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] sm:p-7">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">PDF order</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{files.length} files · Drag to reorder</p>
              </div>
              <button type="button" onClick={open} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300">
                <FilePlus2 size={16} /> Add more PDFs
              </button>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={reorder}>
              <SortableContext items={files.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  <AnimatePresence>{files.map((item, index) => (
                    <SortablePdf key={item.id} item={item} index={index} onRemove={(id) => { setOutput(null); setFiles((current) => current.filter((entry) => entry.id !== id)); }} />
                  ))}</AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </section>

      <div className="mx-auto mt-5 flex max-w-5xl flex-col items-end gap-3">
        <div className="w-full"><FileConversionSummary files={files.map(({ file }) => file)} output={output} /></div>
        {files.length === 1 && <p className="text-sm text-amber-700 dark:text-amber-300">Add one more PDF to continue.</p>}
        {error && <p role="alert" className="max-w-2xl text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        {files.length > 0 && (
          <Button onClick={merge} disabled={files.length < 2 || isMerging} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg">
            <Download size={18} /> {isMerging ? "Merging your PDFs..." : `Merge ${files.length} PDFs`}
          </Button>
        )}
      </div>
    </main>
  );
}
