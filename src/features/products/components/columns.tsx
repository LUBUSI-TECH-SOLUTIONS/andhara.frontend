import type { ColumnDef } from "@tanstack/react-table"
import type { SortOption } from "@/lib/utils" 
import { formatCurrency, formatPercent } from "@/lib/format"

import type { Product } from "@/features/products/types/productTypes"
import { Button } from "@/components/ui/button"
import { ProductActions } from "@/features/products/components/productActions"
import { Badge } from "@/components/ui/badge"
import { StockDropdown } from "@/features/products/components/stockDropdwon"
import { ProductService } from "@/features/products/services/productService"
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react"

interface ColumnOptions {
  onSort: (field: string) => void
  sort?: SortOption
  isLoading: boolean
}

export const getColumns = ({ onSort, sort, isLoading }: ColumnOptions): ColumnDef<Product>[] => {
  const handleSort = (field: string) => {
    if (isLoading) return
    onSort(field)
  }

  const getSortIcon = (field: string) => {
    if (!sort || sort.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }

    return (
      <ArrowUpDown
        className={`ml-2 h-4 w-4 ${sort.direction === "asc" ? "text-primary" : "text-primary rotate-180"}`}
      />
    )
  }

  return [
    {
      accessorKey: "id_product",
      header: "ID",
      cell: ({ row }) => (
        <div className="text-center max-w-[100px] truncate" title={row.getValue("id_product")}>
          {(row.getValue("id_product") as string).substring(0, 8)}...
        </div>
      ),
    },
    {
      accessorKey: "product_name",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("product_name")} disabled={isLoading}>
          Producto
          {getSortIcon("product_name")}
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
    },
        {
      id: "stock",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("stock")} disabled={isLoading}>
          Stock
          {getSortIcon("stock")}
        </Button>
      ),
      cell: ({ row }) => <StockDropdown product={row.original} />,
    },
    {
      accessorKey: "product_description",
      header: "Descripción",
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("product_description")}</div>,
    },
    {
      accessorKey: "id_supplier",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("id_supplier")} disabled={isLoading}>
          Proveedor
          {getSortIcon("id_supplier")}
        </Button>
      ),
      cell: ({ row }) => {
        const supplierId = row.getValue("id_supplier") as string
        return <div>{ProductService.getSupplierName(supplierId)}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "purchase_price",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort("purchase_price")}
          className="whitespace-nowrap"
          disabled={isLoading}
        >
          Precio Compra
          {getSortIcon("purchase_price")}
        </Button>
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("purchase_price"))
        return <div className="text-right">{formatCurrency(amount)}</div>
      },
    },
    {
      accessorKey: "product_discount",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("product_discount")} disabled={isLoading}>
          Descuento
          {getSortIcon("product_discount")}
        </Button>
      ),
      cell: ({ row }) => {
        const discount = Number.parseFloat(row.getValue("product_discount"))
        return <div className="text-right">{formatPercent(discount)}</div>
      },
    },
    {
      accessorKey: "sale_price",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort("sale_price")}
          className="whitespace-nowrap"
          disabled={isLoading}
        >
          Precio Venta
          {getSortIcon("sale_price")}
        </Button>
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("sale_price"))
        return <div className="text-right">{formatCurrency(amount)}</div>
      },
    },
    {
      accessorKey: "profit_margin",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("profit_margin")} disabled={isLoading}>
          Margen
          {getSortIcon("profit_margin")}
        </Button>
      ),
      cell: ({ row }) => {
        const margin = Number.parseFloat(row.getValue("profit_margin"))
        return <div className="text-right">{formatPercent(margin)}</div>
      },
    },
    {
      accessorKey: "product_state",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("product_state")} disabled={isLoading}>
          Estado
          {getSortIcon("product_state")}
        </Button>
      ),
      cell: ({ row }) => {
        const state = row.getValue("product_state") as boolean
        return (
          <div className="flex justify-center">
            {state ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Activo
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Inactivo
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ProductActions row={row} />,
    },
  ]
}
