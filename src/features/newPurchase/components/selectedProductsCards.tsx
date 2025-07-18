import { useFormContext } from "react-hook-form"
import { PurchaseFormValue } from "@/features/dashboard/schema/purchaseSchema"
import { formatCurrency } from "@/lib/format"
import { useProductStore } from "@/app/stores/productStore"
import { usePurchaseStore } from "@/app/stores/purchaseStore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MinusCircle, PlusCircle, X } from "lucide-react"

export const SelectedProdcutsCard = () => {

  const { allProducts } = useProductStore()
  const { watch } = useFormContext<PurchaseFormValue>()
  const { addOrUpdateProduct, removeUnitFromProduct, selectedProducts, removeProductCompletely } = usePurchaseStore()


  const getSelectedProductDetails = () => {
    return selectedProducts
      .map((selected) => {
        const fullProduct = allProducts.find(p => p.id_product === selected.id_product);
        if (!fullProduct) return null;

        return {
          ...fullProduct,
          quantity: selected.unit_quantity,
          subtotal: Number(fullProduct.sale_price) * selected.unit_quantity
        };
      })
      .filter(Boolean); // elimina nulls
  };

  const selectedDetails = getSelectedProductDetails();

  const deliveryCost = Number(watch("delivery_cost"))
  return (
    <div>
      <h3 className="text-sm font-medium pb-2"> Productos seleccionados</h3>
      {selectedProducts.length === 0 ? (
        <div className="text-center py-6 border border-dashed rounded-md">
          <p className="text-slate-500 text-sm">
            No hay productos seleccionados
          </p>
          <p className="text-slate-500 text-sm">
            Selecciona productos para agregar a la venta
          </p>
        </div>
      ) : (
        <div className="space-y-2 mr-2">
          {selectedDetails.map((product) => (
            <Card key={product?.id_product}>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-sm">{product?.product_name}</h4>
                    <p className="text-sm text-slate-600">{formatCurrency(Number(product?.sale_price))}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeUnitFromProduct(product?.id_product || "")}
                    >
                      <MinusCircle className="h-3 w-3" />
                      <span className="sr-only">Disminuir</span>
                    </Button>
                    <span className="text-sm font-medium">{product?.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => addOrUpdateProduct(product?.id_product || "")}
                    >
                      <PlusCircle className="h-3 w-3 text-slate-600" />
                      <span className="sr-only">Aumentar</span>
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-slate-600">
                    Subtotal: {formatCurrency(Number(product?.subtotal))}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1 text-xs"
                    onClick={() => removeProductCompletely(product?.id_product || "")}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="bg-slate-50 rounded-lg mt-3">
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="font-medium">Total: Productos</span>
              <span>{selectedDetails.reduce((sum, p) => sum + (p?.quantity || 0), 0)}</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="font-medium">
                Subtotal:
              </span>
              <span>
                {
                  formatCurrency(selectedDetails.reduce((sum, p) => sum + (p?.subtotal || 0), 0))
                }
              </span>
            </div>
            {
              deliveryCost > 0 && (
                <div className="flex justify-between items-center mt-1 text-sm">
                  <span className="font-medium">Costo de envio:</span>
                  <span>{formatCurrency(deliveryCost)}</span>
                </div>
              )
            }
            <Separator className="my-2" />
            <div className="flex justify-between items-center font-medium">
              <span>Total:</span>
              <span>
                {
                  formatCurrency(selectedDetails.reduce((sum, p) => sum + (p?.subtotal || 0), 0) + deliveryCost)
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}