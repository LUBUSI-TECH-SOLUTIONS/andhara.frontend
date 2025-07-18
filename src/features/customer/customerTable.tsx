import { useCustomerStore } from "@/app/stores/customers/customerStore"
import { type ColumnFiltersState, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getColumns } from "@/features/customer/components/columns"
import { Skeleton } from "@/components/ui/skeleton"
import { sortCustomersByLastPurchase } from "@/lib/utils"
import { usePurchaseStore } from "@/app/stores/purchaseStore"

export const CostumerTable = () => {
  const {
    fetchCustomers,
    displayedCustomers,
    isLoading,
    pageSize,
    sort,
    setSort
  } = useCustomerStore()

  const {
    createPurchase
  } = usePurchaseStore()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection] = useState({})

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers, createPurchase])

  const handleSort = (field: string) => {
    if (!sort || sort.field !== field) {
      setSort({ field, direction: "asc" });
    } else if (sort.direction === "asc") {
      setSort({ field, direction: "desc" });
    } else {
      setSort(undefined);
    }
  };

  const columns = useMemo(
    () => getColumns({ onSort: handleSort, sort, isLoading }),
    [sort, isLoading, handleSort]
  )

  const sortedCustomers = useMemo(() => {
    return sortCustomersByLastPurchase(displayedCustomers);
  }, [displayedCustomers]);

  const table = useReactTable({
    data: sortedCustomers,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
      rowSelection,
    },
    manualPagination: false,
    manualSorting: false,
    pageCount: Math.ceil(sortedCustomers.length / pageSize),
  })

  return (
    <section className="rounded border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap">
                    {isLoading ? (
                      <Skeleton className="h-6 w-full max-w-[120px]" />
                    ) : (
                      header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="gap-2">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center">
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`sticky ${cell.column.id === 'actions' ? 'right-0' : ''
                        } bg-background`}>
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
}