"use client";

import React, {useState} from "react";
import {useDropzone} from "react-dropzone";
import {DndContext, closestCenter} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

const SortableItem = ({file, index}: { file: File; index: number }) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: file.name});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes} {...listeners}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md cursor-grab">
            {index + 1}. {file.name} - {(file.size / 1024).toFixed(2)} KB
        </li>
    );
};

const JpegToPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [orientation, setOrientation] = useState("portrait");
    const [pageSize, setPageSize] = useState("A4");
    const [includeMargins, setIncludeMargins] = useState(true);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {"image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"]},
        onDrop,
    });

    const handleDragEnd = (event: any) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        const oldIndex = files.findIndex((file) => file.name === active.id);
        const newIndex = files.findIndex((file) => file.name === over.id);
        const updatedFiles = [...files];
        const [movedFile] = updatedFiles.splice(oldIndex, 1);
        updatedFiles.splice(newIndex, 0, movedFile);
        setFiles(updatedFiles);
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-start bg-lightBgCust dark:bg-darkBgCust text-gray-900 dark:text-white p-6">
            <section className="text-center p-6">
                <p className="font-poppins text-4xl text-gray-600 dark:text-gray-300">JPEG to PDF Converter</p>
            </section>

            <div className="w-full max-w-6xl flex flex-wrap gap-4 items-center mb-4">
                <div className="flex items-center space-x-4">
                    {/* Orientation Dropdown */}
                    <div className="relative w-1/2 max-w-xs">
                        <label className="block font-poppins text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Orientation:
                        </label>
                        <div className="relative">
                            <select
                                className="w-full font-sans p-3 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md appearance-none
                           focus:ring-2 focus:ring-lightButtonHoverCust focus:outline-none transition-all
                           duration-300 ease-in-out hover:border-lightButtonHoverCust pr-10"
                                value={orientation}
                                onChange={(e) => setOrientation(e.target.value)}
                            >
                                <option
                                    className="p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-lightButtonHoverCust"
                                    value="portrait">
                                    📄 Portrait
                                </option>
                                <option
                                    className="p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-lightButtonHoverCust"
                                    value="landscape">
                                    📜 Landscape
                                </option>
                            </select>
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                ▼
            </span>
                        </div>
                    </div>

                    {/* Page Size Dropdown */}
                    <div className="relative w-1/2 max-w-xs">
                        <label className="block font-poppins text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            📄 Page Size:
                        </label>
                        <div className="relative">
                            <select
                                className="w-full font-sans p-3 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md appearance-none
                           focus:ring-2 focus:ring-lightButtonHoverCust focus:outline-none transition-all
                           duration-300 ease-in-out hover:border-lightButtonHoverCust pr-10"
                                value={pageSize}
                                onChange={(e) => setPageSize(e.target.value)}
                            >
                                <option
                                    className="p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-lightButtonHoverCust focus:bg-pink-200"
                                    value="A4">
                                    📑 A4
                                </option>
                                <option
                                    className="p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-lightButtonHoverCust"
                                    value="Letter">
                                    ✉️ Letter
                                </option>
                                <option
                                    className="p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-lightButtonHoverCust"
                                    value="Legal">
                                    ⚖️ Legal
                                </option>
                            </select>
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                ▼
            </span>
                        </div>
                    </div>
                </div>


                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="margins"
                        className="w-5 h-5 bg-white dark:text-white border-gray-300 dark:border-gray-600
                   rounded focus:ring-2 focus:ring-lightButtonHoverCust transition-all duration-300 ease-in-out
                   cursor-pointer accent-pink-500"
                        checked={includeMargins}
                        onChange={(e) => setIncludeMargins(e.target.checked)}
                    />
                    <label htmlFor="margins" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        Include Margins
                    </label>
                </div>

            </div>

            <div {...getRootProps()}
                 className={`mt-4 w-full max-w-6xl p-24 border-2 border-dashed rounded-lg cursor-pointer transition duration-300 ${
                     isDragActive ? "border-gray-50 bg-blue-50" : "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                 } ${files.length > 0 ? "p-32" : "p-24"}`}>
                <input {...getInputProps()} multiple/>
                <div className="text-center">
                    <p className="text-2xl font-medium">{isDragActive ? "Drop the files here..." : "Drag & Drop JPEG images or Click to Upload"}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">(Multiple files supported, drag to
                        reorder)</p>
                </div>
            </div>

            {files.length > 0 && (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={files.map((file) => file.name)} strategy={verticalListSortingStrategy}>
                        <div className="mt-6 w-full max-w-2xl bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
                            <h2 className="text-lg font-semibold mb-2">Selected Files (Drag to reorder):</h2>
                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <SortableItem key={file.name} file={file} index={index}/>
                                ))}
                            </ul>
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {files.length > 0 && (
                <button
                    className="mt-6 bg-darkButtonCust hover:bg-darkBgSecondarCust text-white px-6 py-2 rounded-lg font-semibold transition">
                    Convert to PDF
                </button>
            )}
        </div>
    );
};

export default JpegToPdf;
