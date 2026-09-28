"use client";

import { ThemeProvider } from "@/components/theme-toggle";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider position="bottom-start">{children}</ToastProvider>
    </ThemeProvider>
  );
}
