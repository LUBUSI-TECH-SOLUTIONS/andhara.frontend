import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { PurchaseFormDetails } from "./components/purchaseFormDetails"
import { PurchaseFormProducts } from "./components/purchaseProductSelector"
import { PurchaseSumary } from "./components/purchaseSumary"
import { Button } from "@/components/ui/button"
import { usePurchaseStore } from "@/app/stores/purchaseStore"
import { useCustomerStore } from "@/app/stores/customers/customerStore"
import { useForm } from "react-hook-form"
import { PurchaseFormValue, purchaseSchema } from "../dashboard/schema/purchaseSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PurchaseRequest } from "../dashboard/types/purchaseTypes"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/format"
import { formaterDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


export const PurchasePage = () => {
  const { activeTab, setActiveTab, selectedProducts, createPurchase, isLoading } = usePurchaseStore()
  const { selectedCustomer, clearFilters, fetchCustomerPurchases, customerPurchase } = useCustomerStore()
  const navigate = useNavigate()

  const form = useForm<PurchaseFormValue>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      purchase_duration: "",
      payment_type: "",
      payment_status: "",
      remaining_balance: "",
      delivery_type: "",
      delivery_comment: "",
      delivery_cost: "0",
    },
    mode: "onChange",
  })

  const isSelectCustomer = selectedCustomer?.branch.id_branch ? false : true

  useEffect(() => {
    if (selectedCustomer?.customer_document) {
      fetchCustomerPurchases(selectedCustomer.customer_document)
    }
  }, [selectedCustomer])

  const onSubmit = async (data: PurchaseFormValue) => {
    try {
      const finalData: PurchaseRequest = {
        customer_document: selectedCustomer?.customer_document || "",
        id_branch: selectedCustomer?.branch.id_branch || "",
        purchase_duration: Number(data.purchase_duration),
        payment_type: data.payment_type,
        payment_status: data.payment_status,
        remaining_balance: Number(data.remaining_balance),
        delivery_type: data.delivery_type,
        delivery_comment: data.delivery_comment,
        delivery_cost: Number(data.delivery_cost),
        products: selectedProducts,
      }
      await createPurchase(finalData)
      toast.success("Venta creada con éxito")
      clearFilters()
      form.reset()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al crear la venta"
      toast.error(errorMessage || "Error al crear la venta")
    }
  }
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-slate-700" />
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Nueva Venta {selectedCustomer ? selectedCustomer.customer_first_name + " " + selectedCustomer.customer_last_name : ""}</CardTitle>
          </div>
          <CardDescription>Crear una nueva venta con detalles de cliente y productos</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full col-span-2">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="details">Detalle</TabsTrigger>
              <TabsTrigger disabled={isSelectCustomer} value="products">Productos</TabsTrigger>
              <TabsTrigger disabled={isSelectCustomer} value="summary">Resumen</TabsTrigger>
            </TabsList>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="overflow-auto">
                  <TabsContent value="details">
                    <PurchaseFormDetails />
                  </TabsContent>
                  <TabsContent value="products">
                    <PurchaseFormProducts />
                  </TabsContent>
                  <TabsContent value="summary">
                    <PurchaseSumary />
                    <Button
                      type="submit"
                      className="w-full mt-4"
                      disabled={
                        !form.formState.isValid
                        || isLoading
                      }>
                      {isLoading ? "Cargando..." : "Crear Venta"}
                    </Button>
                  </TabsContent>
                </ScrollArea>
              </form>
            </Form>
          </Tabs>
          {selectedCustomer ? (
            <div className="col-span-1 mx-2 border-dashed border-primary/30">
              <ScrollArea className="h-[calc(100vh)]">
                <div className="space-y-6">
                  {customerPurchase?.purchases.map((purchase) => (
                    <Card key={purchase.id_purchase}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Compra del {formaterDate(purchase.purchase_date)}</CardTitle>
                          <Badge variant="secondary" className="font-semibold">
                            {formatCurrency(purchase.total_purchase)}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Duración: {purchase.purchase_duration} días</span>
                          <span className="font-medium">Próxima compra: {formaterDate(purchase.next_purchase_date)}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-medium mb-2">Productos:</h4>
                        <div className="space-y-3">
                          {purchase.products.map((product) => (
                            <div key={product.id_product} className="bg-muted p-3 rounded-md">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{product.product_name}</span>
                                <Badge variant="secondary">
                                  {product.unit_quantity} {product.unit_quantity > 1 ? "unidades" : "unidad"}
                                </Badge>
                              </div>
                              <Separator className="my-2" />
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Subtotal (sin IVA):</span>
                                  <p>{formatCurrency(product.subtotal_without_vat)}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Total (con IVA):</span>
                                  <p className="font-semibold">{formatCurrency(product.total_price_with_vat)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 bg-neutral-200/40 m-4 border-dashed border-primary border rounded">
              <h2 className="text-muted-foreground text-xl font-semibold text-center">Busca un cliente por documento o nombre para comenzar una venta</h2>
              {/* <Search className="text-xl text-primary mb-2" /> */}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}