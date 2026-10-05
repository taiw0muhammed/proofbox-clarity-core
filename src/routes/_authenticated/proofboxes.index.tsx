import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, ArchiveRestore, Plus, Star } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, FilterDropdown, ProofBoxCard, SearchBar } from "@/components/proofbox-ui";
import { fetchBoxesWithState, setBoxState, toRecord } from "@/lib/proofbox-queries";
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
  const [sort, setSort] = useState("newest");
  const [showArchived, setShowArchived] = useState(false);
  const client = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["boxes-with-state"], queryFn: fetchBoxesWithState });
  const stateMutation = useMutation({ mutationFn: ({ id, values }: { id: string; values: Parameters<typeof setBoxState>[1] }) => setBoxState(id, values), onSuccess: () => { void client.invalidateQueries({ queryKey: ["boxes-with-state"] }); } });

  const records = (data?.boxes ?? [])
    .filter((box) => showArchived ? Boolean(box.userState?.archived_at) : !box.userState?.archived_at)
    .filter((box) => (filter === "all" ? true : box.status === filter))
    .map((box) => ({ box, record: toRecord(box, user?.id ?? null) }))
    .filter((record) =>
      search.trim() === "" ? true : `${record.record.title} ${record.record.participant} ${record.record.code}`.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => sort === "oldest" ? new Date(a.box.created_at).getTime() - new Date(b.box.created_at).getTime() : sort === "title" ? a.box.title.localeCompare(b.box.title) : Number(Boolean(b.box.userState?.starred)) - Number(Boolean(a.box.userState?.starred)) || new Date(b.box.created_at).getTime() - new Date(a.box.created_at).getTime());

  return (
    <AppShell>
      <PageHeading
        title="ProofBoxes"
        description="Every agreement, transaction and commitment you've recorded."
        action={<Button asChild className="hidden sm:inline-flex"><Link to="/proofboxes/create"><Plus />Create</Link></Button>}
      />
      <div className="mt-7 flex flex-wrap gap-2">
        <SearchBar value={search} onChange={setSearch} />
        <FilterDropdown value={filter} onChange={setFilter} />
        <Select value={sort} onValueChange={setSort}><SelectTrigger className="h-11 w-36 bg-card" aria-label="Sort records"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="oldest">Oldest</SelectItem><SelectItem value="title">Title</SelectItem></SelectContent></Select>
        <Button variant={showArchived ? "secondary" : "outline"} className="h-11" onClick={() => setShowArchived((value) => !value)}>{showArchived ? <ArchiveRestore /> : <Archive />}{showArchived ? "Archived" : "Archive"}</Button>
      </div>
      {isLoading ? (
        <div className="mt-12 text-center text-sm text-muted-foreground">Loading your ProofBoxes…</div>
      ) : records.length === 0 ? (
        <div className="mt-6"><EmptyState title="Nothing to show" description="No records match this search or filter yet." /></div>
      ) : (
        <div className="mt-6 grid gap-3">{records.map(({ box, record }) => <div key={record.id} className="relative"><ProofBoxCard record={record} /><div className="absolute right-3 top-3 flex gap-1 bg-card pl-2"><Button size="icon" variant="ghost" aria-label={box.userState?.starred ? "Remove from favorites" : "Add to favorites"} onClick={() => stateMutation.mutate({ id: box.id, values: { starred: !box.userState?.starred, archived_at: box.userState?.archived_at ?? null, last_viewed_at: box.userState?.last_viewed_at ?? null } })}><Star className={box.userState?.starred ? "fill-primary text-primary" : ""} /></Button><Button size="icon" variant="ghost" aria-label={showArchived ? "Restore ProofBox" : "Archive ProofBox"} onClick={() => stateMutation.mutate({ id: box.id, values: { starred: box.userState?.starred ?? false, archived_at: showArchived ? null : new Date().toISOString(), last_viewed_at: box.userState?.last_viewed_at ?? null } })}>{showArchived ? <ArchiveRestore /> : <Archive />}</Button></div></div>)}</div>
      )}
    </AppShell>
  );
}
