export type AttendanceStatus = "present" | "absent" | "leave";

export type AttendanceRecord = {
  date: string;
  status: AttendanceStatus;
  inTime?: string;
  outTime?: string;
};

export type User = {
  id: number;
  name: string;
  attendance: AttendanceRecord[];
};