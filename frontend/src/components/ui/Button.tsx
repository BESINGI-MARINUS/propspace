import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:   "bg-primary text-white hover:bg-primary-hover disabled:opacity-50",
  secondary: "bg-surface-card border border-surface-border text-ink hover:bg-surface",
  ghost:     "text-ink-muted hover:text-ink hover:bg-surface",
  danger:    "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: Props) => (
  <button
    className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors
      focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer
      ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    )}
    {children}
  </button>
);
