import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type MembersJoinedProps = {
  data?: Record<string, number> | null | undefined;
  className?: string;
};

/** Abbreviated month labels — full names are too wide to render all 12 X ticks in narrow cards. */
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MembersJoined = ({ data }: MembersJoinedProps) => {
  const chartData = useMemo(
    () =>
      MONTHS.map((month) => ({
        month,
        total: Number(data?.[month]) || 0,
      })),
    [data],
  );

  const hasData = useMemo(() => chartData.some((entry) => entry.total > 0), [chartData]);

  if (!hasData) {
    return (
      <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No membership data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          interval={0}
          tickFormatter={(_, index: number) => SHORT_MONTHS[index] ?? ""}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
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
