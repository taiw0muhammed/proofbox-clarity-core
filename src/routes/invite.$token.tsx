import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { claimInvitation, ensureProfile } from "@/lib/proofbox-queries";
import { ProofBoxLogo } from "@/components/proofbox-logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/invite/$token")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Join a ProofBox — ProofBox" },
      { name: "description", content: "Accept your invitation and review the record you were added to." },
      { property: "og:title", content: "Join a ProofBox — ProofBox" },
      { property: "og:description", content: "Accept your invitation and review the record you were added to." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitePage,
});

function InvitePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        void navigate({ to: "/auth", search: { invite: token } });
        return;
      }
      await ensureProfile(data.user);
      try {
        const boxId = (await claimInvitation(token)) as string | null;
        if (cancelled) return;
        if (boxId) void navigate({ to: "/proofboxes/$id", params: { id: boxId } });
        else void navigate({ to: "/proofboxes" });
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
      <ProofBoxLogo />
      {error ? (
        <>
          <h1 className="text-xl font-bold">This invitation could not be opened</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => void navigate({ to: "/proofboxes" })}>Go to your ProofBoxes</Button>
        </>
      ) : (
        <>
          <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary"><ShieldCheck className="size-6" /></span>
          <p className="inline-flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" />Opening your invitation…</p>
        </>
      )}
    </main>
  );
}
