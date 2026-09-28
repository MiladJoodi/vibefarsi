"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";

const faqs = [
  {
    q: "چطور سفارش را لغو کنم؟",
    a: "از صفحه‌ی سفارش‌ها منوی بیشتر را باز کنید و «لغو» را بزنید. تا قبل از ارسال، لغو رایگان است.",
  },
  {
    q: "تسویه‌ی شبا چقدر طول می‌کشد؟",
    a: "معمولاً تا ۲۴ ساعت کاری. پنج‌شنبه‌ها و جمعه‌ها ممکن است به روز کاری بعد بیفتد.",
  },
  {
    q: "چطور موجودی محصول را ببینم؟",
    a: "در محصولات، ستون موجودی و نشان «ناموجود» وضعیت را نشان می‌دهد. زیر ۵ عدد، اعلان هشدار می‌آید.",
  },
  {
    q: "پیش‌فاکتور تا کی اعتبار دارد؟",
    a: "۷ روز شمسی از تاریخ صدور. بعد از آن باید پیش‌فاکتور تازه صادر کنید.",
  },
  {
    q: "چطور تیکت پشتیبانی باز کنم؟",
    a: "از منوی پشتیبانی، «تیکت جدید» را بزنید و موضوع و جزئیات را بنویسید. پاسخ معمولاً زیر چند ساعت می‌آید.",
  },
];

/** راهنما و پرسش‌های متداول فروشگاه. */
export function HelpPage() {
  const { toast } = useToast();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">راهنما</h1>
          <p className="text-sm text-muted-foreground">پاسخ‌های پرتکرار پنل فروشگاه</p>
        </div>
        <Tooltip content="پیام شما به پشتیبانی می‌رود">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast({
                title: "درخواست ارسال شد",
                description: "به‌زودی از پشتیبانی تماس می‌گیریم.",
                variant: "success",
              })
            }
          >
            <HelpCircle />
            سوال دیگر
          </Button>
        </Tooltip>
      </div>

      <Accordion
        items={faqs.map((f, i) => ({
          id: String(i),
          title: f.q,
          content: <p className="leading-7">{f.a}</p>,
        }))}
        defaultOpen={["0"]}
      />
    </div>
  );
}
