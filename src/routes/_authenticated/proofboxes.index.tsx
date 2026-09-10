import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState, FilterDropdown, ProofBoxCard, SearchBar } from "@/components/proofbox-ui";
import { fetchBoxes, toRecord } from "@/lib/proofbox-queries";
import { useUser } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/proofboxes/")({
  head: () => ({
    meta: [
      { title: "Your ProofBoxes — ProofBox" },
      { name: "description", content: "Search and review all your shared records." },
      { property: "og:title", content: "Your ProofBoxes — ProofBox" },
      { property: "og:description", content: "Search and review all your shared records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProofBoxesPage,
});

function ProofBoxesPage() {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { data: boxes, isLoading } = useQuery({ queryKey: ["boxes"], queryFn: fetchBoxes });

  const records = (boxes ?? [])
    .filter((box) => (filter === "all" ? true : box.status === filter))
    .map((box) => toRecord(box, user?.id ?? null))
    .filter((record) =>
      search.trim() === "" ? true : `${record.title} ${record.participant} ${record.code}`.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <AppShell>
      <PageHeading
        title="ProofBoxes"
        description="Every agreement, transaction and commitment you've recorded."
        action={<Button asChild className="hidden sm:inline-flex"><Link to="/proofboxes/create"><Plus />Create</Link></Button>}
      />
      <div className="mt-7 flex gap-2">
        <SearchBar value={search} onChange={setSearch} />
        <FilterDropdown value={filter} onChange={setFilter} />
      </div>
      {isLoading ? (
        <div className="mt-12 flex justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : records.length === 0 ? (
        <div className="mt-6"><EmptyState title="Nothing to show" description="No records match this search or filter yet." /></div>
      ) : (
        <div className="mt-6 grid gap-3">{records.map((record) => <ProofBoxCard key={record.id} record={record} />)}</div>
      )}
    </AppShell>
  );
}
