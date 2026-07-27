import { CodeXml, FileImage, Files, FileType2, ListOrdered, Minimize2, Scissors } from "lucide-react";

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
  {
    title: "Add page numbers",
    content: "Add clear, sequential page numbers to any PDF document.",
    link: "/page-numbers",
    Icon: ListOrdered,
    available: true,
  },
  {
    title: "HTML to PDF",
    content: "Turn HTML and CSS into a polished, print-ready PDF document.",
    link: "/html-to-pdf",
    Icon: CodeXml,
    available: true,
  },
  {
    title: "RTF to PDF",
    content: "Convert formatted RTF documents into polished, shareable PDFs.",
    link: "/rtf-to-pdf",
    Icon: FileType2,
    available: true,
  },
  {
    title: "Split PDF",
    content: "Separate one page or a whole set into independent PDF files.",
    link: "/split-pdf",
    Icon: Scissors,
    available: true,
  },
];
