import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react"

import { cn } from "@/lib/utils"

export interface ShimmerButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "href"> {
  /** Si se define, se renderiza `<a>` (enlaces internos / externos). */
  href?: string
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      href,
      ...rest
    },
    ref
  ) => {
    const style = {
      "--spread": "90deg",
      "--shimmer-color": shimmerColor,
      "--radius": borderRadius,
      "--speed": shimmerDuration,
      "--cut": shimmerSize,
      "--bg": background,
    } as CSSProperties

    const classNames = cn(
      "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 py-3 whitespace-nowrap text-white no-underline [background:var(--bg)]",
      "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
      className
    )

    const inner = (
      <>
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "@container-[size] absolute inset-0 overflow-visible"
          )}
        >
          <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        <span className="relative z-10">{children}</span>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
          )}
        />
      </>
    )

    if (href != null && href !== "") {
      const {
        type: _type,
        disabled: _disabled,
        form: _form,
        formAction: _formAction,
        formEncType: _formEncType,
        formMethod: _formMethod,
        formNoValidate: _formNoValidate,
        formTarget: _formTarget,
        name: _name,
        value: _value,
        ...anchorProps
      } = rest

      return (
        <a
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          style={style}
          className={classNames}
          {...(anchorProps as Omit<ComponentPropsWithoutRef<"a">, "href" | "children">)}
        >
          {inner}
        </a>
      )
    }

    return (
      <button
        style={style}
        className={classNames}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...rest}
      >
        {inner}
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"
