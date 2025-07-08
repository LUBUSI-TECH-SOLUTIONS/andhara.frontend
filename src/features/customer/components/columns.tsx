import { formaterDate, SortOption } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "@/features/customer/types/customerTypes"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CustomerActions, CustomerDataAction } from "@/features/customer/components/customerActions"
import { ArrowUpDown} from "lucide-react"

interface ColumnOptions {
  onSort: (field: string) => void
  sort?: SortOption
  isLoading: boolean
}

export const getColumns = ({ onSort, sort, isLoading }: ColumnOptions): ColumnDef<Customer>[] => {
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
      id: "branch_name",
      accessorFn: (row) => row.branch?.branch_name,
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("branch.branch_name")} disabled={isLoading}>
          Sucursal
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left max-w-[100px] truncate">
          {row.original.branch?.branch_name}
        </div>
      ),
    },
    {
      id: "purchase_date",
      accessorFn: (row) => row.last_purchase?.next_purchase_date,
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("last_purchase.purchase_date")} disabled={isLoading}>
          Última compra
          {getSortIcon("last_purchase.purchase_date")}
        </Button>
      ),
      cell: ({ row }) => (
        <CustomerDataAction row={row} />
      )
    },
    {
      accessorKey: "customer_first_name",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("customer_first_name")} disabled={isLoading}>
          Nombre
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("customer_first_name")}
        </div>
      ),
    },
    {
      accessorKey: "customer_last_name",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("customer_last_name")} disabled={isLoading}>
          Apellido
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("customer_last_name")}
        </div>
      ),
    },
    {
      accessorKey: "document_type",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("document_type")} disabled={isLoading}>
          Tipo de documento
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("document_type")}
        </div>
      ),
    },
    {
      accessorKey: "customer_document",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("customer_document")} disabled={isLoading}>
          Documento
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("customer_document")}
        </div>
      ),
    },
    {
      accessorKey: "phone_number",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("phone_number")} disabled={isLoading}>
          Teléfono
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("phone_number")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("email")} disabled={isLoading}>
          Correo
          {getSortIcon("home_address")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "home_address",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("home_address")} disabled={isLoading}>
          Dirección
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left">
          {row.getValue("home_address")}
        </div>
      ),
    },
    {
      id: "branch.city_name",
      accessorFn: (row) => row.branch?.city_name,
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("branch.city_name")} disabled={isLoading}>
          Ciudad
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left">
          {row.getValue("branch.city_name")}
        </div>
      ),
    },
    {
      id: "branch.department_name",
      accessorFn: (row) => row.branch?.department_name,
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("branch.department_name")} disabled={isLoading}>
          Departamento
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left">
          {row.getValue("branch.department_name")}
        </div>
      ),
    },
    {
      id: "last_purchase.total_purchase",
      accessorFn: (row) => row.last_purchase?.total_purchase,
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("last_purchase.total_purchase")} disabled={isLoading}>
          Total compra
          {getSortIcon("last_purchase.total_purchase")}
        </Button>
      ),
      cell: ({ row }) => {
        const total = row.original.last_purchase?.total_purchase
        return (
          <div className="text-right">
            {total ?
              formatCurrency(Number(row.original.last_purchase?.total_purchase || "")) :
              formatCurrency(Number("0"))
            }
          </div>
        )
      },
    },
    {
      id: "last_purchase.next_purchase_date",
      accessorFn: (row) => row.last_purchase?.next_purchase_date,
      header: () => (
        <Button variant="ghost" onClick={() => handleSort("last_purchase.next_purchase_date")} disabled={isLoading}>
          Próxima compra
          {getSortIcon("last_purchase.next_purchase_date")}
        </Button>
      ),
      cell: ({ row }) => {
        const next_date = row.original.last_purchase?.next_purchase_date
        return (
          <div className="text-center">
            {next_date ?
              formaterDate(row.original.last_purchase?.next_purchase_date || "") :
              "No registrado"
            }
          </div>
        )
      },
    },
    {
      accessorKey: "customer_state",
      header: () => (
        <div className="text-center">
          Estado
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge className="text-center" variant={row.getValue("customer_state") ? "success" : "destructive"}>
            {row.getValue("customer_state") ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="sticky right-0 bg-background">
          <CustomerActions row={row} />
        </div>
      ),
      size: 100,
      enableSorting: false,
      enableColumnFilter: false
    }
  ]
}

