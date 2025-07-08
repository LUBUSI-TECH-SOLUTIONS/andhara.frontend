import { useFormContext } from "react-hook-form"
import { useCustomerStore } from "@/app/stores/customers/customerStore"
import { usePurchaseStore } from "@/app/stores/purchaseStore"
import { useProductStore } from "@/app/stores/productStore"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent } from "@/components/ui/card"
import { PurchaseFormValue } from "@/features/dashboard/schema/purchaseSchema"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, CreditCard, Truck, User } from "lucide-react"

export const PurchaseSumary = () => {
  const { selectedCustomer } = useCustomerStore()
  const { watch } = useFormContext<PurchaseFormValue>()
  const { allProducts } = useProductStore()
  const { selectedProducts } = usePurchaseStore()

  const purchaseDuration = watch("purchase_duration")
  const deliveryType = watch("delivery_type")
  const deliveryCost = Number(watch("delivery_cost"))
  const deliveryComments = watch("delivery_comment")
  const paymentType = watch("payment_type")
  const paymentStatus = watch("payment_status")
  const remainigBalance = formatCurrency(Number(watch("remaining_balance")))


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

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-primary" />
        Resumen del pedido
      </h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 max-h-[210px] overflow-y-auto">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-600" />
                Información del Cliente
              </h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-slate-600 font-semibold">Cliente:</span>
                  <span>{selectedCustomer?.customer_first_name} {selectedCustomer?.customer_last_name}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-slate-600 font-semibold">Sucursal:</span>
                  <span>{selectedCustomer?.branch.branch_name}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-slate-600 font-semibold">Duración:</span>
                  <span>{purchaseDuration} días</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 max-h-[210px] overflow-y-auto">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4 text-slate-600" />
                Información de Entrega
              </h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-slate-600 font-semibold">Tipo de Entrega:</span>
                  <span>{deliveryType}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-slate-600 font-semibold">Costo de Entrega:</span>
                  <span>{formatCurrency(deliveryCost)}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-slate-600 font-semibold">Comentarios:</span>
                  <span>{deliveryComments}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* section two  */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 max-h-[210px] overflow-y-auto">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-600" />
                Información de Pago
              </h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-slate-600 font-semibold">Tipo de Pago:</span>
                  <span>{paymentType}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-slate-600 font-semibold">Estado de Pago:</span>
                  <span>{paymentStatus}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-slate-600 font-semibold">Saldo Restante:</span>
                  <span>{remainigBalance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 max-h-[210px] overflow-y-auto">
              <h4 className="font-medium text-sm mb-2">Resumen de Costos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                  <span>
                    {formatCurrency(selectedDetails.reduce((sum, p) => sum + (p?.subtotal || 0), 0))}
                  </span>
                </div>
                {
                  deliveryCost > 0 && (
                    <div className="flex justify-between items-center mt-1 text-sm">
                      <span className="font-semibold">Costo de envio:</span>
                      <span>{formatCurrency(deliveryCost)}</span>
                    </div>
                  )
                }
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  {formatCurrency(selectedDetails.reduce((sum, p) => sum + (p?.subtotal || 0), 0) + deliveryCost)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}