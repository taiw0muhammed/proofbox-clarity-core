import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile } from "@/lib/proofbox-queries";
import { ProofBoxLogo } from "@/components/proofbox-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    invite: typeof search["invite"] === "string" ? (search["invite"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — ProofBox" },
      { name: "description", content: "Sign in or create a ProofBox account to record agreements and keep the proof." },
      { property: "og:title", content: "Sign in — ProofBox" },
      { property: "og:description", content: "Sign in or create a ProofBox account to record agreements and keep the proof." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { invite } = Route.useSearch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const goNext = () => {
    if (invite) navigate({ to: "/invite/$token", params: { token: invite } });
    else navigate({ to: "/dashboard" });
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) goNext();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string) => {
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { toast.error("Could not sign in", { description: error.message }); return; }
    if (data.user) await ensureProfile(data.user);
    goNext();
  };

  const signUp = async (name: string, email: string, password: string) => {
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
    });
    setBusy(false);
    if (error) { toast.error("Could not create your account", { description: error.message }); return; }
    if (data.session && data.user) {
      await ensureProfile(data.user);
      goNext();
      return;
    }
    setCheckEmail(true);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <ProofBoxLogo className="text-primary-foreground" />
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight">Make agreements clear. Keep the proof.</h2>
          <p className="mt-4 max-w-md leading-7 text-primary-foreground/80">
            Record what was agreed, attach evidence and confirm it with the people involved.
          </p>
        </div>
        <p className="inline-flex items-center gap-2 text-sm text-primary-foreground/80"><ShieldCheck className="size-4" />Private by default. Only invited people can see a record.</p>
      </div>

      <div className="flex flex-col px-4 py-8 sm:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to home</Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div className="lg:hidden"><ProofBoxLogo /></div>
          {checkEmail ? (
            <div className="mt-6 rounded-lg border bg-card p-6 text-center shadow-card">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary"><ShieldCheck className="size-6" /></span>
              <h1 className="mt-4 text-xl font-bold">Check your email</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">We sent you a confirmation link. Open it to finish creating your account, then come back and sign in.</p>
            </div>
          ) : (
            <>
              <h1 className="mt-6 text-2xl font-bold">Welcome to ProofBox</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your account or create a new one.</p>
              <Tabs defaultValue="signin" className="mt-7">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="mt-6">
                  <form
                    className="space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const form = new FormData(event.currentTarget);
                      void signIn(String(form.get("email")), String(form.get("password")));
                    }}
                  >
                    <FieldRow id="signin-email" name="email" type="email" label="Email" placeholder="you@example.com" />
                    <FieldRow id="signin-password" name="password" type="password" label="Password" placeholder="Your password" />
                    <Button type="submit" className="h-11 w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Sign in</Button>
                  </form>
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                  <form
                    className="space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const form = new FormData(event.currentTarget);
                      void signUp(String(form.get("name")), String(form.get("email")), String(form.get("password")));
                    }}
                  >
                    <FieldRow id="signup-name" name="name" type="text" label="Full name" placeholder="Muhammed Imam" />
                    <FieldRow id="signup-email" name="email" type="email" label="Email" placeholder="you@example.com" />
                    <FieldRow id="signup-password" name="password" type="password" label="Password" placeholder="At least 6 characters" />
                    <Button type="submit" className="h-11 w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Create account</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ id, name, type, label, placeholder }: { id: string; name: string; type: string; label: string; placeholder: string }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} type={type} required placeholder={placeholder} className="mt-2 h-11" autoComplete={type === "password" ? "current-password" : "on"} />
    </div>
  );
}
