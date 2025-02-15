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
            <div className="bg-lightBgCust dark:bg-gray-800 rounded-md shadow-lg p-4 m-3 max-w-xs h-40 hover:shadow-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-105">

                {/* Icon Section */}
                <div className="flex items-center justify-center w-1/6">
                    <Icon className={`text-3xl ${iconColor} transition-transform duration-300 hover:scale-110`} />
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
