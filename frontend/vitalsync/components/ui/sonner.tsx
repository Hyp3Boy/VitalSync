"use client"

import type { CSSProperties } from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const LIGHT_TOAST_STYLE: CSSProperties = {
  "--normal-bg": "#fffdf7",
  "--normal-text": "#4e342e",
  "--normal-border": "#f2d8c8",
  "--border-radius": "1.25rem",
}

const Toaster = ({ className, style, theme, ...props }: ToasterProps) => {
  const mergedClassName = ["toaster group", "text-[#4e342e]", className]
    .filter(Boolean)
    .join(" ")

  return (
    <Sonner
      theme={(theme ?? "light") as ToasterProps["theme"]}
      className={mergedClassName}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        ...LIGHT_TOAST_STYLE,
        ...style,
      }}
      {...props}
    />
  )
}

export { Toaster }
