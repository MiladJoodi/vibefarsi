"use client";

import * as React from "react";
import { ArrowDownLeft, ArrowUpLeft, Eye, EyeOff, Plus, Wallet } from "lucide-react";
import { Odometer } from "@/components/animations/odometer";
import { NumberPop } from "@/components/animations/number-pop";
import { AmountInput } from "@/components/ui/amount-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IbanInput } from "@/components/ui/iban-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { cn, fa, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const tx = [
  { id: 1, title: "واریز از کارت ۶۰۳۷", amount: 2_000_000, date: new Date(), kind: "in" as const },
  { id: 2, title: "خرید از دکان", amount: -890_000, date: new Date(Date.now() - 864e5), kind: "out" as const },
  { id: 3, title: "برداشت به شبا", amount: -1_500_000, date: new Date(Date.now() - 3 * 864e5), kind: "out" as const, pending: true },
  { id: 4, title: "بازگشت وجه سفارش #۱۴۰۴۹", amount: 640_000, date: new Date(Date.now() - 6 * 864e5), kind: "in" as const },
];

/** کیف پول: موجودی، تراکنش‌ها با تاریخ شمسی، شارژ سریع و برداشت به شبا. */
export function WalletPage() {
  const { toast } = useToast();
  const [hidden, setHidden] = React.useState(false);
  const [withdraw, setWithdraw] = React.useState(false);
  const [iban, setIban] = React.useState("");
  const [ibanOk, setIbanOk] = React.useState(false);
  const [amount, setAmount] = React.useState<number | null>(null);
  const balance = 2_100_000;
  const amt = amount ?? 0;

  function charge(v: number) {
    toast({
      title: "درگاه باز شد",
      description: `در حال انتقال برای شارژ ${formatToman(v)}`,
      variant: "success",
    });
  }

  function submitWithdraw() {
    setWithdraw(false);
    toast({
      title: "درخواست برداشت ثبت شد",
      description: `${formatToman(amt)} به شبا ارسال می‌شود.`,
      variant: "success",
    });
  }

  return (
    <div className="text-foreground">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-xl font-bold">کیف پول</h1>
          <p className="text-sm text-muted-foreground">موجودی، شارژ سریع و برداشت به شبا</p>
        </div>
        <div
          className="relative overflow-hidden rounded-surface border border-border bg-card p-6"
          style={{
            backgroundImage:
              "radial-gradient(60% 80% at 100% 0%, oklch(from var(--brand) l c h / 22%), transparent 70%)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="size-4" />
              موجودی کیف پول
            </span>
            <button
              type="button"
              onClick={() => setHidden((h) => !h)}
              aria-label={hidden ? "نمایش" : "پنهان"}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <div className="mt-3 text-3xl font-bold">
            {hidden ? "•••••••" : <Odometer value={balance} unit="تومان" />}
          </div>
          <div className="mt-5 flex gap-2">
            <Button size="sm" onClick={() => charge(500_000)}>
              <Plus />
              افزایش موجودی
            </Button>
            <Button size="sm" variant="outline" onClick={() => setWithdraw(true)}>
              برداشت
            </Button>
          </div>
        </div>

        <div className="rounded-surface border border-border bg-card p-5">
          <p className="text-sm font-semibold">شارژ سریع</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[100_000, 200_000, 500_000, 1_000_000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => charge(v)}
                className="cursor-pointer rounded-control border border-border px-3 py-1.5 text-sm transition-colors duration-(--motion) ease-motion hover:bg-accent"
              >
                <NumberPop value={v} className="text-sm" />
                <span className="ms-1 text-muted-foreground">تومان</span>
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="all" variant="underline">
          <TabsList aria-label="تراکنش‌ها">
            <TabsTrigger value="all">همه</TabsTrigger>
            <TabsTrigger value="in">واریز</TabsTrigger>
            <TabsTrigger value="out">برداشت</TabsTrigger>
          </TabsList>
          {(["all", "in", "out"] as const).map((k) => (
            <TabsContent key={k} value={k}>
              <ul className="divide-y divide-border rounded-surface border border-border bg-card">
                {tx
                  .filter((t) => k === "all" || t.kind === k)
                  .map((t) => (
                    <li key={t.id} className="flex items-center gap-3 p-4">
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full",
                          t.kind === "in" ? "bg-success/15 text-success" : "bg-secondary text-foreground",
                        )}
                      >
                        {t.kind === "in" ? (
                          <ArrowDownLeft className="size-4" />
                        ) : (
                          <ArrowUpLeft className="size-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{t.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatJalali(t.date, { weekday: true })}
                        </p>
                      </div>
                      <div className="text-end">
                        <p
                          className={cn(
                            "text-sm font-semibold tabular-nums",
                            t.kind === "in" ? "text-success" : "",
                          )}
                        >
                          {t.kind === "in" ? "+" : "−"}
                          {formatToman(Math.abs(t.amount))}
                        </p>
                        {t.pending && (
                          <Badge variant="warning" className="mt-1">
                            در انتظار تسویه
                          </Badge>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog
        open={withdraw}
        onOpenChange={setWithdraw}
        title="برداشت به حساب بانکی"
        description="تسویه‌ی شبا معمولاً تا ۲۴ ساعت کاری طول می‌کشد."
        footer={
          <>
            <Button disabled={!ibanOk || !amt || amt > balance} onClick={submitWithdraw}>
              ثبت درخواست
            </Button>
            <Button variant="ghost" onClick={() => setWithdraw(false)}>
              انصراف
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-sm font-medium">شماره‌ی شبا</span>
            <IbanInput
              value={iban}
              onChange={(v, ok) => {
                setIban(v);
                setIbanOk(ok);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-sm font-medium">مبلغ برداشت</span>
            <AmountInput
              value={amount}
              onChange={setAmount}
              max={balance}
              quick={[200_000, 500_000, 1_000_000]}
            />
            {amt > balance && (
              <p className="text-xs text-destructive">بیشتر از موجودی است</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            کارمزد: {fa(0)} تومان · واریز به نام صاحب حساب کیف پول
          </p>
        </div>
      </Dialog>
    </div>
  );
}
