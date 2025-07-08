import { z } from 'zod';

export const formSchema = z.object({
  email:
    z.string()
      .min(1, 'El correo es requerido')
      .max(50, 'El correo no puede tener más de 50 caracteres')
      .email({ message: 'El correo debe tener un formato válido' })
      .refine((email => email.includes('@')), {
        message: 'El correo debe incluir un @',
      })
      .refine((email) => email.endsWith('.com'), {
        message: 'El correo debe terminar con .com',
      }
      ),
  password: z
    .string()
      .min(1, 'La contraseña es requerida')
      .min(4, 'La contraseña debe tener al menos 4 caracteres')
      .max(20, 'La contraseña no puede tener más de 20 caracteres')
})