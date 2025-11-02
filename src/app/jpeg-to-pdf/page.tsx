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
import { Button } from "../components/Button";

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
            className="relative aspect-square w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
        >
            <div className="w-full h-full flex items-center justify-center dark:bg-gray-500">
                <img
                    src={item.preview}
                    alt={item.file.name}
                    className="w-full h-full object-contain p-2"
                    draggable={false}
                />
            </div>

            <div className="absolute left-2 top-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded max-w-[70%] truncate">
                {item.file.name}
            </div>

            <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);  // <-- pass id (string)
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
                                    <SortableContext items={files.map((f) => f.id)} strategy={rectSortingStrategy}>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-full px-0">
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
                                className="md:col-span-1 col-span-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-4 bg-white/90 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm">
                                    <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-100 mb-4 flex items-center justify-between">
                                        ⚙️ Settings
                                        <span className="text-xs text-gray-400 font-normal">PDF Options</span>
                                    </h3>

                                    {/* Orientation */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                            Orientation
                                        </label>
                                        <select
                                            value={orientation}
                                            onChange={(e) =>
                                                setOrientation(e.target.value as "portrait" | "landscape")
                                            }
                                            className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                        >
                                            <option value="portrait">Portrait</option>
                                            <option value="landscape">Landscape</option>
                                        </select>
                                    </div>

                                    {/* Divider */}
                                    <hr className="border-gray-200 dark:border-gray-700 my-3" />

                                    {/* Page Size */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                            Page Size
                                        </label>
                                        <select
                                            value={pageSize}
                                            onChange={(e) =>
                                                setPageSize(e.target.value as "A4" | "Letter" | "Legal")
                                            }
                                            className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                        >
                                            <option value="A4">A4</option>
                                            <option value="Letter">Letter</option>
                                            <option value="Legal">Legal</option>
                                        </select>
                                    </div>

                                    {/* Divider */}
                                    <hr className="border-gray-200 dark:border-gray-700 my-3" />

                                    {/* Border Type */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                            Border Type
                                        </label>
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
                                            className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                        >
                                            <option value="include-margins">Include Margins</option>
                                            <option value="none">No Border</option>
                                            <option value="thin">Thin</option>
                                            <option value="dotted">Dotted</option>
                                        </select>
                                    </div>

                                    {/* Divider */}
                                    <hr className="border-gray-200 dark:border-gray-700 my-3" />

                                    {/* Merge Option */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="mergeAll"
                                            type="checkbox"
                                            checked={mergeAll}
                                            onChange={(e) => {
                                                userToggledMerge.current = true;
                                                setMergeAll(e.target.checked);
                                            }}
                                            className="w-4 h-4 accent-pink-500 cursor-pointer rounded focus:ring-2 focus:ring-pink-400"
                                        />
                                        <label
                                            htmlFor="mergeAll"
                                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                                        >
                                            Merge all images into one PDF
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
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
                    <Button onClick={handleConvert} disabled={files.length === 0}>
                        Convert to PDF
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default JpegToPdf;
