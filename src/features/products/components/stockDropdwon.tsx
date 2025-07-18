import { useState } from "react"
import { type Product } from "@/features/products/types/productTypes"
import { BRANCHES } from "@/shared/static"

import { Button } from "@/components/ui/button"
import { Boxes } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface StockDropdownProps {
  product: Product
}

export function StockDropdown({ product }: StockDropdownProps) {
  const [open, setOpen] = useState(false)
  const totalStock = product.stock.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Boxes className="h-4 w-4" />
          <span className="sr-md:not-sr-only">Stock</span>
          <Badge variant="outline" className="ml-1">
            {totalStock}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="font-medium block">{product.product_name}</span>
          <span className="text-xs text-muted-foreground">Stock por sucursal</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          {BRANCHES.map((branch) => {
            const stockItem = product.stock.find((item) => item.id_branch === branch.id_branch)
            const quantity = stockItem ? stockItem.quantity : 0

            return (
              <div key={branch.id_branch} className="flex justify-between items-center py-1">
                <span className="text-sm">{branch.name}</span>
                <Badge
                  variant={"default"}
                  className="ml-auto"
                >
                  {quantity}
                </Badge>
              </div>
            )
          })}
          <DropdownMenuSeparator className="my-1" />
          <div className="flex justify-between items-center py-1">
            <span className="text-sm font-medium">Total</span>
            <Badge variant="outline" className="font-medium ml-auto">
              {totalStock}
            </Badge>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
