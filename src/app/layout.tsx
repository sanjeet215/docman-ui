import "./styles/globals.css"
import ThemeSwitcher from "./components/ThemeSwitcher";
import Navbar from "./components/NavBar";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className="transition-colors duration-300">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        </head>
        <body className="bg-lightBgCust text-lightTextCust dark:bg-darkBgCust dark:text-darkTextCust min-h-screen">
            <header
                className="fixed top-0 left-0 w-full bg-white dark:bg-darkBgCust shadow-md p-4 flex justify-between items-center border-b border-cyan-50 dark:border-amber-950 z-50 h-16 md:h-20">
                <Navbar/>
                <ThemeSwitcher/>
            </header>
            {/* Spacer to offset fixed header height */}
            <div aria-hidden="true" className="h-16 md:h-20" />
            <div className="p-6">
                {children}
            </div>
        </body>
        </html>
    );
}



