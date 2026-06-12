import { getTranslations } from "next-intl/server";

import { AboutTextReveal } from "@/components/about-text-reveal";
import { withBasePath } from "@/lib/site-config";

export async function AboutSection() {
  const t = await getTranslations("about");

  return (
    <section
      id="about"
      className="scroll-mt-12 border-b border-white/10 bg-zinc-950 pt-14 pb-16 sm:pt-20 sm:pb-24 md:scroll-mt-20"
    >
      <div className="mx-auto max-w-[88rem] px-6 sm:px-10 lg:px-12">
        <AboutTextReveal
          title={t("title")}
          lead={t("lead")}
          p1={t("p1")}
          p2={t("p2")}
          p3={t("p3")}
          leadImage={{
            src: withBasePath("/arquitectura_saas_elegante.gif"),
            alt: t("leadImageAlt"),
          }}
          bodyImage={{
            src: withBasePath("/about_me_ai_data_flow.gif"),
            alt: t("bodyImageAlt"),
          }}
          p3Image={{
            src: withBasePath("/mi_enfoque_animado_descargable.gif"),
            alt: t("p3ImageAlt"),
          }}
        />
      </div>
    </section>
  );
}
