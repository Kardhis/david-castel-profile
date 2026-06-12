"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { LocaleFlag } from "@/components/locale-flag";
import { cn } from "@/lib/utils";

const localeNames: Record<AppLocale, string> = {
  es: "Español",
  en: "English",
  ca: "Català",
};

export function LanguageSwitcher({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const currentLocale = (
    routing.locales.includes(locale as AppLocale)
      ? locale
      : routing.defaultLocale
  ) as AppLocale;

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  const handleSelect = (nextLocale: AppLocale) => {
    setOpen(false);
    if (nextLocale === currentLocale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      const options = listRef.current?.querySelectorAll<HTMLButtonElement>(
        'button[role="option"]'
      );
      if (!options || options.length === 0) return;

      event.preventDefault();
      const currentIndex = Array.from(options).findIndex(
        (option) => option === document.activeElement
      );
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        currentIndex === -1
          ? direction === 1
            ? 0
            : options.length - 1
          : (currentIndex + direction + options.length) % options.length;

      options[nextIndex]?.focus();
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    const activeOption = listRef.current?.querySelector<HTMLButtonElement>(
      'button[aria-selected="true"]'
    );
    activeOption?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open, close]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t("languageLabel")}: ${localeNames[currentLocale]}`}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-h-8 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 md:min-h-11 md:gap-2 md:px-4 md:py-2 md:text-base"
      >
        <LocaleFlag locale={currentLocale} />
        <span>{localeNames[currentLocale]}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={cn("h-3 w-3 shrink-0 transition-transform md:h-4 md:w-4", open && "rotate-180")}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <ul
        id={listId}
        ref={listRef}
        role="listbox"
        aria-label={t("languageLabel")}
        aria-hidden={!open}
        className={cn(
          "absolute right-0 z-50 mt-2 min-w-[10.5rem] overflow-hidden rounded-xl border border-white/15 bg-[#1a3d47] py-1 shadow-xl transition",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        {routing.locales.map((loc) => {
          const isActive = loc === currentLocale;

          return (
            <li key={loc} role="presentation">
              <button
                type="button"
                role="option"
                tabIndex={open ? 0 : -1}
                aria-selected={isActive}
                onClick={() => handleSelect(loc)}
                className={cn(
                  "flex w-full min-h-11 items-center gap-2 px-4 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400/50 sm:text-base",
                  isActive
                    ? "bg-white/10 font-medium text-white"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <LocaleFlag locale={loc} />
                {localeNames[loc]}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
