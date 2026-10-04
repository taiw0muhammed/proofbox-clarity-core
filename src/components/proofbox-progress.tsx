import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProofBoxProgress({ status }: { status: string }) {
  const normal = ["Created", "Awaiting confirmation", "Confirmed", "In progress", "Due", "Completed"];
  const steps = status === "disputed" ? ["Created", "Confirmed", "Disputed"] : normal;
  const index = status === "draft" ? 0 : status === "awaiting_confirmation" ? 1 : status === "confirmed" ? 3 : status === "completed" ? 5 : status === "disputed" ? 2 : 0;
  return <div className="overflow-x-auto pb-2"><ol className="flex min-w-[560px] items-start" aria-label="ProofBox progress">{steps.map((step, stepIndex) => { const complete = stepIndex < index; const current = stepIndex === index; return <li key={step} className="flex min-w-0 flex-1 items-start last:flex-none"><div className="flex w-full flex-col items-start"><div className="flex w-full items-center"><span className={cn("grid size-7 shrink-0 place-items-center rounded-full border bg-background text-xs font-semibold text-muted-foreground", (complete || current) && "border-primary bg-primary text-primary-foreground", step === "Disputed" && current && "border-destructive bg-destructive text-destructive-foreground")}>{complete ? <Check className="size-3.5" /> : stepIndex + 1}</span>{stepIndex < steps.length - 1 && <span className={cn("h-px flex-1 bg-border", complete && "bg-primary")} />}</div><span className={cn("mt-2 max-w-24 text-xs text-muted-foreground", current && "font-semibold text-foreground")}>{step}</span></div></li>; })}</ol></div>;
}