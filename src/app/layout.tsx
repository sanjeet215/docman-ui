import "./styles/globals.css"
import ThemeSwitcher from "./components/ThemeSwitcher";
import Navbar from "./components/NavBar";

// export default function Layout({children}: { children: React.ReactNode }) {
//     return (
//         <html lang="en" className="transition-colors duration-300">
//         <body className="bg-lightBgCust text-lightTextCust dark:bg-darkBgCust dark:text-darkTextCust">
//         <header className="p-5 flex justify-between items-center border-b border-cyan-50 dark:border-amber-950">
//             <Navbar/>
//             <ThemeSwitcher/>
//         </header>
//         <main className="p-6">{children}</main>
//         </body>
//         </html>
//     );
// }

// export default function Layout({children}: { children: React.ReactNode }) {
//     return (
//         <html lang="en" className="transition-colors min-h-screen duration-300">
//         <body className="bg-lightBgCust text-lightTextCust dark:bg-darkBgCust dark:text-darkTextCust min-h-screen">
//         <header className="p-5 flex justify-between items-center border-b border-cyan-50 dark:border-amber-950">
//             <Navbar/>
//         </header>
//             <ThemeSwitcher/>
//             {children}
//         </body>
//         </html>
//     );
// }

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body
                className="bg-lightBgCust text-lightTextCust dark:bg-darkBgCust dark:text-darkTextCust transition-colors duration-300">
                <header className="p-5 flex justify-between items-center border-b border-cyan-50 dark:border-amber-950">
                    <Navbar/>
                    <ThemeSwitcher/>
                </header>
                <main className="p-6">
                    {children}
                </main>
            </body>
        </html>
    );
}



