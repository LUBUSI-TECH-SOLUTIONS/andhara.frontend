import { z } from "zod";

export const purchaseSchema = z.object({
  purchase_duration: z.string().min(1, "Purchase duration is required"),
  payment_type: z.string().min(1, "Payment type is required"),
  payment_status: z.string().min(1, "Payment status is required"),
  remaining_balance: z.coerce.string().min(0, "Remaining balance must be 0 or greater"),
  delivery_type: z.string().min(1, "Delivery type is required"),
  delivery_comment: z.string().optional(),
  delivery_cost: z.coerce.string().min(0, "Delivery cost must be 0 or greater"),
})

export type PurchaseFormValue = z.infer<typeof purchaseSchema>;