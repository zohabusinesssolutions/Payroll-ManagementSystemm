
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import apiService from "@/app/adminspace/data/api";
import {
  AdminityDataTable,
  type FilterConfig,
  type TableActions,
} from "@/components/adminity-data-table";
import { useRequest } from "ahooks";
import { payrollConfig, columns, type IPayroll } from "./dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, Users } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
}

export default function PayrollPage() {
  // Original AdminityTable states
  const [selectedPayroll, setSelectedPayroll] = useState<IPayroll | null>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // New filter states
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [allEmployeesMode, setAllEmployeesMode] = useState<boolean>(true); // Default to all employees
  
  // Additional states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [exporting, setExporting] = useState<boolean>(false);
  const [customPayrollData, setCustomPayrollData] = useState<IPayroll[] | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [bankNameSearchQuery, setBankNameSearchQuery] = useState<string>("");

  // Use original API to fetch payroll data with filters applied
  const { data, loading, refresh } = useRequest(
    () => {
      if (!selectedMonth || !selectedYear) {
        return Promise.resolve({ data: [], total: 0 });
      }
      if (customPayrollData) {
        // Return custom data if we have filtered results
        return Promise.resolve({ data: customPayrollData });
      }
      // Use original summary API as fallback
      return apiService.payroll.getSummary({ month: selectedMonth, year: selectedYear });
    },
    {
      refreshDeps: [selectedMonth, selectedYear, customPayrollData],
    }
  );

  // Months array for dropdown
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i).reverse();

  // Get payroll data from API response
  const payrollData: IPayroll[] = data?.data || [];
  
  // Filter data based on search query (original functionality)
  const filteredDataWithoutSerial = searchQuery 
    ? payrollData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : payrollData;

  // Add serial numbers to the filtered data
  const filteredData = filteredDataWithoutSerial.map((item, index) => ({
    ...item,
    serial_no: index + 1,
  }));

  // Load employees on component mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await apiService.employee.get();
        const employeeList = response.data.map((emp: any) => ({
          id: emp.employeeId,
          name: emp.name,
          employeeId: emp.employeeId,
        }));
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error loading employees:", error);
        toast.error("Failed to load employees");
      }
    };

    loadEmployees();
  }, []);

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(employeeSearchQuery.toLowerCase()) 
  );

  // Handle employee selection
  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeSearchQuery(employee.name);
  };

  // Handle search payroll (new functionality)
  const handleSearchPayroll = async () => {
    if (!allEmployeesMode && !selectedEmployee) {
      toast.error("Please select an employee or enable 'All Employees' mode");
      return;
    }

    setSearching(true);
    try {
      const queryParams: any = {
        month: selectedMonth,
        year: selectedYear,
      };

      if (!allEmployeesMode && selectedEmployee) {
        queryParams.employeeId = selectedEmployee.id;
      }

      // Add bank name filter if provided
      if (bankNameSearchQuery.trim()) {
        queryParams.bankName = bankNameSearchQuery.trim();
      }

      const response = await apiService.payroll.get(queryParams);
      setCustomPayrollData(response.data || []);
      
      if (response.data?.length === 0) {
        toast.info("No payroll data found for the selected criteria");
      } else {
        toast.success(`Found ${response.data?.length || 0} payroll record(s)`);
      }
    } catch (error: any) {
      console.error("Error searching payroll:", error);
      toast.error(
        error?.response?.data?.error || 
        error?.message || 
        "Failed to search payroll data"
      );
      setCustomPayrollData([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle CSV export
  const handleExportCSV = async () => {
    if (!allEmployeesMode) {
      toast.error("CSV export is only available for 'All Employees' mode");
      return;
    }

    setExporting(true);
    try {
      if (!selectedMonth || !selectedYear) {
        toast.error("Please select both month and year for export");
        setExporting(false);
        return;
      }

      // Get the currently filtered/displayed data
      const dataToExport = customPayrollData || payrollData;
      
      if (!dataToExport || dataToExport.length === 0) {
        toast.error("No data to export. Please ensure payroll data is loaded.");
        setExporting(false);
        return;
      }

      // Call the export API with filtered data
      const exportParams: { month: number; year: number; bankName?: string } = {
        month: selectedMonth,
        year: selectedYear,
      };
      
      if (bankNameSearchQuery.trim()) {
        exportParams.bankName = bankNameSearchQuery.trim();
      }
      
      await apiService.payroll.exportCSV(exportParams);
      toast.success("CSV file downloaded successfully");
    } catch (error: any) {
      console.error("Error exporting CSV:", error);
      toast.error(
        error?.response?.data?.error || 
        error?.message || 
        "Failed to export CSV"
      );
    } finally {
      setExporting(false);
    }
  };

  // Handle form submission for editing payroll (original functionality)
  const handleSubmit = async (formData: any) => {
    if (!selectedPayroll) {
      toast.error("No payroll record selected");
      return;
    }

    try {
      toast.loading("Updating payroll...", { id: "update-payroll" });
      if (!selectedMonth || !selectedYear) {
        toast.error("Please select both month and year before updating");
        return;
      }
      const response = await apiService.payroll.edit({
        employeeId: selectedPayroll.id,
        month: selectedMonth,
        year: selectedYear,
        updates: formData,
      });

      if (response && (response.data || response.message)) {
        toast.success("Payroll updated successfully!", { id: "update-payroll" });
        
        // Close the drawer
        setSelectedPayroll(null);
        setDrawerMode("create");
        
        // Refresh the payroll data
        refresh();
        setCustomPayrollData(null); // Reset custom data to refresh
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

  // Handle generate slip action (original functionality)
  const handleGenerateSlip = async (item: IPayroll) => {
    try {
      toast.loading("Generating salary slip...", { id: "generate-slip" });
      if (!selectedMonth || !selectedYear) {
        toast.error("Please select both month and year before generating slip");
        return;
      }
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

  // Reset employee selection when switching to all employees mode
  useEffect(() => {
    if (allEmployeesMode) {
      setSelectedEmployee(null);
      setEmployeeSearchQuery("");
    }
  }, [allEmployeesMode]);

  // Original AdminityTable filters
  const filters: FilterConfig[] = [
    {
      key: "name",
      label: "Employee Name",
      type: "search",
      placeholder: "Search employee...",
    },
  ];

  // Original AdminityTable actions
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
    <div className="space-y-6 mt-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        <p className="text-muted-foreground">
          Search and manage employee payroll details by month and year
        </p>
      </div>

      {/* New Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Month and Year Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth?.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Selection */}
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear?.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* All Employees Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allEmployees"
              checked={allEmployeesMode}
              onCheckedChange={(checked) => setAllEmployeesMode(checked as boolean)}
            />
            <Label htmlFor="allEmployees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Employees
            </Label>
          </div>

          {/* Employee Search (hidden when All Employees is selected) */}
          {!allEmployeesMode && (
            <div className="space-y-2">
              <Label htmlFor="employee">Employee Search</Label>
              <div className="relative">
                <Input
                  id="employee"
                  placeholder="Search by Employee ID or Name..."
                  value={employeeSearchQuery}
                  onChange={(e) => {
                    setEmployeeSearchQuery(e.target.value);
                    setSelectedEmployee(null);
                  }}
                />
                {employeeSearchQuery && !selectedEmployee && filteredEmployees.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredEmployees.slice(0, 10).map((employee) => (
                      <div
                        key={employee.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">ID: {employee.employeeId}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedEmployee && (
                <div className="text-sm text-green-600">
                  Selected: {selectedEmployee.name} (ID: {selectedEmployee.employeeId})
                </div>
              )}
            </div>
          )}

          {/* Bank Name Search Filter */}
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name Search</Label>
            <Input
              id="bankName"
              placeholder="Search by bank name... (e.g., Meezan, HBL, UBL)"
              value={bankNameSearchQuery}
              onChange={(e) => setBankNameSearchQuery(e.target.value)}
            />
            {bankNameSearchQuery && (
              <div className="text-sm text-blue-600">
                Filter: Employees with bank name containing &quot;{bankNameSearchQuery}&quot;
              </div>
            )}
          </div>

          

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSearchPayroll}
              disabled={searching}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {searching ? "Searching..." : "Search Payroll"}
            </Button>

            {allEmployeesMode && (
              <Button
                variant="outline"
                onClick={handleExportCSV}
                disabled={exporting}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {exporting ? "Exporting..." : "Export CSV"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Original AdminityDataTable */}
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
