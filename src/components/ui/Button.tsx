import { cn } from "@/utils/cn";
import * as React from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:scale-[1.02] hover:shadow-md",
    secondary:
      "bg-white text-primary border border-primary hover:bg-primary hover:text-white",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
