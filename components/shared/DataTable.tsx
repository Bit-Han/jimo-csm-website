// src/components/shared/DataTable.tsx
// Pure Tailwind table wrapper
// DATA FLOW: parent passes columns + rows; this renders the table, handles empty state
import { cn } from "@/lib/utils/helpers";
import type { ReactNode } from "react";
import { PageSpinner } from "@/components/ui/Spinner";

export interface Column<T> {
  key: string;
  header: string;
  width?: string;       // Tailwind width class e.g. "w-48"
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  loading,
  emptyMessage = "No results found",
  emptyDescription = "Try adjusting your filters.",
  rowKey,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-sm">
        {/* Header */}
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap",
                  col.width
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <PageSpinner />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <p className="text-sm font-medium text-gray-500">{emptyMessage}</p>
                <p className="mt-1 text-xs text-gray-400">{emptyDescription}</p>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-gray-100 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-gray-50/80"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-gray-800 align-middle">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}