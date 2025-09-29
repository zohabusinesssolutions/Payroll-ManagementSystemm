"use client";

import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminityDrawer, type AdminityDrawerConfig } from "./adminity-drawer";
import { useMemo, useState, useCallback } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDebounce } from "@/hooks/use-debounce";

export interface BaseTableData {
  id: string;
  [key: string]: any;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "search" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface TableActions<T> {
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  isEditable: boolean;
  can_create: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (item: T) => void;
  onCreate?: () => void;
  customActions?: Array<{
    label: string;
    onClick: (item: T) => void;
    className?: string;
  }>;
}

interface AdminityDataTableProps<T extends BaseTableData> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  filters?: FilterConfig[];
  drawerConfig?: AdminityDrawerConfig;
  actions?: TableActions<T>;
  title?: string;
  description?: string;
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

// Skeleton component for loading state
function TableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-[280px]" />
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="rounded-lg border">
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[180px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

export function AdminityDataTable<T extends BaseTableData>({
  data,
  columns: baseColumns,
  loading = false,
  filters = [],
  drawerConfig,
  actions,
  totalCount,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
}: AdminityDataTableProps<T>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  // Local filter states for API calls
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce((query: string) => {
    if (actions?.onSearch) {
      actions.onSearch(query);
    }
  }, 300);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const newFilters = { ...filterValues, [key]: value };
      setFilterValues(newFilters);

      if (actions?.onFilter) {
        actions.onFilter(newFilters);
      }
    },
    [filterValues, actions]
  );

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete && actions?.onDelete) {
      actions.onDelete(itemToDelete.id);
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Add actions column if actions are provided
  const columns: ColumnDef<T>[] = useMemo(() => {
    if (!actions?.isEditable && !actions?.onDelete) return baseColumns;

    const actionsColumn: ColumnDef<T> = {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {actions?.isEditable && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                    setMode("edit");
                    setDrawerOpen(true);
                    actions?.onEdit?.(item);
                  }}
                >
                  Edit
                </DropdownMenuItem>
              )}
              {actions?.customActions?.map((customAction, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    customAction.onClick(item);
                  }}
                  className={customAction.className}
                >
                  {customAction.label}
                </DropdownMenuItem>
              ))}
              {actions?.onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(item);
                  }}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    };

    return [...baseColumns, actionsColumn];
  }, [baseColumns, actions]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
    manualPagination: true, // Since we're handling pagination via API
    pageCount: totalCount ? Math.ceil(totalCount / pageSize) : -1,
  });

  const handleCreateNew = () => {
    setSelectedItem(null);
    setMode("create");
    setDrawerOpen(true);
    actions?.onCreate?.();
  };

  const handleRowClick = (item: T) => {
    if (drawerConfig && actions?.isEditable) {
      setSelectedItem(item);
      setMode("edit");
      setDrawerOpen(true);
      actions?.onEdit?.(item);
    }
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {filters.map((filter) => {
              if (filter.type === "search") {
                return (
                  <div key={filter.key} className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={
                        filter.placeholder ||
                        `Search ${filter.label.toLowerCase()}...`
                      }
                      value={searchQuery}
                      onChange={(event) => {
                        const value = event.target.value;
                        setSearchQuery(value);
                        debouncedSearch(value);
                      }}
                      className="pl-10 w-[280px]"
                    />
                  </div>
                );
              }

              if (filter.type === "select") {
                return (
                  <Select
                    key={filter.key}
                    value={filterValues[filter.key] || ""}
                    onValueChange={(value) => {
                      const filterValue = value === "all" ? "" : value;
                      handleFilterChange(filter.key, filterValue);
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All {filter.label.toLowerCase()}
                      </SelectItem>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }

              return null;
            })}
          </div>

          {actions?.can_create && (
            <Button onClick={handleCreateNew} className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 px-6 font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={(e) => {
                    // Don't trigger row click if clicking on action button
                    if ((e.target as HTMLElement).closest('[role="button"]')) {
                      return;
                    }
                    handleRowClick(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalCount && totalCount > pageSize && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
            results
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                onClick={() => onPageChange?.(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronFirst />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 bg-transparent"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 bg-transparent"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalCount / pageSize)}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                onClick={() => onPageChange?.(Math.ceil(totalCount / pageSize))}
                disabled={currentPage === Math.ceil(totalCount / pageSize)}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronLast />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      {drawerConfig && (
        <AdminityDrawer
          config={drawerConfig}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          data={selectedItem || undefined}
          mode={mode}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
