"use client";

import * as React from "react";
import { Bell, CreditCard, Store, Truck } from "lucide-react";
import { AmountInput } from "@/components/ui/amount-input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Field, Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarItem } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

function Panel({
  title,
  desc,
  children,
  footer,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="rounded-surface border-line border-border bg-card shadow-surface [--tw-border-style:var(--line-style)]">
      <div className="border-b border-border p-5">
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="flex justify-start border-t border-border p-4">{footer}</div>}
    </section>
  );
}

type Section = "shop" | "shipping" | "payments" | "notifications";

/** تنظیمات فروشگاه: اطلاعات فروشگاه، ارسال، درگاه و اعلان‌ها. */
export function ShopSettingsPage() {
  const { toast } = useToast();
  const [section, setSection] = React.useState<Section>("shop");
  const [phone, setPhone] = React.useState("09121234567");
  const [shipFee, setShipFee] = React.useState<number | null>(85_000);
  const [shipFree, setShipFree] = React.useState<number | null>(1_500_000);

  const nav: { id: Section; icon: typeof Store; label: string }[] = [
    { id: "shop", icon: Store, label: "فروشگاه" },
    { id: "shipping", icon: Truck, label: "ارسال" },
    { id: "payments", icon: CreditCard, label: "پرداخت" },
    { id: "notifications", icon: Bell, label: "اعلان‌ها" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">تنظیمات فروشگاه</h1>
        <p className="text-sm text-muted-foreground">اطلاعات عمومی، ارسال، درگاه و اعلان‌ها</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <Sidebar className="h-fit w-full shrink-0 rounded-surface bg-muted/40 lg:w-52">
          {nav.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={`#${item.id}`}
              active={section === item.id}
              onClick={(e) => {
                e.preventDefault();
                setSection(item.id);
              }}
            />
          ))}
        </Sidebar>

        <div className="min-w-0 flex-1 space-y-6">
          {section === "shop" && (
            <Panel
              title="اطلاعات فروشگاه"
              desc="نام، تماس و آدرسی که روی فاکتور و صفحه‌ی فروشگاه دیده می‌شود."
              footer={
                <Button
                  size="sm"
                  onClick={() => toast({ title: "تغییرات ذخیره شد", variant: "success" })}
                >
                  ذخیره تغییرات
                </Button>
              }
            >
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <ProfileAvatar name="وایب‌فارسی" role="فروشگاه" size="lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-sm font-medium">لوگوی فروشگاه</p>
                  <FileUpload accept="image/*" multiple={false} maxSize={1_000_000} hint="حداکثر ۱ مگابایت" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="نام فروشگاه" htmlFor="shop-name">
                  <Input id="shop-name" defaultValue="فروشگاه وایب‌فارسی" />
                </Field>
                <Field label="دامنه" htmlFor="shop-domain">
                  <Input id="shop-domain" dir="ltr" defaultValue="shop.vibefarsi.ir" />
                </Field>
                <Field label="ایمیل پشتیبانی" htmlFor="shop-email">
                  <Input id="shop-email" dir="ltr" type="email" defaultValue="support@vibefarsi.ir" />
                </Field>
                <div className="space-y-1.5">
                  <span className="text-sm font-medium">موبایل پشتیبانی</span>
                  <PhoneInput value={phone} onChange={setPhone} />
                </div>
                <Field label="استان" htmlFor="shop-province" className="sm:col-span-1">
                  <Select
                    id="shop-province"
                    defaultValue="tehran"
                    options={[
                      { value: "tehran", label: "تهران" },
                      { value: "isfahan", label: "اصفهان" },
                      { value: "shiraz", label: "فارس" },
                      { value: "mashhad", label: "خراسان رضوی" },
                    ]}
                  />
                </Field>
                <Field label="شهر" htmlFor="shop-city">
                  <Input id="shop-city" defaultValue="تهران" />
                </Field>
                <Field label="آدرس کامل" htmlFor="shop-address" className="sm:col-span-2">
                  <Input id="shop-address" defaultValue="خیابان ولیعصر، پلاک ۱۲، واحد ۳" />
                </Field>
              </div>
            </Panel>
          )}

          {section === "shipping" && (
            <Panel
              title="روش‌های ارسال"
              desc="هزینه و روش پیش‌فرض ارسال برای سفارش‌های داخل ایران."
              footer={
                <Button
                  size="sm"
                  onClick={() => toast({ title: "تنظیمات ارسال ذخیره شد", variant: "success" })}
                >
                  ذخیره ارسال
                </Button>
              }
            >
              <RadioGroup
                variant="cards"
                defaultValue="post"
                options={[
                  {
                    value: "post",
                    label: "پست پیشتاز",
                    description: "۲ تا ۴ روز کاری · مناسب سفارش‌های سبک",
                  },
                  {
                    value: "tipax",
                    label: "تیپاکس",
                    description: "۱ تا ۳ روز کاری · رهگیری دقیق‌تر",
                  },
                  {
                    value: "courier",
                    label: "پیک درون‌شهری",
                    description: "همان روز در تهران · فقط مناطق منتخب",
                  },
                ]}
              />
              <Separator className="my-5" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="text-sm font-medium">هزینه‌ی ارسال پایه</span>
                  <AmountInput value={shipFee} onChange={setShipFee} />
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm font-medium">آستانه‌ی ارسال رایگان</span>
                  <AmountInput value={shipFree} onChange={setShipFree} />
                </div>
              </div>
            </Panel>
          )}

          {section === "payments" && (
            <Panel
              title="درگاه پرداخت"
              desc="درگاه فعال برای تسویه‌ی آنلاین با مبلغ تومان."
              footer={
                <Button
                  size="sm"
                  onClick={() => toast({ title: "درگاه ذخیره شد", variant: "success" })}
                >
                  ذخیره درگاه
                </Button>
              }
            >
              <RadioGroup
                variant="cards"
                defaultValue="zarinpal"
                options={[
                  {
                    value: "zarinpal",
                    label: "زرین‌پال",
                    description: "تسویه‌ی سریع و کارتابل آشنا برای مشتری ایرانی",
                  },
                  {
                    value: "idpay",
                    label: "آیدی‌پی",
                    description: "مناسب فروشگاه‌های با حجم تراکنش متوسط",
                  },
                  {
                    value: "cod",
                    label: "پرداخت در محل",
                    description: "فقط برای ارسال با پیک درون‌شهری",
                  },
                ]}
              />
              <div className="mt-5">
                <Field label="مرچنت کد" htmlFor="merchant" hint="فقط عدد لاتین؛ در فاکتور نمایش داده نمی‌شود.">
                  <Input id="merchant" dir="ltr" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                </Field>
              </div>
            </Panel>
          )}

          {section === "notifications" && (
            <Panel title="اعلان‌ها" desc="کدام رویدادهای فروشگاه را می‌خواهید فوری بدانید؟">
              <ul className="divide-y divide-border">
                {(
                  [
                    ["سفارش جدید", "با هر سفارش پیامک و ایمیل بگیرید", true],
                    ["موجودی کم", "وقتی موجودی زیر ۲۰ عدد رفت", true],
                    ["خلاصه‌ی روزانه", "هر شب ساعت ۲۱", true],
                    ["پیشنهادهای بازاریابی", "گاهی؛ نه بیشتر از هفته‌ای یک بار", false],
                  ] as const
                ).map(([t, d, on]) => (
                  <li key={t} className={cn("flex items-center justify-between py-3 first:pt-0 last:pb-0")}>
                    <div>
                      <p className="text-sm font-medium">{t}</p>
                      <p className="text-xs text-muted-foreground">{d}</p>
                    </div>
                    <Switch defaultChecked={on} aria-label={t} />
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
