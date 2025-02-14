"use client";  // This is needed for useState & useEffect to work in App Router

import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "light";
        setTheme(storedTheme);
        document.documentElement.classList.add(storedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        // Update the document root (html tag)
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);

        // Save to localStorage
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-buttonPrimaryCust text-white hover:bg-buttonPrimaryHoverCust dark:bg-buttonSecondaryCust dark:hover:bg-buttonSecondaryHoverCust transition"
        >
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
}
