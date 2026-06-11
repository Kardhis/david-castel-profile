import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site-config";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-zinc-950 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-base leading-relaxed text-zinc-500 sm:flex-row sm:text-left sm:px-6">
        <p>
          © {year} {siteConfig.name}. {t("rights")}
        </p>
        <p className="text-zinc-600">{siteConfig.role}</p>
      </div>
    </footer>
  );
}
