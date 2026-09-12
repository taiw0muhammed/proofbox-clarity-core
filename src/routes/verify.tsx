import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProofBoxLogo } from "@/components/proofbox-logo";
import { verifyCode } from "@/lib/proofbox-queries";
import { formatDate } from "@/lib/proofbox-data";

export const Route = createFileRoute("/verify")({
  validateSearch: (search: Record<string, unknown>) => ({ code: typeof search["code"] === "string" ? search["code"] : "" }),
  head: () => ({
    meta: [
      { title: "Verify a record — ProofBox" },
      { name: "description", content: "Check that a ProofBox reference code belongs to a real, confirmed record." },
      { property: "og:title", content: "Verify a record — ProofBox" },
      { property: "og:description", content: "Check that a ProofBox reference code belongs to a real, confirmed record." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerifyPage,
});

type Result = { title?: string; type?: string; status?: string; created_at?: string; participants?: number } | null;

function VerifyPage() {
  const { code: scannedCode } = Route.useSearch();
  const [code, setCode] = useState(scannedCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(async (value: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = (await verifyCode(value.trim())) as Result | Result[];
      const row = Array.isArray(data) ? (data[0] ?? null) : data;
      if (!row) setError("No record found with that code.");
      else setResult(row);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (scannedCode.trim()) void runCheck(scannedCode);
  }, [scannedCode, runCheck]);

  function check(event: React.FormEvent) {
    event.preventDefault();
    void runCheck(code);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4 py-16">
      <Link to="/" aria-label="ProofBox home" className="mb-8"><ProofBoxLogo /></Link>
      <h1 className="text-2xl font-bold sm:text-3xl">Verify a record</h1>
      <p className="mt-2 text-muted-foreground">Enter a ProofBox reference code to check that it exists and see its status.</p>
      <form onSubmit={check} className="mt-7 space-y-4 rounded-lg border bg-card p-5 shadow-card">
        <div>
          <Label htmlFor="code">Reference code</Label>
          <Input id="code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="PB-260907-041" className="mt-2 h-11" />
        </div>
        <Button type="submit" className="w-full" disabled={!code.trim() || loading}>
          {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}Verify
        </Button>
      </form>
      {error && <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
      {result && (
        <div className="mt-5 rounded-lg border border-success/25 bg-success-soft p-5">
          <h2 className="font-semibold">{result.title ?? "Record found"}</h2>
          <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
            {result.type && <div><dt className="inline font-medium text-foreground">Type: </dt><dd className="inline">{result.type}</dd></div>}
            {result.status && <div><dt className="inline font-medium text-foreground">Status: </dt><dd className="inline">{result.status}</dd></div>}
            {result.created_at && <div><dt className="inline font-medium text-foreground">Created: </dt><dd className="inline">{formatDate(result.created_at)}</dd></div>}
          </dl>
        </div>
      )}
    </main>
  );
}
