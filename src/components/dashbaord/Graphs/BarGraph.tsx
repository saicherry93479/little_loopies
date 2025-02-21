"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function BarGraph({ 
  data = [], 
  chartConfig,
  colors = [
    'hsl(210, 70%, 50%)',   // Bright Blue
    'hsl(120, 60%, 50%)',   // Vibrant Green
    'hsl(340, 70%, 50%)',   // Coral Red
    'hsl(40, 80%, 50%)',    // Warm Orange
    'hsl(280, 60%, 50%)',   // Purple
    'hsl(30, 80%, 50%)'     // Deep Orange
  ]
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[280px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid 
          vertical={false} 
          horizontal={true}
          className="stroke-gray-100"
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          className="text-xs"
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            return new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="orders"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        <Bar 
          dataKey="count" 
          fill={colors[0]}
          fillOpacity={0.7}
        />
      </BarChart>
    </ChartContainer>
  );
}