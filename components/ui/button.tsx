"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const styles = {
  primary:
    "bg-[var(--foreground)] text-white shadow-[0_12px_28px_rgba(18,32,51,0.15)] hover:opacity-95",
  secondary:
    "bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[rgba(15,91,215,0.16)]",
  ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-alt)]",
  danger: "bg-[rgba(217,72,95,0.12)] text-[var(--danger)] hover:bg-[rgba(217,72,95,0.18)]",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

