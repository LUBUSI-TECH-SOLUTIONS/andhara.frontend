import { useEffect, useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { customerManagementStore } from "@/app/stores/customerManagementStore";
import { getColumns } from "@/features/dashboard/components/serviceTable/colums";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ServiceTable = () => {
  const {
    fetchCustomerManagementList,
    customerManagement,
    isLoading,
    error,
    customerManagementList
  } = customerManagementStore();

  useEffect(
    () => {
      fetchCustomerManagementList();
    },
    [fetchCustomerManagementList, customerManagement]
  );

  const columns = useMemo(() => getColumns(), [isLoading]);

  const table = useReactTable({
    data: customerManagementList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: false,
    manualSorting: false,
  })

  return (
    <section className="rounded border overflow-hidden">
      {
        error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )
      }
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="gap-2">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`sticky ${cell.column.id === 'actions' ? 'right-0' : ''
                        }`}>
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
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center">
                  No se encontrarón resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  )
};
