import { postMultipartWithJson } from "../lib/api";
import type { RequestTypeDTO, Orientation, PageSize, UIBorderType, BackendBorderType } from "../lib/types";

function mapBorderType(ui: UIBorderType): BackendBorderType {
  switch (ui) {
    case "none":
      return "NO_BORDER";
    case "thin":
      return "THIN";
    case "include-margins":
      return "INCLUDE_MARGINS";
    case "dotted":
      return "DOTTED";
  }
}



export async function imageToPdf(
  files: File[],
  opts: {
    orientation: Orientation;
    pageSize: PageSize;
    borderType: UIBorderType;
    mergeAll: boolean;
    compressOutput?: boolean;
    fileName?: string;
  }
): Promise<Blob> {
  const fileName = opts.fileName ?? (files.length === 1
    ? `${files[0].name.replace(/\.[^.]+$/, "")}.pdf`
    : "output.pdf");

  const dto: RequestTypeDTO = {
    fileName,
    isImageToPdf: true,
    isMergePDF: false,
    isSplitPDF: false,
    isWatermarkPDF: false,
    isCompressPDF: opts.compressOutput ?? true,
    isExtractText: false,
    compressionRequired: opts.compressOutput ?? true,
    compressionQuality: opts.compressOutput === false ? 0 : 70,
    watermarkRequired: false,
    imageToPdfDTO: {
      orientation: opts.orientation,
      pageSize: opts.pageSize,
      borderType: mapBorderType(opts.borderType),
      mergeAll: opts.mergeAll,
    },
    compressPDFDTO: opts.compressOutput === false ? null : {
      fileName,
      pageSize: opts.pageSize,
      maxImageWidth: null,
      maxImageHeight: null,
      compressionQuality: 70,
      mergeAll: false,
    },
    waterMarkProp: null,
  };

  const res = await postMultipartWithJson("/api/pdf/imageToPdf", "files", files, "requestTypeDTO", dto);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to convert images to PDF (status ${res.status})`);
  }
  return await res.blob();
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  const form = new FormData();
  files.forEach((file) => form.append("files", file, file.name));

  const response = await fetch("/api/pdf/merge", {
    method: "POST",
    body: form,
  });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to merge PDFs (status ${response.status})`);
  }
  return response.blob();
}

export async function compressPdfs(
  files: File[],
  options: { pageSize: "A4" | "Letter" | "Legal"; compressionQuality: number; mergeAll: boolean }
): Promise<{ blob: Blob; fileName: string }> {
  const form = new FormData();
  files.forEach((file) => form.append("files", file, file.name));
  form.append(
    "compressPDFDTO",
    new Blob([JSON.stringify(options)], { type: "application/json" })
  );

  const response = await fetch("/api/pdf/compress", { method: "POST", body: form });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to compress PDFs (status ${response.status})`);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return {
    blob: await response.blob(),
    fileName: match?.[1] ?? (options.mergeAll ? "compressed-merged.pdf" : "compressed-pdfs.zip"),
  };
}

export async function addPageNumbers(
  file: File,
  options: { position: string; startNumber: number; fontSize: number }
): Promise<{ blob: Blob; fileName: string }> {
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("pageNumberDTO", new Blob([JSON.stringify(options)], { type: "application/json" }));

  const response = await fetch("/api/pdf/page-numbers", { method: "POST", body: form });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to add page numbers (status ${response.status})`);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return { blob: await response.blob(), fileName: match?.[1] ?? "numbered.pdf" };
}

export async function htmlToPdf(options: {
  html: string;
  fileName: string;
  pageSize: "A4" | "Letter" | "Legal";
  orientation: "portrait" | "landscape";
  marginMm: number;
  compress: boolean;
  compressionQuality: number;
}): Promise<{ blob: Blob; fileName: string }> {
  const response = await fetch("/api/pdf/html-to-pdf", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to convert HTML (status ${response.status})`);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return { blob: await response.blob(), fileName: match?.[1] ?? "converted.pdf" };
}

export async function rtfToPdf(
  file: File,
  options: {
    fileName: string;
    pageSize: "A4" | "Letter" | "Legal";
    orientation: "portrait" | "landscape";
    marginMm: number;
    compress: boolean;
    compressionQuality: number;
  }
): Promise<{ blob: Blob; fileName: string }> {
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("options", new Blob([JSON.stringify(options)], { type: "application/json" }));
  const response = await fetch("/api/pdf/rtf-to-pdf", { method: "POST", body: form });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to convert RTF (status ${response.status})`);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return { blob: await response.blob(), fileName: match?.[1] ?? "converted.pdf" };
}

export async function splitPdf(
  file: File,
  options: { pages: string; separateFiles: boolean }
): Promise<{ blob: Blob; fileName: string }> {
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("options", new Blob([JSON.stringify(options)], { type: "application/json" }));
  const response = await fetch("/api/pdf/split", { method: "POST", body: form });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to split PDF (status ${response.status})`);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return { blob: await response.blob(), fileName: match?.[1] ?? "split-pdf.zip" };
}

export async function watermarkPdf(
  file: File,
  options: {
    watermarkText: string;
    watermarkFontSize: number;
    watermarkPosition: string;
    watermarkAngle: number;
    watermarkOpacity: string;
    watermarkColor: string;
  }
): Promise<{ blob: Blob; fileName: string }> {
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("options", new Blob([JSON.stringify(options)], { type: "application/json" }));
  const response = await fetch("/api/pdf/watermark", { method: "POST", body: form });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to add watermark (status ${response.status})`);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return { blob: await response.blob(), fileName: match?.[1] ?? "watermarked.pdf" };
}

export class PdfPasswordRequiredError extends Error {
  constructor() {
    super("This PDF is password protected. Enter the correct password.");
    this.name = "PdfPasswordRequiredError";
  }
}

export async function unlockPdf(
  file: File,
  options: { password?: string; compress: boolean; compressionQuality: number }
): Promise<{ blob: Blob; fileName: string; wasProtected: boolean }> {
  const form = new FormData();
  form.append("file", file, file.name);
  if (options.password) form.append("password", options.password);
  form.append("compress", String(options.compress));
  form.append("compressionQuality", String(options.compressionQuality));
  const response = await fetch("/api/pdf/unlock", { method: "POST", body: form });
  if (!response.ok) {
    if (response.status === 422 && response.headers.get("x-password-required") === "true") {
      throw new PdfPasswordRequiredError();
    }
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to unlock PDF (status ${response.status})`);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return {
    blob: await response.blob(),
    fileName: match?.[1] ?? "unlocked.pdf",
    wasProtected: response.headers.get("x-was-protected") === "true",
  };
}

export async function protectPdfs(
  files: File[],
  options: { password: string; mergeAll: boolean; compress: boolean; compressionQuality: number }
): Promise<{ blob: Blob; fileName: string }> {
  const form = new FormData();
  files.forEach((file) => form.append("files", file, file.name));
  form.append("password", options.password);
  form.append("mergeAll", String(options.mergeAll));
  form.append("compress", String(options.compress));
  form.append("compressionQuality", String(options.compressionQuality));
  const response = await fetch("/api/pdf/protect", { method: "POST", body: form });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to protect PDF (status ${response.status})`);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return { blob: await response.blob(), fileName: match?.[1] ?? "protected.pdf" };
}
