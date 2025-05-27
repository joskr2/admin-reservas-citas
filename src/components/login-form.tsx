"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Por favor ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      login(values.email);
      toast.success("¡Bienvenido/a! Has iniciado sesión correctamente.");
      router.push("/");
    } catch (error) {
      toast.error("Error al iniciar sesión. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md max-w-5xl mx-auto">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Formulario lado izquierdo */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-yellow-800" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ¡Bienvenid@!
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Ingresa con tus credenciales para acceder
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        Correo Electrónico
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="tu@correo.com"
                          className="h-12 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          disabled={isLoading}
                        />
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
                      <FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-600" />
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="h-12 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500 dark:text-gray-400">
                        Mínimo 6 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Ingresando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Iniciar Sesión
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Imagen lado derecho */}
          <div className="relative hidden md:block bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <Image
              src="/loginimage.webp"
              alt="Acceso a la plataforma"
              width={600}
              height={600}
              className="absolute inset-0 h-full w-full object-cover rounded-r-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-r-2xl"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
