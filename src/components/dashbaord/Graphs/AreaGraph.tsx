import React, { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function AreaGraph({
  data = [],
  className = "h-[310px] w-full"
}) {
  const chartConfig = useMemo(() => {
    if (!data || data.length === 0) {
      return {};
    }
    
    // Custom color palette
    const colors = [
      'hsl(210, 70%, 50%)',   // Bright Blue
      'hsl(120, 60%, 50%)',   // Vibrant Green
      'hsl(340, 70%, 50%)',   // Coral Red
      'hsl(40, 80%, 50%)',    // Warm Orange
      'hsl(280, 60%, 50%)',   // Purple
      'hsl(30, 80%, 50%)'     // Deep Orange
    ];

    const keys = Object.keys(data[0]).filter(key => key !== 'month');
    return keys.reduce((acc, key, index) => ({
      ...acc,
      [key]: {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        color: colors[index % colors.length]
      }
    }), {});
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className={className}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
        <XAxis 
          dataKey="month" 
          tickLine={false} 
          axisLine={false} 
          className="text-xs"
        />
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          className="text-xs"
        />
        <Tooltip 
          content={
            <ChartTooltipContent 
              nameKey="label" 
              hideLabel 
            />
          } 
        />
        {Object.keys(data[0])
          .filter(key => key !== 'month')
          .map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={chartConfig[key].color}
              fill={chartConfig[key].color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
      </AreaChart>
    </ChartContainer>
  );
}