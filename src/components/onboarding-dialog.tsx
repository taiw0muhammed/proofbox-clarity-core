import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, FileCheck2, FolderLock, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProfile, useUser } from "@/hooks/use-auth";
import { updateProfile } from "@/lib/proofbox-queries";

const steps = [
  { icon: FileCheck2, title: "Create a clear record", description: "Start from scratch or use a template for borrowing, payments, rentals, services and more." },
  { icon: UsersRound, title: "Confirm it together", description: "Invite the people involved. Everyone reviews the same details and confirmations stay in the history." },
  { icon: FolderLock, title: "Keep the proof", description: "Attach private evidence, record payments, set reminders and share a safe verification link." },
] as const;

export function OnboardingDialog() {
  const { user } = useUser();
  const { data: profile, isLoading } = useProfile();
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const queryClient = useQueryClient();
  const finish = async () => {
    if (!user || closing) return;
    setClosing(true);
    try { await updateProfile(user.id, { onboarded: true }); await queryClient.invalidateQueries({ queryKey: ["profile"] }); }
    catch { toast.error("Could not save your progress. Please try again."); setClosing(false); }
  };
  if (isLoading || !profile || profile.onboarded) return null;
  const current = steps[step];
  if (!current) return null;
  const Icon = current.icon;
  return <Dialog open><DialogContent className="max-w-md" onInteractOutside={(event) => event.preventDefault()}><DialogHeader><div className="mb-4 flex items-center justify-between"><span className="grid size-11 place-items-center rounded-md bg-primary-soft text-primary"><Icon className="size-5" /></span><span className="text-xs font-semibold text-muted-foreground">{step + 1} of {steps.length}</span></div><DialogTitle className="text-2xl">{current.title}</DialogTitle><DialogDescription className="min-h-16 pt-2 text-sm leading-6">{current.description}</DialogDescription></DialogHeader><div className="flex gap-2" aria-label="Onboarding progress">{steps.map((item, index) => <span key={item.title} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-primary" : "bg-secondary"}`} />)}</div><div className="mt-2 flex items-center justify-between gap-3"><Button variant="ghost" disabled={closing} onClick={() => void finish()}>Skip</Button>{step < steps.length - 1 ? <Button onClick={() => setStep((value) => value + 1)}>Continue</Button> : <Button disabled={closing} onClick={() => void finish()}><CalendarDays />Start using ProofBox</Button>}</div></DialogContent></Dialog>;
}