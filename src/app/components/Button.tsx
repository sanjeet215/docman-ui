"use client";

import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-lg font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const byVariant: Record<Variant, string> = {
  primary:
    "bg-darkButtonCust text-white hover:bg-darkBgSecondarCust focus-visible:outline-darkButtonCust dark:bg-darkButtonCust dark:hover:bg-darkButtonHoverCust",
  secondary:
    "bg-lightButtonCust text-white hover:bg-lightButtonHoverCust focus-visible:outline-lightButtonCust dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
  ghost:
    "bg-transparent text-lightTextCust hover:bg-black/5 dark:text-darkTextCust dark:hover:bg-white/10",
};

const bySize: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) => {
  return (
    <button className={[base, byVariant[variant], bySize[size], className].join(" ")} {...rest}>
      {children}
    </button>
  );
};

export const ButtonLink: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant; size?: Size }
> = ({ href, variant = "primary", size = "md", className = "", children, ...rest }) => {
  return (
    <Link
      href={href}
      className={[base, byVariant[variant], bySize[size], className].join(" ")}
      {...rest}
    >
      {children}
    </Link>
  );
};
