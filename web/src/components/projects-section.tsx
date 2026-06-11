import { getTranslations } from "next-intl/server";

export async function ProjectsSection() {
  const t = await getTranslations("projects");

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-b border-white/10 bg-zinc-950 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="section-title-gradient">{t("title")}</span>
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">{t("subtitle")}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="group rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 transition hover:border-sky-500/40">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400/80 sm:text-base">
              {t("soon")}
            </p>
            <h3 className="font-heading mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {t("card1.title")}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-zinc-400 sm:text-lg">
              {t("card1.body")}
            </p>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 transition hover:border-sky-500/40">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400/80 sm:text-base">
              {t("soon")}
            </p>
            <h3 className="font-heading mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {t("card2.title")}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-zinc-400 sm:text-lg">
              {t("card2.body")}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
