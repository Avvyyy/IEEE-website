import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-sm p-6 transition-all duration-300 hover:border-ieee-blue/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-ieee-blue/10",
        className
      )}
    >
      {children}
    </div>
  );
}
