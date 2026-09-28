import type { Metadata } from "next";
import { Noto_Naskh_Arabic, Vazirmatn } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["700"],
  variable: "--font-naskh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "وایب‌فارسی | پنل فروشگاه",
  description: "پنل نمونه فروشگاه فارسی با کامپوننت‌های وایب‌فارسی",
};

const themeBoot = `(function(){try{var k='vf-theme';var t=localStorage.getItem(k);var d=t==='dark';var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${vazirmatn.variable} ${naskh.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
