"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")


const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(function Label({ className, children, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants(),
        "text-primary/90 flex items-center gap-1",
        className
      )}
      {...props}
    >
      {/* Ayurveda leaf accent, optional */}
      <svg
        className="w-3 h-3 opacity-40 text-primary -ml-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ display: 'inline' }}
      >
        <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
        <path d="M12 8V14" />
      </svg>
      {children}
    </LabelPrimitive.Root>
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

export { Label }
