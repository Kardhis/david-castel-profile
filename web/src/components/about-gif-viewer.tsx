"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GIF_NATURAL_WIDTH = 1536;
const GIF_NATURAL_HEIGHT = 1024;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

const gifFrameClassName =
  "relative aspect-[3/2] max-h-[40vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-xl shadow-black/30 ring-1 ring-white/5 sm:max-h-none";

const gifTriggerClassName = cn(
  gifFrameClassName,
  "cursor-pointer p-0 text-left transition hover:border-sky-500/35 hover:ring-2 hover:ring-sky-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
);

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function getFitWidth() {
  if (typeof window === "undefined") return GIF_NATURAL_WIDTH;
  return Math.min(window.innerWidth * 0.94, GIF_NATURAL_WIDTH);
}

function getTouchDistanceFromTouches(
  first: React.Touch,
  second: React.Touch
) {
  const dx = first.clientX - second.clientX;
  const dy = first.clientY - second.clientY;
  return Math.hypot(dx, dy);
}

function GifFullscreenOverlay({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const t = useTranslations("about");
  const closeRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [fitWidth, setFitWidth] = useState(GIF_NATURAL_WIDTH);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef(1);
  const activePointerIdRef = useRef<number | null>(null);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const displayWidth = fitWidth * scale;
  const displayHeight = (displayWidth * GIF_NATURAL_HEIGHT) / GIF_NATURAL_WIDTH;

  const panRef = useRef(pan);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  const clampPan = useCallback(
    (nextPan: { x: number; y: number }) => {
      const viewport = viewportRef.current;
      if (!viewport) return nextPan;

      const viewportWidth = viewport.clientWidth;
      const viewportHeight = viewport.clientHeight;
      const horizontalOverflow = Math.max(0, displayWidth - viewportWidth);
      const verticalOverflow = Math.max(0, displayHeight - viewportHeight);
      const maxX = horizontalOverflow / 2;
      const maxY = verticalOverflow / 2;

      if (horizontalOverflow === 0 && verticalOverflow === 0) {
        return { x: 0, y: 0 };
      }

      return {
        x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
        y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
      };
    },
    [displayWidth, displayHeight]
  );

  const zoomIn = useCallback(() => {
    setScale((current) => clampZoom(Number((current + ZOOM_STEP).toFixed(2))));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((current) => clampZoom(Number((current - ZOOM_STEP).toFixed(2))));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (scale <= 1) {
      setPan({ x: 0, y: 0 });
      return;
    }

    setPan((current) => clampPan(current));
  }, [scale, clampPan]);

  useEffect(() => {
    const updateFitWidth = () => setFitWidth(getFitWidth());
    updateFitWidth();
    window.addEventListener("resize", updateFitWidth);
    return () => window.removeEventListener("resize", updateFitWidth);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn();
      }

      if (event.key === "-") {
        event.preventDefault();
        zoomOut();
      }

      if (event.key === "0") {
        event.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, zoomIn, zoomOut, resetZoom]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      setScale((current) => clampZoom(Number((current + delta).toFixed(2))));
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, []);

  const handleDoubleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    setScale((current) => {
      const next = current > 1 ? 1 : 2;
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (pinchStartDistanceRef.current !== null) return;
    if (event.button !== 0) return;

    activePointerIdRef.current = event.pointerId;
    setIsDragging(true);
    panStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    if (pinchStartDistanceRef.current !== null) return;

    const deltaX = event.clientX - panStartRef.current.x;
    const deltaY = event.clientY - panStartRef.current.y;
    setPan(
      clampPan({
        x: panStartRef.current.panX + deltaX,
        y: panStartRef.current.panY + deltaY,
      })
    );
  };

  const endPan = (event: React.PointerEvent<HTMLImageElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return;

    activePointerIdRef.current = null;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2) return;

    activePointerIdRef.current = null;
    setIsDragging(false);

    const first = event.touches[0];
    const second = event.touches[1];
    if (!first || !second) return;

    pinchStartDistanceRef.current = getTouchDistanceFromTouches(first, second);
    pinchStartScaleRef.current = scale;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2 || pinchStartDistanceRef.current === null) {
      return;
    }

    const first = event.touches[0];
    const second = event.touches[1];
    if (!first || !second) return;

    event.preventDefault();
    const distance = getTouchDistanceFromTouches(first, second);
    const ratio = distance / pinchStartDistanceRef.current;
    setScale(
      clampZoom(Number((pinchStartScaleRef.current * ratio).toFixed(2)))
    );
  };

  const handleTouchEnd = () => {
    pinchStartDistanceRef.current = null;
  };

  const zoomPercent = Math.round(scale * 100);

  const toolbarButtonClassName =
    "border border-white/20 bg-black/70 text-white hover:bg-black/90 hover:text-white";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className={toolbarButtonClassName}
          onClick={zoomOut}
          disabled={scale <= MIN_ZOOM}
          aria-label={t("zoomOutGif")}
        >
          <Minus aria-hidden className="size-5" strokeWidth={2.25} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(toolbarButtonClassName, "min-w-[4.5rem] px-3 font-medium tabular-nums")}
          onClick={resetZoom}
          aria-label={t("resetGifZoom")}
        >
          {zoomPercent}%
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className={toolbarButtonClassName}
          onClick={zoomIn}
          disabled={scale >= MAX_ZOOM}
          aria-label={t("zoomInGif")}
        >
          <Plus aria-hidden className="size-5" strokeWidth={2.25} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className={toolbarButtonClassName}
          onClick={resetZoom}
          aria-label={t("resetGifZoom")}
        >
          <RotateCcw aria-hidden className="size-5" strokeWidth={2.25} />
        </Button>
        <Button
          ref={closeRef}
          type="button"
          variant="ghost"
          size="icon-lg"
          className={toolbarButtonClassName}
          onClick={onClose}
          aria-label={t("closeGifView")}
        >
          <X aria-hidden className="size-6" strokeWidth={2.25} />
        </Button>
      </div>

      <p className="pointer-events-none absolute bottom-4 left-1/2 z-20 max-w-[min(92vw,40rem)] -translate-x-1/2 text-center text-sm text-zinc-400">
        {t("gifZoomHint")}
      </p>

      <div
        ref={viewportRef}
        className="flex h-full w-full items-center justify-center overflow-hidden px-3 pb-14 pt-20 sm:px-6 sm:pt-24"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <img
          src={src}
          alt={alt}
          width={GIF_NATURAL_WIDTH}
          height={GIF_NATURAL_HEIGHT}
          draggable={false}
          className={cn(
            "h-auto max-w-none shrink-0 select-none touch-none",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          style={{
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
          onDoubleClick={handleDoubleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPan}
          onPointerCancel={endPan}
        />
      </div>
    </div>,
    document.body
  );
}

function GifImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={GIF_NATURAL_WIDTH}
      height={GIF_NATURAL_HEIGHT}
      className={cn("h-full w-full object-contain object-center", className)}
      loading="lazy"
      decoding="async"
    />
  );
}

export function AboutGifViewer({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const t = useTranslations("about");

  const openView = useCallback(() => setIsOpen(true), []);
  const closeView = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {reduceMotion ? (
        <button
          type="button"
          className={gifTriggerClassName}
          onClick={openView}
          aria-label={t("openGifView")}
        >
          <GifImage src={src} alt={alt} />
        </button>
      ) : (
        <motion.button
          type="button"
          className={gifTriggerClassName}
          onClick={openView}
          aria-label={t("openGifView")}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "center center" }}
        >
          <GifImage src={src} alt={alt} />
        </motion.button>
      )}

      {isOpen ? (
        <GifFullscreenOverlay src={src} alt={alt} onClose={closeView} />
      ) : null}
    </>
  );
}
