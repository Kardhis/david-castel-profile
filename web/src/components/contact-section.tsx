import { getTranslations } from "next-intl/server";

import { ContactForm } from "@/components/contact-form";

export async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <section
      id="contact"
      className="scroll-mt-12 bg-slate-900 pt-14 pb-16 sm:pt-20 sm:pb-24 md:scroll-mt-20"
    >
      <div className="mx-auto max-w-[88rem] px-6 sm:px-10 lg:px-12">
        <h2 className="font-heading font-semibold leading-normal tracking-tight">
          <span className="section-title-gradient">{t("title")}</span>
        </h2>
        <p className="mt-4 w-full text-pretty text-lg leading-relaxed text-zinc-300 md:text-2xl">
          {t("lead")}
        </p>
        <ContactForm />
      </div>
    </section>
  );
}
