"use client";

import apiService from "@/app/adminspace/data/api";
import {
  AdminityDataTable,
  type FilterConfig,
  type TableActions,
} from "@/components/adminity-data-table";
import { useRequest } from "ahooks";
import { useState } from "react";
import { columns, departmentConfig, type IDepartment } from "./dto";

export default function DepartmentPage() {
  const [, setSelectedDepartment] =
    useState<IDepartment | null>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

  const { data, loading, refresh, runAsync } = useRequest(
    apiService.department.get
  );


  // Define filters
  const filters: FilterConfig[] = [
    {
      key: "name",
      label: "Department Name",
      type: "search",
      placeholder: "Search departments...",
    },
  ];

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    try {
      console.log("Submitting department data:", formData);

      if (drawerMode === "create") {
        // Call create API
        await apiService.department.create(formData);
      } else {
        // Call update API
        // await apiService.department.update(selectedDepartment?.id!, formData)
      }

      // Refresh the data
      refresh();
    } catch (error) {
      console.error("Error submitting department:", error);
      throw error; // Re-throw to show error in form
    }
  };

  // Define actions
  const actions: TableActions<IDepartment> = {
    onSearch: async (query: string) => {
      await runAsync({ name: query });
    },
    onFilter: (filters: Record<string, string>) => {
      console.log("Filter:", filters);
      // Implement your filter logic here
    },
    isEditable: true,
    can_create: true,
    onDelete: async (id: string) => {
      try {
        console.log("Deleting department:", id);
        // await apiService.department.delete(id)
        refresh();
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    },
    onEdit: (item: IDepartment) => {
      setSelectedDepartment(item);
      setDrawerMode("edit");
    },
    onCreate: () => {
      setSelectedDepartment(null);
      setDrawerMode("create");
    },
  };

  return (
    <div>
      <div className="my-12">
        <h1 className="text-2xl font-bold">Department Management</h1>
        <p className="text-muted-foreground">
          Manage departments and their access permissions. All permission fields
          are required.
        </p>
      </div>

      <AdminityDataTable
        data={data?.data || []}
        columns={columns}
        loading={loading}
        filters={filters}
        drawerConfig={departmentConfig({
          mode: drawerMode,
          onSubmit: handleSubmit,
          loading: loading,
          onCancel: () => {
            setSelectedDepartment(null);
            setDrawerMode("create");
          },
        })}
        actions={actions}
        totalCount={data?.total}
        pageSize={10}
        currentPage={1}
      />
    </div>
  );
}
