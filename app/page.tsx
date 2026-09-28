import Link from "next/link";
import { AuroraBackground } from "@/components/backgrounds/aurora";
import { GrainBackground } from "@/components/backgrounds/grain";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background p-6 text-foreground">
      <AuroraBackground />
      <GrainBackground opacity={0.4} />
      <div className="relative z-10 flex max-w-md flex-col items-center gap-5 text-center">
        <Avatar name="وایب‌فارسی" size="lg" />
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">وایب‌فارسی</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            پنل فروشگاه فارسی با کامپوننت‌های راست‌چین
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/login">
            <Button>صفحه ورود</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">داشبورد</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
