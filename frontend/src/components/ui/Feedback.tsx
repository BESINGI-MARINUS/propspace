// Spinner
export const Spinner = ({ className = "" }: { className?: string }) => (
  <div className={`flex justify-center items-center py-16 ${className}`}>
    <span className="w-9 h-9 border-4 border-surface-border border-t-primary rounded-full animate-spin" />
  </div>
);

// Empty state
interface EmptyProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <h3 className="font-display text-xl text-ink mb-1">{title}</h3>
    {description && (
      <p className="text-ink-muted text-sm max-w-xs">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// Error message
export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {message}
  </div>
);

// Success message
export const SuccessMessage = ({ message }: { message: string }) => (
  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
    {message}
  </div>
);
