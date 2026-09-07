export type ProofBoxStatus = "Active" | "Awaiting confirmation" | "Due soon" | "Completed" | "Disputed";

export type ProofBoxRecord = {
  id: string;
  title: string;
  type: string;
  participant: string;
  date: string;
  value: string;
  status: ProofBoxStatus;
  due: string;
  icon: "camera" | "palette" | "laptop" | "phone" | "truck" | "payment";
};

export const records: ProofBoxRecord[] = [
  { id: "camera-borrow", title: "Camera Borrow", type: "Borrow", participant: "Ahmed Bello", date: "Sep 7, 2026", value: "₦500,000 item value", status: "Awaiting confirmation", due: "Sep 15", icon: "camera" },
  { id: "logo-design", title: "Logo Design", type: "Service", participant: "Ada Creative", date: "Sep 4, 2026", value: "₦40,000 · ₦20,000 paid", status: "Due soon", due: "Sep 12", icon: "palette" },
  { id: "laptop-rental", title: "Laptop Rental", type: "Rental", participant: "Tunde Lawal", date: "Aug 28, 2026", value: "₦85,000", status: "Active", due: "Sep 30", icon: "laptop" },
  { id: "phone-sale", title: "Phone Sale", type: "Sale", participant: "Zainab Musa", date: "Aug 23, 2026", value: "₦320,000", status: "Completed", due: "Completed", icon: "phone" },
  { id: "equipment-delivery", title: "Event Equipment", type: "Delivery", participant: "Kora Events", date: "Aug 19, 2026", value: "12 items", status: "Completed", due: "Delivered", icon: "truck" },
];

export const timelineEvents = [
  { type: "created", title: "ProofBox created", detail: "Muhammed created this record", time: "Sep 7, 2026 · 9:14 AM" },
  { type: "evidence", title: "Evidence added", detail: "3 camera photos and a purchase receipt", time: "Sep 7, 2026 · 9:18 AM" },
  { type: "invited", title: "Ahmed invited", detail: "Invitation sent by secure link", time: "Sep 7, 2026 · 9:21 AM" },
  { type: "confirmed", title: "Muhammed confirmed", detail: "Agreement details accepted", time: "Sep 7, 2026 · 9:24 AM" },
  { type: "waiting", title: "Waiting for Ahmed", detail: "Confirmation reminder scheduled", time: "Now" },
];

export const notifications = [
  { id: 1, group: "Today", title: "Ahmed confirmed Camera Borrow", detail: "Both participants have now confirmed the record.", time: "2 minutes ago", kind: "confirmed", unread: true },
  { id: 2, group: "Today", title: "Camera Borrow is due in 3 days", detail: "The Sony camera is due back on September 15.", time: "1 hour ago", kind: "reminder", unread: true },
  { id: 3, group: "Yesterday", title: "You were invited to a ProofBox", detail: "Tunde invited you to review Laptop Rental.", time: "Yesterday · 4:30 PM", kind: "invited", unread: false },
  { id: 4, group: "Earlier", title: "Payment evidence added", detail: "Ada Creative added a bank transfer receipt to Logo Design.", time: "Sep 8 · 11:02 AM", kind: "evidence", unread: false },
];