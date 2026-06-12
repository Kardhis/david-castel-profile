import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";

export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations("nav");

  const links = [
    { href: "#about", label: t("about") },
    { href: "#works", label: t("works") },
    { href: "#projects", label: t("projects") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-b from-[#245964] via-[#1a3d47] to-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 md:h-16 md:gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <MobileNav links={links} />
          <Link
            href="/"
            className="hidden font-heading text-base font-semibold tracking-tight text-white sm:text-lg md:inline-block"
          >
            {siteConfig.name}
          </Link>
        </div>
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
        <div className="flex shrink-0 items-center gap-2 max-md:mr-2">
          <LanguageSwitcher locale={locale} />
          <a
            href="#projects"
            className="hidden min-h-11 items-center rounded-full bg-sky-500 px-4 text-base font-semibold text-zinc-950 transition hover:bg-sky-400 md:inline-flex"
          >
            {t("ctaProjects")}
          </a>
        </div>
      </div>
    </header>
  );
}
