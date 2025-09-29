
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
import { generateAndOpenPDF } from "@/components/SalarySlipPDF";

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
  const filteredData = searchQuery 
    ? payrollData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : payrollData;

  // Handle generate slip action
  const handleGenerateSlip = async (item: IPayroll) => {
    try {
      toast.loading("Generating salary slip...", { id: "generate-slip" });
      
      // Call API to get payroll data and create database record
      const response = await apiService.payroll.generateSlip({
        employeeId: item.id,
        month: selectedMonth,
        year: selectedYear,
      });

      if (response.success) {
        // Generate PDF on frontend using @react-pdf/renderer
        await generateAndOpenPDF(response.data);
        
        toast.success("Salary slip generated successfully!", { id: "generate-slip" });
        
        // Refresh payroll data
        refresh();
      } else {
        throw new Error(response.message || "Failed to generate salary slip");
      }
    } catch (error: any) {
      console.error("Error generating slip:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to generate salary slip", { 
        id: "generate-slip" 
      });
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
          onSubmit: (formData) => console.log("Submitted:", formData),
          loading: loading,
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
