"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Database } from "@/types/db";

type DailyBalance =
  Database["public"]["Functions"]["get_daily_balance"]["Returns"];
interface IBalanceChartProps {
  dailyBalance: DailyBalance;
}

export default function AccountPeriodChart({
  dailyBalance,
}: IBalanceChartProps) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="pb-2">
          <CardTitle>Balance History</CardTitle>
      </CardHeader>
      <CardContent>
        {dailyBalance.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            No data available for this time period
          </div>
        ) : (
          <div className="h-[250px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                accessibilityLayer
                width={500}
                height={400}
                data={dailyBalance}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" hideLabel />}
                />
                <YAxis />
                <Area
                  dataKey="balance"
                  type="linear"
                  fill="var(--color-desktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
