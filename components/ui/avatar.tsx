import { cn, fa } from "@/lib/utils";
import { getAvatarSrc } from "@/lib/avatars";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "size-7 text-[11px]", md: "size-9 text-sm", lg: "size-12 text-base" };

/**
 * آواتار. با `src` تصویر می‌گیرد؛ اگر نباشد از عکس‌های دموی وایب‌فارسی
 * (`/avatars/*.jpg`) بر اساس اسم انتخاب می‌شود — مثل پیش‌نمایش vibefarsi.ir.
 */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const resolved = src || getAvatarSrc(name);
  return (
    <span
      title={name}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        sizes[size],
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local avatar JPEGs */}
      <img src={resolved} alt={name} className="size-full rounded-full object-cover" />
    </span>
  );
}

/** Overlapping avatars with a «+n» tail. */
export function AvatarGroup({
  people,
  max = 4,
  size = "md",
  className,
}: {
  people: { name: string; src?: string }[];
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className={cn("flex items-center", className)}>
      {shown.map((p, i) => (
        <Avatar
          key={p.name}
          {...p}
          size={size}
          className={cn("ring-2 ring-background", i > 0 && "-ms-2")}
        />
      ))}
      {rest > 0 && (
        <span className="ms-2 text-xs text-muted-foreground">+{fa(rest)} نفر دیگر</span>
      )}
    </div>
  );
}
