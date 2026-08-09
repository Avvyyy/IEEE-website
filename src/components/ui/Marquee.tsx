import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden scrollbar-none", className)}>
      <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
        <div className="flex items-center gap-12 pr-12">{children}</div>
        <div className="flex items-center gap-12 pr-12" aria-hidden="true">
          {children}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-deep to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-deep to-transparent" />
    </div>
  );
}
