
"use client";

import apiService from "@/app/adminspace/data/api";
import {
  AdminityDataTable,
  type FilterConfig,
  type TableActions,
} from "@/components/adminity-data-table";
import { useRequest } from "ahooks";
import { useState } from "react";
import { payrollConfig, columns, type IPayroll } from "./dto";
import { toast } from "sonner";

export default function PayrollPage() {
  const [selectedPayroll, setSelectedPayroll] = useState<IPayroll | null>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get current month and year for default query
  const currentDate = new Date();
  const [selectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear] = useState(currentDate.getFullYear());

  // Use API to fetch payroll data
  const { data, loading, refresh, runAsync } = useRequest(
    () => apiService.payroll.getSummary({ month: selectedMonth, year: selectedYear }),
    {
      refreshDeps: [selectedMonth, selectedYear],
    }
  );

  // Get payroll data from API response
  const payrollData: IPayroll[] = data?.data || [];
  
  // Filter data based on search query
  const filteredDataWithoutSerial = searchQuery 
    ? payrollData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : payrollData;

  // Add serial numbers to the filtered data
  const filteredData = filteredDataWithoutSerial.map((item, index) => ({
    ...item,
    serial_no: index + 1,
  }));

  // Handle form submission for editing payroll
  const handleSubmit = async (formData: any) => {
    if (!selectedPayroll) {
      toast.error("No payroll record selected");
      return;
    }

    try {
      toast.loading("Updating payroll...", { id: "update-payroll" });

      console.log("Submitting payroll edit:", {
        employeeId: selectedPayroll.id,
        month: selectedMonth,
        year: selectedYear,
        updates: formData,
      });

      // Call the edit payroll API
      const response = await apiService.payroll.edit({
        employeeId: selectedPayroll.id,
        month: selectedMonth,
        year: selectedYear,
        updates: formData,
      });

      console.log("Edit payroll response:", response);

      if (response && (response.data || response.message)) {
        toast.success("Payroll updated successfully!", { id: "update-payroll" });
        
        // Close the drawer
        setSelectedPayroll(null);
        setDrawerMode("create");
        
        // Refresh the payroll data
        refresh();
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      console.error("Error updating payroll:", error);
      toast.error(
        error?.response?.data?.error || 
        error?.response?.data?.message ||
        error?.message || 
        "Failed to update payroll", 
        { id: "update-payroll" }
      );
    }
  };

  // Handle generate slip action
  const handleGenerateSlip = async (item: IPayroll) => {
    try {
      toast.loading("Generating salary slip...", { id: "generate-slip" });
      
      console.log("Generating slip for:", {
        employeeId: item.id,
        month: selectedMonth,
        year: selectedYear,
      });
      
      // Call API service which handles both backend and PDF generation
      const response = await apiService.payroll.generateSlip({
        employeeId: item.id,
        month: selectedMonth,
        year: selectedYear,
      });

      if (response.success) {
        toast.success("Salary slip generated and downloaded successfully!", { id: "generate-slip" });
        
        // Refresh payroll data
        refresh();
      } else {
        throw new Error(response.message || "Failed to generate salary slip");
      }
    } catch (error: any) {
      console.error("Error generating slip:", error);
      toast.error(
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to generate salary slip", 
        { id: "generate-slip" }
      );
    }
  };

  // Filters
  const filters: FilterConfig[] = [
    {
      key: "name",
      label: "Employee Name",
      type: "search",
      placeholder: "Search employee...",
    },
  ];

  // Actions
  const actions: TableActions<IPayroll> = {
    onSearch: async (query: string) => {
      setSearchQuery(query);
    },
    isEditable: true,
    can_create: false, // payroll slips usually not manually created
    onEdit: (item: IPayroll) => {
      setSelectedPayroll(item);
      setDrawerMode("edit");
    },
    onCreate: () => {
      setSelectedPayroll(null);
      setDrawerMode("create");
    },
    customActions: [
      {
        label: "Generate Slip",
        onClick: handleGenerateSlip,
        className: "text-blue-600",
      },
    ],
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        <p className="text-muted-foreground">
          View and manage employee payroll details
        </p>
      </div>

      <AdminityDataTable
        data={filteredData}
        columns={columns}
        loading={loading}
        filters={filters}
        drawerConfig={payrollConfig({
          mode: drawerMode,
          onSubmit: handleSubmit,
          loading: loading,
          defaultValues: selectedPayroll || undefined,
          onCancel: () => {
            setSelectedPayroll(null);
            setDrawerMode("create");
          },
        })}
        actions={actions}
        totalCount={filteredData.length}
        pageSize={10}
        currentPage={1}
      />
    </div>
  );
}
