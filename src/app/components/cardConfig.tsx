import { FaFilePdf,FaStar, FaHeart, FaBolt, FaGlobe } from "react-icons/fa";

export const cardConfig = [
    {
        title: "JPEG to PDF",
        content: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
        link: "/jpeg-to-pdf",
        Icon: FaFilePdf,
        iconColor: "text-red-700"
    },
    {
        title: "MERGE PDF",
        content: "Easily merge multiple PDFs into a single file while maintaining quality and formatting.",
        link: "/card1",
        Icon: FaFilePdf,
        iconColor: "text-red-700"
    },
    {
        title: "SPLIT PDF",
        content: "Quickly split a PDF into multiple files with precision, keeping the original quality intact.",
        link: "/card3",
        Icon: FaBolt,
        iconColor: "text-cyan-500"
    },
    {
        title: "PPT to PDF",
        content: "Convert your PowerPoint presentations to PDF effortlessly while preserving layout and design",
        link: "/card1",
        Icon: FaStar,
    },
    {
        title: "Compress PDF",
        content: "Reduce your PDF file size while maintaining quality—fast, secure, and easy to use.",
        link: "/card4",
        Icon: FaGlobe,
    }
];
