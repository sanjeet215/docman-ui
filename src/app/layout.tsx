import "./styles/globals.css"
import ThemeSwitcher from "./components/ThemeSwitcher";
import Navbar from "./components/NavBar";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className="transition-colors duration-300">
        <body className="bg-lightBgCust text-lightTextCust dark:bg-darkBgCust dark:text-darkTextCust min-h-screen">
            <header
                className="fixed top-0 left-0 w-full bg-white dark:bg-darkBgCust shadow-md p-4 flex justify-between items-center border-b border-cyan-50 dark:border-amber-950 z-50">
                <Navbar/>
                <ThemeSwitcher/>
            </header>
            <div className="pt-[48px] p-6">
                {children}
            </div>
        </body>
        </html>
    );
}



