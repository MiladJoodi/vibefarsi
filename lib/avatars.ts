/** عکس‌های دموی وایب‌فارسی — همان‌هایی که در vibefarsi.ir/components/avatar دیده می‌شوند. */
const POOL = [
  "/avatars/sara.jpg",
  "/avatars/ali.jpg",
  "/avatars/negar.jpg",
  "/avatars/reza.jpg",
  "/avatars/mina.jpg",
] as const;

/** نگاشت اسم‌های شناخته‌شده به فایل عکس دمو. */
const BY_FIRST: Record<string, (typeof POOL)[number]> = {
  سارا: "/avatars/sara.jpg",
  علی: "/avatars/ali.jpg",
  نگار: "/avatars/negar.jpg",
  رضا: "/avatars/reza.jpg",
  مینا: "/avatars/mina.jpg",
  وایب‌فارسی: "/avatars/sara.jpg",
  سالن: "/avatars/negar.jpg",
};

/** مسیر آواتار پایدار برای هر اسم — همیشه یکی از عکس‌های واقعی دمو. */
export function getAvatarSrc(name: string): string {
  const trimmed = name.trim() || "؟";
  const first = trimmed.split(/\s+/)[0] ?? trimmed;
  if (BY_FIRST[first]) return BY_FIRST[first];
  if (BY_FIRST[trimmed]) return BY_FIRST[trimmed];
  return POOL[hashIndex(trimmed) % POOL.length];
}

function hashIndex(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
