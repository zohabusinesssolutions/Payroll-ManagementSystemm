import { ISalary } from "./ISalary";

export interface IEmployee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phoneNo: string;
  cnicNo: string;
  dateOfBirth: string;
  designation: string;
  department: string;
  joiningDate: string;
  resignDate?: string;
  status: "active" | "resigned";
  image?: string;
  salary?: ISalary;
  attendance: {
    PRESENT: number;
    ABSENT: number;
    HALFDAY: number;
    LATE: number;
    LEAVE: number;
  };
}