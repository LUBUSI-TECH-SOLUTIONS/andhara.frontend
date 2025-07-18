import { Row } from "@tanstack/react-table";
import { formaterDate } from "@/lib/utils";
import { toast } from "sonner";
import { Customer } from "@/features/customer/types/customerTypes";
import { useCustomerStore } from "@/app/stores/customers/customerStore";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, ExternalLink, MoreHorizontal, Power, ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom";

interface CustomerActionsProps {
  row: Row<Customer>
}

export const CustomerActions = ({row}: CustomerActionsProps) => {
  const customer = row.original
  const {
    openEditDialog, 
    toggleCustomerStatus, 
    setSelectedCustomer 
  } = useCustomerStore()
  const navigate = useNavigate()
  const handleToggleCustomerState = async (document: string) => {
    try {
      await toggleCustomerStatus(document)
      toast.success(`Cliente ${customer.customer_state ? "desactivado" : "activado"} correctamente`)
    }catch (error) {
      console.error("Error toggling customer state:", error)
      toast.error("Error al cambiar el estado del cliente")
    }
  }

  const handleNewPurchaseWithCustomer = async () => {
    try {
      setSelectedCustomer(customer)
      navigate(`/nueva-compra/${customer.customer_document}`)
    } catch (error) {
      console.error("Error opening purchase modal:", error)
      toast.error("Error al abrir el modal de compra")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
        onClick={() => openEditDialog(customer)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNewPurchaseWithCustomer()}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar venta
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleToggleCustomerState(customer.customer_document!)}>
          <Power className="mr-2 h-4 w-4" />
          {customer.customer_state ? "Desactivar" : "Activar"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const CustomerDataAction = ({row}: CustomerActionsProps) => {
  const customer = row.original
  const { openPurchaseSheet } = useCustomerStore()


  return (
    <Button
    variant="link"
    className="cursor-pointer"
    onClick={() => openPurchaseSheet(customer)}
  >
    {customer.last_purchase?.purchase_date
      ? formaterDate(customer.last_purchase?.purchase_date)
      : "No registrado"}
    <ExternalLink className="h-4 w-4 ml-1" />
  </Button>
  )
}