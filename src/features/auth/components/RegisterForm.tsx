import { useEffect} from "react";
import { registerSchema } from "@/features/auth/schema/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRegisterStore } from "@/app/stores/registerStore";
import { toast } from "sonner"
import { roles } from "@/features/auth/types/userTypes";

import UserTable from "@/features/auth/components/UserTable";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RegisterForm = () => {
  const { register, getUsers, error, isLoading } = useRegisterStore()
  const navigate = useNavigate();

  useEffect(() => {
    getUsers()
  }
    , [getUsers])

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: roles[0].role, // Default to the first role
    },
  })

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const finalValues = {
      email: values.email,
      password: values.password,
      role: values.role,
    }
    try {
      await register(finalValues.email, finalValues.password, finalValues.role)
      form.reset()
      toast.success(
        `El usuario ${values.email} se registro correctamente`, {
      }
      )
      if (error) {
        toast.error(
          error, {
        }
        )
      }
    } catch (error) {
      console.error("Register failed:", error);
      toast.error(
        "Register failed. Please check your credentials and try again.", {
      }
      )
    }
  }

  return (
    <>
    <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Volver
    </Button>
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Gestion de usuarios</CardTitle>
        <CardDescription>
          Aqui puedes registrar nuevos usuarios y gestionar los existentes.
        </CardDescription>
      </CardHeader>
      <CardContent>
      <Tabs defaultValue="users"orientation="vertical">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="w-full">Usuarios</TabsTrigger>
          <TabsTrigger value="register" className="w-full">Registrar</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="pt-4">
          <UserTable />
        </TabsContent>
        <TabsContent value="register" className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl >
                      <Input placeholder="Correo" {...field} />
                    </FormControl>
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
                    <FormControl >
                      <Input type="password" placeholder="Contraseña" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl >
                      <Input type="password" placeholder="Confirmar contraseña" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.role} value={role.role}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {isLoading ? 'Cargando...' : 'Registrar'}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      </CardContent>
    </Card >
    </>

  )
}

export default RegisterForm;