"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { AnimatedList } from "@/components/animations/animated-list";
import { BorderBeam } from "@/components/animations/border-beam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { cn, fa } from "@/lib/utils";
import { timeAgo } from "@/lib/persian";

type Note = {
  id: string;
  title: string;
  description: string;
  date: Date;
  read: boolean;
  person: string;
  role?: string;
};

const seed: Note[] = [
  {
    id: "1",
    title: "سفارش جدید ثبت شد",
    description: "سفارش #۱۴۰۴۹۰ · ۲٬۴۵۰٬۰۰۰ تومان",
    date: new Date(),
    read: false,
    person: "سارا محمدی",
    role: "مشتری",
  },
  {
    id: "2",
    title: "واریز به کیف پول",
    description: "۲٬۰۰۰٬۰۰۰ تومان از کارت ۶۰۳۷ واریز شد",
    date: new Date(Date.now() - 2 * 3600e3),
    read: false,
    person: "سارا محمدی",
    role: "مدیر فروشگاه",
  },
  {
    id: "3",
    title: "پاسخ تیکت پشتیبانی",
    description: "به تیکت «واریز انجام شد…» پاسخ داد",
    date: new Date(Date.now() - 864e5),
    read: false,
    person: "مینا احمدی",
    role: "پشتیبان",
  },
  {
    id: "4",
    title: "موجودی کم شد",
    description: "هدفون بی‌سیم مدل X۲ کمتر از ۵ عدد مانده",
    date: new Date(Date.now() - 2 * 864e5),
    read: true,
    person: "سارا محمدی",
    role: "مدیر فروشگاه",
  },
  {
    id: "5",
    title: "ارسال سفارش",
    description: "سفارش #۱۴۰۴۸۸ با تیپاکس ارسال شد",
    date: new Date(Date.now() - 3 * 864e5),
    read: true,
    person: "علی رضایی",
    role: "مشتری",
  },
];

/** صفحه‌ی اعلان‌ها — کنار هر مورد آواتار شخص مرتبط. */
export function NotificationsPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState(seed);
  const unread = items.filter((i) => !i.read).length;

  function markAll() {
    setItems((list) => list.map((n) => ({ ...n, read: true })));
    toast({
      title: "همه خوانده شد",
      description: `${fa(unread)} اعلان به‌عنوان خوانده علامت خورد.`,
      variant: "success",
    });
  }

  function markOne(id: string) {
    setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">اعلان‌ها</h1>
          <p className="text-sm text-muted-foreground">
            {unread > 0 ? `${fa(unread)} اعلان خوانده‌نشده` : "همه اعلان‌ها را دیده‌اید"}
          </p>
        </div>
        <Button size="sm" variant="outline" disabled={!unread} onClick={markAll}>
          <CheckCircle2 />
          خواندن همه
        </Button>
      </div>

      <BorderBeam duration={5} color="var(--brand)">
        <div className="flex items-center gap-3 p-4">
          <ProfileAvatar name="سارا محمدی" role="مدیر فروشگاه" size="md" withCard={false} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">مرکز اعلان فروشگاه</p>
            <p className="text-xs text-muted-foreground">
              سفارش، کیف پول و پشتیبانی اینجا جمع می‌شوند.
            </p>
          </div>
          {unread > 0 && <Badge variant="brand">{fa(unread)} جدید</Badge>}
        </div>
      </BorderBeam>

      <Tabs defaultValue="all" variant="underline">
        <TabsList aria-label="فیلتر اعلان">
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="unread">نخوانده</TabsTrigger>
        </TabsList>
        {(["all", "unread"] as const).map((tab) => {
          const list = tab === "all" ? items : items.filter((n) => !n.read);
          return (
            <TabsContent key={tab} value={tab}>
              {list.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-surface border border-dashed border-border py-12 text-center">
                  <AlertTriangle className="size-5 text-muted-foreground" />
                  <p className="text-sm font-medium">اعلانی نیست</p>
                  <p className="text-xs text-muted-foreground">وقتی اتفاقی بیفتد اینجا می‌آید.</p>
                </div>
              ) : (
                <AnimatedList stagger={60} className="space-y-2">
                  {list.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markOne(n.id)}
                      className={cn(
                        "flex w-full cursor-pointer gap-3 rounded-surface border border-border bg-card p-3.5 text-start transition-colors duration-(--motion) ease-motion hover:bg-accent/50",
                        !n.read && "border-brand/30 bg-brand/5",
                      )}
                    >
                      <span className="relative mt-0.5 shrink-0">
                        <ProfileAvatar name={n.person} role={n.role} size="md" withCard={false} />
                        {!n.read && (
                          <span className="absolute -end-0.5 -top-0.5 size-2 rounded-full bg-brand ring-2 ring-card" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{n.title}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {n.person} · {n.description}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          {timeAgo(n.date)}
                        </span>
                      </span>
                    </button>
                  ))}
                </AnimatedList>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
