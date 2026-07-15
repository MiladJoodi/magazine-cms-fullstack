import { Loader2 } from "lucide-react";

type CmsTableSkeletonProps = {
  label: string;
  columns: number;
  rows?: number;
};

export function CmsTableSkeleton({
  label,
  columns,
  rows = 5,
}: CmsTableSkeletonProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border bg-card"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
        <Loader2
          className="size-4 animate-spin text-muted-foreground"
          aria-hidden
        />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>

      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 px-4 py-3"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              animationDelay: `${rowIndex * 75}ms`,
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 animate-pulse rounded-md bg-muted"
                style={{
                  width: `${50 + ((rowIndex + colIndex) % 4) * 12}%`,
                  animationDelay: `${(rowIndex * columns + colIndex) * 60}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
