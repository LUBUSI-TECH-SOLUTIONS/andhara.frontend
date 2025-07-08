import { useFormContext } from "react-hook-form"
import { PurchaseFormValue } from "@/features/dashboard/schema/purchaseSchema"
import { DELIVERY_TYPES, PAYMENT_STATUS, PAYMENT_TYPES } from "@/shared/static"
import { CreditCard, Truck, User } from "lucide-react"
import { SearchCustomer } from "@/features/newPurchase/components/searchCustomer"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCustomerStore } from "@/app/stores/customers/customerStore"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { usePurchaseStore } from "@/app/stores/purchaseStore"

export const PurchaseFormDetails = () => {
  const { control, formState } = useFormContext<PurchaseFormValue>()
  const { selectedCustomer } = useCustomerStore()
  const { setActiveTab, closeModal } = usePurchaseStore()

  const handleNext = () => {
    setActiveTab("products")
  }

  return (
    <section className="space-y-4">
      <div className="p-2">
        <div>
          <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-primary">
            <User className="h-6 w-6" />
            Cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchCustomer />
            <div className="col-span-2 md:col-span-1">
              <Label htmlFor="customer_name" className="mb-2">Nombre del Cliente</Label>
              <Input
                id="customer_name"
                type="text"
                placeholder="Número de documento"
                disabled
                value={selectedCustomer?.customer_first_name}
              />
            </div>
            <FormField
              control={control}
              name="purchase_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración de Compra (días)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Tiempo que durará la compra"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-primary">
            <Truck className="h-6 w-6" />
            Información de Entrega
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="delivery_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Entrega</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un tipo de etrega" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DELIVERY_TYPES.map((d) => (
                        <SelectItem key={d.name} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="delivery_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo de Entrega</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Opcional"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="delivery_comment"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Comentario de Entrega</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="comentarios de la entrega"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-primary">
            <CreditCard className="h-6 w-6" />
            Detalles de Pago
          </h3>
          <div className="grid grid-col-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="payment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de pago</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un tipo de pago" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_TYPES.map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado del pago</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione el estado del pago" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_STATUS.map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="remaining_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Restante</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Opcional"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
            disabled={!formState.isValid || !selectedCustomer?.customer_document}
            onClick={handleNext}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </section>
  )
}