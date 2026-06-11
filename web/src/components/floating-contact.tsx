"use client";

import { useTranslations } from "next-intl";

export function FloatingContact() {
  const t = useTranslations("floating");

  return (
    <a
      href="#contact"
      aria-label={t("aria")}
      className="fixed bottom-6 right-6 z-50 flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-sky-500 text-base font-bold text-zinc-950 shadow-lg shadow-sky-500/30 transition hover:scale-105 hover:bg-sky-400 sm:h-16 sm:w-16 md:bottom-8 md:right-8"
    >
      <span className="sr-only">{t("label")}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7 sm:h-8 sm:w-8"
        aria-hidden
      >
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
      </svg>
    </a>
  );
}
