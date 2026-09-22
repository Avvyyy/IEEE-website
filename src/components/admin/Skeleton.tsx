import { cn } from "@/lib/utils";

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface/50 overflow-hidden animate-pulse">
      <div className="h-10 border-b border-white/10 bg-white/[0.03]" />
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className={cn(
            "flex gap-4 px-4 py-3 border-b border-white/5",
            r % 2 === 1 && "bg-white/[0.02]"
          )}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={cn(
                "h-4 rounded bg-white/[0.06]",
                c === 0 ? "w-1/3" : c === cols - 1 ? "w-16" : "w-1/4"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-surface/50 p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-white/[0.06]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded bg-white/[0.06] w-1/2" />
          <div className="h-3 rounded bg-white/[0.04] w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 rounded bg-white/[0.04] w-full" />
        <div className="h-3 rounded bg-white/[0.04] w-3/4" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-white/[0.06]" />
      <div className="h-4 w-72 rounded bg-white/[0.04]" />
      <div className="flex gap-3">
        <div className="h-10 w-32 rounded-full bg-white/[0.06]" />
        <div className="h-10 w-32 rounded-full bg-white/[0.06]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
