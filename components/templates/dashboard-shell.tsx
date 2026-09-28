"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  LineChart,
  Sparkline,
  jalaliDayLabels,
  jalaliWeekLabels,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SearchInput } from "@/components/ui/search-input";
import { Stat } from "@/components/ui/stat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppShell } from "@/components/templates/app-shell";
import { NumberPop } from "@/components/animations/number-pop";
import { cn, fa, faNumber, faPercent, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const weekLabels = jalaliWeekLabels();
const dayLabels14 = jalaliDayLabels(14);

const weeklySales = [8.2, 11.4, 9.8, 14.6, 13.1, 18.4, 12.0].map((v, i) => ({
  label: weekLabels[i],
  value: Math.round(v * 1_000_000),
}));

const monthlyTrend = [42, 48, 45, 52, 58, 55, 61, 66, 63, 71, 74, 69, 78, 82].map((v, i) => ({
  label: i % 2 ? "" : dayLabels14[i],
  value: v * 1_000_000,
}));

const visitors = [3.1, 3.4, 2.9, 4.2, 3.8, 5.1, 4.6].map((v, i) => ({
  label: weekLabels[i],
  value: Math.round(v * 1000),
}));

const categoryBars = [
  { label: "لباس", value: 42 },
  { label: "کفش", value: 28 },
  { label: "لوازم", value: 18 },
  { label: "زیبایی", value: 12 },
].map((d) => ({ label: d.label, value: d.value * 1_000_000 }));

const sparks = {
  sales: [40, 42, 45, 44, 48, 52, 55, 58],
  orders: [20, 22, 19, 24, 26, 25, 28, 30],
  customers: [12, 14, 13, 11, 15, 16, 14, 13],
  basket: [30, 31, 33, 32, 34, 36, 35, 37],
};

const products = [
  { name: "کتانی اسپرت", sold: 186, revenue: 74_400_000, spark: [20, 24, 22, 28, 30, 33, 31, 36], up: true },
  { name: "هودی زمستانی", sold: 142, revenue: 56_800_000, spark: [30, 28, 26, 24, 22, 20, 19, 18], up: false },
  { name: "کیف چرمی", sold: 98, revenue: 49_000_000, spark: [10, 12, 14, 13, 16, 18, 17, 20], up: true },
  { name: "عطر مینیمال", sold: 76, revenue: 38_000_000, spark: [8, 9, 11, 10, 12, 14, 13, 15], up: true },
];

const orders = [
  { id: "14052", name: "مریم احمدی", amount: 2_890_000, status: "پرداخت‌شده", tone: "success" as const },
  { id: "14051", name: "علی رضایی", amount: 640_000, status: "در انتظار", tone: "warning" as const },
  { id: "14050", name: "نگار کریمی", amount: 1_215_000, status: "ارسال‌شده", tone: "brand" as const },
  { id: "14049", name: "رضا موسوی", amount: 3_400_000, status: "پرداخت‌شده", tone: "success" as const },
  { id: "14048", name: "سارا نوری", amount: 890_000, status: "لغو شده", tone: "destructive" as const },
  { id: "14047", name: "حسین کاظمی", amount: 4_120_000, status: "پرداخت‌شده", tone: "success" as const },
];

const channels = [
  { name: "اینستاگرام", value: 48 },
  { name: "سایت", value: 32 },
  { name: "دیجی‌کالا", value: 14 },
  { name: "سایر", value: 6 },
];

function Panel({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-surface border-line border-border bg-card shadow-surface [--tw-border-style:var(--line-style)]",
        padded && "p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PanelTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function useProgressReveal(target: number, delay = 200) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    const t = window.setTimeout(() => setValue(target), delay);
    return () => window.clearTimeout(t);
  }, [target, delay]);
  return value;
}

function AnimatedProgress(props: React.ComponentProps<typeof Progress> & { delay?: number }) {
  const { value = 0, delay = 180, ...rest } = props;
  const shown = useProgressReveal(value, delay);
  return <Progress {...rest} value={shown} />;
}

/** داشبورد فروش با آمار، چند نمودار و جدول سفارش‌ها. */
export function DashboardShell() {
  return (
    <AppShell>
      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              نمای کلی فروش
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatJalali(new Date(), { weekday: true })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden min-w-0 flex-1 md:block md:w-56 lg:w-64">
              <SearchInput placeholder="جست‌وجو در سفارش‌ها…" size="sm" />
            </div>
            <Button size="sm" className="min-h-10">
              <Plus className="size-4" />
              <span className="hidden sm:inline">محصول جدید</span>
              <span className="sm:hidden">جدید</span>
            </Button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "فروش امروز",
              value: faNumber(12_450_000),
              unit: "تومان",
              delta: 18,
              spark: sparks.sales,
              up: true,
            },
            {
              label: "سفارش‌های باز",
              value: fa(246),
              delta: 12,
              spark: sparks.orders,
              up: true,
            },
            {
              label: "مشتریان جدید",
              value: fa(38),
              delta: -4,
              spark: sparks.customers,
              up: false,
            },
            {
              label: "میانگین سبد",
              value: faNumber(1_860_000),
              unit: "تومان",
              delta: 6,
              spark: sparks.basket,
              up: true,
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className="animate-enter-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Stat
                label={s.label}
                value={s.value}
                unit={s.unit}
                delta={s.delta}
                className="rounded-surface border-line shadow-surface h-full"
                spark={<Sparkline data={s.spark} positive={s.up} />}
              />
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-5">
          <Panel className="xl:col-span-3">
            <PanelTitle
              title="فروش هفتگی"
              description="شنبه تا جمعه · تومان"
              action={<Badge variant="success">رشد ۲۳٪</Badge>}
            />
            <div className="min-h-[220px]">
              <BarChart data={weeklySales} height={220} highlight={5} />
            </div>
          </Panel>
          <div className="flex flex-col gap-4 xl:col-span-2">
            <Panel>
              <PanelTitle title="هدف ماهانه" description="از هدف ۳۰۰ میلیون تومانی" />
              <div className="mt-1 space-y-2">
                <AnimatedProgress value={72} showValue delay={280} />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>۲۱۶ میلیون</span>
                  <span>۳۰۰ میلیون</span>
                </div>
              </div>
            </Panel>
            <Panel className="flex-1">
              <PanelTitle title="کانال‌های فروش" />
              <div className="space-y-3">
                {channels.map((c, i) => (
                  <AnimatedProgress
                    key={c.name}
                    label={c.name}
                    value={c.value}
                    showValue
                    size="sm"
                    delay={220 + i * 80}
                  />
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelTitle
              title="روند ۱۴ روزه"
              description="فروش روزانه با برچسب شمسی"
              action={<Badge variant="brand">اوج جمعه</Badge>}
            />
            <div className="min-h-[210px]">
              <LineChart data={monthlyTrend} height={210} />
            </div>
          </Panel>
          <Panel>
            <PanelTitle
              title="بازدید سایت"
              description="هفته‌ی جاری · هزار نفر"
              action={<Badge variant="success">+{faPercent(9)}</Badge>}
            />
            <div className="min-h-[210px]">
              <LineChart data={visitors} height={210} />
            </div>
          </Panel>
        </section>

        <section className="grid gap-4 xl:grid-cols-5">
          <Panel className="xl:col-span-2">
            <PanelTitle title="فروش بر اساس دسته" />
            <div className="min-h-[200px]">
              <BarChart data={categoryBars} height={200} />
            </div>
          </Panel>
          <Panel padded={false} className="xl:col-span-3">
            <div className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-5">
              <p className="text-sm font-semibold">پرفروش‌ترین محصولات</p>
              <Button variant="ghost" size="sm">
                مشاهده همه
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>محصول</TableHead>
                    <TableHead>فروش</TableHead>
                    <TableHead className="hidden sm:table-cell">روند</TableHead>
                    <TableHead>درآمد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.name}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell numeric>{fa(p.sold)} عدد</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Sparkline data={p.spark} positive={p.up} />
                      </TableCell>
                      <TableCell numeric>{formatToman(p.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </section>

        <Panel padded={false}>
          <div className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-5">
            <div>
              <p className="text-sm font-semibold">سفارش‌های اخیر</p>
              <p className="text-xs text-muted-foreground">{fa(orders.length)} سفارش آخر</p>
            </div>
            <a
              href="/dashboard/orders"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              مشاهده‌ی همه
            </a>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شماره</TableHead>
                  <TableHead>مشتری</TableHead>
                  <TableHead>مبلغ</TableHead>
                  <TableHead>وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="text-xs text-muted-foreground" dir="ltr">
                      #{fa(o.id)}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <ProfileAvatar name={o.name} size="sm" role="مشتری" />
                        <span className="truncate">{o.name}</span>
                      </span>
                    </TableCell>
                    <TableCell numeric>{formatToman(o.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={o.tone}>{o.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
