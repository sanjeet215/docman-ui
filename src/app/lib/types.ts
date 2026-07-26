export type Orientation = "portrait" | "landscape";
export type PageSize = "A4" | "Letter" | "Legal";
// UI values
export type UIBorderType = "none" | "include-margins" | "thin" | "dotted";
// Backend enum values
export type BackendBorderType =
  | "THIN"
  | "NO_BORDER"
  | "MEDIUM"
  | "THICK"
  | "DOTTED"
  | "INCLUDE_MARGINS";
export type BorderType = UIBorderType | BackendBorderType;

export interface ImageToPdfDTO {
  orientation: Orientation;
  pageSize: PageSize;
  borderType: BorderType;
  mergeAll: boolean;
}

export type CompressPDFDTO = Record<string, never>;

export type WaterMarkProp = Record<string, never>;

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
  imageToPdfDTO: ImageToPdfDTO | null;
  compressPDFDTO: CompressPDFDTO | null;
  waterMarkProp: WaterMarkProp | null;
}
