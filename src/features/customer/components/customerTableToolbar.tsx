import { useCustomerStore } from "@/app/stores/customers/customerStore"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"


export const ProductTableToolbar = () => {
  const { isLoading, openNewDialog } = useCustomerStore()

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-4">
      <div className="flex flex-1 items-center space-x-2">
      </div>
      <div className="flex space-x-2">
        <Button onClick={openNewDialog} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>
    </div>
  )
}
