"use client";

import { Avatar } from "@/components/ui/avatar";
import { HoverCard } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

/** آواتار پروفایل با پیش‌نمایش شناور برای اطلاعات شخصی. */
export function ProfileAvatar({
  name,
  role,
  src,
  size = "md",
  className,
  withCard = true,
}: {
  name: string;
  role?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  withCard?: boolean;
}) {
  const avatar = <Avatar name={name} src={src} size={size} className={className} />;
  if (!withCard) return avatar;

  return (
    <HoverCard
      trigger={<span className="inline-flex cursor-default">{avatar}</span>}
      className="w-56"
    >
      <div className="flex items-center gap-3">
        <Avatar name={name} src={src} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name}</p>
          {role && <p className={cn("truncate text-xs text-muted-foreground")}>{role}</p>}
        </div>
      </div>
    </HoverCard>
  );
}
