import Link from "next/link";

const Navbar = () => {
    return (
        <nav>
            <ul className="font-poppins flex space-x-6">
                <li>
                    <Link href="/" className="font-poppins hover:text-lightButtonHoverCust">Home</Link>
                </li>
                <li>
                    <Link href="/about" className="font-poppins hover:text-lightButtonHoverCust">About</Link>
                </li>
                <li>
                    <Link href="/services" className="font-poppins hover:text-lightButtonHoverCust">Services</Link>
                </li>
                <li>
                    <Link href="/contact" className="font-poppins hover:text-lightButtonHoverCust">Contact</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
