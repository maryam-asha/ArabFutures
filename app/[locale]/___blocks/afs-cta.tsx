import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";

type CtaVariant = "outline" | "text" | "dark-text";

const VARIANTS: Record<CtaVariant, string> = {
  outline: "border border-gold text-gold px-5 py-3 hover:bg-gold hover:text-ink",
  text: "text-light py-3 hover:text-gold",
  "dark-text": "text-ink py-3 hover:opacity-70",
};

type CtaProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: CtaVariant;
  size?: "sm" | "md";
  className?: string;
  arrow?: boolean;
};

/** The two link styles of the design: gold outline button and plain label + arrow. */
export function Cta({ variant = "outline", size = "md", arrow = true, className, children, ...props }: CtaProps) {
  return (
    <Link
      {...props}
      className={cn(
        "afs-label group inline-flex items-center gap-3 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
        size === "sm" && "text-xs gap-2",
        size === "sm" && variant === "outline" && "px-3 py-2",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
      {arrow && <ArrowRight aria-hidden className={cn("shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1", size === "sm" ? "size-3.5" : "size-4")} />}
    </Link>
  );
}
