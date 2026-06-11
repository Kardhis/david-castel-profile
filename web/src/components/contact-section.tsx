import { getTranslations } from "next-intl/server";

import { ContactForm } from "@/components/contact-form";

export async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-slate-900 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <h2 className="font-heading font-semibold leading-normal tracking-tight">
          <span className="section-title-gradient text-[4.8rem]">{t("title")}</span>
        </h2>
        <p className="mt-4 w-full text-pretty text-xl leading-loose text-zinc-300 md:text-2xl">
          {t("lead")}
        </p>
        <ContactForm />
      </div>
    </section>
  );
}
