import { FileImage, Files, Minimize2 } from "lucide-react";

export const cardConfig = [
  {
    title: "JPEG to PDF",
    content: "Turn one or more JPG, JPEG or PNG images into a polished PDF.",
    link: "/jpeg-to-pdf",
    Icon: FileImage,
    available: true,
  },
  {
    title: "Merge PDF",
    content: "Combine multiple PDF documents into one organized file.",
    link: "/merge-pdf",
    Icon: Files,
    available: true,
  },
  {
    title: "Compress PDF",
    content: "Reduce PDF file size while keeping documents clear and readable.",
    link: "/compress-pdf",
    Icon: Minimize2,
    available: true,
  },
];
