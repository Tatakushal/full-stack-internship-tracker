"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onCheckedChange,
  className,
  "aria-label": ariaLabel
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "grid h-5 w-5 place-items-center rounded-md border border-white/15 bg-white/5 text-slate-950 transition hover:border-cyan-300/60",
        checked && "border-cyan-200 bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.28)]",
        className
      )}
    >
      {checked ? <Check className="h-3.5 w-3.5" /> : null}
    </button>
  );
}
