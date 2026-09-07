import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { FilterDropdown, ProofBoxCard, SearchBar } from "@/components/proofbox-ui";
import { records } from "@/lib/proofbox-data";

export const Route = createFileRoute("/proofboxes/")({ head: () => ({ meta: [{ title: "Your ProofBoxes — ProofBox" }, { name: "description", content: "Search and review all your shared records." }, { property: "og:title", content: "Your ProofBoxes — ProofBox" }, { property: "og:description", content: "Search and review all your shared records." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: ProofBoxesPage });
function ProofBoxesPage() { return <AppShell><PageHeading title="ProofBoxes" description="Every agreement, transaction and commitment you've recorded." action={<Button asChild className="hidden sm:inline-flex"><Link to="/proofboxes/create"><Plus />Create</Link></Button>} /><div className="mt-7 flex gap-2"><SearchBar /><FilterDropdown /></div><div className="mt-6 grid gap-3">{records.map((record) => <ProofBoxCard key={record.id} record={record} />)}</div></AppShell>; }