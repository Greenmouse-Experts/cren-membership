import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type MembersJoinedProps = {
  data?: Record<string, number> | null | undefined;
  className?: string;
};

const MembersJoined = ({ data }: MembersJoinedProps) => {
  const chartData = useMemo(
    () =>
      Object.entries(data ?? {}).map(([month, total]) => ({
        month,
        total: Number(total) || 0,
      })),
    [data],
  );

  if (chartData.length === 0) {
    return (
      <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No membership data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
          formatter={(value) => [String(value), "Members"]}
          labelFormatter={(label) => String(label)}
        />
        <Bar dataKey="total" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MembersJoined;
