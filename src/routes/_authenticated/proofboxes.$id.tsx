import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Flag, Loader2, MessageSquare, Upload, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AppShell, SectionHeading } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AgreementRows,
  ConfirmationPanel,
  EvidenceCard,
  ParticipantCard,
  StatusBadge,
  Timeline,
} from "@/components/proofbox-ui";
import { useUser } from "@/hooks/use-auth";
import {
  completeBox,
  confirmParticipation,
  disputeBox,
  evidenceUrl,
  fetchBox,
  inviteParticipant,
  requestChanges,
  uploadEvidence,
} from "@/lib/proofbox-queries";
import {
  displayStatus,
  dueLabel,
  fileSize,
  formatDate,
  formatDateTime,
  formatMoney,
  initialsOf,
} from "@/lib/proofbox-data";

export const Route = createFileRoute("/_authenticated/proofboxes/$id")({
  head: () => ({
    meta: [
      { title: "ProofBox details — ProofBox" },
      { name: "description", content: "Review the agreement, evidence and confirmation history of this record." },
      { property: "og:title", content: "ProofBox details — ProofBox" },
      { property: "og:description", content: "Review the agreement, evidence and confirmation history of this record." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [changeNote, setChangeNote] = useState("");

  const { data: box, isLoading } = useQuery({ queryKey: ["box", id], queryFn: () => fetchBox(id) });
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["box", id] });
    void queryClient.invalidateQueries({ queryKey: ["boxes"] });
  };

  const act = <T,>(fn: (input: T) => Promise<unknown>, message: string) =>
    ({
      mutationFn: fn,
      onSuccess: () => {
        toast.success(message);
        refresh();
      },
      onError: (error: Error) => toast.error(error.message),
    });

  const confirmMutation = useMutation(act((participantId: string) => confirmParticipation(participantId), "Confirmed"));
  const changesMutation = useMutation(
    act((participantId: string) => requestChanges(participantId, changeNote || "Changes requested"), "Change request sent"),
  );
  const completeMutation = useMutation(act(() => completeBox(id), "Marked as completed"));
  const disputeMutation = useMutation(act((reason: string) => disputeBox(id, reason), "Dispute reported"));
  const inviteMutation = useMutation(
    act(() => inviteParticipant(id, inviteEmail, "participant", inviteName || inviteEmail), "Invitation added"),
  );
  const uploadMutation = useMutation(act((file: File) => uploadEvidence(id, file, ""), "Evidence added"));

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex justify-center py-24"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      </AppShell>
    );
  }

  if (!box) {
    return (
      <AppShell>
        <p className="py-24 text-center text-muted-foreground">This ProofBox is not available to you.</p>
      </AppShell>
    );
  }

  const me = (box.participants ?? []).find((p) => p.user_id === user?.id);
  const canConfirm = me && me.confirmation_status === "pending";
  const isOpen = box.status !== "completed" && box.status !== "disputed";

  const rows = [
    { label: "Type", value: box.type },
    { label: "Description", value: box.description ?? "—" },
    { label: "Value", value: box.amount !== null ? formatMoney(box.amount, box.currency) : "No amount recorded" },
    { label: "Start date", value: formatDate(box.start_date) },
    { label: "Due date", value: dueLabel(box.status, box.due_date, box.completed_at) },
    { label: "Terms", value: box.terms ?? "—" },
    { label: "Reference code", value: box.code },
  ];

  const events = (box.timeline_events ?? [])
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((event) => ({
      type: event.event_type,
      title: event.description ?? event.event_type,
      detail: event.actor_name ?? "",
      time: formatDateTime(event.created_at),
    }));

  return (
    <AppShell>
      <Link to="/proofboxes" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />All ProofBoxes
      </Link>
      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">{box.title}</h1>
          <StatusBadge status={displayStatus(box.status, box.due_date)} />
        </div>
        <p className="mt-2 font-medium text-muted-foreground">
          {box.amount !== null ? `${formatMoney(box.amount, box.currency)} · ` : ""}{box.code}
        </p>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-9">
          <section>
            <SectionHeading title="Agreement" />
            <div className="rounded-lg border bg-card px-4 shadow-card sm:px-6"><AgreementRows rows={rows} /></div>
          </section>

          <section>
            <SectionHeading title="Participants" />
            <div className="grid gap-3">
              {(box.participants ?? []).map((participant) => (
                <ParticipantCard
                  key={participant.id}
                  name={participant.display_name ?? participant.invite_email ?? "Invited person"}
                  role={participant.role === "creator" ? "Owner" : "Participant"}
                  initials={initialsOf(participant.display_name ?? participant.invite_email)}
                  confirmed={participant.confirmation_status === "confirmed"}
                  time={participant.confirmed_at ? formatDateTime(participant.confirmed_at) : undefined}
                  waitingLabel={participant.confirmation_status === "changes_requested" ? "Changes requested" : "Waiting"}
                />
              ))}
            </div>
            {isOpen && box.creator_id === user?.id && (
              <div className="mt-4 grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <div>
                  <Label htmlFor="invite-name">Name</Label>
                  <Input id="invite-name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="mt-2 h-11" placeholder="Ahmed Bello" />
                </div>
                <div>
                  <Label htmlFor="invite-email">Email</Label>
                  <Input id="invite-email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="mt-2 h-11" placeholder="ahmed@example.com" />
                </div>
                <Button
                  className="h-11"
                  disabled={!inviteEmail || inviteMutation.isPending}
                  onClick={() => inviteMutation.mutate(undefined as never)}
                >
                  <UserPlus />Invite
                </Button>
              </div>
            )}
          </section>

          <section>
            <SectionHeading
              title="Evidence"
              action={
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    <Upload />Add
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadMutation.mutate(file);
                        event.target.value = "";
                      }}
                    />
                  </label>
                </Button>
              }
            />
            {(box.evidence ?? []).length === 0 ? (
              <p className="rounded-lg border border-dashed bg-card px-4 py-8 text-center text-sm text-muted-foreground">No evidence attached yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(box.evidence ?? []).map((item) => (
                  <EvidenceCard
                    key={item.id}
                    title={item.file_name}
                    meta={fileSize(item.file_size)}
                    fileType={item.file_type}
                    onClick={async () => {
                      try {
                        window.open(await evidenceUrl(item.file_path), "_blank", "noopener");
                      } catch (error) {
                        toast.error((error as Error).message);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeading title="History" />
            <div className="rounded-lg border bg-card p-5 sm:p-6">
              {events.length === 0 ? <p className="text-sm text-muted-foreground">No activity yet.</p> : <Timeline events={events} />}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-lg border bg-card p-5 shadow-card">
            <h2 className="font-semibold">Next step</h2>
            {canConfirm ? (
              <>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Review the details above, then confirm or ask for changes.</p>
                <Button className="mt-4 w-full" disabled={confirmMutation.isPending} onClick={() => confirmMutation.mutate(me.id)}>
                  <Check />Confirm this record
                </Button>
                <Textarea
                  className="mt-3"
                  placeholder="What needs to change?"
                  value={changeNote}
                  onChange={(event) => setChangeNote(event.target.value)}
                />
                <Button variant="outline" className="mt-2 w-full" disabled={changesMutation.isPending} onClick={() => changesMutation.mutate(me.id)}>
                  <MessageSquare />Request changes
                </Button>
              </>
            ) : (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {box.status === "completed"
                  ? "This record is completed."
                  : box.status === "disputed"
                    ? "This record is in dispute."
                    : "Waiting for everyone to confirm."}
              </p>
            )}
            {isOpen && (
              <>
                <Button variant="ghost" className="mt-3 w-full text-muted-foreground" disabled={completeMutation.isPending} onClick={() => completeMutation.mutate(undefined as never)}>
                  Mark completed
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => disputeMutation.mutate(changeNote || "Dispute reported")}
                >
                  <Flag />Report dispute
                </Button>
              </>
            )}
          </div>
          <ConfirmationPanel compact />
        </aside>
      </div>
    </AppShell>
  );
}
