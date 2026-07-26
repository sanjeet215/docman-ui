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
