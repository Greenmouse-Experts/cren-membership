import { useMemo } from "react";
import { LineChart as LineChartIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatAsNgnMoney } from "../../services/helpers";
import type { MonthlyPaymentPoint } from "@/types/api";

type DuesPaymentProps = {
  data?: MonthlyPaymentPoint[] | null | undefined;
};

const DuesPayment = ({ data }: DuesPaymentProps) => {
  const chartData = useMemo(
    () =>
      (data ?? []).map((point) => ({
        month: point.month,
        total: Number(point.total_amount) || 0,
      })),
    [data],
  );

  if (chartData.length === 0) {
    return (
      <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-center">
        <LineChartIcon className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No dues payments recorded yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="dues-payment-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.28} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
          width={72}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          tickFormatter={(value) => formatAsNgnMoney(Number(value)) || "₦0"}
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
          formatter={(value) => [formatAsNgnMoney(Number(value)) || "₦0", "Collected"]}
          labelFormatter={(label) => String(label)}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#dues-payment-fill)"
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DuesPayment;
