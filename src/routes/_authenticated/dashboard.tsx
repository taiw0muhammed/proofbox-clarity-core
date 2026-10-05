import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, CalendarDays, CheckCircle2, Clock3, FileText, LayoutTemplate, Loader2, Plus, QrCode, Star } from "lucide-react";
import { AppShell, PageHeading, SectionHeading } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState, ProofBoxCard, StatCard } from "@/components/proofbox-ui";
import { DashboardCharts } from "@/components/dashboard-charts";
import { fetchBoxesWithState, toRecord } from "@/lib/proofbox-queries";
import { useProfile, useUser } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ProofBox" },
      { name: "description", content: "See your agreements, transactions and commitments in one place." },
      { property: "og:title", content: "Dashboard — ProofBox" },
      { property: "og:description", content: "See your agreements, transactions and commitments in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useUser();
  const { data: profile } = useProfile();
  const { data, isLoading, error } = useQuery({ queryKey: ["boxes-with-state"], queryFn: fetchBoxesWithState });
  const boxes = data?.boxes.filter((box) => !box.userState?.archived_at) ?? [];

  const firstName = (profile?.full_name ?? user?.email ?? "there").split(" ")[0];
  const records = (boxes ?? []).map((box) => toRecord(box, user?.id ?? null));
  const needsAttention = records.filter((record) => record.status === "Awaiting confirmation" || record.status === "Overdue" || record.status === "Due soon");
  const counts = {
    active: records.filter((r) => r.status === "Active" || r.status === "Due soon").length,
    awaiting: records.filter((r) => r.status === "Awaiting confirmation" || r.status === "Draft").length,
    due: records.filter((r) => r.status === "Due soon" || r.status === "Overdue").length,
    completed: records.filter((r) => r.status === "Completed").length,
  };

  return (
    <AppShell>
      <PageHeading
        title={`Hello, ${firstName}`}
        description="Your agreements, transactions and commitments in one place."
        action={<Button asChild className="hidden sm:inline-flex"><Link to="/proofboxes/create"><Plus />Create ProofBox</Link></Button>}
      />
      <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Active" value={counts.active} icon={FileText} />
        <StatCard label="Awaiting" value={counts.awaiting} icon={Clock3} tone="warning" />
        <StatCard label="Due soon" value={counts.due} icon={Bell} tone="danger" />
        <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} tone="success" />
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"><QuickLink to="/proofboxes/create" label="New ProofBox" icon={Plus} /><QuickLink to="/templates" label="Use template" icon={LayoutTemplate} /><QuickLink to="/scan" label="Scan code" icon={QrCode} /><QuickLink to="/reminders" label="Add reminder" icon={CalendarDays} /></section>

      {isLoading && <div className="mt-10 flex justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}
      {error && <p className="mt-10 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">We couldn't load your records. Please refresh and try again.</p>}

      {!isLoading && !error && records.length === 0 && <div className="mt-9"><EmptyState /></div>}

      {!isLoading && !error && records.length > 0 && (
        <section className="mt-9">
          <SectionHeading title="Activity" />
          <ClientOnly fallback={<div className="h-52 rounded-lg border bg-card" />}>
            <DashboardCharts boxes={boxes} />
          </ClientOnly>
        </section>
      )}

      {needsAttention.length > 0 && (
        <section className="mt-9">
          <SectionHeading title="Needs your attention" />
          <div className="grid gap-4 md:grid-cols-2">{needsAttention.slice(0, 4).map((record) => <ProofBoxCard key={record.id} record={record} prominent />)}</div>
        </section>
      )}

      {records.length > 0 && (
        <section className="mt-10">
          <SectionHeading title="Recent ProofBoxes" action={<Link to="/proofboxes" className="text-sm font-semibold text-primary hover:underline">View all</Link>} />
          <div className="grid gap-3">{records.slice(0, 6).map((record) => <ProofBoxCard key={record.id} record={record} />)}</div>
        </section>
      )}
      {boxes.some((box) => box.userState?.starred) && <section className="mt-10"><SectionHeading title="Starred" action={<Star className="size-5 fill-primary text-primary" />} /><div className="grid gap-3">{boxes.filter((box) => box.userState?.starred).slice(0, 4).map((box) => <ProofBoxCard key={box.id} record={toRecord(box, user?.id ?? null)} />)}</div></section>}
    </AppShell>
  );
}

function QuickLink({ to, label, icon: Icon }: { to: "/proofboxes/create" | "/templates" | "/scan" | "/reminders"; label: string; icon: typeof Plus }) { return <Button asChild variant="outline" className="h-14 justify-start bg-card"><Link to={to}><Icon />{label}</Link></Button>; }
