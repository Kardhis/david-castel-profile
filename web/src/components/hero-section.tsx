"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Particles } from "@/components/ui/particles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { withBasePath } from "@/lib/site-config";

const heroImageSrc = withBasePath("/hero.jpg");
const mobileHeroImageSrc = withBasePath("/DavidProgramador.png");

/** Altura del header sticky (h-12 móvil / h-16 desktop) para el hero a pantalla completa. */
const heroMobileMinHeight = "min-h-0 md:min-h-[calc(100svh-4rem)]";

export function HeroSection() {
  const t = useTranslations("hero");
  const [desktopBgOk, setDesktopBgOk] = useState(true);
  const reduceMotion = useReducedMotion();
  const [particleQuantity, setParticleQuantity] = useState(144);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateQuantity = () => {
      setParticleQuantity(mediaQuery.matches ? 48 : 144);
    };

    updateQuantity();
    mediaQuery.addEventListener("change", updateQuantity);

    return () => mediaQuery.removeEventListener("change", updateQuantity);
  }, []);

  return (
    <section
      className={`relative w-full overflow-x-clip border-b border-white/10 bg-gradient-to-b from-[#245964] via-[#1a3d47] to-zinc-950 md:bg-transparent ${heroMobileMinHeight}`}
      aria-labelledby="hero-heading"
    >
      {/* Fondo desktop: hero.jpg a pantalla completa */}
      <div className="absolute inset-0 z-0 hidden md:block">
        {desktopBgOk ? (
          <Image
            src={heroImageSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[right_top] brightness-[1.07] contrast-[1.04] saturate-[1.06]"
            onError={() => setDesktopBgOk(false)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 text-center">
            <span className="text-4xl font-semibold text-zinc-600">DC</span>
            <span className="mt-2 max-w-xs text-xs text-zinc-500">
              Coloca tu foto en{" "}
              <code className="text-zinc-400">public/hero.jpg</code>
            </span>
          </div>
        )}
      </div>

      {desktopBgOk && !reduceMotion ? (
        <Particles
          className="absolute inset-0 z-[1] hidden h-full w-full md:block"
          quantity={particleQuantity}
          staticity={40}
          ease={70}
          size={1.20}
          speed={3.9}
          color="#bae6fd"
        />
      ) : null}

      {/* Capas ligeras: contraste solo donde hace falta; la foto se ve más viva */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] hidden bg-[radial-gradient(ellipse_85%_55%_at_75%_18%,rgba(56,189,248,0.09),transparent_50%)] md:block"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-t from-zinc-950/80 via-zinc-950/25 to-transparent md:from-zinc-950/55 md:via-zinc-950/12 md:to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[2] hidden bg-gradient-to-l from-zinc-950/62 via-zinc-950/15 to-transparent sm:from-zinc-950/52 sm:via-zinc-950/10 lg:from-zinc-950/48 md:block"
        aria-hidden
      />

      {/* Grid: contenedor más ancho; desde lg el copy usa columnas 6–12 (7 cols) */}
      <div
        className={`relative z-10 mx-auto grid w-full max-w-[min(100%,120rem)] grid-cols-12 items-start gap-x-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 sm:px-6 sm:py-12 lg:items-stretch lg:gap-x-6 lg:px-10 lg:py-16 xl:px-12 ${heroMobileMinHeight}`}
      >
        <div className="col-span-12 flex justify-center md:hidden">
          <div className="mb-6 w-[min(100%,20rem)] shrink-0 sm:w-80">
            {/* <img> evita problemas del optimizador con basePath en móvil */}
            <img
              src={mobileHeroImageSrc}
              alt={t("imageAlt")}
              width={609}
              height={609}
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full max-w-full rounded-2xl border border-white/10 shadow-xl shadow-black/40"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate col-span-12 mx-auto flex max-w-2xl flex-col justify-start px-[4%] text-left sm:max-w-3xl sm:justify-center sm:px-[8%] md:max-w-4xl lg:col-start-6 lg:col-span-7 lg:mx-0 lg:max-w-none lg:justify-center lg:-translate-y-10"
        >
          {/* Backlight: z-0 (nunca -z) + capa amplia + opacidades visibles sobre foto oscura */}
          <div
            className="pointer-events-none absolute -inset-[38%] z-0 blur-[56px] sm:-inset-[45%] sm:blur-[72px]"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 48% 42% at 50% 30%, rgba(125, 211, 252, 0.75), rgba(56, 189, 248, 0.28) 38%, transparent 62%), radial-gradient(ellipse 58% 48% at 50% 58%, rgba(192, 132, 252, 0.45), rgba(167, 139, 250, 0.15) 42%, transparent 66%), radial-gradient(ellipse 95% 55% at 50% 92%, rgba(254, 143, 181, 0.28), transparent 52%), radial-gradient(ellipse 35% 28% at 50% 22%, rgba(255, 255, 255, 0.18), transparent 55%)",
            }}
          />
          <div className="relative z-10 flex w-full flex-col">
          <p
            className="font-heading mb-4 flex w-full flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-balance font-black uppercase leading-none tracking-[0.08em] text-white sm:mb-5 sm:gap-x-4 md:mb-2 md:sm:mb-3"
            aria-label={t("greetingAria")}
          >
            <span
              className="text-[clamp(1.375rem,4.5vw,2rem)] text-white md:text-[clamp(1.625rem,5.5vw,2.625rem)]"
              aria-hidden
            >
              {t("greetingLead")}
            </span>
            <span
              className="hero-greeting-name-wrap text-[clamp(1.75rem,6vw,2.625rem)] md:text-[clamp(2.25rem,7.5vw,3.5rem)]"
              aria-hidden
            >
              <span className="hero-greeting-name-base">{t("greetingName")}</span>
              <span className="hero-greeting-name-fill">{t("greetingName")}</span>
            </span>
          </p>
          <p className="mb-8 mt-0 text-center text-pretty text-[clamp(1rem,2.2vw+0.7rem,1.375rem)] font-black leading-relaxed text-[#83a9b1] sm:mb-10 md:text-[clamp(1.25rem,2.75vw+0.9rem,1.6875rem)]">
            {t("role")}
          </p>
          <div className="text-center">
          <h1
            id="hero-heading"
            className="font-heading mb-8 mt-0 text-balance text-[clamp(1.5rem,4.5vw+0.5rem,2.375rem)] font-semibold leading-[1.2] tracking-tight text-white sm:mb-10"
          >
            {t("headline")}
          </h1>
          <p className="mb-8 mt-0 text-balance text-[clamp(1.5rem,4.5vw+0.5rem,2.375rem)] font-black leading-[1.2] tracking-tight text-[#83a9b1] sm:mb-10 md:px-10 md:text-pretty md:text-[clamp(1.25rem,2.75vw+0.95rem,1.75rem)] md:leading-relaxed md:tracking-normal">
            {t("sub")}
          </p>
          </div>
          <div className="mt-4 flex w-full flex-row flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3">
            <ShimmerButton
              href="#projects"
              borderRadius="9999px"
              background="rgb(14 165 233)"
              shimmerColor="rgb(224 242 254)"
              shimmerSize="0.12em"
              shimmerDuration="2.8s"
              className="min-h-11 w-auto shrink-0 border-sky-400/40 px-3.5 py-2 text-[clamp(0.875rem,1.2vw+0.7rem,1.125rem)] font-semibold text-zinc-950 shadow-md shadow-sky-500/20 sm:min-h-12 sm:min-w-[11rem] sm:px-5 sm:py-2.5"
            >
              {t("ctaPrimary")}
            </ShimmerButton>
            <ShimmerButton
              href="#contact"
              borderRadius="9999px"
              background="rgba(255, 255, 255, 0.07)"
              shimmerColor="rgba(125, 211, 252, 0.9)"
              shimmerSize="0.12em"
              shimmerDuration="3.2s"
              className="min-h-11 w-auto shrink-0 border-white/25 px-3.5 py-2 text-[clamp(0.875rem,1.2vw+0.7rem,1.125rem)] font-semibold text-white backdrop-blur-md sm:min-h-12 sm:min-w-[11rem] sm:px-5 sm:py-2.5"
            >
              {t("ctaSecondary")}
            </ShimmerButton>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
