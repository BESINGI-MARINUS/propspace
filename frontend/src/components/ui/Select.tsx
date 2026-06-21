import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

interface Option { value: string; label: string }

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-lg border bg-white text-ink text-sm
            focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
            ${error ? "border-red-400" : "border-surface-border"}
            ${className}`}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
