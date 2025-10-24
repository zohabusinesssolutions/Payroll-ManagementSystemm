"use client";

import apiService from "@/app/adminspace/data/api";
import type { IEmployee } from "@/app/types/IEmployee";
import { AdminityButton } from "@/components/adminity-button";
import { AdminityDrawer } from "@/components/adminity-drawer";
import { AdminityLoader } from "@/components/adminity-loader";
import { useBoolean, useRequest } from "ahooks";
import { Plus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { employeeConfig } from "./dto";
import { EmployeeCard } from "./employee-card";
import { IDepartment } from "@/app/types/IDepartment";

function EmptyState({ onAddEmployee }: { onAddEmployee: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No employees found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Get started by adding your first employee to the system. You can manage
        their information and track attendance.
      </p>
      <AdminityButton onClick={onAddEmployee}>
        <Plus className="h-4 w-4 mr-2" />
        Add Employee
      </AdminityButton>
    </div>
  );
}

export default function EmployeePage() {
  // Fetch departments and employees using useRequest
  useRequest(apiService.department.get, {
    manual: false,
    onSuccess: ({ data }) => {
      setDepartments(data);
    },
  });

  // Fetch employees
  const { loading } = useRequest(apiService.employee.get, {
    manual: false,
    onSuccess: ({ data }) => {
      setEmployees(data);
    },
  });

  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(
    null
  );

  const [isDrawerOpen, { setTrue: openDrawer, setFalse: closeDrawer }] =
    useBoolean(false);

  const [formData, setFormData] = useState<Record<string, any> | undefined>(
    undefined
  );
  const [mode, setMode] = useState<"create" | "edit">("create");

  // Add useRequest for employee operations
  const { loading: submitLoading, run: submit } = useRequest(
    async (data: any) => {
      if (mode === "create") return await apiService.employee.create(data);
      else return await apiService.employee.update(selectedEmployee!.id, data);
    },
    {
      manual: true,
      onSuccess: (response) => {
        console.log("🎉 Operation completed successfully:", response);
        // Update local state
        if (mode === "create") {
          setEmployees((prev) => [...prev, response.data]);
        } else {
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.id === selectedEmployee?.id ? response.data : emp
            )
          );
        }

        // Close drawer and reset form
        closeDrawer();
        setFormData(undefined);
        setSelectedEmployee(null);
      },
      onError: (error) => {
        console.error("❌ API call failed:", error);
      },
    }
  );

  const { activeEmployees, resignedEmployees } = useMemo(
    () => ({
      activeEmployees: employees.filter((emp) => emp.status === "active"),
      resignedEmployees: employees.filter((emp) => emp.status === "resigned"),
    }),
    [employees]
  );

  // Handler functions
  const handleCreateEmployee = () => {
    console.log("➕ Creating new employee");
    setMode("create");
    setFormData(undefined);
    setSelectedEmployee(null);
    openDrawer();
  };

  const handleEditEmployee = (employee: any) => {
    console.log("✏️ Editing employee:", employee);
    setMode("edit");
    setSelectedEmployee(employee);

    // Map employee data to form format
    const mappedData = {
      name: employee.name || "",
      email: employee.email || "",
      phoneNo: employee.phoneNo || "",
      cnicNo: employee.cnicNo || "",
      dateOfBirth: employee.dateOfBirth || "",
      maritalStatus: employee.maritalStatus || "",
      address: employee.address || "",
      department: employee.departmentId || "",
      designation: employee.designation || "",
      startDate: employee.joiningDate || "",
      resignDate: employee.resignDate || "",
      grossSalary: employee.salary?.grossSalary || 0,
      fuelAllowance: employee.salary?.fuelAllowance || 0,
      medicalAllowance: employee.salary?.medicalAllowance || 0,
      modeOfPayment: employee.bankAccount ? "Online" : "Cash",
      bankName: employee.bankAccount?.bankName || "",
      accountTitle: employee.bankAccount?.accountTitle || "",
      accountNo: employee.bankAccount?.accountNo || "",
      branchCode: employee.bankAccount?.branchCode || "",
    };

    console.log("📋 Mapped form data:", mappedData);
    setFormData(mappedData);
    openDrawer();
  };

  // const handleDeleteEmployee = (user: any) => {
  //   if (confirm(`Are you sure you want to delete ${user.name}?`)) {
  //     // TODO: Implement delete functionality
  //     console.log("🗑️ Deleting employee:", user);
  //   }
  // };

  const handleCloseDrawer = (open: boolean) => {
    if (!open) {
      closeDrawer();
      setFormData(undefined);
      setSelectedEmployee(null);
    }
  };

  return (
    <AdminityLoader loading={loading} className="container space-y-6">
      {employees.length === 0 ? (
        <EmptyState onAddEmployee={handleCreateEmployee} />
      ) : (
        <>
          {activeEmployees.length > 0 && (
            <div className="space-y-6 mt-12">
              <h2 className="text-2xl font-semibold">Active Employees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onEdit={handleEditEmployee}
                  />
                ))}
              </div>
            </div>
          )}

          {resignedEmployees.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Former Employees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {resignedEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onEdit={handleEditEmployee}
                  />
                ))}
              </div>
            </div>
          )}

          {activeEmployees.length === 0 && resignedEmployees.length > 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No active employees. All employees have resigned.
              </p>
            </div>
          )}
        </>
      )}

      {/* AdminityDrawer */}
      <AdminityDrawer
        config={employeeConfig({
          mode,
          departments: departments,
          onSubmit: submit,
          loading: loading || submitLoading,
          onCancel: closeDrawer,
        })}
        trigger={
          <AdminityButton
            onClick={handleCreateEmployee}
            size="lg"
            className="fixed bottom-6 right-6 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out z-50 group overflow-hidden"
          >
            <div className="flex items-center space-x-0 group-hover:space-x-2 transition-all duration-300">
              <Plus className="h-6 w-6 flex-shrink-0" />
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                Add Employee
              </span>
            </div>
          </AdminityButton>
        }
        open={isDrawerOpen}
        onOpenChange={handleCloseDrawer}
        data={formData}
        mode={mode}
      />
    </AdminityLoader>
  );
}
