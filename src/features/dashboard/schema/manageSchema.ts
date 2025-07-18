import { z } from "zod";


export const manageSchema = z.object({
  customer_service_status: z.boolean(),
  contact_comment: z.string().min(1, "El comentarios es indispensable para gestionar el seguimiento"),
})

export type ManageFormValue = z.infer<typeof manageSchema>

export const manageDefaultValues = {
  customer_service_status: false,
  contact_comment: "",
}

