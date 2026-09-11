import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { displayStatus, dueLabel, formatDate, formatMoney, type ProofBoxRecord } from "./proofbox-data";

type Tables = Database["public"]["Tables"];
export type Box = Tables["proof_boxes"]["Row"];
export type Participant = Tables["participants"]["Row"];
export type Evidence = Tables["evidence"]["Row"];
export type TimelineEvent = Tables["timeline_events"]["Row"];
export type Amendment = Tables["amendments"]["Row"];
export type AppNotification = Tables["notifications"]["Row"];
export type Profile = Tables["profiles"]["Row"];

export type BoxWithParticipants = Box & { participants: Participant[] };
export type FullBox = Box & {
  participants: Participant[];
  evidence: Evidence[];
  timeline_events: TimelineEvent[];
  amendments: Amendment[];
};

function unwrap<T>({ data, error }: { data: T; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data;
}

export async function ensureProfile(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) {
  const fullName =
    (user.user_metadata?.["full_name"] as string | undefined) ??
    (user.user_metadata?.["name"] as string | undefined) ??
    null;
  const { data: existing } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (existing) return;
  await supabase.from("profiles").insert({ id: user.id, email: user.email ?? null, full_name: fullName });
}

export async function fetchProfile(userId: string) {
  return unwrap(await supabase.from("profiles").select("*").eq("id", userId).maybeSingle());
}

export async function updateProfile(userId: string, values: Partial<Tables["profiles"]["Update"]>) {
  return unwrap(await supabase.from("profiles").update(values).eq("id", userId).select().single());
}

export async function fetchBoxes() {
  return unwrap(
    await supabase
      .from("proof_boxes")
      .select("*, participants(*)")
      .order("created_at", { ascending: false }),
  ) as BoxWithParticipants[];
}

export async function fetchBox(id: string) {
  return unwrap(
    await supabase
      .from("proof_boxes")
      .select("*, participants(*), evidence(*), timeline_events(*), amendments(*)")
      .eq("id", id)
      .maybeSingle(),
  ) as FullBox | null;
}

export async function createBox(values: Omit<Tables["proof_boxes"]["Insert"], "creator_id">) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("You need to be signed in.");
  const box = unwrap(
    await supabase.from("proof_boxes").insert({ ...values, creator_id: auth.user.id }).select().single(),
  );
  if (!box) throw new Error("Could not create this record.");
  const profile = await fetchProfile(auth.user.id);
  await supabase.from("participants").insert({
    proof_box_id: box.id,
    user_id: auth.user.id,
    invite_email: auth.user.email ?? null,
    display_name: profile?.full_name ?? auth.user.email ?? "Creator",
    role: "creator",
  });
  await supabase.from("timeline_events").insert({
    proof_box_id: box.id,
    actor_id: auth.user.id,
    actor_name: profile?.full_name ?? auth.user.email ?? null,
    event_type: "created",
    description: "ProofBox created",
  });
  return box;
}

export async function updateBox(id: string, values: Tables["proof_boxes"]["Update"]) {
  return unwrap(await supabase.from("proof_boxes").update(values).eq("id", id).select().single());
}

export async function inviteParticipant(boxId: string, email: string, role: string, name: string) {
  return unwrap(
    await supabase.rpc("invite_participant", { _box: boxId, _email: email, _role: role, _name: name }),
  );
}

export async function confirmParticipation(participantId: string) {
  return unwrap(
    await supabase
      .from("participants")
      .update({ confirmation_status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", participantId)
      .select()
      .single(),
  );
}

export async function requestChanges(participantId: string, message: string) {
  return unwrap(
    await supabase
      .from("participants")
      .update({ confirmation_status: "changes_requested", change_request: message })
      .eq("id", participantId)
      .select()
      .single(),
  );
}

export async function completeBox(id: string) {
  const { data: auth } = await supabase.auth.getUser();
  const box = await updateBox(id, {
    status: "completed",
    completed_by: auth.user?.id ?? null,
    completed_at: new Date().toISOString(),
  });
  await supabase.from("timeline_events").insert({
    proof_box_id: id,
    actor_id: auth.user?.id ?? null,
    event_type: "completed",
    description: "Marked as completed",
  });
  return box;
}

export async function disputeBox(id: string, reason: string) {
  const { data: auth } = await supabase.auth.getUser();
  const box = await updateBox(id, { status: "disputed", dispute_reason: reason });
  await supabase.from("timeline_events").insert({
    proof_box_id: id,
    actor_id: auth.user?.id ?? null,
    event_type: "disputed",
    description: `Dispute reported: ${reason}`,
  });
  return box;
}

export async function createAmendment(boxId: string, reason: string, previous: unknown, next: unknown) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("You need to be signed in.");
  return unwrap(
    await supabase
      .from("amendments")
      .insert({
        proof_box_id: boxId,
        created_by: auth.user.id,
        reason,
        previous_data: previous as never,
        new_data: next as never,
      })
      .select()
      .single(),
  );
}

export async function uploadEvidence(boxId: string, file: File, description: string) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("You need to be signed in.");
  const safeName = file.name.replace(/[^\w.\-]/g, "_");
  const path = `${boxId}/${crypto.randomUUID()}-${safeName}`;
  const upload = await supabase.storage.from("evidence").upload(path, file);
  if (upload.error) throw new Error(upload.error.message);
  return unwrap(
    await supabase
      .from("evidence")
      .insert({
        proof_box_id: boxId,
        uploaded_by: auth.user.id,
        file_name: file.name,
        file_path: path,
        file_type: file.type,
        file_size: file.size,
        description: description || null,
      })
      .select()
      .single(),
  );
}

export async function evidenceUrl(path: string) {
  const { data, error } = await supabase.storage.from("evidence").createSignedUrl(path, 3600);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function fetchNotifications() {
  return unwrap(
    await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(60),
  );
}

export async function markNotificationsRead(ids: string[]) {
  if (!ids.length) return;
  await supabase.from("notifications").update({ read: true }).in("id", ids);
}

export async function verifyCode(code: string) {
  return unwrap(await supabase.rpc("verify_proof_box", { _code: code }));
}

export async function claimInvitation(token: string) {
  return unwrap(await supabase.rpc("claim_invitation", { _token: token }));
}

export function toRecord(box: BoxWithParticipants, currentUserId: string | null): ProofBoxRecord {
  const others = (box.participants ?? []).filter((p) => p.user_id !== currentUserId);
  const participant =
    others[0]?.display_name ?? others[0]?.invite_email ?? (box.creator_id === currentUserId ? "Only you" : "Shared with you");
  return {
    id: box.id,
    code: box.code,
    title: box.title,
    type: box.type,
    participant,
    date: formatDate(box.created_at),
    value: box.amount !== null ? formatMoney(box.amount, box.currency) : box.type,
    status: displayStatus(box.status, box.due_date),
    due: dueLabel(box.status, box.due_date, box.completed_at),
    icon: box.type,
  };
}
