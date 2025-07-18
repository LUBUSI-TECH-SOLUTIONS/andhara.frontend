import { z } from 'zod';
import { branchesStatic } from '@/shared/static'
import { typesDocument } from '@/shared/static'; 


export const customerEschema = z.object({
  customer_document:
    z.string()
      .min(1, 'El documento es requerido')
      .max(20, 'El documento no puede tener más de 20 caracteres')
      .refine((customer_document) => customer_document.length >= 6, {
        message: 'El documento debe tener al menos 6 caracteres',
      }),
  document_type:
    z.enum(typesDocument.map((type) => type.id) as [string, ...string[]], {
      errorMap: () => ({ message: 'El tipo de documento es requerido' }),
    })
      .refine((document_type) => document_type.length >= 2, {
        message: 'El tipo de documento debe tener al menos 2 caracteres',
      }),
  customer_first_name:
    z.string()
      .min(1, 'El nombre es requerido')
      .max(20, 'El nombre no puede tener más de 20 caracteres')
      .refine((customer_first_name) => customer_first_name.length >= 2, {
        message: 'El nombre debe tener al menos 2 caracteres',
      }),
  customer_last_name:
    z.string()
      .min(1, 'El apellido es requerido')
      .max(20, 'El apellido no puede tener más de 20 caracteres')
      .refine((customer_last_name) => customer_last_name.length >= 2, {
        message: 'El apellido debe tener al menos 2 caracteres',
      }),
  phone_number:
    z.string()
      .min(1, 'El teléfono es requerido')
      .max(20, 'El teléfono no puede tener más de 20 caracteres')
      .refine((phone_number) => phone_number.length >= 6, {
        message: 'El teléfono debe tener al menos 6 caracteres',
      }),
  email:
    z.string()
      .min(1, 'El correo es requerido')
      .max(50, 'El correo no puede tener más de 50 caracteres')
      .email({ message: 'El correo debe tener un formato válido' })
      .refine((email) => email.includes('@'), {
        message: 'El correo debe incluir un @',
      })
      .refine((email) => email.endsWith('.com'), {
        message: 'El correo debe terminar con .com',
      }),
  home_address:
    z.string()
      .min(1, 'La dirección es requerida')
      .max(50, 'La dirección no puede tener más de 50 caracteres')
      .refine((home_address) => home_address.length >= 6, {
        message: 'La dirección debe tener al menos 6 caracteres',
      }),
  customer_state: z.boolean().default(true).optional(),
  id_branch:
    z.enum(branchesStatic.map((branch) => branch.id_branch) as [string, ...string[]], {
      errorMap: () => ({ message: 'La sucursal es requerida' }),
    })
      .refine((id_branch) => id_branch.length >= 2, {
        message: 'La sucursal debe tener al menos 2 caracteres',
      }),
})

export type CustomerFormValue = z.infer<typeof customerEschema>