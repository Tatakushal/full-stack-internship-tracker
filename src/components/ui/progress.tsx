import { cn } from "@/lib/utils";

export function Progress({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-fuchsia-300 transition-all duration-700"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
