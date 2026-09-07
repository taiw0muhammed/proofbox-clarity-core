import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, PageHeading } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/proofbox-ui";
import { notifications } from "@/lib/proofbox-data";

export const Route = createFileRoute("/notifications")({ head: () => ({ meta: [{ title: "Notifications — ProofBox" }, { name: "description", content: "Confirmation updates, invitations and due date reminders." }, { property: "og:title", content: "Notifications — ProofBox" }, { property: "og:description", content: "Confirmation updates, invitations and due date reminders." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: NotificationsPage });
function NotificationsPage() { return <AppShell><PageHeading title="Notifications" description="Confirmations, invitations and reminders that need your attention." action={<Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => toast.success("Marked as read")}>Mark all read</Button>} /><div className="mt-7 space-y-7">{["Today", "Yesterday", "Earlier"].map((group) => <section key={group}><h2 className="mb-3 text-xs font-bold uppercase text-muted-foreground">{group}</h2><div className="overflow-hidden rounded-lg border bg-card shadow-card">{notifications.filter((item) => item.group === group).map((item) => <NotificationItem key={item.id} {...item} />)}</div></section>)}</div></AppShell>; }