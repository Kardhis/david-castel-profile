"use client";

import { useMemo, useRef } from "react";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

/** Divide en frases por puntuación final (. ? !) seguida de espacio. */
function splitPhrases(text: string): string[] {
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length > 0) return parts;
  const t = text.trim();
  return t ? [t] : [];
}

type PhraseVariant = "lead" | "body";

function PhraseReveal({
  text,
  phraseIndex,
  totalPhrases,
  revealProgress,
  variant,
}: {
  text: string;
  phraseIndex: number;
  totalPhrases: number;
  revealProgress: MotionValue<number>;
  variant: PhraseVariant;
}) {
  const reduceMotion = useReducedMotion();
  const n = Math.max(1, totalPhrases);

  const local = useTransform(revealProgress, (p) => {
    const start = phraseIndex / n;
    const end = (phraseIndex + 1) / n;
    if (p <= start) return 0;
    if (p >= end) return 1;
    return (p - start) / (end - start);
  });

  const smooth = useSpring(local, {
    stiffness: 95,
    damping: 48,
    mass: 0.38,
  });

  const clipPath = useTransform(smooth, [0, 1], [
    "polygon(0 0, 0 100%, 0% 100%, 0% 0)",
    "polygon(0 0, 0 100%, 100% 100%, 100% 0)",
  ]);

  const className = "text-pretty text-xl leading-loose md:text-2xl";
  const dimClassName = "text-zinc-600";
  const brightClassName =
    variant === "lead" ? "text-zinc-200" : "text-zinc-300";

  if (reduceMotion) {
    return <p className={cn(className, brightClassName)}>{text}</p>;
  }

  return (
    <div className="relative w-full">
      <p className={cn(className, dimClassName)}>{text}</p>
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath }}
        aria-hidden
      >
        <p className={cn(className, brightClassName, "w-full max-w-none")}>
          {text}
        </p>
      </motion.div>
    </div>
  );
}

export function AboutTextReveal({
  title,
  lead,
  p1,
  p2,
  p3,
  leadImage,
  bodyImage,
  p3Image,
}: {
  title: string;
  lead: string;
  p1: string;
  p2: string;
  p3: string;
  leadImage?: { src: string; alt: string };
  bodyImage?: { src: string; alt: string };
  p3Image?: { src: string; alt: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    /* Más recorrido hasta progress=1 → iluminación más pausada */
    offset: ["start center", "end 0.58"],
  });

  /** 1 cuando el centro del título coincide con el centro del viewport. */
  const { scrollYProgress: titleMidViewport } = useScroll({
    target: titleRef,
    offset: ["start end", "center center"],
  });

  /** Sin iluminar hasta que «Sobre mí» llegue a media pantalla; luego sigue el scroll del bloque. */
  const revealProgress = useTransform(
    [scrollYProgress, titleMidViewport],
    (latest) => {
      const [page, gate] = latest as [number, number];
      if (gate < 1) return 0;
      return Math.min(1, Math.max(0, page) / 0.92);
    }
  );

  const { leadPhrases, p1Phrases, p2Phrases, p3Phrases, total } = useMemo(() => {
    const l = splitPhrases(lead);
    const a = splitPhrases(p1);
    const b = splitPhrases(p2);
    const c = splitPhrases(p3);
    return {
      leadPhrases: l,
      p1Phrases: a,
      p2Phrases: b,
      p3Phrases: c,
      total: l.length + a.length + b.length + c.length,
    };
  }, [lead, p1, p2, p3]);

  return (
    <div ref={containerRef} className="w-full">
      <h2
        ref={titleRef}
        className="font-heading font-semibold leading-normal tracking-tight"
      >
        <span className="section-title-gradient text-[4.8rem]">{title}</span>
      </h2>
      {leadImage ? (
        <div className="mt-4 grid w-full gap-8 md:grid-cols-12 md:items-center md:gap-10">
          <div className="min-w-0 flex flex-col gap-4 md:col-span-5">
            {leadPhrases.map((phrase, i) => (
              <PhraseReveal
                key={`lead-${i}-${phrase.slice(0, 12)}`}
                text={phrase}
                phraseIndex={i}
                totalPhrases={total}
                revealProgress={revealProgress}
                variant="lead"
              />
            ))}
          </div>
          <div className="relative min-w-0 w-full md:col-span-7">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-xl shadow-black/30 ring-1 ring-white/5">
              {/* <img> evita el optimizador de Next, que puede dejar el GIF en un solo fotograma */}
              <img
                src={leadImage.src}
                alt={leadImage.alt}
                width={1536}
                height={1024}
                className="h-full w-full object-contain object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex w-full max-w-none flex-col gap-4">
          {leadPhrases.map((phrase, i) => (
            <PhraseReveal
              key={`lead-${i}-${phrase.slice(0, 12)}`}
              text={phrase}
              phraseIndex={i}
              totalPhrases={total}
              revealProgress={revealProgress}
              variant="lead"
            />
          ))}
        </div>
      )}

      {bodyImage ? (
        <div className="mt-14 grid w-full gap-8 sm:mt-16 md:mt-20 md:grid-cols-12 md:items-center md:gap-10">
          <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
            {p1Phrases.map((phrase, i) => (
              <PhraseReveal
                key={`p1-${i}-${phrase.slice(0, 12)}`}
                text={phrase}
                phraseIndex={leadPhrases.length + i}
                totalPhrases={total}
                revealProgress={revealProgress}
                variant="body"
              />
            ))}
            {p2Phrases.map((phrase, i) => (
              <PhraseReveal
                key={`p2-${i}-${phrase.slice(0, 12)}`}
                text={phrase}
                phraseIndex={leadPhrases.length + p1Phrases.length + i}
                totalPhrases={total}
                revealProgress={revealProgress}
                variant="body"
              />
            ))}
          </div>
          <div className="relative min-w-0 w-full md:col-span-7">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-xl shadow-black/30 ring-1 ring-white/5">
              <img
                src={bodyImage.src}
                alt={bodyImage.alt}
                width={1536}
                height={1024}
                className="h-full w-full object-contain object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-14 grid gap-8 sm:mt-16 md:mt-20 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            {p1Phrases.map((phrase, i) => (
              <PhraseReveal
                key={`p1-${i}-${phrase.slice(0, 12)}`}
                text={phrase}
                phraseIndex={leadPhrases.length + i}
                totalPhrases={total}
                revealProgress={revealProgress}
                variant="body"
              />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {p2Phrases.map((phrase, i) => (
              <PhraseReveal
                key={`p2-${i}-${phrase.slice(0, 12)}`}
                text={phrase}
                phraseIndex={leadPhrases.length + p1Phrases.length + i}
                totalPhrases={total}
                revealProgress={revealProgress}
                variant="body"
              />
            ))}
          </div>
        </div>
      )}

      {p3Image ? (
        <div className="mt-14 grid w-full gap-8 sm:mt-16 md:mt-20 md:grid-cols-12 md:items-center md:gap-10">
            <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
              {p3Phrases.map((phrase, i) => (
                <PhraseReveal
                  key={`p3-${i}-${phrase.slice(0, 12)}`}
                  text={phrase}
                  phraseIndex={
                    leadPhrases.length + p1Phrases.length + p2Phrases.length + i
                  }
                  totalPhrases={total}
                  revealProgress={revealProgress}
                  variant="body"
                />
              ))}
            </div>
            <div className="relative min-w-0 w-full md:col-span-7">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-xl shadow-black/30 ring-1 ring-white/5">
                <img
                  src={p3Image.src}
                  alt={p3Image.alt}
                  width={1536}
                  height={1024}
                  className="h-full w-full object-contain object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-14 flex flex-col gap-4 sm:mt-16 md:mt-20">
            {p3Phrases.map((phrase, i) => (
              <PhraseReveal
                key={`p3-${i}-${phrase.slice(0, 12)}`}
                text={phrase}
                phraseIndex={
                  leadPhrases.length + p1Phrases.length + p2Phrases.length + i
                }
                totalPhrases={total}
                revealProgress={revealProgress}
                variant="body"
              />
            ))}
          </div>
        )}
    </div>
  );
}
