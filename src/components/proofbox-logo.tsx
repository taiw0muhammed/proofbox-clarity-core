import { cn } from "@/lib/utils";

export function ProofBoxMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid size-8 place-items-center rounded-[9px] bg-primary text-primary-foreground shadow-brand", className)} aria-hidden="true">
      <svg viewBox="0 0 32 32" className="size-5" fill="none">
        <path d="M7.5 9.5 16 5l8.5 4.5v13L16 27l-8.5-4.5v-13Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="m11.5 16 3 3 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function ProofBoxLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <ProofBoxMark />
      {!compact && <span className="text-[17px] font-bold text-foreground">ProofBox</span>}
    </span>
  );
}