"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar as CalendarIcon,
  ChevronDown,
  CheckCircle,
  XCircle,
  SunIcon,
  ClockIcon,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // shadcn's (react-day-picker) calendar
import { format, parse } from "date-fns";

const YYYY_MM = "yyyy-MM";

const filterSchema = z.object({
  search: z.string().trim().default(""),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Invalid month format (YYYY-MM)")
    .default(format(new Date(), YYYY_MM)),
});

// IMPORTANT: use the *output* type because we used .default() in the schema
type FilterValues = z.input<typeof filterSchema>;

type AttendanceFilterProps = {
  defaultMonth?: Date;
  onSubmit: (data: FilterValues) => void;
  onReset?: () => void;
};

const toMonthString = (date: Date) => format(date, YYYY_MM);
const fromMonthString = (value?: string) =>
  value ? parse(value, YYYY_MM, new Date()) : undefined;

export default function AttendanceFilter({
  defaultMonth = new Date(),
  onSubmit,
  onReset,
}: AttendanceFilterProps) {
  const defaultValues: FilterValues = useMemo(
    () => ({
      search: "",
      month: toMonthString(defaultMonth),
    }),
    [defaultMonth]
  );

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const [open, setOpen] = useState(false);

  const handleReset = () => {
    form.reset(defaultValues);
    onReset?.();
  };

  return (
    <div className="space-y-4 p-4 bg-white border mb-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-x-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Filter Attendance
        </h3>
        <div className="flex gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            <span>Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <SunIcon className="h-4 w-4 text-yellow-500" />
            <span>Half Day</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-orange-500" />
            <span>Late</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          {/* Search */}
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search by Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter employee name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Month */}
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => {
              const selectedDate = fromMonthString(field.value);

              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Select Month
                  </FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w- justify-between font-normal"
                          type="button"
                        >
                          {selectedDate
                            ? format(selectedDate, "MMMM yyyy")
                            : "Select month"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          // Let user pick *any* day; we only keep YYYY-MM
                          onSelect={(date) => {
                            if (date) field.onChange(toMonthString(date));
                            setOpen(false);
                          }}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Apply Filter
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Clear Filter
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
