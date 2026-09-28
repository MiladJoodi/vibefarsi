"use client";

import * as React from "react";
import { LayoutGrid, List, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { NumberPop } from "@/components/animations/number-pop";
import { ProductGrid, type Product } from "@/components/blocks/product-grid";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "@/components/ui/sheet";
import { Field, Input } from "@/components/ui/input";
import { AmountInput } from "@/components/ui/amount-input";
import { FileUpload } from "@/components/ui/file-upload";
import { Sparkline } from "@/components/ui/chart";
import { Stat } from "@/components/ui/stat";
import { useToast } from "@/components/ui/toast";
import { fa, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

type Row = Product & { spark?: number[]; [k: string]: unknown };

const catalog: Row[] = [
  { id: "p1", name: "کتانی اسپرت سفید", price: 2_890_000, original: 3_450_000, rating: 4.6, reviews: 128, badge: "پرفروش", category: "کفش", stock: 42, imageSrc: "/products/sneakers-white.png", spark: [20, 24, 22, 28, 30, 33, 31, 36] },
  { id: "p2", name: "هودی زمستانی خاکستری", price: 1_650_000, original: 1_980_000, rating: 4.2, reviews: 86, category: "لباس", stock: 18, imageSrc: "/products/hoodie-grey.png", spark: [30, 28, 26, 24, 22, 20, 19, 18] },
  { id: "p3", name: "کیف چرمی دستی", price: 4_200_000, rating: 4.8, reviews: 54, badge: "جدید", category: "لوازم", stock: 9, imageSrc: "/products/leather-bag.png", spark: [10, 12, 14, 13, 16, 18, 17, 20] },
  { id: "p4", name: "عطر مینیمال ۱۰۰ میل", price: 3_100_000, original: 3_600_000, rating: 4.5, reviews: 201, category: "زیبایی", stock: 63, imageSrc: "/products/perfume.png", spark: [8, 9, 11, 10, 12, 14, 13, 15] },
  { id: "p5", name: "ساعت فلزی کلاسیک", price: 7_800_000, rating: 4.1, reviews: 39, category: "لوازم", stock: 0, outOfStock: true, imageSrc: "/products/watch-metal.png", spark: [40, 38, 36, 34, 32, 30, 28, 26] },
  { id: "p6", name: "شلوار جین راسته", price: 1_240_000, original: 1_490_000, rating: 4.0, reviews: 97, category: "لباس", stock: 55, imageSrc: "/products/jeans-blue.png", spark: [15, 16, 18, 17, 19, 21, 20, 22] },
  { id: "p7", name: "کفش رسمی مشکی", price: 3_750_000, rating: 4.4, reviews: 61, badge: "ویژه", category: "کفش", stock: 14, imageSrc: "/products/shoes-black.png", spark: [12, 14, 13, 16, 18, 17, 19, 21] },
  { id: "p8", name: "کرم مرطوب‌کننده", price: 480_000, original: 620_000, rating: 4.7, reviews: 312, category: "زیبایی", stock: 120, imageSrc: "/products/cream-jar.png", spark: [25, 26, 28, 27, 30, 32, 31, 34] },
  { id: "p9", name: "تی‌شرت نخی ساده", price: 390_000, rating: 4.3, reviews: 174, category: "لباس", stock: 88, imageSrc: "/products/tshirt-white.png", spark: [18, 19, 18, 20, 22, 21, 23, 24] },
  { id: "p10", name: "کوله‌پشتی شهری", price: 2_150_000, original: 2_600_000, rating: 4.5, reviews: 73, category: "لوازم", stock: 27, imageSrc: "/products/backpack.png", spark: [9, 11, 10, 13, 14, 16, 15, 17] },
  { id: "p11", name: "عینک آفتابی UV۴۰۰", price: 980_000, rating: 4.2, reviews: 45, category: "لوازم", stock: 33, imageSrc: "/products/sunglasses.png", spark: [7, 8, 9, 8, 10, 11, 10, 12] },
  { id: "p12", name: "کمربند چرم طبی", price: 720_000, original: 890_000, rating: 4.0, reviews: 58, category: "لوازم", stock: 41, imageSrc: "/products/belt-leather.png", spark: [14, 15, 14, 16, 17, 16, 18, 19] },
  { id: "p13", name: "ژاکت پشمی مردانه", price: 2_450_000, rating: 4.6, reviews: 67, badge: "جدید", category: "لباس", stock: 22, imageSrc: "/products/sweater-wool.png", spark: [11, 13, 15, 14, 17, 19, 18, 20] },
  { id: "p14", name: "صندل تابستانی", price: 1_120_000, rating: 3.9, reviews: 29, category: "کفش", stock: 0, outOfStock: true, imageSrc: "/products/sandals.png", spark: [22, 20, 18, 16, 14, 12, 10, 8] },
  { id: "p15", name: "ست مراقبت پوست", price: 2_980_000, original: 3_500_000, rating: 4.8, reviews: 156, badge: "پرفروش", category: "زیبایی", stock: 37, imageSrc: "/products/skincare-set.png", spark: [16, 18, 20, 19, 22, 24, 23, 26] },
  { id: "p16", name: "کلاه بیسبال", price: 350_000, rating: 4.1, reviews: 88, category: "لوازم", stock: 76, imageSrc: "/products/cap-navy.png", spark: [5, 6, 7, 6, 8, 9, 8, 10] },
];

/** مدیریت محصولات: شبکه کارت + جدول موجودی با فیلتر دسته. */
export function AdminProductsPage() {
  const { toast } = useToast();
  const [view, setView] = React.useState("grid");
  const [category, setCategory] = React.useState("all");
  const [open, setOpen] = React.useState(false);
  const [price, setPrice] = React.useState<number | null>(1_890_000);
  const rows = catalog.filter((p) => category === "all" || p.category === category);
  const inStock = rows.filter((p) => !p.outOfStock).length;
  const low = rows.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 20).length;
  const inventoryValue = rows.reduce((s, p) => s + p.price * (p.stock ?? 0), 0);

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: "محصول",
      sortable: true,
      cell: (p) => (
        <div className="flex items-center gap-3">
          {p.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={String(p.imageSrc)}
              alt={p.name}
              className="size-11 shrink-0 rounded-control object-cover ring-1 ring-border"
            />
          ) : null}
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-[11px] text-muted-foreground">{p.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "قیمت",
      sortable: true,
      numeric: true,
      cell: (p) => <Price amount={p.price} original={p.original} size="sm" />,
    },
    {
      key: "stock",
      header: "موجودی",
      sortable: true,
      numeric: true,
      cell: (p) =>
        p.outOfStock ? (
          <Badge variant="destructive">ناموجود</Badge>
        ) : (
          <span className={(p.stock ?? 0) < 20 ? "font-medium text-warning" : ""}>
            {fa(p.stock ?? 0)} عدد
          </span>
        ),
    },
    {
      key: "rating",
      header: "امتیاز",
      sortable: true,
      cell: (p) =>
        p.rating !== undefined ? (
          <div className="flex items-center gap-1.5">
            <Rating value={p.rating} readOnly size="sm" />
            <span className="text-xs text-muted-foreground">({fa(p.reviews ?? 0)})</span>
          </div>
        ) : (
          "—"
        ),
    },
    {
      key: "spark",
      header: "روند فروش",
      cell: (p) => <Sparkline data={(p.spark as number[]) ?? [1, 2, 3]} positive={!p.outOfStock} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      cell: () => (
        <DropdownMenu
          align="end"
          trigger={
            <Button variant="ghost" size="icon" className="size-8" aria-label="بیشتر">
              <MoreHorizontal />
            </Button>
          }
          items={[
            { label: "ویرایش", icon: Pencil },
            { type: "separator" },
            { label: "حذف", icon: Trash2, danger: true },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold sm:text-2xl">محصولات</h1>
          <p className="text-sm text-muted-foreground">{formatJalali(new Date(), { weekday: true })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            size="sm"
            aria-label="نمای محصولات"
            value={view}
            onChange={setView}
            options={[
              { value: "grid", label: <LayoutGrid className="size-4" />, "aria-label": "شبکه" },
              { value: "table", label: <List className="size-4" />, "aria-label": "جدول" },
            ]}
          />
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus />
            محصول جدید
          </Button>
        </div>
      </div>

      {low > 0 && (
        <Alert variant="warning" title={`${fa(low)} محصول موجودی کم دارد`}>
          بهتر است قبل از اتمام، سفارش تأمین بزنید.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="کل محصولات" value={<NumberPop value={rows.length} />} delta={8} className="rounded-surface" />
        <Stat label="موجود در انبار" value={<NumberPop value={inStock} />} delta={3} className="rounded-surface" />
        <Stat label="موجودی کم" value={<NumberPop value={low} />} delta={-2} className="rounded-surface" />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-surface border-line border-border bg-card/60 px-3 py-2.5 [--tw-border-style:var(--line-style)]">
        <div className="w-44">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9"
            options={[
              { value: "all", label: "همه‌ی دسته‌ها" },
              { value: "لباس", label: "لباس" },
              { value: "کفش", label: "کفش" },
              { value: "لوازم", label: "لوازم" },
              { value: "زیبایی", label: "زیبایی" },
            ]}
          />
        </div>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <span className="text-xs text-muted-foreground">
          ارزش موجودی: <span className="font-medium text-foreground">{formatToman(inventoryValue)}</span>
        </span>
        <span className="ms-auto text-xs text-muted-foreground">{fa(rows.length)} مورد</span>
      </div>

      {view === "grid" ? (
        <ProductGrid
          products={rows}
          dense
          onAdd={(p) =>
            toast({
              title: "به سبد اضافه شد",
              description: p.name,
              variant: "success",
            })
          }
        />
      ) : (
        <DataTable<Row>
          rows={rows}
          columns={columns}
          rowKey={(p) => p.id}
          searchKeys={["name", "category"]}
          searchPlaceholder="جست‌وجوی نام یا دسته…"
          pageSize={8}
          emptyTitle="محصولی پیدا نشد"
          emptyDescription="دسته را عوض کنید یا محصول جدیدی اضافه کنید."
        />
      )}

      <Sheet open={open} onOpenChange={setOpen} title="محصول جدید">
        <div className="flex h-full flex-col gap-4">
          <p className="text-sm text-muted-foreground">نام، قیمت و تصویر را وارد کنید.</p>
          <Field label="نام محصول" htmlFor="pn">
            <Input id="pn" placeholder="مثلاً: کتانی اسپرت" />
          </Field>
          <div className="space-y-1.5">
            <span className="text-sm font-medium">قیمت فروش</span>
            <AmountInput value={price} onChange={setPrice} quick={[890_000, 1_890_000, 2_890_000]} />
          </div>
          <div className="space-y-1.5">
            <span className="text-sm font-medium">تصویر محصول</span>
            <FileUpload accept="image/*" multiple={false} maxSize={2_000_000} hint="حداکثر ۲ مگابایت" />
          </div>
          <div className="mt-auto flex gap-2 pt-4">
            <Button
              className="flex-1"
              onClick={() => {
                setOpen(false);
                toast({ title: "محصول ذخیره شد", variant: "success" });
              }}
            >
              ذخیره
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              انصراف
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
