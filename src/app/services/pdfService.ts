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
    isCompressPDF: false,
    isExtractText: false,
    compressionRequired: false,
    compressionQuality: 0,
    watermarkRequired: false,
    imageToPdfDTO: {
      orientation: opts.orientation,
      pageSize: opts.pageSize,
      borderType: mapBorderType(opts.borderType),
      mergeAll: opts.mergeAll,
    },
    compressPDFDTO: null,
    waterMarkProp: null,
  };

  const res = await postMultipartWithJson("/api/pdf/imageToPdf", "files", files, "requestTypeDTO", dto);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to convert images to PDF (status ${res.status})`);
  }
  return await res.blob();
}
