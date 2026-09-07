import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Bell, CalendarClock, Camera, Check, CheckCircle2, CircleDollarSign, Clock3, FileText, Image, Laptop, PackageCheck, Palette, Phone, Search, ShieldCheck, Truck, UserRound, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ProofBoxRecord, ProofBoxStatus } from "@/lib/proofbox-data";

export function PrimaryButton(props: ButtonProps) { return <Button {...props} />; }
export function SecondaryButton(props: ButtonProps) { return <Button variant="outline" {...props} />; }

const statusStyles: Record<ProofBoxStatus, string> = {
  Active: "border-info/20 bg-info-soft text-info",
  "Awaiting confirmation": "border-warning/25 bg-warning-soft text-warning-foreground",
  "Due soon": "border-danger/20 bg-danger-soft text-danger",
  Completed: "border-success/20 bg-success-soft text-success",
  Disputed: "border-destructive/20 bg-destructive/10 text-destructive",
};

export function StatusBadge({ status, className }: { status: ProofBoxStatus; className?: string }) {
  return <Badge variant="outline" className={cn("gap-1.5 whitespace-nowrap px-2.5 py-1 font-medium", statusStyles[status], className)}><span className="size-1.5 rounded-full bg-current" />{status}</Badge>;
}

const icons = { camera: Camera, palette: Palette, laptop: Laptop, phone: Phone, truck: Truck, payment: CircleDollarSign };

export function RecordIcon({ kind, className }: { kind: keyof typeof icons; className?: string }) {
  const Icon = icons[kind];
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

export function ParticipantCard({ name, role, confirmed, time, initials }: { name: string; role: string; confirmed: boolean; time?: string; initials: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border bg-card p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">{initials}</span>
      <div className="min-w-0"><p className="truncate font-semibold">{name}</p><p className="text-sm text-muted-foreground">{role}</p></div>
      {confirmed ? <div className="text-right"><span className="inline-flex items-center gap-1 text-sm font-semibold text-success"><CheckCircle2 className="size-4" /> Confirmed</span><p className="mt-0.5 text-xs text-muted-foreground">{time}</p></div> : <span className="inline-flex items-center gap-1.5 text-sm font-medium text-warning-foreground"><Clock3 className="size-4" /> Waiting</span>}
    </div>
  );
}

const evidenceIcons = { photo: Image, receipt: FileText, document: FileText, screenshot: Camera };
export function EvidenceCard({ title, type, meta }: { title: string; type: keyof typeof evidenceIcons; meta: string }) {
  const Icon = evidenceIcons[type];
  return <button className="group w-full overflow-hidden rounded-lg border bg-card text-left transition hover:border-primary/25 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="grid aspect-[4/3] place-items-center bg-secondary"><Icon className="size-8 text-muted-foreground transition group-hover:text-primary" /></span><span className="block p-3"><span className="block truncate text-sm font-semibold">{title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{meta}</span></span></button>;
}

const timelineIcon: Record<string, typeof Check> = { created: FileText, invited: UsersRound, evidence: Image, confirmed: CheckCircle2, amended: FileText, reminder: Bell, completed: PackageCheck, disputed: AlertTriangle, waiting: Clock3 };
export function Timeline({ events }: { events: Array<{ type: string; title: string; detail: string; time: string }> }) {
  return <ol className="relative ml-4 border-l border-border">{events.map((event, index) => { const Icon = timelineIcon[event.type] ?? Clock3; return <li key={`${event.title}-${event.time}`} className="relative pb-7 pl-8 last:pb-0"><span className={cn("absolute -left-4 top-0 grid size-8 place-items-center rounded-full border bg-background text-muted-foreground", event.type === "confirmed" && "border-success/30 bg-success-soft text-success", event.type === "waiting" && "border-warning/30 bg-warning-soft text-warning-foreground")}><Icon className="size-3.5" /></span><div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"><p className="text-sm font-semibold text-foreground">{event.title}</p><time className="shrink-0 text-xs text-muted-foreground">{event.time}</time></div><p className="mt-1 text-sm text-muted-foreground">{event.detail}</p></li>; })}</ol>;
}

export function DueDateIndicator({ children, urgent = false }: { children: ReactNode; urgent?: boolean }) { return <span className={cn("inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground", urgent && "bg-danger-soft text-danger")}><CalendarClock className="size-3.5" />{children}</span>; }

export function SearchBar({ placeholder = "Search ProofBoxes" }: { placeholder?: string }) { return <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label={placeholder} placeholder={placeholder} className="h-11 bg-card pl-9 shadow-none" /></div>; }

export function FilterDropdown() { return <Select defaultValue="all"><SelectTrigger className="h-11 w-[132px] bg-card" aria-label="Filter records"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All records</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="waiting">Awaiting</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>; }

export function EmptyState() { return <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center"><span className="mx-auto grid size-11 place-items-center rounded-md bg-secondary text-muted-foreground"><FileText className="size-5" /></span><h3 className="mt-4 font-semibold">No ProofBoxes yet</h3><p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Create your first record to keep an agreement clear and easy to find.</p><Button asChild className="mt-5"><Link to="/proofboxes/create">Create ProofBox</Link></Button></div>; }

export function ConfirmationPanel({ compact = false }: { compact?: boolean }) { return <div className={cn("rounded-lg border border-success/25 bg-success-soft p-5", !compact && "sm:p-6")}><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-success text-success-foreground"><ShieldCheck className="size-[18px]" /></span><div><h3 className="font-semibold text-foreground">Confirmed information is preserved</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Once everyone confirms, future changes are recorded as amendments. The original agreement stays unchanged and visible.</p></div></div></div>; }

export function NotificationItem({ title, detail, time, kind, unread }: { title: string; detail: string; time: string; kind: string; unread: boolean }) { const Icon = timelineIcon[kind] ?? Bell; return <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-b px-4 py-4 last:border-0 sm:px-5"><span className={cn("grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground", kind === "confirmed" && "bg-success-soft text-success", kind === "reminder" && "bg-warning-soft text-warning-foreground")}><Icon className="size-4" /></span><div className="min-w-0"><p className={cn("text-sm", unread ? "font-semibold" : "font-medium")}>{title}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</p><time className="mt-1.5 block text-xs text-muted-foreground">{time}</time></div>{unread && <span className="mt-2 size-2 rounded-full bg-primary" aria-label="Unread" />}</div>; }

export function StatCard({ label, value, icon: Icon, tone = "neutral" }: { label: string; value: number; icon: typeof Bell; tone?: "neutral" | "warning" | "danger" | "success" }) { return <div className="rounded-lg border bg-card p-4 shadow-card"><div className="flex items-center justify-between"><span className="text-sm font-medium text-muted-foreground">{label}</span><span className={cn("grid size-8 place-items-center rounded-md bg-secondary text-muted-foreground", tone === "warning" && "bg-warning-soft text-warning-foreground", tone === "danger" && "bg-danger-soft text-danger", tone === "success" && "bg-success-soft text-success")}><Icon className="size-4" /></span></div><p className="mt-3 text-2xl font-bold">{value}</p></div>; }

export function AgreementRows() { const rows = [["Owner", "Muhammed Imam"], ["Borrower", "Ahmed Bello"], ["Item", "Sony Alpha a7 IV camera"], ["Borrowed", "September 7, 2026"], ["Return", "September 15, 2026"], ["Responsibility", "Borrower covers damage beyond normal wear."]]; return <dl className="divide-y">{rows.map(([term, detail]) => <div key={term} className="grid gap-1 py-4 sm:grid-cols-[150px_1fr]"><dt className="text-sm text-muted-foreground">{term}</dt><dd className="text-sm font-medium leading-6 text-foreground">{detail}</dd></div>)}</dl>; }

export const typeChoices = [
  { label: "Borrow", description: "Items lent temporarily", icon: Camera }, { label: "Payment", description: "Money owed or paid", icon: CircleDollarSign }, { label: "Sale", description: "An item being sold", icon: Phone }, { label: "Rental", description: "Items rented for a period", icon: Laptop },
  { label: "Service", description: "Work and deliverables", icon: Palette }, { label: "Delivery", description: "Goods to be delivered", icon: Truck }, { label: "Promise", description: "A personal commitment", icon: CheckCircle2 }, { label: "Custom", description: "Something else", icon: FileText },
];

export function CreateTypeCard({ label, description, icon: Icon, selected, onClick }: { label: string; description: string; icon: typeof Camera; selected: boolean; onClick: () => void }) { return <button type="button" onClick={onClick} aria-pressed={selected} className={cn("group min-h-28 rounded-lg border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selected && "border-primary bg-primary-soft ring-1 ring-primary")}><span className={cn("grid size-9 place-items-center rounded-md bg-secondary text-muted-foreground", selected && "bg-primary text-primary-foreground")}><Icon className="size-[18px]" /></span><span className="mt-3 block text-sm font-semibold">{label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{description}</span></button>; }

export { AlertTriangle, Bell, CheckCircle2, Clock3, PackageCheck, ShieldCheck, UserRound };