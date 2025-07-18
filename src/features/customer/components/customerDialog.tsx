import { useCustomerStore } from "@/app/stores/customers/customerStore"
import { useEffect } from "react"
import { branchesStatic, typesDocument } from "@/shared/static"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogDescription } from "@/components/ui/dialog"
import { customerEschema, CustomerFormValue } from "@/features/customer/schema/customerSchema"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPen, UserPlus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

export const CustomerDialog = () => {
  const {
    createCustomer,
    updateCustomer,
    isLoading,
    error,
    selectedCustomer,
    isNewDialogOpen,
    isEditDialogOpen,
    closeEditDialog,
    closeNewDialog
  } = useCustomerStore()

  const isEditing = !!selectedCustomer
  const isOpen = isEditDialogOpen || isNewDialogOpen

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (isEditDialogOpen) {
        closeEditDialog()
      }
      if (isNewDialogOpen) {
        closeNewDialog()
      }
    }
  }

  const form = useForm<CustomerFormValue>({
    resolver: zodResolver(customerEschema),
    defaultValues: {
      customer_document: "",
      document_type: "CC",
      customer_first_name: "",
      customer_last_name: "",
      medical_diagnosis: "",
      phone_number: "",
      email: "",
      home_address: "",
      customer_state: true,
      id_branch: branchesStatic[0].id_branch,
    }
  })

  useEffect(() => {
    if (selectedCustomer) {
      form.reset({
        customer_document: selectedCustomer.customer_document,
        document_type: selectedCustomer.document_type,
        customer_first_name: selectedCustomer.customer_first_name,
        customer_last_name: selectedCustomer.customer_last_name,
        phone_number: selectedCustomer.phone_number,
        email: selectedCustomer.email,
        medical_diagnosis: selectedCustomer.medical_diagnosis,
        home_address: selectedCustomer.home_address,
        customer_state: selectedCustomer.customer_state,
        id_branch:
          typeof selectedCustomer.branch ===
            "string"
            ? selectedCustomer.branch
            : selectedCustomer.branch?.id_branch ?? undefined

      })
    } else {
      form.reset({
        customer_document: "",
        document_type: "",
        customer_first_name: "",
        customer_last_name: "",
        medical_diagnosis: "",
        phone_number: "",
        email: "",
        home_address: "",
        customer_state: true,
        id_branch: ""
      })
    }
  }, [selectedCustomer, form, isOpen])

  const onSubmit = async (data: CustomerFormValue) => {
    try {
      if (isEditing && selectedCustomer) {
        await updateCustomer({
          customer_document: selectedCustomer.customer_document,
          document_type: selectedCustomer.document_type,
          customer_first_name: data.customer_first_name,
          customer_last_name: data.customer_last_name,
          phone_number: data.phone_number,
          email: data.email,
          medical_diagnosis: data.medical_diagnosis,
          home_address: data.home_address,
          customer_state: data.customer_state ?? true,
          id_branch: data.id_branch,
        })
      } else {
        await createCustomer({
          customer_document: data.customer_document,
          document_type: data.document_type,
          customer_first_name: data.customer_first_name,
          customer_last_name: data.customer_last_name,
          phone_number: data.phone_number,
          email: data.email,
          medical_diagnosis: data.medical_diagnosis,
          home_address: data.home_address,
          customer_state: data.customer_state ?? true,
          id_branch: data.id_branch,
        })
      }
    } catch (error) {
      console.error("Error updating customer:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing
              ? <UserPen className="w-6 h-6 text-primary" />
              : <UserPlus className="w-6 h-6 text-primary" />}
            {isEditing ? "Editar Cliente" : "Crear Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Modifique los detalles del cliente." : "Ingrese los detalles del nuevo cliente."}
          </DialogDescription>
          <Separator className="my-2" />
        </DialogHeader>
        {
          error && (
            <Alert variant={"destructive"}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )
        }
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isEditing || isLoading}
                        placeholder="Ingrese el documento"
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de documento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={isEditing || isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full" disabled={isLoading}>
                          <SelectValue placeholder="Seleccione el tipo de documento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typesDocument.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ingrese el nombre" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer_last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ingrese el apellido" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medical_diagnosis"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Diagnostico</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Ingrese el diagnostico del cliente" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ingrese el teléfono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ingrese el correo electrónico" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="home_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ingrese la dirección" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="id_branch"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Sucursal</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={isLoading}>
                        <SelectValue placeholder="Seleccione la sucursal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branchesStatic.map((branch) => (
                        <SelectItem key={branch.id_branch} value={branch.id_branch}>
                          {branch.branch_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer_state"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Estado</FormLabel>
                    <FormDescription>
                      {field.value
                        ? "El cliente está activo"
                        : "El cliente está inactivo"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )

}
