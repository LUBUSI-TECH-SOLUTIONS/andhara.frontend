import { z } from "zod"

const stockInfoSchema = z.object({
  id_product: z.string().optional(),
  id_branch: z.string(),
  quantity: z.coerce.number().min(0, "La cantidad no puede ser negativa"),
})

export const productsSchema = z.object({
  id_product: z.string().optional(),

  product_name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .refine((val) => val.length >= 2, {
      message: "El nombre debe tener al menos 2 caracteres",
    }),

  product_description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .refine((val) => val.length >= 6, {
      message: "La descripción debe tener al menos 6 caracteres",
    }),

  purchase_price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 1000000, {
    message: "El precio de compra debe ser un número válido entre 1 y 1000000",
  }),

  product_discount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "El descuento debe estar entre 0 y 100",
  }),

  sale_price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 1000000, {
    message: "El precio de venta debe ser un número válido entre 1 y 1000000",
  }),
  profit_margin: z.number().optional(),
  vat: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "El IVA debe estar entre 0 y 100",
  }),

  product_state: z.boolean().default(true).optional(),

  id_supplier: z.string({
    required_error: "El proveedor es requerido",
    invalid_type_error: "El proveedor debe ser un string",
  }),

  stock: z.array(stockInfoSchema),
})

export type ProductFormValues = z.infer<typeof productsSchema>
