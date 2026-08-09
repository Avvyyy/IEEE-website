import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonBaseProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<NonNullable<ButtonBaseProps["variant"]>, string> = {
  primary:
    "bg-ieee-blue text-white hover:bg-ieee-blue-light shadow-lg shadow-ieee-blue/20",
  secondary:
    "bg-transparent text-white border border-white/30 hover:border-white hover:bg-white/5",
  ghost: "bg-transparent text-white hover:bg-white/10",
};

const sizeClasses: Record<NonNullable<ButtonBaseProps["size"]>, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-95 cursor-pointer";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const isExternal = href.startsWith("http");
  const linkClass = cn(base, variantClasses[variant], sizeClasses[size], className);

  if (isExternal) {
    return (
      <a href={href} className={linkClass} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClass} {...rest}>
      {children}
    </Link>
  );
}
