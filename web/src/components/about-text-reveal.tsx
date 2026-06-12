"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { AboutGifViewer } from "@/components/about-gif-viewer";

/** Agrupa el texto según los saltos de línea visuales del párrafo renderizado. */
function measureTextLines(element: HTMLElement, text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const tokens = trimmed.split(/(\s+)/).filter((part) => part.length > 0);
  if (tokens.length === 0) return [trimmed];

  element.replaceChildren();
  const spans: HTMLSpanElement[] = [];

  for (const token of tokens) {
    const span = document.createElement("span");
    span.textContent = token;
    span.style.display = "inline";
    element.appendChild(span);
    spans.push(span);
  }

  const lines: string[] = [];
  let currentLine = "";
  let previousTop = spans[0]?.offsetTop ?? 0;

  for (const span of spans) {
    const top = span.offsetTop;
    const token = span.textContent ?? "";

    if (top > previousTop + 1) {
      if (currentLine) lines.push(currentLine);
      currentLine = token;
      previousTop = top;
    } else {
      currentLine += token;
    }
  }

  if (currentLine) lines.push(currentLine);

  element.textContent = trimmed;
  return lines.length > 0 ? lines : [trimmed];
}

type TextVariant = "lead" | "body";

const textClassName = "text-pretty text-lg leading-relaxed md:text-2xl";

type MeasuredLines = {
  lead: string[];
  p1: string[];
  p2: string[];
  p3: string[];
};

function getPreviousLineRef(
  lineRefs: RefObject<(HTMLDivElement | null)[]>,
  lineIndex: number
): RefObject<HTMLDivElement | null> {
  return {
    get current() {
      if (lineIndex <= 0) return null;
      return lineRefs.current[lineIndex - 1] ?? null;
    },
    set current(_value: HTMLDivElement | null) {
      /* Solo lectura: el ref anterior lo gestiona su propio elemento. */
    },
  };
}

function LineReveal({
  text,
  lineIndex,
  variant,
  titleMidViewport,
  previousLineRef,
  registerRef,
}: {
  text: string;
  lineIndex: number;
  variant: TextVariant;
  titleMidViewport: MotionValue<number>;
  previousLineRef: RefObject<HTMLDivElement | null>;
  registerRef: (element: HTMLDivElement | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerRef(lineRef.current);
    return () => registerRef(null);
  }, [registerRef]);

  const prevScrollTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    prevScrollTarget.current = previousLineRef.current ?? lineRef.current;
  });

  /** 0 al entrar en pantalla → 1 cuando el centro del trozo llega al centro del viewport. */
  const { scrollYProgress: centerProgress } = useScroll({
    target: lineRef,
    offset: ["start end", "center center"],
  });

  const { scrollYProgress: prevCenterProgress } = useScroll({
    target: prevScrollTarget,
    offset: ["start end", "center center"],
  });

  const revealProgress = useTransform(
    [centerProgress, prevCenterProgress, titleMidViewport],
    (latest) => {
      const [mine, prev, titleGate] = latest as [number, number, number];
      if (titleGate < 1) return 0;
      if (lineIndex > 0 && prev < 1) return 0;
      return Math.min(1, Math.max(0, mine));
    }
  );

  const clipPath = useTransform(revealProgress, [0, 1], [
    "polygon(0 0, 0 100%, 0% 100%, 0% 0)",
    "polygon(0 0, 0 100%, 100% 100%, 100% 0)",
  ]);

  const dimClassName = "text-zinc-600";
  const brightClassName =
    variant === "lead" ? "text-zinc-200" : "text-zinc-300";

  if (reduceMotion) {
    return <p className={cn(textClassName, brightClassName)}>{text}</p>;
  }

  return (
    <div ref={lineRef} className="relative w-full">
      <p className={cn(textClassName, dimClassName)}>{text}</p>
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath }}
        aria-hidden
      >
        <p className={cn(textClassName, brightClassName, "w-full max-w-none")}>
          {text}
        </p>
      </motion.div>
    </div>
  );
}

function LineRevealItem({
  text,
  lineIndex,
  variant,
  titleMidViewport,
  lineRefs,
}: {
  text: string;
  lineIndex: number;
  variant: TextVariant;
  titleMidViewport: MotionValue<number>;
  lineRefs: RefObject<(HTMLDivElement | null)[]>;
}) {
  const registerRef = useCallback(
    (element: HTMLDivElement | null) => {
      lineRefs.current[lineIndex] = element;
    },
    [lineIndex, lineRefs]
  );

  return (
    <LineReveal
      text={text}
      lineIndex={lineIndex}
      variant={variant}
      titleMidViewport={titleMidViewport}
      previousLineRef={getPreviousLineRef(lineRefs, lineIndex)}
      registerRef={registerRef}
    />
  );
}

function paragraphLineKey(prefix: string, index: number, line: string) {
  return `${prefix}-${index}-${line.slice(0, 16)}`;
}

function AboutParagraphBlock({
  text,
  lines,
  startLineIndex,
  variant,
  titleMidViewport,
  lineRefs,
  measureRef,
  prefix,
}: {
  text: string;
  lines: string[];
  startLineIndex: number;
  variant: TextVariant;
  titleMidViewport: MotionValue<number>;
  lineRefs: RefObject<(HTMLDivElement | null)[]>;
  measureRef?: RefObject<HTMLParagraphElement | null>;
  prefix: string;
}) {
  const reduceMotion = useReducedMotion();
  const brightClassName =
    variant === "lead" ? "text-zinc-200" : "text-zinc-300";

  if (reduceMotion) {
    return <p className={cn(textClassName, brightClassName)}>{text}</p>;
  }

  return (
    <div className="relative w-full">
      {measureRef ? (
        <p
          ref={measureRef}
          className={cn(
            textClassName,
            "pointer-events-none invisible absolute inset-x-0 top-0 -z-10 h-auto w-full"
          )}
          aria-hidden
        >
          {text}
        </p>
      ) : null}
      <div className="flex w-full flex flex-col">
        {lines.map((line, index) => (
          <LineRevealItem
            key={paragraphLineKey(prefix, index, line)}
            text={line}
            lineIndex={startLineIndex + index}
            variant={variant}
            titleMidViewport={titleMidViewport}
            lineRefs={lineRefs}
          />
        ))}
      </div>
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
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  /** 1 cuando el centro del título coincide con el centro del viewport. */
  const { scrollYProgress: titleMidViewport } = useScroll({
    target: titleRef,
    offset: ["start end", "center center"],
  });

  const leadMeasureRef = useRef<HTMLParagraphElement>(null);
  const p1MeasureRef = useRef<HTMLParagraphElement>(null);
  const p2MeasureRef = useRef<HTMLParagraphElement>(null);
  const p3MeasureRef = useRef<HTMLParagraphElement>(null);

  const [measuredLines, setMeasuredLines] = useState<MeasuredLines>(() => ({
    lead: [lead],
    p1: [p1],
    p2: [p2],
    p3: [p3],
  }));

  const measureAllLines = useCallback(() => {
    const measure = (
      ref: RefObject<HTMLParagraphElement | null>,
      value: string
    ) => {
      if (!ref.current) return [value.trim()].filter(Boolean);
      return measureTextLines(ref.current, value);
    };

    setMeasuredLines({
      lead: measure(leadMeasureRef, lead),
      p1: measure(p1MeasureRef, p1),
      p2: measure(p2MeasureRef, p2),
      p3: measure(p3MeasureRef, p3),
    });
  }, [lead, p1, p2, p3]);

  useLayoutEffect(() => {
    measureAllLines();
  }, [measureAllLines]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      measureAllLines();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [measureAllLines]);

  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts?.ready) return;
    void document.fonts.ready.then(() => {
      measureAllLines();
    });
  }, [measureAllLines]);

  const p1Start = measuredLines.lead.length;
  const p2Start = p1Start + measuredLines.p1.length;
  const p3Start = p2Start + measuredLines.p2.length;

  const paragraphProps = {
    titleMidViewport,
    lineRefs,
  };

  return (
    <div ref={containerRef} className="w-full">
      <h2
        ref={titleRef}
        className="font-heading font-semibold leading-normal tracking-tight"
      >
        <span className="section-title-gradient">{title}</span>
      </h2>
      {leadImage ? (
        <div className="mt-4 grid w-full gap-8 md:grid-cols-12 md:items-center md:gap-10">
          <div className="min-w-0 flex flex-col gap-4 md:col-span-5">
            <AboutParagraphBlock
              text={lead}
              lines={measuredLines.lead}
              startLineIndex={0}
              variant="lead"
              measureRef={leadMeasureRef}
              prefix="lead"
              {...paragraphProps}
            />
          </div>
          <div className="relative min-w-0 w-full md:col-span-7">
            <AboutGifViewer src={leadImage.src} alt={leadImage.alt} />
          </div>
        </div>
      ) : (
        <div className="mt-4 flex w-full max-w-none flex-col gap-4">
          <AboutParagraphBlock
            text={lead}
            lines={measuredLines.lead}
            startLineIndex={0}
            variant="lead"
            measureRef={leadMeasureRef}
            prefix="lead"
            {...paragraphProps}
          />
        </div>
      )}

      {bodyImage ? (
        <div className="mt-14 grid w-full gap-8 sm:mt-16 md:mt-20 md:grid-cols-12 md:items-center md:gap-10">
          <div className="flex min-w-0 flex flex-col gap-4 md:col-span-5">
            <AboutParagraphBlock
              text={p1}
              lines={measuredLines.p1}
              startLineIndex={p1Start}
              variant="body"
              measureRef={p1MeasureRef}
              prefix="p1"
              {...paragraphProps}
            />
            <AboutParagraphBlock
              text={p2}
              lines={measuredLines.p2}
              startLineIndex={p2Start}
              variant="body"
              measureRef={p2MeasureRef}
              prefix="p2"
              {...paragraphProps}
            />
          </div>
          <div className="relative min-w-0 w-full md:col-span-7">
            <AboutGifViewer src={bodyImage.src} alt={bodyImage.alt} />
          </div>
        </div>
      ) : (
        <div className="mt-14 grid gap-8 sm:mt-16 md:mt-20 md:grid-cols-2">
          <div className="flex flex flex-col gap-4">
            <AboutParagraphBlock
              text={p1}
              lines={measuredLines.p1}
              startLineIndex={p1Start}
              variant="body"
              measureRef={p1MeasureRef}
              prefix="p1"
              {...paragraphProps}
            />
          </div>
          <div className="flex flex flex-col gap-4">
            <AboutParagraphBlock
              text={p2}
              lines={measuredLines.p2}
              startLineIndex={p2Start}
              variant="body"
              measureRef={p2MeasureRef}
              prefix="p2"
              {...paragraphProps}
            />
          </div>
        </div>
      )}

      {p3Image ? (
        <div className="mt-14 grid w-full gap-8 sm:mt-16 md:mt-20 md:grid-cols-12 md:items-center md:gap-10">
          <div className="flex min-w-0 flex flex-col gap-4 md:col-span-5">
            <AboutParagraphBlock
              text={p3}
              lines={measuredLines.p3}
              startLineIndex={p3Start}
              variant="body"
              measureRef={p3MeasureRef}
              prefix="p3"
              {...paragraphProps}
            />
          </div>
          <div className="relative min-w-0 w-full md:col-span-7">
            <AboutGifViewer src={p3Image.src} alt={p3Image.alt} />
          </div>
        </div>
      ) : (
        <div className="mt-14 flex flex-col gap-4 sm:mt-16 md:mt-20">
          <AboutParagraphBlock
            text={p3}
            lines={measuredLines.p3}
            startLineIndex={p3Start}
            variant="body"
            measureRef={p3MeasureRef}
            prefix="p3"
            {...paragraphProps}
          />
        </div>
      )}
    </div>
  );
}
