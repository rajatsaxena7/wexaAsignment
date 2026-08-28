import { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon = "◇",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-lg text-muted" aria-hidden>
        {icon}
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "We couldn't reach the database",
  description = "The graph database might be paused, unreachable, or misconfigured. Check your connection details and try again.",
  detail,
  onRetry,
}: {
  title?: string;
  description?: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-danger/20 bg-danger-bg px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-lg text-danger" aria-hidden>
        !
      </span>
      <h3 className="text-base font-semibold text-danger">{title}</h3>
      <p className="max-w-md text-sm text-muted">{description}</p>
      {detail && (
        <pre className="max-w-md whitespace-pre-wrap break-words rounded-lg bg-surface px-3 py-2 text-left text-xs text-muted">
          {detail}
        </pre>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-full border border-danger/30 px-4 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse-soft rounded-md bg-surface-muted ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-2/3" />
    </div>
  );
}
