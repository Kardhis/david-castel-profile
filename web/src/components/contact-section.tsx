import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site-config";

export async function ContactSection() {
  const t = await getTranslations("contact");
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(t("mailSubject"))}`;

  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-zinc-900/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="section-title-gradient">{t("title")}</span>
        </h2>
        <p className="mt-4 max-w-2xl text-xl leading-relaxed text-zinc-300 md:text-2xl">
          {t("lead")}
        </p>
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 sm:text-base">
              {t("emailLabel")}
            </p>
            <p className="mt-1 font-mono text-base text-zinc-200 sm:text-lg">
              {siteConfig.email}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500 sm:text-base">
              {t("note")}
            </p>
          </div>
          <a
            href={mailto}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-zinc-950 transition hover:bg-sky-400 sm:px-7 sm:text-lg"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
