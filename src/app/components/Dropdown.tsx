import React from "react";

interface DropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    description?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange, description }) => {
    return (
        <div className="w-full">
            <label className="block font-poppins text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>
            <select
                className="w-full font-sans p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300 ease-in-out hover:border-pink-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option, index) => (
                    <option
                        key={index}
                        className="p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-pink-200 focus:bg-pink-300"
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>
            {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
        </div>
    );
};

export default Dropdown;
