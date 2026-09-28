"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ENTER_DASHBOARD_FLAG } from "@/components/templates/enter-dashboard";
import { NotificationBadge } from "@/components/animations/notification-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { Sidebar, SidebarGroup, SidebarItem } from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function NavBody({
  pathname,
  onNavigate,
  unread = 2,
}: {
  pathname: string;
  onNavigate?: () => void;
  unread?: number;
}) {
  const click = onNavigate
    ? () => {
        onNavigate();
      }
    : undefined;

  return (
    <>
      <SidebarGroup title="اصلی">
        <SidebarItem
          icon={LayoutDashboard}
          label="نمای کلی"
          href="/dashboard"
          active={pathname === "/dashboard"}
          onClick={click}
        />
        <SidebarItem
          icon={ShoppingCart}
          label="سفارش‌ها"
          href="/dashboard/orders"
          badge={12}
          active={pathname.startsWith("/dashboard/orders")}
          onClick={click}
        />
        <SidebarItem
          icon={Package}
          label="محصولات"
          href="/dashboard/products"
          active={pathname.startsWith("/dashboard/products")}
          onClick={click}
        />
        <SidebarItem
          icon={Users}
          label="مشتری‌ها"
          href="/dashboard/customers"
          active={pathname.startsWith("/dashboard/customers")}
          onClick={click}
        />
      </SidebarGroup>
      <SidebarGroup title="مالی و نوبت">
        <SidebarItem
          icon={Wallet}
          label="کیف پول"
          href="/dashboard/wallet"
          active={pathname.startsWith("/dashboard/wallet")}
          onClick={click}
        />
        <SidebarItem
          icon={FileText}
          label="فاکتور"
          href="/dashboard/invoices"
          active={pathname.startsWith("/dashboard/invoices")}
          onClick={click}
        />
        <SidebarItem
          icon={CalendarDays}
          label="رزرو نوبت"
          href="/dashboard/booking"
          active={pathname.startsWith("/dashboard/booking")}
          onClick={click}
        />
      </SidebarGroup>
      <SidebarGroup title="ارتباط" collapsible>
        <SidebarItem
          icon={MessageSquare}
          label="پشتیبانی"
          href="/dashboard/support"
          badge={2}
          active={pathname.startsWith("/dashboard/support")}
          onClick={click}
        />
        <SidebarItem
          icon={() => (
            <NotificationBadge show={unread > 0} count={unread}>
              <Bell className="size-4 stroke-[1.75]" />
            </NotificationBadge>
          )}
          label="اعلان‌ها"
          href="/dashboard/notifications"
          active={pathname.startsWith("/dashboard/notifications")}
          onClick={click}
        />
        <SidebarItem
          icon={HelpCircle}
          label="راهنما"
          href="/dashboard/help"
          active={pathname.startsWith("/dashboard/help")}
          onClick={click}
        />
        <SidebarItem
          icon={Settings}
          label="تنظیمات فروشگاه"
          href="/dashboard/settings"
          active={pathname.startsWith("/dashboard/settings")}
          onClick={click}
        />
      </SidebarGroup>
    </>
  );
}

function BrandMark({ compact }: { compact?: boolean }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", compact && "gap-2")}>
      <Avatar name="وایب‌فارسی" size={compact ? "sm" : "md"} />
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-bold leading-tight">وایب‌فارسی</p>
        <p className="truncate text-[11px] text-muted-foreground">پنل فروشگاه</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [welcome, setWelcome] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(ENTER_DASHBOARD_FLAG) === "1") {
        sessionStorage.removeItem(ENTER_DASHBOARD_FLAG);
        setWelcome(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const header = (
    <div className="flex w-full items-center justify-between gap-2">
      <BrandMark />
      <ThemeToggle />
    </div>
  );

  const footer = (
    <div className="space-y-1 rounded-surface bg-background/70 p-2">
      <div className="flex items-center gap-2.5 px-1.5 py-1.5">
        <ProfileAvatar name="سارا محمدی" role="مدیر فروشگاه" size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">سارا محمدی</p>
          <p className="truncate text-[11px] text-muted-foreground">مدیر فروشگاه</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-control px-2.5 text-sm text-muted-foreground transition-colors duration-(--motion) ease-motion hover:bg-accent/70 hover:text-foreground"
      >
        <LogOut className="size-4 stroke-[1.75]" />
        خروج
      </button>
    </div>
  );

  return (
    <div
      className={cn(
        "flex min-h-dvh bg-background text-foreground md:gap-0",
        welcome && "animate-enter-in",
      )}
    >
      <Sidebar
        className="sticky top-0 hidden h-dvh shrink-0 self-start md:flex"
        header={header}
        footer={footer}
      >
        <NavBody pathname={pathname} />
      </Sidebar>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="منوی ناوبری"
        >
          <button
            type="button"
            aria-label="بستن منو"
            className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <Sidebar
            className="absolute inset-y-0 start-0 z-10 h-full w-[min(17rem,88vw)] bg-card shadow-overlay motion-safe:animate-[drawer-in_280ms_var(--motion-ease)_both]"
            header={
              <div className="flex w-full items-center justify-between gap-2">
                <BrandMark />
                <div className="flex items-center gap-0.5">
                  <ThemeToggle />
                  <button
                    type="button"
                    aria-label="بستن"
                    onClick={() => setMobileOpen(false)}
                    className="flex size-9 cursor-pointer items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>
            }
            footer={footer}
          >
            <NavBody pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </Sidebar>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-background/95 px-3 backdrop-blur-sm md:hidden">
          <button
            type="button"
            aria-label="باز کردن منو"
            onClick={() => setMobileOpen(true)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-control text-foreground hover:bg-accent"
          >
            <Menu className="size-5" />
          </button>
          <BrandMark compact />
          <div className="ms-auto">
            <ThemeToggle />
          </div>
        </header>

        <main className="min-w-0 flex-1 p-3 sm:p-4 md:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
