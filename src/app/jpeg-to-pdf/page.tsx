"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    rectSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, FileImage, GripVertical, ImagePlus, LockKeyhole, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/Button";
import { FileConversionSummary, type ConversionOutput } from "../components/FileConversionSummary";
import { ToolExplanation } from "../components/ToolExplanation";
import { Select, SelectOption } from "../components/Select";
import { imageToPdf } from "../services/pdfService";

type FileWithPreview = {
    id: string;
    file: File;
    preview: string;
};

// SortablePreview: expect id string for onRemove This section renders the images on drop
const SortablePreview = ({
                             item,
                             onRemove,
                         }: {
    item: FileWithPreview;
    onRemove: (id: string) => void;   // <-- expect id
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: item.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-[#D0C1A9]/70 bg-white shadow-sm dark:border-[#6D9773]/40 dark:bg-[#0C3B2E]"
        >
            <div className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-900">
                <img
                    src={item.preview}
                    alt={item.file.name}
                    className="w-full h-full object-contain p-2"
                    draggable={false}
                />
            </div>

            <div className="absolute left-2 top-2 flex max-w-[72%] items-center gap-1 rounded-lg bg-slate-950/70 px-2 py-1 text-xs text-white backdrop-blur">
                <GripVertical size={12} />
                <span className="truncate">
                {item.file.name}
                </span>
            </div>

            <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);  // <-- pass id (string)
                }}
                title="Remove image"
                aria-label={`Remove ${item.file.name}`}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-white text-rose-600 shadow transition hover:bg-rose-50 dark:bg-slate-900"
            >
                <Trash2 size={14} />
            </button>
        </motion.div>
    );
};


const JpegToPdf: React.FC = () => {
    const idCounter = useRef(0);
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    // Settings
    const [orientation, setOrientation] = useState<"portrait" | "landscape">(
        "portrait"
    );
    const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Legal">("A4");
    const [borderType, setBorderType] = useState<
        "none" | "include-margins" | "thin" | "dotted"
    >("include-margins");
    const [mergeAll, setMergeAll] = useState<boolean>(false);
    const [compressOutput, setCompressOutput] = useState<boolean>(true);
    const [isConverting, setIsConverting] = useState(false);
    const [output, setOutput] = useState<ConversionOutput | null>(null);

    const userToggledMerge = useRef(false);
    const filesRef = useRef<FileWithPreview[]>([]);
    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    const onDrop = (acceptedFiles: File[]) => {
        setOutput(null);
        const newFiles: FileWithPreview[] = acceptedFiles.map((f) => {
            idCounter.current += 1;
            return {
                id: `${idCounter.current}-${f.name}-${f.size}-${Date.now()}`,
                file: f,
                preview: URL.createObjectURL(f),
            };
        });
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
        onDrop,
        multiple: true
    });

    // Auto-check mergeAll when multiple files
    useEffect(() => {
        if (!userToggledMerge.current && files.length > 1) {
            setMergeAll(true);
        }
        if (!userToggledMerge.current && files.length <= 1) {
            setMergeAll(false);
        }
    }, [files.length]);

    // Revoke previews on unmount
    useEffect(() => {
        return () => {
            filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
        };
    }, []);

    const handleRemove = (id: string) => {
        setOutput(null);
        setFiles((prev) => {
            const removed = prev.find((p) => p.id === id);
            if (removed) URL.revokeObjectURL(removed.preview);
            return prev.filter((p) => p.id !== id);
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = files.findIndex((f) => f.id === active.id);
        const newIndex = files.findIndex((f) => f.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        setFiles((current) => arrayMove(current, oldIndex, newIndex));
    };

    const handleConvert = async () => {
        if (files.length === 0) return;
        setIsConverting(true);
        try {
            const blob = await imageToPdf(
                files.map(f => f.file),
                { orientation, pageSize, borderType, mergeAll, compressOutput }
            );

            const downloadName = files.length === 1
                ? `${files[0].file.name.replace(/\.[^.]+$/, "")}.pdf`
                : "output.pdf";
            setOutput({ name: downloadName, size: blob.size });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = downloadName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert(e instanceof Error ? e.message : "Conversion failed");
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[#E2E1DF] px-5 py-10 dark:bg-[#0C3B2E] sm:px-8 lg:px-10">
            <header className="mx-auto mb-8 max-w-7xl">
                <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400">
                    <ArrowLeft size={16} /> Back to tools
                </Link>
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]">
                            <FileImage size={15} /> Image converter
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">JPEG to PDF converter</h1>
                        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                            Upload, arrange and convert your images into a clean PDF document.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <LockKeyhole size={16} className="text-emerald-500" />
                        Files are processed securely
                    </div>
                </div>
            </header>

            <motion.div
                layout
                transition={{ duration: 0.4 }}
                className={`mx-auto max-w-7xl overflow-visible rounded-3xl transition-all duration-300 ${
                    isDragActive
                        ? "ring-4 ring-indigo-200 dark:ring-indigo-500/20"
                        : ""
                } ${files.length === 0 ? "max-w-3xl" : "w-full"} `}
            >
                <div
                    {...getRootProps()}
                    className={`transition-all duration-300 ${
                        files.length === 0
                          ? "cursor-pointer rounded-3xl border-2 border-dashed border-indigo-200 bg-white p-10 shadow-sm hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-[#6D9773] dark:bg-[#173F35] dark:hover:border-[#FFBA00] sm:p-16"
                          : ""
                    }`}
                >
                    <input {...getInputProps()} />

                    {files.length === 0 ? (
                        // Show only dropzone initially
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]">
                                <ImagePlus size={29} />
                            </div>
                            <p className="text-xl font-semibold text-slate-900 dark:text-white">
                                {isDragActive
                                    ? "Drop files here..."
                                    : "Drop your images here"}
                            </p>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                or click to browse · JPG, JPEG and PNG supported
                            </p>
                            <span className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 dark:bg-[#FFBA00] dark:text-[#0C3B2E]">Choose images</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_310px] lg:items-start">
                            {/* LEFT: Dropzone + Previews */}
                            <div className="rounded-3xl border border-[#D0C1A9]/70 bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35] sm:p-6">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-semibold text-slate-900 dark:text-white">Your images</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{files.length} {files.length === 1 ? "file" : "files"} · Drag to reorder</p>
                                    </div>
                                    <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300">
                                        <ImagePlus size={16} /> Add more
                                    </button>
                                </div>
                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext items={files.map((f) => f.id)} strategy={rectSortingStrategy}>
                                        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                                            <AnimatePresence>
                                                {files.map((file) => (
                                                    <SortablePreview
                                                        key={file.id}
                                                        item={file}
                                                        onRemove={handleRemove} // handleRemove expects (id: string)
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>

                            {/* RIGHT: Settings Panel */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="lg:sticky lg:top-24"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="rounded-3xl border border-[#D0C1A9]/70 bg-white p-5 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]">
                                    <h3 className="mb-5 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                                        <Settings2 size={19} className="text-indigo-600" />
                                        PDF settings
                                    </h3>

                                    {/* Orientation */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                            Orientation
                                        </label>
                                        <Select
                                            value={orientation}
                                            onChange={(v) => setOrientation(v)}
                                            options={[
                                                { value: "portrait", label: "Portrait" },
                                                { value: "landscape", label: "Landscape" },
                                            ] as SelectOption<"portrait" | "landscape">[]}
                                        />
                                    </div>

                                    {/* Divider */}
                                    <hr className="border-gray-200 dark:border-gray-700 my-3" />

                                    {/* Page Size */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                            Page Size
                                        </label>
                                        <Select
                                            value={pageSize}
                                            onChange={(v) => setPageSize(v)}
                                            options={[
                                                { value: "A4", label: "A4" },
                                                { value: "Letter", label: "Letter" },
                                                { value: "Legal", label: "Legal" },
                                            ] as SelectOption<"A4" | "Letter" | "Legal">[]}
                                        />
                                    </div>

                                    {/* Divider */}
                                    <hr className="border-gray-200 dark:border-gray-700 my-3" />

                                    {/* Border Type */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                            Border Type
                                        </label>
                                        <Select
                                            value={borderType}
                                            onChange={(v) => setBorderType(v)}
                                            options={[
                                                { value: "include-margins", label: "Include Margins" },
                                                { value: "none", label: "No Border" },
                                                { value: "thin", label: "Thin" },
                                                { value: "dotted", label: "Dotted" },
                                            ] as SelectOption<"none" | "include-margins" | "thin" | "dotted">[]}
                                        />
                                    </div>

                                    {/* Divider */}
                                    <hr className="border-gray-200 dark:border-gray-700 my-3" />

                                    {/* Merge Option */}
                                    <label htmlFor="mergeAll" className="flex items-center space-x-3 cursor-pointer select-none">
                                        <input
                                            id="mergeAll"
                                            type="checkbox"
                                            checked={mergeAll}
                                            onChange={(e) => {
                                                userToggledMerge.current = true;
                                                setMergeAll(e.target.checked);
                                            }}
                                            className="peer sr-only"
                                        />
                                        <span
                                            aria-hidden="true"
                                            className="grid place-items-center h-5 w-5 rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-400 transition-all duration-150 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:shadow peer-checked:ring-1 peer-checked:ring-blue-300 peer-checked:scale-[0.98] dark:border-gray-600 dark:bg-gray-900 dark:hover:border-gray-500 dark:peer-checked:bg-pink-500 dark:peer-checked:ring-pink-300 [&>svg]:hidden peer-checked:[&>svg]:block"
                                        >
                                            <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Merge all images into one PDF</span>
                                    </label>

                                    <hr className="border-gray-200 dark:border-gray-700 my-3" />

                                    <label htmlFor="compressOutput" className="flex items-center space-x-3 cursor-pointer select-none">
                                        <input
                                            id="compressOutput"
                                            type="checkbox"
                                            checked={compressOutput}
                                            onChange={(e) => setCompressOutput(e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <span
                                            aria-hidden="true"
                                            className="grid place-items-center h-5 w-5 rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-400 transition-all duration-150 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#5C341E] peer-checked:bg-[#5C341E] peer-checked:border-[#5C341E] peer-checked:shadow peer-checked:ring-1 peer-checked:ring-[#D0C1A9] peer-checked:scale-[0.98] dark:border-[#6D9773] dark:bg-[#0C3B2E] dark:peer-checked:bg-[#FFBA00] dark:peer-checked:border-[#FFBA00] [&>svg]:hidden peer-checked:[&>svg]:block"
                                        >
                                            <svg className="h-3.5 w-3.5 text-white dark:text-[#0C3B2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Compress output PDF</span>
                                    </label>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </motion.div>

            {files.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mx-auto mt-5 flex w-full max-w-7xl flex-col items-end gap-3"
                >
                    <div className="w-full"><FileConversionSummary files={files.map(({ file }) => file)} output={output} /></div>
                    <Button onClick={handleConvert} disabled={files.length === 0 || isConverting} size="lg" className="gap-2 rounded-xl px-6 py-3 shadow-lg">
                        <Download size={18} />
                        {isConverting ? "Creating your PDF..." : "Convert and download"}
                    </Button>
                </motion.div>
            )}
            <ToolExplanation maxWidth="max-w-7xl" title="What the JPEG to PDF tool does" description="Create a single, easy-to-share PDF from one image or an ordered collection of images." details={[
                { title: "Arrange your pages", description: "Drag images into the exact order they should appear in the finished document." },
                { title: "Control the layout", description: "Choose page size, orientation, margins and border treatment before conversion." },
                { title: "Download a polished PDF", description: "Merge multiple images and optionally compress the output for easier sharing." },
            ]} />
        </main>
    );
};

export default JpegToPdf;
