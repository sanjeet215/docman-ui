"use client"; // Ensure this is at the top to make it a client-side component

import React from 'react';
import Link from 'next/link';

const Card = ({ title, content, link }: { title: string; content: string; link: string }) => {
    return (
        <Link href={link} passHref>
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4 w-100 h-40 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between cursor-pointer"
            >
                <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white overflow-hidden text-ellipsis whitespace-nowrap">
                    {title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                    {content}
                </p>
            </div>
        </Link>
    );
};

export default Card;
