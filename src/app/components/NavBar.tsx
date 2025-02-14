import Link from "next/link";

const Navbar = () => {
    return (
        <nav>
            <ul className="flex space-x-6">
                <li>
                    <Link href="/" className="hover:text-blue-500">Home</Link>
                </li>
                <li>
                    <Link href="/about" className="hover:text-blue-500">About</Link>
                </li>
                <li>
                    <Link href="/services" className="hover:text-blue-500">Services</Link>
                </li>
                <li>
                    <Link href="/contact" className="hover:text-blue-500">Contact</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
