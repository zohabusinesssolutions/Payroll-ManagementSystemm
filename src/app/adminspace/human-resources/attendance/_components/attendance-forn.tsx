"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type AttendanceFormProps = {
  userName: string;
  date: string;
  initialInTime?: string;
  initialOutTime?: string;
  onSubmit: (data: { inTime: string; outTime: string }) => void;
  onCancel?: () => void;
};

const attendanceSchema = z
  .object({
    inTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    outTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  })
  .refine(
    (data) => {
      if (data.inTime && data.outTime) {
        const [inHours, inMinutes] = data.inTime.split(":").map(Number);
        const [outHours, outMinutes] = data.outTime.split(":").map(Number);
        const inTime = inHours * 60 + inMinutes;
        const outTime = outHours * 60 + outMinutes;
        return outTime > inTime;
      }
      return true;
    },
    {
      message: "Out time must be after in time",
      path: ["outTime"],
    }
  );

type AttendanceFormData = z.infer<typeof attendanceSchema>;

export default function AttendanceForm({ userName, date, initialInTime = "", initialOutTime = "", onSubmit, onCancel }: AttendanceFormProps) {

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      inTime: initialInTime,
      outTime: initialOutTime,
    },
  });


  const handleSubmit = (data: AttendanceFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Update Attendance</h4>
        <p className="text-sm text-muted-foreground">
          {userName} - {date}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="inTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    In Time
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="outTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Out Time
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
