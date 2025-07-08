import { useCustomerStore } from "@/app/stores/customers/customerStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const Pagination = () => {
  const { 
    pageIndex, 
    pageSize, 
    total, 
    setPageIndex, 
    setPageSize, 
    isLoading, 
    fetchCustomers 
  } = useCustomerStore()
  const fromItem = total > 0 ? pageIndex * pageSize + 1 : 0
  const toItem = Math.min((pageIndex + 1) * pageSize, total)


const handlePageSizeChange = (size: number) => {
  if (isLoading) return

  setPageSize(size)
  setPageIndex(0)
  fetchCustomers({
    skip: 0,
    limit: size,
  })
}
  return (
    <section className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
      <div className="text-sm text-muted-foreground">
        {
          total > 0 ? (
            <>
              Mostrando {fromItem} a {toItem} de {total} cliente(s)
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
      </div>
    </section>
  )
}