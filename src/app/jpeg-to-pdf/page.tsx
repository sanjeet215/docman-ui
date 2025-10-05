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

type FileWithPreview = {
    id: string;
    file: File;
    preview: string;
};

const SortablePreview = ({
                             item,
                             onRemove,
                         }: {
    item: FileWithPreview;
    onRemove: (id: string) => void;
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
            transition={{ duration: 0.18 }}
            className="relative rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
        >
            <img
                src={item.preview}
                alt={item.file.name}
                className="object-cover w-full h-28"
                draggable={false}
            />

            <div className="absolute left-2 top-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded max-w-[70%] truncate">
                {item.file.name}
            </div>

            <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                }}
                title="Remove image"
                className="absolute right-2 top-2 bg-red-600 bg-opacity-90 hover:bg-opacity-100 text-white text-xs px-2 py-0.5 rounded"
            >
                ✕
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

    const userToggledMerge = useRef(false);
    const filesRef = useRef<FileWithPreview[]>([]);
    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    const onDrop = (acceptedFiles: File[]) => {
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

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
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
        console.log({ files, orientation, pageSize, borderType, mergeAll });
        alert("Convert action triggered — implement PDF generation here.");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-lightBgCust dark:bg-darkBgCust text-gray-900 dark:text-white p-6">
            <header className="max-w-full mx-auto mb-4">
                <section className="text-center p-6">
                    <p className="font-poppins text-4xl text-gray-600 dark:text-gray-300">
                        JPEG to PDF Converter
                    </p>
                </section>
            </header>

            {/* Container that expands */}
            <motion.div
                layout
                transition={{ duration: 0.4 }}
                className={`mx-auto rounded-lg border-2 border-dashed transition-all duration-300 overflow-hidden ${
                    isDragActive
                        ? "border-gray-50 bg-blue-50"
                        : "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                } ${files.length === 0 ? "w-1/2" : "w-full"} `}
            >
                <div
                    {...getRootProps()}
                    className={`transition-all duration-300 ${
                        files.length === 0 ? "p-8" : "p-4 md:p-6"
                    }`}
                >
                    <input {...getInputProps()} />

                    {files.length === 0 ? (
                        // Show only dropzone initially
                        <div className="flex flex-col items-center justify-center text-center cursor-pointer">
                            <p className="text-xl font-medium">
                                {isDragActive
                                    ? "Drop files here..."
                                    : "Drag & Drop JPEG images or Click to Upload"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                (Multiple files supported)
                            </p>
                        </div>
                    ) : (
                        // Once files exist — expand view
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                            {/* LEFT: Dropzone + Previews */}
                            <div className="md:col-span-4 col-span-1 rounded-md flex flex-col">
                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={files.map((f) => f.id)}
                                        strategy={rectSortingStrategy}
                                    >
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            <AnimatePresence>
                                                {files.map((f) => (
                                                    <SortablePreview
                                                        key={f.id}
                                                        item={f}
                                                        onRemove={handleRemove}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>

                            {/* RIGHT: Settings */}
                            <div
                                className="md:col-span-1 col-span-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                                    <h3 className="font-medium mb-2">Settings</h3>

                                    <label className="block text-sm mb-1">Orientation</label>
                                    <select
                                        value={orientation}
                                        onChange={(e) =>
                                            setOrientation(e.target.value as "portrait" | "landscape")
                                        }
                                        className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 mb-3 text-sm"
                                    >
                                        <option value="portrait"> 🚀 Portrait</option>
                                        <option value="landscape">Landscape</option>
                                    </select>

                                    <label className="block text-sm mb-1">Page Size</label>
                                    <select
                                        value={pageSize}
                                        onChange={(e) =>
                                            setPageSize(e.target.value as "A4" | "Letter" | "Legal")
                                        }
                                        className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 mb-3 text-sm"
                                    >
                                        <option value="A4">A4</option>
                                        <option value="Letter">Letter</option>
                                        <option value="Legal">Legal</option>
                                    </select>

                                    <label className="block text-sm mb-1">Border Type</label>
                                    <select
                                        value={borderType}
                                        onChange={(e) =>
                                            setBorderType(
                                                e.target.value as
                                                    | "none"
                                                    | "include-margins"
                                                    | "thin"
                                                    | "dotted"
                                            )
                                        }
                                        className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 mb-3 text-sm"
                                    >
                                        <option value="include-margins">Include Margins</option>
                                        <option value="none">No Border</option>
                                        <option value="thin">Thin</option>
                                        <option value="dotted">Dotted</option>
                                    </select>

                                    <div className="flex items-center space-x-2 mt-1">
                                        <input
                                            id="mergeAll"
                                            type="checkbox"
                                            checked={mergeAll}
                                            onChange={(e) => {
                                                userToggledMerge.current = true;
                                                setMergeAll(e.target.checked);
                                            }}
                                            className="w-4 h-4 rounded cursor-pointer accent-pink-500"
                                        />
                                        <label htmlFor="mergeAll" className="text-sm">
                                            Merge all images
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Convert Button */}
            {files.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full mx-auto mt-4 flex justify-end w-full"
                >
                    <button
                        onClick={handleConvert}
                        disabled={files.length === 0}
                        className={`px-5 py-2 rounded-lg font-semibold transition ${
                            files.length === 0
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-darkButtonCust hover:bg-darkBgSecondarCust text-white"
                        }`}
                    >
                        Convert to PDF
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default JpegToPdf;
