import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleFlagProps = {
  locale: AppLocale;
  className?: string;
};

/** Icono de bandera por idioma (decorativo; el nombre del idioma va en el texto adyacente). */
export function LocaleFlag({ locale, className }: LocaleFlagProps) {
  return (
    <span
      className={cn(
        "inline-flex h-3 w-4 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-white/20 md:h-3.5 md:w-5",
        className
      )}
      aria-hidden
    >
      {locale === "es" ? <SpanishFlag /> : null}
      {locale === "en" ? <BritishFlag /> : null}
      {locale === "ca" ? <CatalanFlag /> : null}
    </span>
  );
}

function SpanishFlag() {
  return (
    <svg viewBox="0 0 24 16" className="h-full w-full" aria-hidden>
      <rect width="24" height="16" fill="#AA151B" />
      <rect y="4" width="24" height="8" fill="#F1BF00" />
    </svg>
  );
}

function BritishFlag() {
  return (
    <svg viewBox="0 0 24 16" className="h-full w-full" aria-hidden>
      <rect width="24" height="16" fill="#012169" />
      <path fill="#FFF" d="M10 0h4v16h-4zM0 6h24v4H0z" />
      <path fill="#C8102E" d="M11 0h2v16h-2zM0 7h24v2H0z" />
      <path fill="#FFF" d="M0 0 9 5.5V0H0zm15 0v5.5L24 0H15zM0 16l9-5.5V16H0zm15 0v-5.5L24 16H15z" />
      <path fill="#C8102E" d="M0 0 8 4.8V0H0zm16 0v4.8L24 0H16zM0 16l8-4.8V16H0zm16 0v-4.8L24 16H16z" />
    </svg>
  );
}

function CatalanFlag() {
  return (
    <svg viewBox="0 0 24 16" className="h-full w-full" aria-hidden>
      <rect width="24" height="16" fill="#FCDD09" />
      <rect y="2" width="24" height="2" fill="#DA121A" />
      <rect y="6" width="24" height="2" fill="#DA121A" />
      <rect y="10" width="24" height="2" fill="#DA121A" />
      <rect y="14" width="24" height="2" fill="#DA121A" />
    </svg>
  );
}
