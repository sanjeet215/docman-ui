import Link from "next/link";
import { Home, Info, Briefcase, Mail } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="flex items-center">
            <ul className="font-poppins flex items-center gap-5 text-gray-700 dark:text-gray-300">
                <li>
                    <Link href="/" className="flex items-center gap-2 hover:text-lightButtonHoverCust transition-colors">
                        <Home size={18} /> <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link href="/about" className="flex items-center gap-2 hover:text-lightButtonHoverCust transition-colors">
                        <Info size={18} /> <span>About</span>
                    </Link>
                </li>
                <li>
                    <Link href="/services" className="flex items-center gap-2 hover:text-lightButtonHoverCust transition-colors">
                        <Briefcase size={18} /> <span>Services</span>
                    </Link>
                </li>
                <li>
                    <Link href="/contact" className="flex items-center gap-2 hover:text-lightButtonHoverCust transition-colors">
                        <Mail size={18} /> <span>Contact</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
