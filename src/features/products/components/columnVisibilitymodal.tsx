import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Columns, RotateCcw, Check, X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import type { Product } from "@/features/products/types/productTypes";
import {
   PRODUCT_COLUMNS,
   useColumnVisibility,
} from "@/hooks/useColumnVisibility";
import { Badge } from "@/components/ui/badge";

interface ColumnVisibilityModalProps {
   table: Table<Product>;
}

export function ColumnVisibilityModal({ table }: ColumnVisibilityModalProps) {
   const [open, setOpen] = useState(false);

   const {
      columnVisibility,
      toggleColumnVisibility,
      resetColumnVisibility,
      showAllColumns,
      hideAllColumns,
   } = useColumnVisibility(table);

   const visibleColumnsCount = Object.entries(columnVisibility).filter(
      ([id, isVisible]) =>
         isVisible && PRODUCT_COLUMNS.find((col) => col.id === id)?.canHide
   ).length;

   const hideableColumnsCount = PRODUCT_COLUMNS.filter(
      (col) => col.canHide
   ).length;

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button
               variant="outline"
               size="sm"
               className="h-8 gap-1 px-2 lg:px-3"
               aria-label="Configurar columnas visibles">
               <Columns className="h-4 w-4" />
               <span className="hidden md:inline">Columnas</span>
               {visibleColumnsCount > 0 && (
                  <Badge
                     variant="secondary"
                     className="ml-1 h-5 px-1 rounded-sm">
                     {visibleColumnsCount}/{hideableColumnsCount}
                  </Badge>
               )}
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="flex items-center justify-between">
                  <span>Columnas visibles</span>
                  <Badge variant="secondary">
                     {visibleColumnsCount}/{hideableColumnsCount}
                  </Badge>
               </DialogTitle>
               <DialogDescription>
                  Selecciona las columnas que deseas mostrar en la tabla.
               </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
               <div className="flex justify-between mb-2">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={showAllColumns}
                     className="flex items-center gap-1">
                     <Check className="h-4 w-4" />
                     <span>Todas</span>
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={hideAllColumns}
                     className="flex items-center gap-1">
                     <X className="h-4 w-4" />
                     <span>Ninguna</span>
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={resetColumnVisibility}
                     className="flex items-center gap-1">
                     <RotateCcw className="h-4 w-4" />
                     <span>Restablecer</span>
                  </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PRODUCT_COLUMNS.map((column) => {
                     if (!column.canHide) return null;

                     const isChecked = !!columnVisibility[column.id];

                     return (
                        <div
                           key={column.id}
                           className="flex items-center space-x-2 rounded-md border p-2">
                           <Checkbox
                              id={`column-${column.id}`}
                              checked={isChecked}
                              onCheckedChange={() =>
                                 toggleColumnVisibility(column.id)
                              }
                           />
                           <Label
                              htmlFor={`column-${column.id}`}
                              className="flex-1 cursor-pointer">
                              {column.label}
                              {column.description && (
                                 <span className="text-xs text-muted-foreground block">
                                    {column.description}
                                 </span>
                              )}
                           </Label>
                        </div>
                     );
                  })}
               </div>
            </div>

            <DialogFooter>
               <Button onClick={() => setOpen(false)}>Cerrar</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
