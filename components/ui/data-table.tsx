// src/components/ui/data-table.tsx

import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyTitle = "No records yet",
  emptyDescription = "New entries will show up here once added.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E8E6E1] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E8E6E1] bg-[#FAFAF9]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 font-medium text-[#6B6F76] ${alignClass[column.align ?? "left"]}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-[#6B6F76]">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10">
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-sm font-medium text-[#15171A]">{emptyTitle}</p>
                  <p className="text-sm text-[#6B6F76]">{emptyDescription}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={rowKey(row)} className="border-t border-[#E8E6E1] hover:bg-[#FAFAF9]">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 text-[#15171A] ${alignClass[column.align ?? "left"]}`}
                  >
                    {column.render(row)}
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