import { customerManagementStore } from "@/app/stores/customerManagementStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { manageDefaultValues, ManageFormValue, manageSchema } from "@/features/dashboard/schema/manageSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { CustomerManagement } from "@/features/dashboard/types/purchaseTypes";

export const ManagementDialog = () => {
  const { isOpenManagement, selectedService, setIsCloseManagement, customerManagement } = customerManagementStore();
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsCloseManagement();
    }
  }

  const form = useForm<ManageFormValue>({
    resolver: zodResolver(manageSchema),
    defaultValues: manageDefaultValues,
  })

  const onSubmit = async (data: ManageFormValue) => {
    const finalData: CustomerManagement = {
      id_customer_service: selectedService.id_customer_service,
      ...data
    }
    try {
      await customerManagement(finalData)
    } catch (error) {
      console.log(error)
    } finally {
      setIsCloseManagement()
      form.reset(manageDefaultValues)
    }
  }

  return (
    <Dialog open={isOpenManagement} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {
              form.watch("customer_service_status") ? (
                <p className="">Mantener activo</p>
              ) : (
                <p className="">Cerrar seguimiento</p>
              )
            }
          </DialogTitle>
          <DialogDescription asChild>
            {form.watch("customer_service_status") ? (
              <p className="text-sm">Al mantener el estado activo, se le seguira recordando de realizar el contacto con el cliente.</p>
            ) : (
              <p className="text-sm">Al cerrar el seguimiento, se eliminara de la lista que se encarga de recordar el contacto con el cliente.</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_service_status"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border rounded p-4">
                  <FormControl>
                    <div className="flex items-center justify-start gap-x-2">
                      <Label htmlFor="customer_service_status">Cerrar seguimiento</Label>
                      <Switch
                        id="customer_service_status"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="customer_service_status">Mantener activo</Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese comentario adicional aquí..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ingrese comentario adicional
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Guardar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}