import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-sans text-sm font-semibold tracking-tight transition-[transform,background-color,border-color,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        neo: "border border-ink/25 bg-panel text-ink shadow-neo-sm hover:-translate-y-0.5 hover:border-ink/50 hover:bg-panel-2 hover:shadow-neo active:translate-y-0 active:shadow-neo-sm",
        "neo-dark":
          "border border-invert/30 bg-invert text-deep shadow-neo-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-neo active:translate-y-0 active:shadow-neo-sm",
        "neo-blue":
          "border border-neo-blue bg-neo-blue text-white shadow-neo-blue hover:-translate-y-0.5 hover:bg-[#5a79ed] hover:shadow-neo active:translate-y-0 active:shadow-neo-sm",
        "neo-violet":
          "border border-neo-violet bg-neo-violet text-white shadow-neo-violet hover:-translate-y-0.5 hover:bg-[#896bdb] hover:shadow-neo active:translate-y-0 active:shadow-neo-sm",
        "neo-cyan":
          "border border-neo-cyan bg-neo-cyan text-deep shadow-neo-cyan hover:-translate-y-0.5 hover:bg-[#a3e7f0] hover:shadow-neo active:translate-y-0 active:shadow-neo-sm",
        "neo-green":
          "border border-neo-green bg-neo-green text-deep shadow-neo-green hover:-translate-y-0.5 hover:bg-[#a1e6d0] hover:shadow-neo active:translate-y-0 active:shadow-neo-sm",
        "neo-yellow":
          "border border-neo-yellow bg-neo-yellow text-deep shadow-neo-yellow hover:-translate-y-0.5 hover:bg-[#f9e2b5] hover:shadow-neo active:translate-y-0 active:shadow-neo-sm",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 px-6 text-base has-[>svg]:px-4",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
