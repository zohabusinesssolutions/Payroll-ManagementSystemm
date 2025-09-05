"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useIsMobile } from "@/hooks/use-mobile"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", earning: 222, expense: 150 },
  { date: "2024-04-02", earning: 97, expense: 180 },
  { date: "2024-04-03", earning: 167, expense: 120 },
  { date: "2024-04-04", earning: 242, expense: 260 },
  { date: "2024-04-05", earning: 373, expense: 290 },
  { date: "2024-04-06", earning: 301, expense: 340 },
  { date: "2024-04-07", earning: 245, expense: 180 },
  { date: "2024-04-08", earning: 409, expense: 320 },
  { date: "2024-04-09", earning: 59, expense: 110 },
  { date: "2024-04-10", earning: 261, expense: 190 },
  { date: "2024-04-11", earning: 327, expense: 350 },
  { date: "2024-04-12", earning: 292, expense: 210 },
  { date: "2024-04-13", earning: 342, expense: 380 },
  { date: "2024-04-14", earning: 137, expense: 220 },
  { date: "2024-04-15", earning: 120, expense: 170 },
  { date: "2024-04-16", earning: 138, expense: 190 },
  { date: "2024-04-17", earning: 446, expense: 360 },
  { date: "2024-04-18", earning: 364, expense: 410 },
  { date: "2024-04-19", earning: 243, expense: 180 },
  { date: "2024-04-20", earning: 89, expense: 150 },
  { date: "2024-04-21", earning: 137, expense: 200 },
  { date: "2024-04-22", earning: 224, expense: 170 },
  { date: "2024-04-23", earning: 138, expense: 230 },
  { date: "2024-04-24", earning: 387, expense: 290 },
  { date: "2024-04-25", earning: 215, expense: 250 },
  { date: "2024-04-26", earning: 75, expense: 130 },
  { date: "2024-04-27", earning: 383, expense: 420 },
  { date: "2024-04-28", earning: 122, expense: 180 },
  { date: "2024-04-29", earning: 315, expense: 240 },
  { date: "2024-04-30", earning: 454, expense: 380 },
  { date: "2024-05-01", earning: 165, expense: 220 },
  { date: "2024-05-02", earning: 293, expense: 310 },
  { date: "2024-05-03", earning: 247, expense: 190 },
  { date: "2024-05-04", earning: 385, expense: 420 },
  { date: "2024-05-05", earning: 481, expense: 390 },
  { date: "2024-05-06", earning: 498, expense: 520 },
  { date: "2024-05-07", earning: 388, expense: 300 },
  { date: "2024-05-08", earning: 149, expense: 210 },
  { date: "2024-05-09", earning: 227, expense: 180 },
  { date: "2024-05-10", earning: 293, expense: 330 },
  { date: "2024-05-11", earning: 335, expense: 270 },
  { date: "2024-05-12", earning: 197, expense: 240 },
  { date: "2024-05-13", earning: 197, expense: 160 },
  { date: "2024-05-14", earning: 448, expense: 490 },
  { date: "2024-05-15", earning: 473, expense: 380 },
  { date: "2024-05-16", earning: 338, expense: 400 },
  { date: "2024-05-17", earning: 499, expense: 420 },
  { date: "2024-05-18", earning: 315, expense: 350 },
  { date: "2024-05-19", earning: 235, expense: 180 },
  { date: "2024-05-20", earning: 177, expense: 230 },
  { date: "2024-05-21", earning: 82, expense: 140 },
  { date: "2024-05-22", earning: 81, expense: 120 },
  { date: "2024-05-23", earning: 252, expense: 290 },
  { date: "2024-05-24", earning: 294, expense: 220 },
  { date: "2024-05-25", earning: 201, expense: 250 },
  { date: "2024-05-26", earning: 213, expense: 170 },
  { date: "2024-05-27", earning: 420, expense: 460 },
  { date: "2024-05-28", earning: 233, expense: 190 },
  { date: "2024-05-29", earning: 78, expense: 130 },
  { date: "2024-05-30", earning: 340, expense: 280 },
  { date: "2024-05-31", earning: 178, expense: 230 },
  { date: "2024-06-01", earning: 178, expense: 200 },
  { date: "2024-06-02", earning: 470, expense: 410 },
  { date: "2024-06-03", earning: 103, expense: 160 },
  { date: "2024-06-04", earning: 439, expense: 380 },
  { date: "2024-06-05", earning: 88, expense: 140 },
  { date: "2024-06-06", earning: 294, expense: 250 },
  { date: "2024-06-07", earning: 323, expense: 370 },
  { date: "2024-06-08", earning: 385, expense: 320 },
  { date: "2024-06-09", earning: 438, expense: 480 },
  { date: "2024-06-10", earning: 155, expense: 200 },
  { date: "2024-06-11", earning: 92, expense: 150 },
  { date: "2024-06-12", earning: 492, expense: 420 },
  { date: "2024-06-13", earning: 81, expense: 130 },
  { date: "2024-06-14", earning: 426, expense: 380 },
  { date: "2024-06-15", earning: 307, expense: 350 },
  { date: "2024-06-16", earning: 371, expense: 310 },
  { date: "2024-06-17", earning: 475, expense: 520 },
  { date: "2024-06-18", earning: 107, expense: 170 },
  { date: "2024-06-19", earning: 341, expense: 290 },
  { date: "2024-06-20", earning: 408, expense: 450 },
  { date: "2024-06-21", earning: 169, expense: 210 },
  { date: "2024-06-22", earning: 317, expense: 270 },
  { date: "2024-06-23", earning: 480, expense: 530 },
  { date: "2024-06-24", earning: 132, expense: 180 },
  { date: "2024-06-25", earning: 141, expense: 190 },
  { date: "2024-06-26", earning: 434, expense: 380 },
  { date: "2024-06-27", earning: 448, expense: 490 },
  { date: "2024-06-28", earning: 149, expense: 200 },
  { date: "2024-06-29", earning: 103, expense: 160 },
  { date: "2024-06-30", earning: 446, expense: 400 },
]

const chartConfig = {
  earning: {
    label: "Earning",
    color: "var(--primary)",
  },
  expense: {
    label: "Expense",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Earning/Expense Chart</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-earning)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-earning)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillexpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="url(#fillexpense)"
              stroke="var(--color-expense)"
              stackId="a"
            />
            <Area
              dataKey="earning"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-earning)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
