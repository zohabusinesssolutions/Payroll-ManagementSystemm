"use client";

import apiService from "@/app/adminspace/data/api";
import {
  AdminityDataTable,
  type TableActions,
} from "@/components/adminity-data-table";
import { useRequest } from "ahooks";
import { useState } from "react";
import { columns, Config, IExpense } from "./dto";

export default function ExpensePage() {
  const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

  const { data, loading, refresh, runAsync } = useRequest(
    apiService.expense.get
  );

  const { runAsync: createExpense } = useRequest(apiService.expense.create, {
    manual: true,
  });

  const { runAsync: editExpense } = useRequest(apiService.expense.update, {
    manual: true,
  });

  const { runAsync: deleteExpense } = useRequest(apiService.expense.delete, {
    manual: true,
  });

  // Define filters
  // const filters: FilterConfig[] = [
  //   {
  //     key: "name",
  //     label: "Client Name",
  //     type: "select",
  //     placeholder: "Search client...",
  //   },
  // ];

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    if (drawerMode === "create") {
      await createExpense(formData);
    } else {
      await editExpense(selectedExpense!.id, formData);
    }
    refresh();
  };

  // Define actions
  const actions: TableActions<IExpense> = {
    onSearch: async (query: string) => {
      await runAsync({ name: query });
    },
    isEditable: true,
    can_create: false,
    onDelete: async (id: string) => {
      await deleteExpense(id);
      refresh();
    },
    onEdit: (item: IExpense) => {
      setSelectedExpense(item);
      setDrawerMode("edit");
    },
    onCreate: () => {
      setSelectedExpense(null);
      setDrawerMode("create");
    },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Expense Management</h1>
        <p className="text-muted-foreground">
          Manage Corporate Expenses and their Details
        </p>
      </div>

      <AdminityDataTable
        data={data?.data || []}
        columns={columns}
        loading={loading}
        filters={[]}
        drawerConfig={Config({
          mode: drawerMode,
          onSubmit: handleSubmit,
          loading: loading,
          onCancel: () => {
            setSelectedExpense(null);
            setDrawerMode("create");
          },
        })}
        actions={actions}
        totalCount={data?.data?.count}
        pageSize={10}
        currentPage={1}
      />
    </div>
  );
}
