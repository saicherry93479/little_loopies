"use client";

import * as React from "react";
import { addDays, format, subDays, subMonths } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  field:any,
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  field,
  onDateRangeChange,
}: DateRangePickerProps) {
 
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [compare, setCompare] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(new Date());

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDate(newRange);
    onDateRangeChange(newRange);
  };

  const quickSelections = [
    { label: "Today", fn: () => ({ from: new Date(), to: new Date() }) },
    {
      label: "Yesterday",
      fn: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }),
    },
    {
      label: "Last 7 days",
      fn: () => ({ from: subDays(new Date(), 7), to: new Date() }),
    },
    {
      label: "Last 14 days",
      fn: () => ({ from: subDays(new Date(), 14), to: new Date() }),
    },
    {
      label: "Last 30 days",
      fn: () => ({ from: subDays(new Date(), 30), to: new Date() }),
    },
    {
      label: "This Week",
      fn: () => ({
        from: subDays(new Date(), new Date().getDay()),
        to: new Date(),
      }),
    },
    {
      label: "Last Week",
      fn: () => {
        const start = subDays(new Date(), new Date().getDay() + 7);
        return { from: start, to: addDays(start, 6) };
      },
    },
    {
      label: "This Month",
      fn: () => ({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      }),
    },
    {
      label: "Last Month",
      fn: () => {
        const start = subMonths(new Date(), 1);
        return {
          from: new Date(start.getFullYear(), start.getMonth(), 1),
          to: new Date(start.getFullYear(), start.getMonth() + 1, 0),
        };
      },
    },
  ];

  return (
    
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "max-w-[250px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM d, yyyy")} -{" "}
                  {format(date.to, "MMM d, yyyy")}
                </>
              ) : (
                format(date.from, "MMM d, yyyy")
              )
            ) : (
              <span>Filter {field.charAt(0).toUpperCase() + field.slice(1)}</span>
            )}
            
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" align="start">
          <div className="flex ">
            <div className="p-3 border-r flex-1">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setMonth((prevMonth) => subMonths(prevMonth, 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-medium">{format(month, "MMMM yyyy")}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setMonth((prevMonth) => addDays(prevMonth, 31))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                month={month}
                onMonthChange={setMonth}
                className="flex"
                showOutsideDays={false}
                fixedWeeks
              />
            </div>
            <div className="w-fit p-3">
              <div className="flex flex-col">
                {quickSelections.map((selection, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-fit justify-start font-normal"
                    onClick={() => handleDateRangeChange(selection.fn())}
                  >
                    {selection.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex hidden items-center justify-end gap-2 w-full border-t p-4">
            <Button
              variant="outline"
              onClick={() => {
                setDate(undefined);
                onDateRangeChange(undefined);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (date) onDateRangeChange(date);
              }}
            >
              Update
            </Button>
          </div>
        </PopoverContent>
      </Popover>

  );
}
