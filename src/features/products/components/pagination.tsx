import { useProductStore } from "@/app/stores/productStore"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export const Pagination = () => {
  const { pageIndex, pageSize, total, pageCount, setPageIndex, setPageSize, isLoading } = useProductStore()

  const currentPage = pageIndex + 1
  const fromItem = pageIndex * pageSize + 1
  const toItem = Math.min((pageIndex + 1) * pageSize, total)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pageCount || isLoading) return
    setPageIndex(page - 1)
  }

  const handlePageSizeChange = (size: number) => {
    if (isLoading) return
    setPageSize(size)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
      <div className="text-sm text-muted-foreground">
        {total > 0 ? (
          <>
            Mostrando {fromItem} a {toItem} de {total} producto(s)
          </>
        ) : (
          "No hay productos"
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Primera página</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <span className="text-sm">
            Página {currentPage} de {pageCount || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount || pageCount === 0 || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(pageCount)}
            disabled={currentPage === pageCount || pageCount === 0 || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
