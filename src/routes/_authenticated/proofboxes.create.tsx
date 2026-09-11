import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateTypeCard, typeChoices } from "@/components/proofbox-ui";
import { createBox } from "@/lib/proofbox-queries";

export const Route = createFileRoute("/_authenticated/proofboxes/create")({
  head: () => ({
    meta: [
      { title: "Create a ProofBox" },
      { name: "description", content: "Record a clear agreement and invite the people involved." },
      { property: "og:title", content: "Create a ProofBox" },
      { property: "og:description", content: "Record a clear agreement and invite the people involved." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  const [type, setType] = useState("Borrow");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) { toast.error("Add a title so everyone knows what this is."); return; }
    const amountRaw = String(form.get("amount") ?? "").replace(/[^\d.]/g, "");
    setBusy(true);
    try {
      const box = await createBox({
        title,
        type,
        description: String(form.get("description") ?? "") || null,
        terms: String(form.get("terms") ?? "") || null,
        responsibilities: String(form.get("responsibilities") ?? "") || null,
        amount: amountRaw ? Number(amountRaw) : null,
        currency: String(form.get("currency") ?? "NGN") || "NGN",
        start_date: String(form.get("start_date") ?? "") || null,
        due_date: String(form.get("due_date") ?? "") || null,
      });
      await queryClient.invalidateQueries({ queryKey: ["boxes"] });
      toast.success("Record created", { description: "Now invite the other person to confirm the details." });
      navigate({ to: "/proofboxes/$id", params: { id: box.id } });
    } catch (error) {
      toast.error("Could not create this record", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back</Link>
        <h1 className="text-2xl font-bold sm:text-3xl">What are you recording?</h1>
        <p className="mt-2 text-muted-foreground">Choose the closest match, then fill in what was agreed.</p>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {typeChoices.map((choice) => <CreateTypeCard key={choice.label} {...choice} selected={type === choice.label} onClick={() => setType(choice.label)} />)}
        </div>

        <form onSubmit={onSubmit} className="mt-8 rounded-lg border bg-card p-4 shadow-card sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="title" name="title" label="Record title" placeholder="Camera Borrow" />
            <div>
              <Label htmlFor="amount">Amount or item value</Label>
              <div className="mt-2 flex gap-2">
                <select id="currency" name="currency" aria-label="Currency" className="h-11 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="NGN">₦ NGN</option>
                  <option value="USD">$ USD</option>
                  <option value="GBP">£ GBP</option>
                  <option value="EUR">€ EUR</option>
                </select>
                <Input id="amount" name="amount" inputMode="decimal" placeholder="500000" className="h-11" />
              </div>
            </div>
            <Field id="start_date" name="start_date" type="date" label="Start date" placeholder="" />
            <Field id="due_date" name="due_date" type="date" label="Due or return date" placeholder="" />
            <div className="sm:col-span-2">
              <Label htmlFor="description">What happened?</Label>
              <Textarea id="description" name="description" className="mt-2 min-h-28" placeholder="I lent Ahmed my camera worth ₦500,000 today." />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="terms">What was agreed?</Label>
              <Textarea id="terms" name="terms" className="mt-2 min-h-28" placeholder="Conditions, payment schedule, return date and anything else that should be clear." />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="responsibilities">Who is responsible for what?</Label>
              <Textarea id="responsibilities" name="responsibilities" className="mt-2 min-h-24" placeholder="Ahmed covers any damage. Muhammed provides the charger and bag." />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : null}Create record<ArrowRight /></Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function Field({ id, name, label, placeholder, type = "text" }: { id: string; name: string; label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} type={type} placeholder={placeholder} className="mt-2 h-11" />
    </div>
  );
}
