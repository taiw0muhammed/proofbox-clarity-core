import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCircle2, Clock3, FileText, Plus } from "lucide-react";
import { AppShell, PageHeading, SectionHeading } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { ProofBoxCard, StatCard } from "@/components/proofbox-ui";
import { records } from "@/lib/proofbox-data";

export const Route = createFileRoute("/dashboard")({ head: () => ({ meta: [{ title: "Dashboard — ProofBox" }, { name: "description", content: "See your agreements, transactions and commitments in one place." }, { property: "og:title", content: "Dashboard — ProofBox" }, { property: "og:description", content: "See your agreements, transactions and commitments in one place." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: DashboardPage });

function DashboardPage() { return <AppShell><PageHeading title="Good morning, Muhammed" description="Your agreements, transactions and commitments in one place." action={<Button asChild className="hidden sm:inline-flex"><Link to="/proofboxes/create"><Plus />Create ProofBox</Link></Button>} />
  <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4"><StatCard label="Active" value={3} icon={FileText} /><StatCard label="Awaiting" value={2} icon={Clock3} tone="warning" /><StatCard label="Due soon" value={1} icon={Bell} tone="danger" /><StatCard label="Completed" value={8} icon={CheckCircle2} tone="success" /></section>
  <section className="mt-9"><SectionHeading title="Needs your attention" /><div className="grid gap-4 md:grid-cols-2">{records.slice(0,2).map((record) => <ProofBoxCard key={record.id} record={record} prominent />)}</div></section>
  <section className="mt-10"><SectionHeading title="Recent ProofBoxes" action={<Link to="/proofboxes" className="text-sm font-semibold text-primary hover:underline">View all</Link>} /><div className="grid gap-3">{records.slice(2).map((record) => <ProofBoxCard key={record.id} record={record} />)}</div></section>
  <Button asChild className="fixed bottom-24 right-4 z-30 size-12 rounded-full p-0 shadow-brand sm:hidden"><Link to="/proofboxes/create" aria-label="Create ProofBox"><Plus /></Link></Button>
</AppShell>; }