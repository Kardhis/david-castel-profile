"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale: AppLocale = locale === "es" ? "en" : "es";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      className="rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/10 sm:px-4 sm:text-base"
      aria-label={nextLocale === "en" ? "Switch to English" : "Cambiar a español"}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
