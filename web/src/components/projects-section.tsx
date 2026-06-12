import { getTranslations } from "next-intl/server";

export async function ProjectsSection() {
  const t = await getTranslations("projects");

  return (
    <section
      id="projects"
      className="scroll-mt-12 border-b border-white/10 bg-zinc-950 pt-14 pb-16 sm:pt-20 sm:pb-24 md:scroll-mt-20"
    >
      <div className="mx-auto max-w-[88rem] px-6 sm:px-10 lg:px-12">
        <h2 className="font-heading font-semibold leading-normal tracking-tight">
          <span className="section-title-gradient">{t("title")}</span>
        </h2>
        <p className="mt-3 w-full text-pretty text-lg leading-relaxed text-zinc-400 md:text-2xl">{t("subtitle")}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="group rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 transition hover:border-sky-500/40 sm:p-6 md:p-8">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400/80 sm:text-base">
              {t("soon")}
            </p>
            <h3 className="font-heading mt-3 text-lg font-semibold text-white md:text-2xl">
              {t("card1.title")}
            </h3>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-zinc-400 md:text-2xl">
              {t("card1.body")}
            </p>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 transition hover:border-sky-500/40 sm:p-6 md:p-8">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400/80 sm:text-base">
              {t("soon")}
            </p>
            <h3 className="font-heading mt-3 text-lg font-semibold text-white md:text-2xl">
              {t("card2.title")}
            </h3>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-zinc-400 md:text-2xl">
              {t("card2.body")}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
