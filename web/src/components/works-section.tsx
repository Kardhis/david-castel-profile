import { getTranslations } from "next-intl/server";

export async function WorksSection() {
  const t = await getTranslations("works");

  const items = [
    { title: t("items.0.title"), body: t("items.0.body") },
    { title: t("items.1.title"), body: t("items.1.body") },
    { title: t("items.2.title"), body: t("items.2.body") },
  ];

  return (
    <section
      id="works"
      className="scroll-mt-12 border-b border-white/10 bg-slate-900 pt-14 pb-16 sm:pt-20 sm:pb-24 md:scroll-mt-20"
    >
      <div className="mx-auto max-w-[88rem] px-6 sm:px-10 lg:px-12">
        <h2 className="font-heading font-semibold leading-normal tracking-tight">
          <span className="section-title-gradient">{t("title")}</span>
        </h2>
        <p className="mt-3 w-full text-pretty text-lg leading-relaxed text-zinc-400 md:text-2xl">
          {t("subtitle")}
        </p>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-black/20"
            >
              <h3 className="font-heading text-lg font-semibold text-white md:text-2xl">{item.title}</h3>
              <p className="mt-3 text-pretty text-lg leading-relaxed text-zinc-400 md:text-2xl">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
