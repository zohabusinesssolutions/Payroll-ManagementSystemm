import { ISalary } from "./ISalary";

export interface IBankAccount {
  id: string;
  bankName: string;
  accountTitle: string;
  accountNo: string;
  branchCode: string;
  modeOfPayment: "Cash" | "Online";
}

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
  departmentId: string;
  maritalStatus?: string;
  address?: string;
  bankAccount?: IBankAccount;
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