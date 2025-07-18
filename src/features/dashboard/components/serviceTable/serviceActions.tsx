import { Row } from "@tanstack/react-table";
import { customerManagementStore } from "@/app/stores/customerManagementStore";
import { CustomerService } from "@/features/dashboard/types/purchaseTypes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, ShoppingCart, MessageCircle } from "lucide-react";

interface ServiceActionsProps {
  row: Row<CustomerService>
}


export const ServiceActions = ({row}: ServiceActionsProps) => {
  const { 
    fetchCustomerManagementById, 
    clearSelectedService, 
    selectedService  
  } = customerManagementStore();

  const handleSelectService = (id: string) => {
    if (selectedService) {
      clearSelectedService()
    }
    try {
      fetchCustomerManagementById(id)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSelectService(row.original.id_customer_service)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar venta
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <MessageCircle className="mr-2 h-4 w-4" />
          Añadir mensaje
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
