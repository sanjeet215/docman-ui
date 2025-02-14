"use client";

import React from 'react';
import Card from './components/Card';
import { cardConfig } from './components/cardConfig';

const Page = () => {
    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-white">
            <main className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-center">Main Content</h1>
                <div className="flex flex-wrap justify-center gap-4">
                    {cardConfig.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            content={card.content}
                            link={card.link}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Page;
