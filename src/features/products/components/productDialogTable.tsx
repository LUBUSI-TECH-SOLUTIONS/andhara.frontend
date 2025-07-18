import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductService } from "@/features/products/services/productService";
import type { StockInfo } from "@/features/products/types/productTypes";
import { BRANCHES } from "@/shared/static";
import { useProductStore } from "@/app/stores/productStore";

import { FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   productsSchema,
   type ProductFormValues,
} from "@/features/products/schema/productsShema";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const ProductDialog = () => {
   const {
      createProduct,
      updateProduct,
      isLoading,
      selectedProduct,
      editDialogOpen,
      newProductDialogOpen,
      closeEditDialog,
      closeNewProductDialog,
   } = useProductStore();

   const isEditing = !!selectedProduct;
   const isOpen = editDialogOpen || newProductDialogOpen;

   const handleOpenChange = (open: boolean) => {
      if (!open) {
         if (editDialogOpen) closeEditDialog();
         if (newProductDialogOpen) closeNewProductDialog();
      }
   };

   const supplierOptions = useMemo(
      () => ProductService.getSupplierFilterOptions(),
      []
   );

   const form = useForm<ProductFormValues>({
      resolver: zodResolver(productsSchema),
      defaultValues: {
         product_name: "",
         product_description: "",
         purchase_price: "0",
         product_discount: "0",
         profit_margin: 0,
         product_state: true,
         sale_price: "0",
         vat: "19",
         id_supplier: supplierOptions.length > 0 ? supplierOptions[0].id : "",
         stock: BRANCHES.map((branch) => ({
            id_branch: branch.id_branch,
            quantity: 0,
         })),
      },
   });

   useEffect(() => {
      if (selectedProduct) {
         const stockValues = BRANCHES.map((branch) => {
            const stockItem = selectedProduct.stock.find(
               (item) => item.id_branch === branch.id_branch
            );
            return {
               id_branch: branch.id_branch,
               quantity: stockItem ? stockItem.quantity : 0,
            };
         });

         form.reset({
            id_product: selectedProduct.id_product,
            product_name: selectedProduct.product_name,
            product_description: selectedProduct.product_description,
            purchase_price: selectedProduct.purchase_price.toString(),
            product_discount: selectedProduct.product_discount.toString(),
            sale_price: selectedProduct.sale_price?.toString() ?? "0",
            profit_margin: selectedProduct.profit_margin ?? 0,
            vat: selectedProduct.vat?.toString() ?? "19",
            product_state: selectedProduct.product_state ?? true,
            id_supplier:
               selectedProduct.id_supplier ??
               (supplierOptions.length > 0 ? supplierOptions[0].id : ""),
            stock: stockValues,
         });
      } else {
         form.reset({
            product_name: "",
            product_description: "",
            purchase_price: "0",
            product_discount: "0",
            sale_price: "0",
            vat: "19",
            product_state: true,
            id_supplier:
               supplierOptions.length > 0 ? supplierOptions[0].id : "",
            stock: BRANCHES.map((branch) => ({
               id_branch: branch.id_branch,
               quantity: 0,
            })),
         });
      }
   }, [selectedProduct, form, isOpen, supplierOptions]);

   const onSubmit = async (data: ProductFormValues) => {
      try {
         const stock: StockInfo[] = data.stock.map((item) => ({
            id_product: selectedProduct?.id_product || "",
            id_branch: item.id_branch,
            quantity: item.quantity,
         }));

         if (isEditing && selectedProduct) {
            await updateProduct({
               id_product: selectedProduct.id_product,
               product_name: data.product_name,
               product_description: data.product_description,
               purchase_price: Number(data.purchase_price),
               product_discount: Number(data.product_discount),
               sale_price: Number(data.sale_price),
               vat: Number(data.vat),
               product_state: data.product_state,
               id_supplier: data.id_supplier,
               stock,
            });
         } else {
            await createProduct({
               product_name: data.product_name,
               product_description: data.product_description,
               purchase_price: Number(data.purchase_price),
               product_discount: Number(data.product_discount),
               sale_price: Number(data.sale_price),
               vat: Number(data.vat),
               product_state: data.product_state,
               id_supplier: data.id_supplier,
               stock,
            });
         }
      } catch (error) {
         console.error("Error al guardar el producto:", error);
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
         <DialogContent className="sm:max-w-[900px] max-w-[900px]">
            <DialogHeader>
               <DialogTitle>
                  {isEditing ? "Editar Producto" : "Nuevo Producto"}
               </DialogTitle>
               <DialogDescription>
                  {isEditing
                     ? "Actualice los detalles del producto. Haga clic en guardar cuando termine."
                     : "Ingrese los detalles del nuevo producto. Haga clic en guardar cuando termine."}
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4">
                  {isEditing && selectedProduct && (
                     <FormField
                        control={form.control}
                        name="id_product"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>ID</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    disabled
                                    value={selectedProduct.id_product}
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />
                  )}
                  <div className="grid grid-cols-2 gap-2">
                     <FormField
                        control={form.control}
                        name="product_name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="product_description"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Descripción</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="id_supplier"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Proveedor</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                                 value={field.value}>
                                 <FormControl>
                                    <SelectTrigger className="w-full">
                                       <SelectValue placeholder="Seleccione un proveedor" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {supplierOptions.map((supplier) => (
                                       <SelectItem
                                          key={supplier.id}
                                          value={supplier.id}>
                                          {supplier.supplier_name}
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
                        name="purchase_price"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Precio Compra</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                     <FormField
                        control={form.control}
                        name="sale_price"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Precio Venta</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="product_discount"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Descuento (%)</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="vat"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>IVA (%)</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <FormField
                     control={form.control}
                     name="product_state"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                           <div className="space-y-0.5">
                              <FormLabel>Estado del producto</FormLabel>
                              <FormDescription>
                                 {field.value
                                    ? "El producto está activo"
                                    : "El producto está inactivo"}
                              </FormDescription>
                           </div>
                           <FormControl>
                              <Switch
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  <h3 className="font-medium text-sm text-center">
                     Stock por Sucursal
                  </h3>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-3 gap-2">
                     {BRANCHES.map((branch, index) => (
                        <FormField
                           key={branch.id_branch}
                           control={form.control}
                           name={`stock.${index}.quantity`}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>{branch.name}</FormLabel>
                                 <FormControl>
                                    <Input {...field} type="number" min="0" />
                                 </FormControl>
                                 <FormMessage />
                                 <input
                                    type="hidden"
                                    {...form.register(
                                       `stock.${index}.id_branch`
                                    )}
                                    value={branch.id_branch}
                                 />
                              </FormItem>
                           )}
                        />
                     ))}
                  </div>
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
   );
}
