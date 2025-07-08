import { useRef, useState } from "react"
import { PRODUCT_COLUMNS, useColumnVisibility } from "@/hooks/useColumnVisibility"
import type { Table } from "@tanstack/react-table"
import type { Product } from "@/features/products/types/productTypes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Columns, Check, X, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ColumnVisibilityDropdownProps {
  table: Table<Product>
}

export function ColumnVisibilityDropdown({ table }: ColumnVisibilityDropdownProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const { columnVisibility, toggleColumnVisibility, resetColumnVisibility, showAllColumns, hideAllColumns } =
    useColumnVisibility(table)

  const visibleColumnsCount = Object.entries(columnVisibility).filter(
    ([id, isVisible]) => isVisible && PRODUCT_COLUMNS.find((col) => col.id === id)?.canHide,
  ).length

  const hideableColumnsCount = PRODUCT_COLUMNS.filter((col) => col.canHide).length

  return (
    <TooltipProvider>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                ref={triggerRef}
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-2 lg:px-3"
                aria-label="Configurar columnas visibles"
              >
                <Columns className="h-4 w-4" />
                <span className="hidden md:inline">Columnas</span>
                {visibleColumnsCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1 rounded-sm">
                    {visibleColumnsCount}/{hideableColumnsCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Configurar columnas visibles</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          align="end"
          className="w-56"
          onCloseAutoFocus={(e) => {
            e.preventDefault()
          }}
        >
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Columnas visibles</span>
            <Badge variant="secondary" className="ml-1">
              {visibleColumnsCount}/{hideableColumnsCount}
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {PRODUCT_COLUMNS.map((column) => {
              if (!column.canHide) return null

              const isChecked = !!columnVisibility[column.id]

              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={isChecked}
                  onCheckedChange={() => toggleColumnVisibility(column.id)}
                  className="capitalize"
                >
                  {column.label}
                  {column.description && (
                    <span className="text-xs text-muted-foreground ml-2">({column.description})</span>
                  )}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Acciones rápidas</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={showAllColumns}>
                    <Check className="mr-2 h-4 w-4" />
                    <span>Mostrar todas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={hideAllColumns}>
                    <X className="mr-2 h-4 w-4" />
                    <span>Ocultar todas</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={resetColumnVisibility}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    <span>Restaurar predeterminadas</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
