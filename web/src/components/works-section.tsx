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
      className="scroll-mt-20 border-b border-white/10 bg-zinc-900/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="section-title-gradient">{t("title")}</span>
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          {t("subtitle")}
        </p>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-lg shadow-black/20"
            >
              <h3 className="font-heading text-xl font-semibold text-white sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-zinc-400 sm:text-lg">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
