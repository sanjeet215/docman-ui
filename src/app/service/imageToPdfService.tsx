// apiService.ts

import axios from "axios";

export interface RequestTypeDTO {
    fileName: string;
    isImageToPdf: boolean;
    isMergePDF: boolean;
    isSplitPDF: boolean;
    isWatermarkPDF: boolean;
    isCompressPDF: boolean;
    isExtractText: boolean;
    compressionRequired: boolean;
    compressionQuality: number;
    watermarkRequired: boolean;
    imageToPdfDTO: ImageToPdfDTO;
}

export interface ImageToPdfDTO {
    fileName: string;
    borderType?: string; // Optional, assuming this is an enum or similar
    pageSize: string;
}

export const convertImagesToPdf = async (
    files: File[],
    pageSize: string, // Pass page size from the component (e.g., 'A4', 'Letter')
    includeMargins: boolean,
): Promise<void> => {
    const formData = new FormData();

    // Append files to formData
    files.forEach((file) => {
        formData.append("files", file);
    });

    // Construct the DTO with isImageToPdf=true and set additional properties
    const requestTypeDTO: RequestTypeDTO = {
        fileName: "output.pdf",
        isImageToPdf: true,
        isMergePDF: false,
        isSplitPDF: false,
        isWatermarkPDF: false,
        isCompressPDF: false,
        isExtractText: false,
        compressionRequired: false,
        compressionQuality: 80, // Default compression quality
        watermarkRequired: false,
        imageToPdfDTO: {
            fileName: "output.pdf",
            borderType: includeMargins ? "WITH_MARGIN" : "NO_MARGIN", // Example of a condition
            pageSize: pageSize,
        },
    };

    // Append serialized DTO as a JSON string
    formData.append(
        "requestTypeDTO",
        new Blob([JSON.stringify(requestTypeDTO)], { type: "application/json" })
    );

    try {
        // API call
        const response = await axios.post("/imageToPdf", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            responseType: "blob", // Expecting a file in the response
        });

        // Create a download link for the returned file
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Trigger the file download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "output.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("PDF successfully downloaded");
    } catch (error) {
        console.error("Error converting images to PDF:", error);
        throw error;
    }
};