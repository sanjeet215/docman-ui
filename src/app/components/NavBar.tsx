import Link from "next/link";
import { Home, Info, Briefcase, Mail } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md py-3 px-6 rounded-lg">
            <ul className="font-poppins flex space-x-6 text-gray-700 dark:text-gray-300">
                <li>
                    <Link href="/" className="flex items-center space-x-2 hover:text-lightButtonHoverCust transition duration-300">
                        <Home size={18} /> <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link href="/about" className="flex items-center space-x-2 hover:text-lightButtonHoverCust transition duration-300">
                        <Info size={18} /> <span>About</span>
                    </Link>
                </li>
                <li>
                    <Link href="/services" className="flex items-center space-x-2 hover:text-lightButtonHoverCust transition duration-300">
                        <Briefcase size={18} /> <span>Services</span>
                    </Link>
                </li>
                <li>
                    <Link href="/contact" className="flex items-center space-x-2 hover:text-lightButtonHoverCust transition duration-300">
                        <Mail size={18} /> <span>Contact</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
