import { useEffect } from "react"
import { useCustomerStore } from "@/app/stores/customers/customerStore"
import { useProductStore } from "@/app/stores/productStore"
import { formatCurrency } from "@/lib/format"
import { usePurchaseStore } from "@/app/stores/purchaseStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MinusCircle, Package, PlusCircle } from "lucide-react"
import { SelectedProdcutsCard } from "@/features/newPurchase/components/selectedProductsCards"

export const PurchaseFormProducts = () => {
  const { selectedCustomer } = useCustomerStore()
  const { fetchProducts, allProducts, isLoading } = useProductStore()
  const { addOrUpdateProduct, removeUnitFromProduct, selectedProducts, closeModal, setActiveTab} = usePurchaseStore()

  const handleNext = () => {
    setActiveTab("summary")
  }

  const selectedBranch = selectedCustomer?.branch.id_branch

  const getStockByBranch = (product: { stock: { id_branch: string; quantity: number }[] }) => {
    const branchStock = product.stock.find((s) => s.id_branch === selectedBranch);
    return branchStock ? branchStock.quantity : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProducts()
    }
    fetchData()
  }, [])

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            Productos Disponibles en {selectedCustomer?.branch.branch_name}
          </h3>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Poducto</TableHead>
                  <TableHead className="text-right font-medium">Precio</TableHead>
                  <TableHead className="text-center font-medium">Stock</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-sm text-muted-foreground">
                      {isLoading ? "Cargando..." : "No hay productos disponibles"}
                    </TableCell>
                  </TableRow>
                ) : (
                  allProducts.map((product) => (
                    <TableRow key={product.id_product}>
                      <TableCell className="font-medium text-sm max-w-[150px]">
                        <div>
                          <h2>{product.product_name}</h2>
                          <span className="text-sm font-extralight text-muted-foreground">{product.product_description}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(Number(product.sale_price))}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStockByBranch(product) > 0 ? (
                          <Badge variant={
                            getStockByBranch(product) > 5 ? "default" : "destructive"
                          } >{getStockByBranch(product)}</Badge>
                        ) : (
                          <Badge className="text-sm">Sin Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {
                          selectedProducts.some((p) => p.id_product === product.id_product) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeUnitFromProduct(product?.id_product || "")}
                            >
                              <MinusCircle className="h-3 w-3" />
                              <span className="sr-only">Disminuir</span>
                            </Button>
                          )
                        }
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => addOrUpdateProduct(product?.id_product || "")}
                        >
                          <PlusCircle className="h-3 w-3 text-slate-600" />
                          <span className="sr-only">Aumentar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <SelectedProdcutsCard />
        </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button
            variant="outline"
            type="button"
            className="mt-4"
            onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            className="mt-4"
            type="button"
            disabled={selectedProducts.length === 0}
            onClick={handleNext}
          >
            Siguiente
          </Button>
      </div>
    </>
  )
}