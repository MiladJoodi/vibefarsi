"use client";

import * as React from "react";
import { GradientText } from "@/components/animations/gradient-text";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { cn, fa } from "@/lib/utils";

const STEPS = [
  "در حال بررسی حساب…",
  "آماده‌سازی داشبورد…",
  "بارگذاری آمار فروش…",
  "تقریباً آماده‌ست…",
] as const;

export const ENTER_DASHBOARD_FLAG = "vf-entering-dashboard";

/**
 * پوشش تمام‌صفحهٔ ورود به داشبورد؛ بعد از لاگین ظاهر می‌شود
 * تا پرش ناگهانی صفحه حس نشود.
 */
export function EnterDashboardOverlay({
  open,
  onReady,
  durationMs = 2400,
}: {
  open: boolean;
  onReady: () => void;
  durationMs?: number;
}) {
  const [step, setStep] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const readyFired = React.useRef(false);

  React.useEffect(() => {
    if (!open) {
      setVisible(false);
      setStep(0);
      setProgress(0);
      readyFired.current = false;
      return;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const showId = window.requestAnimationFrame(() => setVisible(true));
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (reduce ? 400 : durationMs));
      setProgress(t);
      const idx = Math.min(STEPS.length - 1, Math.floor(t * STEPS.length));
      setStep(idx);
      if (t < 1) {
        raf = window.requestAnimationFrame(tick);
      } else if (!readyFired.current) {
        readyFired.current = true;
        try {
          sessionStorage.setItem(ENTER_DASHBOARD_FLAG, "1");
        } catch {
          /* ignore */
        }
        onReady();
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(showId);
      window.cancelAnimationFrame(raf);
    };
  }, [open, durationMs, onReady]);

  if (!open) return null;

  const pct = Math.round(progress * 100);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background text-foreground transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {/* کاغذی + لکه‌های برند */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(from var(--foreground) l c h / 5%) 1px, transparent 1px), linear-gradient(to bottom, oklch(from var(--foreground) l c h / 5%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 15%, transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-24 top-1/4 size-[28rem] rounded-full bg-brand/15 blur-3xl motion-safe:animate-pulse-soft"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-16 bottom-1/5 size-[22rem] rounded-full bg-brand/10 blur-3xl motion-safe:animate-pulse-soft [animation-delay:700ms]"
      />

      <div className="relative flex w-full max-w-sm flex-col items-center px-6 text-center">
        <Avatar
          name="وایب‌فارسی"
          size="lg"
          className={cn(
            "mb-6 transition-transform duration-500 ease-motion",
            visible ? "scale-100" : "scale-75",
          )}
        />

        <p className="font-display text-2xl font-bold tracking-tight">
          <GradientText duration={4}>وایـب‌فارسی</GradientText>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">داره می‌ره تو داشبورد</p>

        <div className="mt-8 flex items-center gap-2.5 text-sm text-foreground">
          <Spinner size="sm" className="text-brand" />
          <span key={step} className="animate-fade-up">
            {STEPS[step]}
          </span>
        </div>

        <div className="mt-6 w-full max-w-[220px]">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="پیشرفت ورود"
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-150 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs tabular-nums text-muted-foreground">{fa(pct)}٪</p>
        </div>
      </div>
    </div>
  );
}
