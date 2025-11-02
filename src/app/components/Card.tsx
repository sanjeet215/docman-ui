"use client";

import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";

const Card = ({
                  title,
                  content,
                  link,
                  Icon,
                  iconColor = "text-gray-500",
              }: {
    title: string;
    content: string;
    link: string;
    Icon: IconType;
    iconColor?: string;
}) => {
    return (
        <Link href={link} passHref>
            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/70 dark:border-gray-700 shadow-sm p-4 m-3 max-w-xs h-40 transition-all duration-300 ease-out flex items-center gap-3 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:ring-1 hover:ring-lightButtonHoverCust/40 dark:hover:ring-darkButtonHoverCust/40">

                {/* Icon Section */}
                <div className="flex items-center justify-center w-1/6">
                    <Icon className={`text-3xl ${iconColor} transition-transform duration-300 group-hover:scale-110`} />
                </div>

                {/* Content Section */}
                <div className="w-5/6 flex flex-col justify-center">
                    <h3 className="font-poppins text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {title}
                    </h3>
                    <p className="font-roboto text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {content}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default Card;
