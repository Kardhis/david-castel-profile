import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { LanguageSwitcher } from "@/components/language-switcher";

export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations("nav");

  const links = [
    { href: "#about" as const, label: t("about") },
    { href: "#works" as const, label: t("works") },
    { href: "#projects" as const, label: t("projects") },
    { href: "#contact" as const, label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-b from-[#245964] via-[#1a3d47] to-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-base font-semibold tracking-tight text-white sm:text-lg"
        >
          {siteConfig.name}
        </Link>
        <nav
          className="hidden items-center gap-6 text-base text-zinc-300 md:flex"
          aria-label="Primary"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <a
            href="#projects"
            className="rounded-full bg-sky-500 px-3 py-1.5 text-sm font-semibold text-zinc-950 transition hover:bg-sky-400 sm:px-4 sm:text-base"
          >
            {t("ctaProjects")}
          </a>
        </div>
      </div>
    </header>
  );
}
