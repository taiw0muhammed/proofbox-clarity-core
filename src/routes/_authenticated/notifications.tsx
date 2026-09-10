import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app-shell";
import { EmptyState, NotificationItem } from "@/components/proofbox-ui";
import { fetchNotifications, markNotificationsRead } from "@/lib/proofbox-queries";
import { relativeTime } from "@/lib/proofbox-data";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — ProofBox" },
      { name: "description", content: "Confirmations, reminders and evidence updates on your records." },
      { property: "og:title", content: "Notifications — ProofBox" },
      { property: "og:description", content: "Confirmations, reminders and evidence updates on your records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });

  useEffect(() => {
    const unread = (items ?? []).filter((item) => !item.read).map((item) => item.id);
    if (unread.length === 0) return;
    const timer = setTimeout(() => {
      void markNotificationsRead(unread).then(() => queryClient.invalidateQueries({ queryKey: ["notifications"] }));
    }, 1500);
    return () => clearTimeout(timer);
  }, [items, queryClient]);

  return (
    <AppShell>
      <PageHeading title="Notifications" description="Confirmations, reminders and evidence updates on your records." />
      {isLoading ? (
        <div className="mt-12 flex justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : (items ?? []).length === 0 ? (
        <div className="mt-7"><EmptyState title="Nothing yet" description="Updates about your records will appear here." showAction={false} /></div>
      ) : (
        <div className="mt-7 overflow-hidden rounded-lg border bg-card shadow-card">
          {(items ?? []).map((item) => (
            <NotificationItem
              key={item.id}
              title={item.title}
              detail={item.message ?? ""}
              time={relativeTime(item.created_at)}
              kind={item.type}
              unread={!item.read}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
