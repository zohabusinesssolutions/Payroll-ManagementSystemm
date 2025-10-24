"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { enumerateDaysBetweenDates } from "@/lib/common";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import AttendanceFilter from "./_components/attendance-filter";
import AttendanceForm from "./_components/attendance-forn";
import { initialUsers } from "./_components/data";
import { AttendanceRecord, AttendanceStatus, User } from "./_components/types";

const getStatusIcon = (status: AttendanceStatus) => {
  switch (status) {
    case "present":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "absent":
      return <XCircle className="h-5 w-5 text-red-600" />;
    case "leave":
      return <Calendar className="h-5 w-5 text-yellow-600" />;
  }
};

export default function AttendanceTable() {
  const [month, setMonth] = useState(moment());
  const [monthArray, setMonthArray] = useState(
    enumerateDaysBetweenDates(
      moment(month).startOf("month"),
      moment(month).endOf("month")
    )
  );
  const [users, ] = useState<User[]>(initialUsers);
  const [, setSelectedRecord] = useState<{
    userId: number;
    dateIndex: number;
    inTime: string;
    outTime: string;
  } | null>(null);


  const openPopover = (
    userId: number,
    dateIndex: number,
    record: AttendanceRecord
  ) => {
    setSelectedRecord({
      userId,
      dateIndex,
      inTime: record.inTime || "",
      outTime: record.outTime || "",
    });
  };

  useEffect(() => {
    setMonthArray(
      enumerateDaysBetweenDates(
        moment(month).startOf("month"),
        moment(month).endOf("month")
      )
    );
  }, [month]);

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Monthly Attendance</h1>
        <p className="text-gray-600 mt-2">
          {moment(month).format("MMMM YYYY")} - Employee Attendance Record
        </p>
      </div>
      <AttendanceFilter
        onSubmit={({ month: monthStr }) => {
          setMonth(moment(monthStr, "YYYY-MM"));
        }}
        defaultMonth={month.toDate()}
      />
      <div className="border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold ">Employee Name</TableHead>
              {monthArray.map((m, idx) => (
                <TableHead
                  className="font-semibold text-center py-2 px-1"
                  key={idx}
                >
                  {moment(m).format("DD")}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{user.name}</TableCell>
                {user.attendance.map((record, index) => (
                  <TableCell key={index} className="text-center py-2 px-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-2 hover:bg-gray-100"
                          onClick={() => openPopover(user.id, index, record)}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {getStatusIcon(record.status)}
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <AttendanceForm
                          onSubmit={() => {}}
                          userName={user.name}
                          initialInTime={record.inTime}
                          initialOutTime={record.outTime}
                          date={record.date}
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}