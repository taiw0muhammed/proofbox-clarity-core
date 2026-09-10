import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeading, SectionHeading } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { updateProfile } from "@/lib/proofbox-queries";
import { useProfile, useUser } from "@/hooks/use-auth";
import { initialsOf } from "@/lib/proofbox-data";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ProofBox" },
      { name: "description", content: "Manage your ProofBox account details and notification preferences." },
      { property: "og:title", content: "Settings — ProofBox" },
      { property: "og:description", content: "Manage your ProofBox account details and notification preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useUser();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const save = async (values: { full_name?: string; notify_confirmations?: boolean; notify_reminders?: boolean; notify_evidence?: boolean }) => {
    if (!user) return;
    setBusy(true);
    try {
      await updateProfile(user.id, values);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Saved");
    } catch (error) {
      toast.error("Could not save", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { invite: "" }, replace: true });
  };

  return (
    <AppShell>
      <PageHeading title="Settings" description="Manage your account details and how ProofBox keeps you informed." />

      <section className="mt-8 rounded-lg border bg-card p-4 shadow-card sm:p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{initialsOf(profile?.full_name ?? user?.email)}</span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{profile?.full_name ?? "Add your name"}</p>
            <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <form
          className="mt-6 grid gap-5 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void save({ full_name: String(form.get("full_name") ?? "") });
          }}
        >
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} placeholder="Your name" className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email ?? ""} readOnly className="mt-2 h-11 bg-secondary" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Save changes</Button>
          </div>
        </form>
      </section>

      <section className="mt-9">
        <SectionHeading title="Notifications" />
        <div className="divide-y overflow-hidden rounded-lg border bg-card shadow-card">
          <ToggleRow label="Confirmations" description="When someone confirms or asks for changes." checked={profile?.notify_confirmations ?? true} onChange={(value) => void save({ notify_confirmations: value })} />
          <ToggleRow label="Reminders" description="Before a due date passes." checked={profile?.notify_reminders ?? true} onChange={(value) => void save({ notify_reminders: value })} />
          <ToggleRow label="Evidence" description="When new photos or files are added." checked={profile?.notify_evidence ?? true} onChange={(value) => void save({ notify_evidence: value })} />
        </div>
      </section>

      <section className="mt-9">
        <SectionHeading title="Account" />
        <div className="rounded-lg border bg-card p-4 shadow-card sm:p-6">
          <Button variant="outline" onClick={() => void signOut()}><LogOut />Sign out</Button>
        </div>
      </section>
    </AppShell>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 sm:px-6">
      <div><p className="font-medium">{label}</p><p className="mt-0.5 text-sm text-muted-foreground">{description}</p></div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
