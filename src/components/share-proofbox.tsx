import { useEffect, useState } from "react";
import { Copy, Download, Link2, MessageCircle, QrCode, Share2, UserPlus } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ShareProofBox({ code, title, onDownload }: { code: string; title: string; onDownload: () => void }) {
  const [link, setLink] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  useEffect(() => { const url = `${window.location.origin}/verify?code=${encodeURIComponent(code)}`; setLink(url); void QRCode.toDataURL(url, { margin: 1, width: 360 }).then(setQr); }, [code]);
  const copy = async () => { await navigator.clipboard.writeText(link); toast.success("Verification link copied"); };
  const share = async () => { if (navigator.share) await navigator.share({ title: `${title} — ProofBox`, text: `Verify ProofBox ${code}`, url: link }); else await copy(); };
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Verify ProofBox ${code}: ${link}`)}`;
  return <Dialog><DialogTrigger asChild><Button variant="outline" size="sm"><Share2 />Share</Button></DialogTrigger><DialogContent className="max-w-md"><DialogHeader><DialogTitle>Share ProofBox</DialogTitle><DialogDescription>Share a verification link without exposing private agreement details.</DialogDescription></DialogHeader><div className="grid grid-cols-2 gap-3 pt-2"><Action icon={Copy} label="Copy link" onClick={() => void copy()} /><Action icon={Link2} label="Share link" onClick={() => void share()} /><Action icon={MessageCircle} label="WhatsApp" href={whatsapp} /><Action icon={Download} label="Download PDF" onClick={onDownload} /><Action icon={QrCode} label="QR Code" href={qr ?? undefined} download={`${code}-qr.png`} /><Action icon={UserPlus} label="Invite participant" href="#participants" /></div><p className="rounded-md bg-secondary p-3 text-xs leading-5 text-muted-foreground">Public verification shows only the record code, status and creation date.</p></DialogContent></Dialog>;
}
function Action({ icon: Icon, label, onClick, href, download }: { icon: typeof Copy; label: string; onClick?: () => void; href?: string; download?: string }) {
  const content = <><Icon className="size-5 text-primary" /><span className="text-sm font-medium">{label}</span></>;
  const classes = "flex min-h-20 flex-col items-start justify-center gap-2 rounded-lg border bg-card p-3 text-left transition hover:border-primary/30 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return href ? <a className={classes} href={href} download={download} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{content}</a> : <button className={classes} type="button" onClick={onClick}>{content}</button>;
}