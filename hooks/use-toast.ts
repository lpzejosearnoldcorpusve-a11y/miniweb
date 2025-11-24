"use client"

import { useCallback } from "react"
import { toast as sonnerToast } from "sonner"


export type UseToastOptions = {
  title?: string
  description?: string
  variant?: "destructive" | string
  duration?: number
}

export function useToast() {
  const toast = useCallback((arg: string | UseToastOptions) => {
    if (typeof arg === "string") {
      sonnerToast(arg)
      return
    }

    const { title, description, variant, duration } = arg
    const message = title && description ? `${title} - ${description}` : title || description || ""

    if (variant === "destructive") {
      sonnerToast.error(message, { duration })
    } else {
      sonnerToast.success(message, { duration })
    }
  }, [])

  return { toast }
}
