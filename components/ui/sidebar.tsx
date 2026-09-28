"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface SidebarItemProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: React.ReactNode;
  href?: string;
  active?: boolean;
  badge?: number | string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function SidebarItem({
  icon: Icon,
  label,
  href = "#",
  active,
  badge,
  onClick,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-h-10 items-center gap-2.5 rounded-control px-2.5 text-sm transition-colors duration-(--motion) ease-motion",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        active
          ? "bg-foreground/[0.07] font-semibold text-foreground"
          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-1.5 start-0 w-0.5 rounded-full bg-brand"
        />
      )}
      {Icon && (
        <Icon
          className={cn(
            "size-4 shrink-0 stroke-[1.75]",
            active ? "text-brand" : "text-muted-foreground group-hover:text-foreground",
          )}
        />
      )}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "shrink-0 rounded-control px-1.5 py-0.5 text-[10px] font-semibold leading-none tabular-nums",
            active
              ? "bg-brand text-brand-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {typeof badge === "number" ? fa(badge) : badge}
        </span>
      )}
    </Link>
  );
}

export function SidebarGroup({
  title,
  collapsible,
  defaultOpen = true,
  children,
}: {
  title?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="space-y-0.5">
      {title &&
        (collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full cursor-pointer items-center justify-between px-2.5 pb-1.5 pt-5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {title}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-(--motion) ease-motion",
                !open && "-rotate-90",
              )}
            />
          </button>
        ) : (
          <p className="px-2.5 pb-1.5 pt-5 text-[11px] font-medium text-muted-foreground">
            {title}
          </p>
        ))}
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}

/** نوار کناری بدون بوردر؛ پس‌زمینه‌ی جدا از محتوا. */
export function Sidebar({
  header,
  footer,
  className,
  children,
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={cn(
        "flex w-[15.5rem] flex-col bg-muted/40",
        className,
      )}
    >
      {header && <div className="shrink-0 px-3 pb-2 pt-4">{header}</div>}
      <nav className="min-h-0 flex-1 space-y-0 overflow-y-auto px-2 pb-3 pt-1">{children}</nav>
      {footer && <div className="shrink-0 px-2 pb-3 pt-1">{footer}</div>}
    </aside>
  );
}
