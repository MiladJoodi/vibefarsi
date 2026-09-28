"use client";

import * as React from "react";
import { Github, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = React.createContext<ThemeCtx | null>(null);
export const THEME_STORAGE_KEY = "vf-theme";
export const GITHUB_REPO_URL = "https://github.com/MiladJoodi/vibefarsi";

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light");

  React.useEffect(() => {
    const initial = readTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = React.useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme باید داخل ThemeProvider باشد.");
  return ctx;
}

const iconBtn =
  "relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors duration-(--motion) ease-motion hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

/** دکمه‌ی خورشید / ماه برای جابه‌جایی تم روشن و تیره. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "حالت روشن" : "حالت تیره"}
      title={dark ? "حالت روشن" : "حالت تیره"}
      className={cn(iconBtn, className)}
    >
      <Sun
        className={cn(
          "size-4 stroke-[1.75] transition-all duration-(--motion) ease-motion",
          dark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute size-4 stroke-[1.75] transition-all duration-(--motion) ease-motion",
          dark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0",
        )}
      />
    </button>
  );
}

/** لینک مخزن گیت‌هاب پروژه. */
export function GithubLink({ className }: { className?: string }) {
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="مخزن گیت‌هاب"
      title="گیت‌هاب"
      className={cn(iconBtn, className)}
    >
      <Github className="size-4 stroke-[1.75]" />
    </a>
  );
}

/** گروه تم + گیت‌هاب برای هدر سایدبار. */
export function HeaderTools({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <GithubLink />
      <ThemeToggle />
    </div>
  );
}
