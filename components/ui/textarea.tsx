import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-accent/40 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_1px_8px_0_rgba(220,150,80,0.07)]",
          className,
        )}
        ref={ref}
        {...props}
      />
      {/* Ayurveda leaf accent, background */}
      <svg
        className="absolute bottom-2 right-2 w-5 h-5 opacity-10 text-primary pointer-events-none select-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
        <path d="M12 8V14" />
      </svg>
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
