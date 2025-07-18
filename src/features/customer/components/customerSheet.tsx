import { useCustomerStore } from "@/app/stores/customers/customerStore";
import { formaterDate } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton";
import { PurchaseSkeleton } from "@/features/customer/skeleton/productSkeleton";


export const CustomerSheet = () => {
  const { isPurchaseSheetOpen, customerPurchase, closePurchaseSheet, isLoading } = useCustomerStore()

  const isOpen = isPurchaseSheetOpen

  const handleOpenChange = (open: boolean) => {
    if (!open) closePurchaseSheet()
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
          <SheetContent className="w-full sm:max-w-md md:max-w-lg p-5">
            <SheetHeader>
              <SheetTitle className="text-3xl">Compras realizadas</SheetTitle>
              {isLoading ? (
                <Skeleton className="h-5 w-48" />
              ) : (
                <SheetDescription className="font-medium text-primary">Historial de compras: {formatCurrency(customerPurchase?.historical_purchases ?? 0)}</SheetDescription>
              )}
            </SheetHeader>
            <Separator />
            <ScrollArea className="h-[calc(100vh-180px)]">
              {isLoading ? (
                <div className="space-y-6">
                  <PurchaseSkeleton />
                  <PurchaseSkeleton />
                  <PurchaseSkeleton />
                </div>
              ) : (
                <div className="space-y-6">
                  {customerPurchase?.purchases.map((purchase) => (
                    <Card key={purchase.id_purchase} className="border-l-4 border-l-primary">
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
              )}
            </ScrollArea>
            <div className="mt-6 flex justify-between items-center">
              <div>
                <p className="text-muted-foreground">Total de compras</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatCurrency(customerPurchase?.historical_purchases ?? 0)}
                  </p>
                )}
              </div>
              <Button onClick={() => handleOpenChange(false)}>Cerrar</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}