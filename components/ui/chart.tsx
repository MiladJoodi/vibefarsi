"use client";

import * as React from "react";
import { cn, faNumber } from "@/lib/utils";
import { JALALI_WEEKDAYS_SHORT, formatJalali, jalaliWeekday } from "@/lib/jalali";

export type Point = { label: string; value: number };

/** Labels for the last `n` days as Jalali day+month («۲۰ شهریور»). */
export function jalaliDayLabels(n: number, end = new Date()): string[] {
  return Array.from({ length: n }, (_, i) =>
    formatJalali(new Date(end.getTime() - (n - 1 - i) * 864e5), { year: false }),
  );
}

/** Saturday-first weekday labels («ش» … «ج») for the last 7 days ending today. */
export function jalaliWeekLabels(end = new Date()): string[] {
  return Array.from(
    { length: 7 },
    (_, i) => JALALI_WEEKDAYS_SHORT[jalaliWeekday(new Date(end.getTime() - (6 - i) * 864e5))],
  );
}

/** Compact Persian tick: ۱۲٫۵ م / ۸۰۰ هزار / ۹۵۰ */
export function compactFa(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${faNumber(+(n / 1e9).toFixed(1))} میلیارد`;
  if (abs >= 1e6) return `${faNumber(+(n / 1e6).toFixed(1))} میلیون`;
  if (abs >= 1e3) return `${faNumber(Math.round(n / 1e3))} هزار`;
  return faNumber(n);
}

function ticks(max: number, count = 4) {
  const step = Math.pow(10, Math.floor(Math.log10(max || 1)));
  const nice = [1, 2, 2.5, 5, 10].map((m) => m * step).find((s) => max / s <= count) ?? step;
  const top = Math.ceil(max / nice) * nice;
  return { top, values: Array.from({ length: Math.round(top / nice) + 1 }, (_, i) => i * nice) };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Progress 0→1 on mount; respects prefers-reduced-motion. */
function useReveal(duration = 920, delay = 80) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || duration <= 0) {
      setProgress(1);
      return;
    }
    let raf = 0;
    let start = 0;
    const timeout = window.setTimeout(() => {
      start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setProgress(easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [duration, delay]);

  return progress;
}

interface ChartProps {
  data: Point[];
  height?: number;
  format?: (n: number) => string;
  className?: string;
  /** Index to emphasise (e.g. today). */
  highlight?: number;
  /** Animate values from zero on mount (default true). */
  animate?: boolean;
}

/**
 * نمودار میله‌ای. Pure SVG, RTL by construction: the first point is on the right,
 * the value axis sits on the right edge, ticks are Persian and compact.
 */
export function BarChart({
  data,
  height = 180,
  format = compactFa,
  className,
  highlight,
  animate = true,
}: ChartProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const progress = useReveal(animate ? 1000 : 0, animate ? 60 : 0);
  const p = animate ? progress : 1;

  const W = 600,
    H = height,
    padR = 52,
    padL = 4,
    padT = 16,
    padB = 28;
  const { top, values } = ticks(Math.max(...data.map((d) => d.value), 1));
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const slot = plotW / data.length;
  const y = (v: number) => padT + plotH - (v / top) * plotH;
  const x = (i: number) => W - padR - (i + 1) * slot;
  const gid = React.useId();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("w-full", className)}
      role="img"
      aria-label="نمودار میله‌ای"
    >
      <defs>
        <linearGradient id={`${gid}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${gid}-mute`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {values.map((v) => (
        <g key={v}>
          <line
            x1={padL}
            x2={W - padR}
            y1={y(v)}
            y2={y(v)}
            stroke="var(--border)"
            strokeDasharray={v === 0 ? undefined : "3 4"}
            opacity={0.9}
          />
          <text
            x={W - padR + 8}
            y={y(v) + 3}
            fontSize="10"
            fill="var(--muted-foreground)"
            textAnchor="start"
          >
            {format(v)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const stagger = Math.min(1, Math.max(0, (p - i * 0.06) / 0.72));
        const shown = d.value * stagger;
        const bw = slot * 0.55;
        const bx = x(i) + (slot - bw) / 2;
        const by = y(shown);
        const barH = Math.max(0, padT + plotH - by);
        const active = hover === i || highlight === i;
        return (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect x={x(i)} y={padT} width={slot} height={plotH} fill="transparent" />
            <rect
              x={bx}
              y={by}
              width={bw}
              height={barH}
              rx="3"
              fill={active ? `url(#${gid}-bar)` : `url(#${gid}-mute)`}
            />
            {active && (
              <rect x={bx} y={by} width={bw} height={2} rx="1" fill="var(--brand)" />
            )}
            <text
              x={bx + bw / 2}
              y={H - 8}
              fontSize="11"
              fill="var(--muted-foreground)"
              textAnchor="middle"
            >
              {d.label}
            </text>
            {hover === i && stagger > 0.4 && (
              <g>
                <rect
                  x={bx + bw / 2 - 42}
                  y={Math.max(4, by - 28)}
                  width="84"
                  height="22"
                  rx="4"
                  fill="var(--popover)"
                  stroke="var(--border)"
                />
                <text
                  x={bx + bw / 2}
                  y={Math.max(4, by - 28) + 14}
                  fontSize="10"
                  fill="var(--foreground)"
                  textAnchor="middle"
                >
                  {format(d.value)}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** نمودار خطی با ناحیه. Same RTL geometry; smooth path with a soft fill. */
export function LineChart({
  data,
  height = 180,
  format = compactFa,
  className,
  animate = true,
}: ChartProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const progress = useReveal(animate ? 1100 : 0, animate ? 100 : 0);
  const p = animate ? progress : 1;
  const pathRef = React.useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = React.useState(0);

  const W = 600,
    H = height,
    padR = 52,
    padL = 4,
    padT = 16,
    padB = 28;
  const { top, values } = ticks(Math.max(...data.map((d) => d.value), 1));
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const slot = plotW / Math.max(1, data.length - 1);
  const y = (v: number) => padT + plotH - (v / top) * plotH;
  const x = (i: number) => W - padR - i * slot;

  const shown = data.map((d) => ({ ...d, value: d.value * p }));
  const pts = shown.map((d, i) => [x(i), y(d.value)] as const);
  const path = pts
    .map(([px, py], i) => {
      if (i === 0) return `M ${px} ${py}`;
      const [qx, qy] = pts[i - 1];
      const cx = (qx + px) / 2;
      return `C ${cx} ${qy}, ${cx} ${py}, ${px} ${py}`;
    })
    .join(" ");
  const area = `${path} L ${x(data.length - 1)} ${padT + plotH} L ${x(0)} ${padT + plotH} Z`;
  const gid = React.useId();

  React.useLayoutEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, [path]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("w-full", className)}
      role="img"
      aria-label="نمودار خطی"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand)" stopOpacity={0.32 * p} />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {values.map((v) => (
        <g key={v}>
          <line
            x1={padL}
            x2={W - padR}
            y1={y(v)}
            y2={y(v)}
            stroke="var(--border)"
            strokeDasharray={v === 0 ? undefined : "3 4"}
          />
          <text
            x={W - padR + 8}
            y={y(v) + 3}
            fontSize="10"
            fill="var(--muted-foreground)"
            textAnchor="start"
          >
            {format(v)}
          </text>
        </g>
      ))}
      <path d={area} fill={`url(#${gid})`} opacity={0.3 + 0.7 * p} />
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLen || undefined}
        strokeDashoffset={pathLen ? pathLen * (1 - p) : undefined}
      />
      {pts.map(([px, py], i) => (
        <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
          <rect x={px - slot / 2} y={padT} width={slot} height={plotH} fill="transparent" />
          <circle
            cx={px}
            cy={py}
            r={hover === i ? 5 : 0}
            fill="var(--background)"
            stroke="var(--brand)"
            strokeWidth="2"
            opacity={p > 0.85 ? 1 : 0}
          />
          {p > 0.9 && (
            <circle cx={px} cy={py} r={2.5} fill="var(--brand)" opacity={0.9} />
          )}
          <text
            x={px}
            y={H - 8}
            fontSize="11"
            fill="var(--muted-foreground)"
            textAnchor="middle"
          >
            {data[i].label}
          </text>
          {hover === i && p > 0.5 && (
            <g>
              <line
                x1={px}
                x2={px}
                y1={padT}
                y2={padT + plotH}
                stroke="var(--border)"
                strokeDasharray="2 3"
              />
              <rect
                x={px - 44}
                y={Math.max(4, py - 32)}
                width="88"
                height="22"
                rx="4"
                fill="var(--popover)"
                stroke="var(--border)"
              />
              <text
                x={px}
                y={Math.max(4, py - 32) + 14}
                fontSize="10"
                fill="var(--foreground)"
                textAnchor="middle"
              >
                {format(data[i].value)}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

/** اسپارک‌لاین. Tiny trend line for stat cards; no axes. */
export function Sparkline({
  data,
  className,
  positive,
  animate = true,
}: {
  data: number[];
  className?: string;
  positive?: boolean;
  animate?: boolean;
}) {
  const progress = useReveal(animate ? 700 : 0, animate ? 40 : 0);
  const p = animate ? progress : 1;
  const W = 120,
    H = 32,
    max = Math.max(...data),
    min = Math.min(...data);
  const color = positive === false ? "var(--destructive)" : "var(--success)";
  const pts = data.map((v, i) => {
    const x = W - (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * (H - 4) - 2;
    return [x, y] as const;
  });
  // Draw only up to progress along the series
  const count = Math.max(2, Math.ceil(pts.length * p));
  const visible = pts.slice(0, count);
  const poly = visible.map(([x, y]) => `${x},${y}`).join(" ");
  const gid = React.useId();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-8 w-28", className)} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.2" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {visible.length > 1 && (
        <polygon
          points={`${visible[0][0]},${H} ${poly} ${visible[visible.length - 1][0]},${H}`}
          fill={`url(#${gid})`}
        />
      )}
      <polyline
        points={poly}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
