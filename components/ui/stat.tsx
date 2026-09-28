import type { ReactNode } from "react";
import { ArrowDownLeft, ArrowUpLeft } from "lucide-react";
import { cn, faPercent } from "@/lib/utils";

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  /** Percent change vs. the previous period; sign decides the arrow and color. */
  delta?: number;
  deltaLabel?: ReactNode;
  size?: "sm" | "md";
  className?: string;
  spark?: ReactNode;
}

/** آمار. A key number with its change; the arrow points up-left, the RTL "up and forward". */
export function Stat({
  label,
  value,
  unit,
  delta,
  deltaLabel = "نسبت به دوره‌ی قبل",
  size = "md",
  className,
  spark,
}: StatProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-surface border-line border-border bg-card shadow-surface [--tw-border-style:var(--line-style)]",
        size === "sm" ? "p-3" : "p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {spark}
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p
          className={cn(
            "min-w-0 font-bold leading-tight wrap-break-word",
            size === "sm" ? "text-lg" : "text-xl sm:text-2xl",
          )}
        >
          <span className="tabular-nums">{value}</span>
          {unit && (
            <span className="ms-1 inline-block text-xs font-normal text-muted-foreground">{unit}</span>
          )}
        </p>
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold",
              up ? "text-success" : "text-destructive",
            )}
            title={String(deltaLabel)}
          >
            {up ? <ArrowUpLeft className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}
            {faPercent(Math.abs(delta))}
          </span>
        )}
      </div>
    </div>
  );
}
