import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Bell, CalendarClock, Camera, Check, CheckCircle2, CircleDollarSign, Clock3, FileText, HandCoins, Image, Laptop, PackageCheck, Palette, Phone, Search, ShieldCheck, Truck, UserRound, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ProofBoxRecord, ProofBoxStatus } from "@/lib/proofbox-data";

export function PrimaryButton(props: ButtonProps) { return <Button {...props} />; }
export function SecondaryButton(props: ButtonProps) { return <Button variant="outline" {...props} />; }

const statusStyles: Record<ProofBoxStatus, string> = {
  Draft: "border-border bg-secondary text-muted-foreground",
  Active: "border-info/20 bg-info-soft text-info",
  "Awaiting confirmation": "border-warning/25 bg-warning-soft text-warning-foreground",
  "Due soon": "border-danger/20 bg-danger-soft text-danger",
  Overdue: "border-destructive/25 bg-destructive/10 text-destructive",
  Completed: "border-success/20 bg-success-soft text-success",
  Disputed: "border-destructive/20 bg-destructive/10 text-destructive",
};

export function StatusBadge({ status, className }: { status: ProofBoxStatus; className?: string }) {
  return <Badge variant="outline" className={cn("gap-1.5 whitespace-nowrap px-2.5 py-1 font-medium", statusStyles[status], className)}><span className="size-1.5 rounded-full bg-current" />{status}</Badge>;
}

const typeIcons: Record<string, typeof Camera> = {
  Borrow: Camera,
  Service: Palette,
  Rental: Laptop,
  Sale: Phone,
  Delivery: Truck,
  Payment: CircleDollarSign,
  Custom: FileText,
};

export function RecordIcon({ kind, className }: { kind: string; className?: string }) {
  const Icon = typeIcons[kind] ?? FileText;
  return <span className={cn("grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground", className)}><Icon className="size-[18px]" /></span>;
}

export function ProofBoxCard({ record, prominent = false }: { record: ProofBoxRecord; prominent?: boolean }) {
  return (
    <Link to="/proofboxes/$id" params={{ id: record.id }} className={cn("group block rounded-lg border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", prominent && "p-5")}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <RecordIcon kind={record.icon} />
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-card-foreground">{record.title}</h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">with {record.participant}</p>
        </div>
        <StatusBadge status={record.status} className="hidden sm:inline-flex" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-sm">
        <span className="font-medium text-foreground">{record.value}</span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground"><CalendarClock className="size-3.5" />{record.due}</span>
        <StatusBadge status={record.status} className="sm:hidden" />
        <span className="ml-auto text-xs font-medium text-muted-foreground transition group-hover:text-primary">View record →</span>
      </div>
    </Link>
  );
}

export function ParticipantCard({ name, role, confirmed, time, initials, waitingLabel = "Waiting" }: { name: string; role: string; confirmed: boolean; time?: string | undefined; initials: string; waitingLabel?: string | undefined }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border bg-card p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">{initials}</span>
      <div className="min-w-0"><p className="truncate font-semibold">{name}</p><p className="text-sm text-muted-foreground">{role}</p></div>
      {confirmed ? <div className="text-right"><span className="inline-flex items-center gap-1 text-sm font-semibold text-success"><CheckCircle2 className="size-4" /> Confirmed</span><p className="mt-0.5 text-xs text-muted-foreground">{time}</p></div> : <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-warning-foreground"><Clock3 className="size-4" /> {waitingLabel}</span>}
    </div>
  );
}

export function EvidenceCard({ title, meta, fileType, onClick }: { title: string; meta: string; fileType: string | null; onClick?: () => void }) {
  const Icon = fileType?.startsWith("image/") ? Image : FileText;
  return <button type="button" onClick={onClick} className="group w-full overflow-hidden rounded-lg border bg-card text-left transition hover:border-primary/25 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="grid aspect-[4/3] place-items-center bg-secondary"><Icon className="size-8 text-muted-foreground transition group-hover:text-primary" /></span><span className="block p-3"><span className="block truncate text-sm font-semibold">{title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{meta}</span></span></button>;
}

const timelineIcon: Record<string, typeof Check> = { created: FileText, invited: UsersRound, invitation_accepted: UserRound, evidence: Image, confirmed: CheckCircle2, box_confirmed: ShieldCheck, changes_requested: AlertTriangle, amended: FileText, reminder: Bell, completed: PackageCheck, disputed: AlertTriangle, waiting: Clock3, payment: HandCoins };

export function Timeline({ events }: { events: Array<{ type: string; title: string; detail: string; time: string }> }) {
  if (!events.length) return <p className="text-sm text-muted-foreground">Nothing has happened on this record yet.</p>;
  return <ol className="relative ml-4 border-l border-border">{events.map((event, index) => { const Icon = timelineIcon[event.type] ?? Clock3; return <li key={`${event.title}-${event.time}-${index}`} className="relative pb-7 pl-8 last:pb-0"><span className={cn("absolute -left-4 top-0 grid size-8 place-items-center rounded-full border bg-background text-muted-foreground", (event.type === "confirmed" || event.type === "box_confirmed") && "border-success/30 bg-success-soft text-success", event.type === "waiting" && "border-warning/30 bg-warning-soft text-warning-foreground")}><Icon className="size-3.5" /></span><div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"><p className="text-sm font-semibold text-foreground">{event.title}</p><time className="shrink-0 text-xs text-muted-foreground">{event.time}</time></div><p className="mt-1 text-sm text-muted-foreground">{event.detail}</p></li>; })}</ol>;
}

export function DueDateIndicator({ children, urgent = false }: { children: ReactNode; urgent?: boolean }) { return <span className={cn("inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground", urgent && "bg-danger-soft text-danger")}><CalendarClock className="size-3.5" />{children}</span>; }

export function SearchBar({ placeholder = "Search ProofBoxes", value, onChange }: { placeholder?: string; value?: string; onChange?: (value: string) => void }) { return <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label={placeholder} placeholder={placeholder} value={value} onChange={(event) => onChange?.(event.target.value)} className="h-11 bg-card pl-9 shadow-none" /></div>; }

export function FilterDropdown({ value, onChange }: { value?: string; onChange?: (value: string) => void }) { return <Select value={value ?? "all"} onValueChange={(next) => onChange?.(next)}><SelectTrigger className="h-11 w-[144px] bg-card" aria-label="Filter records"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All records</SelectItem><SelectItem value="draft">Drafts</SelectItem><SelectItem value="awaiting_confirmation">Awaiting</SelectItem><SelectItem value="confirmed">Active</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="disputed">Disputed</SelectItem></SelectContent></Select>; }

export function EmptyState({ title = "No ProofBoxes yet", description = "Create your first record to keep an agreement clear and easy to find.", showAction = true }: { title?: string; description?: string; showAction?: boolean }) { return <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center"><span className="mx-auto grid size-11 place-items-center rounded-md bg-secondary text-muted-foreground"><FileText className="size-5" /></span><h3 className="mt-4 font-semibold">{title}</h3><p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>{showAction && <Button asChild className="mt-5"><Link to="/proofboxes/create">Create ProofBox</Link></Button>}</div>; }

export function ConfirmationPanel({ compact = false }: { compact?: boolean }) { return <div className={cn("rounded-lg border border-success/25 bg-success-soft p-5", !compact && "sm:p-6")}><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-success text-success-foreground"><ShieldCheck className="size-[18px]" /></span><div><h3 className="font-semibold text-foreground">Confirmed information is preserved</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Once everyone confirms, future changes are recorded as amendments. The original agreement stays unchanged and visible.</p></div></div></div>; }

export function NotificationItem({ title, detail, time, kind, unread }: { title: string; detail: string; time: string; kind: string; unread: boolean }) { const Icon = timelineIcon[kind] ?? Bell; return <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-b px-4 py-4 last:border-0 sm:px-5"><span className={cn("grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground", (kind === "confirmed" || kind === "box_confirmed") && "bg-success-soft text-success", kind === "reminder" && "bg-warning-soft text-warning-foreground")}><Icon className="size-4" /></span><div className="min-w-0"><p className={cn("text-sm", unread ? "font-semibold" : "font-medium")}>{title}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</p><time className="mt-1.5 block text-xs text-muted-foreground">{time}</time></div>{unread && <span className="mt-2 size-2 rounded-full bg-primary" aria-label="Unread" />}</div>; }

export function StatCard({ label, value, icon: Icon, tone = "neutral" }: { label: string; value: number; icon: typeof Bell; tone?: "neutral" | "warning" | "danger" | "success" }) {
  const tones = { neutral: "bg-secondary text-secondary-foreground", warning: "bg-warning-soft text-warning-foreground", danger: "bg-danger-soft text-danger", success: "bg-success-soft text-success" } as const;
  return <div className="rounded-lg border bg-card p-4 shadow-card"><span className={cn("grid size-9 place-items-center rounded-md", tones[tone])}><Icon className="size-[18px]" /></span><p className="mt-3 text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div>;
}

export function AgreementRows({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return <dl className="divide-y">{rows.map((row) => <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4"><dt className="text-sm text-muted-foreground">{row.label}</dt><dd className="whitespace-pre-line text-sm font-medium leading-6 text-foreground">{row.value}</dd></div>)}</dl>;
}

export const typeChoices = [
  { label: "Borrow", icon: Camera, hint: "Lending an item" },
  { label: "Service", icon: Palette, hint: "Work or a job" },
  { label: "Rental", icon: Laptop, hint: "Paid use over time" },
  { label: "Sale", icon: Phone, hint: "Buying or selling" },
  { label: "Delivery", icon: Truck, hint: "Handover of goods" },
  { label: "Payment", icon: CircleDollarSign, hint: "Money owed or paid" },
  { label: "Custom", icon: FileText, hint: "Anything else" },
] as const;

export function CreateTypeCard({ label, icon: Icon, hint, selected, onClick }: { label: string; icon: typeof Camera; hint: string; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-pressed={selected} className={cn("rounded-lg border bg-card p-4 text-left shadow-card transition hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selected && "border-primary bg-primary-soft")}><Icon className={cn("size-5 text-muted-foreground", selected && "text-primary")} /><span className="mt-3 block text-sm font-semibold">{label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span></button>;
}

export { AlertTriangle, Bell, CheckCircle2, Clock3, PackageCheck, ShieldCheck, UserRound };
