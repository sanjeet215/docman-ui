"use client";

import React from 'react';
import Card from './components/Card';
import { cardConfig } from './components/cardConfig';

const Page = () => {
    return (
        <div className="min-h-screen bg-lightBgCust dark:bg-darkBgCust text-gray-900 dark:text-white">
            <main className="p-6">
                {/* Hero */}
                <section className="relative overflow-hidden rounded-2xl p-8 md:p-10 mb-6 bg-gradient-to-br from-lightButtonCust/15 via-transparent to-lightBgSecondarCust/30 dark:from-darkBgSecondarCust/30 dark:via-transparent dark:to-darkBgCust border border-gray-200/60 dark:border-gray-700">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="font-poppins text-3xl md:text-4xl font-semibold mb-3">Work Smarter with Your Documents</h1>
                        <p className="font-roboto text-base md:text-lg text-gray-700 dark:text-gray-300 mb-5">
                            Convert, compress, and organize PDFs and images in seconds — no sign-up required.
                        </p>
                    </div>
                </section>

                <section className="text-center p-6">
                    <p className="font-poppins text-lg text-gray-600 dark:text-gray-300">
                        Manage your documents effortlessly with our powerful tools. Whether you need to compress,
                        convert, or edit PDFs and images, we make it quick and hassle-free.
                    </p>
                </section>

                <section className="text-center p-6">
                    <h2 className="font-poppins text-lg font-bold mb-4">Why Choose Us?</h2>
                    <ul className="font-roboto list-none space-y-2 text-base text-gray-600 dark:text-gray-300">
                        <li>🚀 Lightning-Fast Processing – Get your files optimized in seconds.</li>
                        <li>🤖 AI-Powered Optimization – Smart compression without losing quality.</li>
                        <li>🔒 100% Secure & Private – Your files are automatically deleted after
                            processing.
                        </li>
                        <li>✅ No Sign-Up Required – Start using our tools instantly, no registration
                            needed.
                        </li>
                    </ul>
                </section>

                <section className="text-center p-6">
                    <h2 className="font-poppins text-base font-bold mb-4">Work Smarter, Not Harder!</h2>
                    <p className="font-roboto text-base text-gray-600 dark:text-gray-300">
                        Forget complicated software—our intuitive, one-click solutions help you convert, compress, and
                        edit PDFs and images effortlessly.
                    </p>
                </section>


                <div className="flex flex-wrap justify-center gap-4">
                    {cardConfig.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            content={card.content}
                            link={card.link}
                            Icon={card.Icon}
                            iconColor={card.iconColor}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Page;
