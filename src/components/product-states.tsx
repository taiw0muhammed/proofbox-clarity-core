import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return <div className="mt-7 space-y-4" aria-label="Loading"><Skeleton className="h-24 w-full" /><div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-40" /><Skeleton className="h-40" /></div><Skeleton className="h-56 w-full" /></div>;
}

export function InlineLoading({ label = "Loading" }: { label?: string }) {
  return <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" />{label}</div>;
}

export function ProductEmpty({ icon: Icon = Inbox, title, description, action }: { icon?: typeof Inbox; title: string; description: string; action?: ReactNode }) {
  return <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center"><span className="mx-auto grid size-11 place-items-center rounded-md bg-secondary text-muted-foreground"><Icon className="size-5" /></span><h3 className="mt-4 font-semibold">{title}</h3><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

export function ProductError({ retry, offline = false }: { retry: () => void; offline?: boolean }) {
  const Icon = offline ? WifiOff : AlertCircle;
  return <div className="mt-7 rounded-lg border border-destructive/20 bg-card px-6 py-10 text-center"><Icon className="mx-auto size-6 text-destructive" /><h3 className="mt-3 font-semibold">{offline ? "You appear to be offline" : "This section didn't load"}</h3><p className="mt-1 text-sm text-muted-foreground">Your information is safe. Reconnect or try again.</p><Button variant="outline" className="mt-4" onClick={retry}>Try again</Button></div>;
}