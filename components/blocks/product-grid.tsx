"use client";

import type { ReactNode } from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { cn, fa } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  original?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  image?: ReactNode;
  imageSrc?: string;
  outOfStock?: boolean;
  stock?: number;
  category?: string;
}

/** شبکه‌ی محصول کاستوم برای پنل — کارت‌های بدون حس دیفالت. */
export function ProductGrid({
  title,
  products,
  onAdd,
  className,
  dense,
}: {
  title?: string;
  products: Product[];
  onAdd?: (p: Product) => void;
  className?: string;
  dense?: boolean;
}) {
  return (
    <section className={cn(dense ? "py-0" : "px-6 py-16", className)}>
      {title && (
        <div className={cn("mb-8 flex items-center justify-between", !dense && "mx-auto max-w-6xl")}>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            دیدن همه
          </a>
        </div>
      )}
      <ul
        className={cn(
          "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4",
          !dense && "mx-auto max-w-6xl",
        )}
      >
        {products.map((p, i) => (
          <li
            key={p.id}
            className="group flex flex-col overflow-hidden rounded-surface border-line border-border bg-card shadow-surface transition-transform duration-(--motion) ease-motion hover:-translate-y-0.5 [--tw-border-style:var(--line-style)]"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              {p.image ??
                (p.imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageSrc}
                    alt={p.name}
                    className="size-full object-cover transition-transform duration-500 ease-motion group-hover:scale-[1.04]"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="size-full"
                    style={{
                      background:
                        "radial-gradient(70% 70% at 50% 40%, oklch(from var(--brand) l c h / 18%), transparent 70%)",
                    }}
                  />
                ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-(--motion) group-hover:opacity-100" />
              {p.badge && (
                <Badge variant="brand" className="absolute end-2.5 top-2.5">
                  {p.badge}
                </Badge>
              )}
              {p.outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/75 text-sm font-medium backdrop-blur-[1px]">
                  ناموجود
                </div>
              )}
              {!p.outOfStock && p.stock !== undefined && p.stock < 20 && (
                <span className="absolute start-2.5 bottom-2.5 rounded-control bg-warning/90 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                  فقط {fa(p.stock)} عدد
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
              {p.category && (
                <p className="text-[11px] font-medium text-muted-foreground">{p.category}</p>
              )}
              <h3 className="line-clamp-2 text-sm font-semibold leading-6">{p.name}</h3>
              {p.rating !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Rating value={p.rating} readOnly size="sm" />
                  {p.reviews !== undefined && <span>({fa(p.reviews)})</span>}
                </div>
              )}
              <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                <Price amount={p.price} original={p.original} size="sm" />
                {onAdd ? (
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`افزودن ${p.name} به سبد`}
                    disabled={p.outOfStock}
                    onClick={() => onAdd(p)}
                    className="size-9"
                  >
                    <ShoppingCart className="size-4" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`افزودن ${p.name} به سبد`}
                    disabled={p.outOfStock}
                    className="size-9"
                  >
                    <ShoppingCart className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
