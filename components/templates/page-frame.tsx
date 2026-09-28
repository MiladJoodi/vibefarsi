"use client";

import * as React from "react";
import { SkeletonReveal } from "@/components/animations/skeleton-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** قاب صفحه با ظهور از اسکلت. */
export function PageFrame({
  children,
  className,
  delayMs = 420,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setLoading(false);
      return;
    }
    const id = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);

  const skeleton = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Skeleton className="h-20 rounded-surface" />
        <Skeleton className="h-20 rounded-surface" />
        <Skeleton className="h-20 rounded-surface" />
        <Skeleton className="h-20 rounded-surface" />
      </div>
      <Skeleton className="h-64 w-full rounded-surface" />
    </div>
  );

  return (
    <SkeletonReveal loading={loading} skeleton={skeleton} className={cn(className)}>
      {children}
    </SkeletonReveal>
  );
}
