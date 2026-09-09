export type ProofBoxStatus =
  | "Draft"
  | "Awaiting confirmation"
  | "Active"
  | "Due soon"
  | "Overdue"
  | "Completed"
  | "Disputed";

export type DbStatus = "draft" | "awaiting_confirmation" | "confirmed" | "completed" | "disputed";

export type ProofBoxRecord = {
  id: string;
  code: string;
  title: string;
  type: string;
  participant: string;
  date: string;
  value: string;
  status: ProofBoxStatus;
  due: string;
  icon: string;
};

export const recordTypes = ["Borrow", "Service", "Rental", "Sale", "Delivery", "Payment", "Custom"] as const;

export function displayStatus(status: string, dueDate: string | null): ProofBoxStatus {
  if (status === "completed") return "Completed";
  if (status === "disputed") return "Disputed";
  if (status === "draft") return "Draft";
  if (status === "awaiting_confirmation") return "Awaiting confirmation";
  if (dueDate) {
    const days = daysUntil(dueDate);
    if (days < 0) return "Overdue";
    if (days <= 5) return "Due soon";
  }
  return "Active";
}

export function daysUntil(date: string): number {
  const target = new Date(`${date}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86_400_000);
}

export function formatMoney(amount: number | null, currency: string | null): string {
  if (amount === null || amount === undefined) return "No amount recorded";
  const symbols: Record<string, string> = { NGN: "₦", USD: "$", GBP: "£", EUR: "€" };
  const symbol = symbols[currency ?? "NGN"] ?? `${currency ?? ""} `;
  return `${symbol}${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function initialsOf(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value.length <= 10 ? `${value}T00:00:00` : value);
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return `${date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} · ${date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
}

export function relativeTime(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(value);
}

export function dueLabel(status: string, dueDate: string | null, completedAt: string | null): string {
  if (status === "completed") return completedAt ? `Completed ${formatDate(completedAt)}` : "Completed";
  if (!dueDate) return "No due date";
  const days = daysUntil(dueDate);
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due ${formatDate(dueDate)}`;
}

export function fileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
