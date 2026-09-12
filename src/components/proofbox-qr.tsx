import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ProofBoxQRCard({ code }: { code: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    const url = `${window.location.origin}/verify?code=${encodeURIComponent(code)}`;
    setLink(url);
    let active = true;
    QRCode.toDataURL(url, { margin: 1, width: 480, errorCorrectionLevel: "M" })
      .then((value) => {
        if (active) setDataUrl(value);
      })
      .catch(() => {
        if (active) setDataUrl(null);
      });
    return () => {
      active = false;
    };
  }, [code]);

  return (
    <div className="rounded-lg border bg-card p-5 shadow-card">
      <h2 className="flex items-center gap-2 font-semibold">
        <QrCode className="size-4 text-primary" />Verification code
      </h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Anyone who scans this sees only the reference, status and date — never the private details.
      </p>
      <div className="mt-4 flex justify-center rounded-lg border bg-background p-4">
        {dataUrl ? (
          <img src={dataUrl} alt={`QR code to verify record ${code}`} width={176} height={176} className="size-44" />
        ) : (
          <div className="size-44 animate-pulse rounded bg-muted" />
        )}
      </div>
      <p className="mt-3 text-center text-sm font-medium">{code}</p>
      <div className="mt-4 grid gap-2">
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(link);
            toast.success("Verification link copied");
          }}
        >
          <Copy />Copy link
        </Button>
        {dataUrl && (
          <Button variant="ghost" asChild>
            <a href={dataUrl} download={`${code}-qr.png`}>
              <Download />Download QR code
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
