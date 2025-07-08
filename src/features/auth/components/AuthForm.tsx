import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeClosed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formSchema } from '@/features/auth/schema/authSchema';
import { useState } from 'react';
import { useAuthStore } from '@/app/stores/authStore';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


const AuthForm = () => {
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const success = await login(values.email, values.password);
      if(!success){
        toast.error(error || "Error al iniciar sesión")
      }
      if(success && !isLoading && !error){
        navigate('/');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  const handleShowPasswor = () => {
    setShowPassword(!showPassword);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-10 flex flex-col justify-center lg:w-[30vw] gap-y-5 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl >
                <Input
                  disabled={isLoading}
                  placeholder='Correo' {...field} />
              </FormControl>
              <FormDescription>
                Ingrese su correo electrónico.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <div className='relative w-full'>
                  <Input
                    disabled={isLoading}
                    type={showPassword ? "text" : "password"}
                    placeholder='Contraseña' {...field} />
                  {
                    showPassword ? (
                      <Eye onClick={handleShowPasswor} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer" />
                    ) : (
                      <EyeClosed onClick={handleShowPasswor} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer" />
                    )
                  }
                </div>
              </FormControl>
              <FormDescription>
                Ingrese su contraseña.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          type="submit">
          {
            isLoading ? 'Cargando...' : 'Iniciar sesión'
          }
        </Button>
      </form>
    </Form>
  );
}

export default AuthForm;

