import { cn } from "@/lib/utils";

export function BarberPole({ className, capClassName }: { className?: string; capClassName?: string }) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("h-1.5 w-full rounded-full bg-cream shadow-[0_0_6px_rgba(244,234,214,0.5)]", capClassName)} />
      <div className="relative w-full flex-1 overflow-hidden rounded-full border border-cream/25">
        <div className="pole-stripes absolute inset-0" />
      </div>
      <div className={cn("h-1.5 w-full rounded-full bg-cream shadow-[0_0_6px_rgba(244,234,214,0.5)]", capClassName)} />
    </div>
  );
}
