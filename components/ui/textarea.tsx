import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "filled" | "outline"
  error?: boolean
  resize?: "none" | "vertical" | "horizontal" | "both"
  characterCount?: boolean
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = "default", 
    error = false, 
    resize = "vertical",
    characterCount = false,
    maxLength,
    value,
    disabled,
    ...props 
  }, ref) => {
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 0
    )

    React.useEffect(() => {
      if (typeof value === "string") {
        setCharCount(value.length)
      }
    }, [value])

    const variants = {
      default: "bg-background border border-input",
      filled: "bg-muted border-transparent",
      outline: "bg-transparent border-2 border-input"
    }

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize"
    }

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            variants[variant],
            resizeClasses[resize],
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          onChange={(e) => {
            if (characterCount) {
              setCharCount(e.target.value.length)
            }
            props.onChange?.(e)
          }}
          {...props}
        />
        
        {characterCount && maxLength && (
          <div className={cn(
            "absolute bottom-2 right-2 text-xs",
            charCount > maxLength * 0.9 
              ? "text-destructive" 
              : "text-muted-foreground"
          )}>
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }