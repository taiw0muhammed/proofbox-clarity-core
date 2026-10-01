import { useMemo } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BoxWithParticipants } from "@/lib/proofbox-queries";
import { displayStatus } from "@/lib/proofbox-data";

const STATUS_COLORS: Record<string, string> = {
  Active: "var(--color-chart-2)",
  "Due soon": "var(--color-warning)",
  Overdue: "var(--color-danger)",
  "Awaiting confirmation": "var(--color-chart-3)",
  Draft: "var(--color-muted-foreground)",
  Confirmed: "var(--color-chart-1)",
  Completed: "var(--color-success)",
  Disputed: "var(--color-chart-5)",
};

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function DashboardCharts({ boxes }: { boxes: BoxWithParticipants[] }) {
  const monthly = useMemo(() => {
    const now = new Date();
    const buckets: { key: string; label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: monthKey(d),
        label: d.toLocaleDateString(undefined, { month: "short" }),
        count: 0,
      });
    }
    for (const box of boxes) {
      const key = monthKey(new Date(box.created_at));
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.count += 1;
    }
    return buckets;
  }, [boxes]);

  const byStatus = useMemo(() => {
    const counts = new Map<string, number>();
    for (const box of boxes) {
      const status = displayStatus(box.status, box.due_date);
      counts.set(status, (counts.get(status) ?? 0) + 1);
    }
    return [...counts.entries()].map(([name, value]) => ({ name, value }));
  }, [boxes]);

  if (boxes.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-4 shadow-card sm:p-5">
        <p className="text-sm font-semibold">Records created</p>
        <p className="text-xs text-muted-foreground">Last 6 months</p>
        <div className="mt-3 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
              <Tooltip
                cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  color: "var(--color-popover-foreground)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-card sm:p-5">
        <p className="text-sm font-semibold">Status breakdown</p>
        <p className="text-xs text-muted-foreground">Across all your records</p>
        <div className="mt-3 flex h-44 items-center">
          <ResponsiveContainer width="55%" height="100%">
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="88%" paddingAngle={3} strokeWidth={0}>
                {byStatus.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "var(--color-chart-4)"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  color: "var(--color-popover-foreground)",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <ul className="flex-1 space-y-1.5 text-xs">
            {byStatus.map((entry) => (
              <li key={entry.name} className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: STATUS_COLORS[entry.name] ?? "var(--color-chart-4)" }}
                />
                <span className="truncate text-muted-foreground">{entry.name}</span>
                <span className="ml-auto font-semibold">{entry.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
