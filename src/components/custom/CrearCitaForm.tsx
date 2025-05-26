"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { crearCita, obtenerUsuarioAutenticado } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { CalendarIcon, ClockIcon, UserIcon, BuildingIcon } from "lucide-react";

// Esquema de validación del formulario
const formSchema = z.object({
  nombreCliente: z.string().min(2, {
    message: "El nombre del cliente debe tener al menos 2 caracteres.",
  }),
  correoCliente: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  fecha: z.string().min(1, {
    message: "Por favor selecciona una fecha.",
  }),
  horaInicio: z.string().min(1, {
    message: "Por favor selecciona la hora de inicio.",
  }),
  horaFin: z.string().min(1, {
    message: "Por favor selecciona la hora de finalización.",
  }),
  habitacion: z.string().min(1, {
    message: "Por favor ingresa un número de habitación.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CrearCitaForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const usuarioLogueado = obtenerUsuarioAutenticado(userId);

  // Inicializar el formulario
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCliente: "",
      correoCliente: "",
      fecha: "",
      horaInicio: "",
      horaFin: "",
      habitacion: "",
    },
  });

  // Función para enviar el formulario
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // Validar que la hora de fin sea después de la hora de inicio
      if (values.horaFin <= values.horaInicio) {
        toast.error("La hora de fin debe ser posterior a la hora de inicio");
        setIsSubmitting(false);
        return;
      }

      // Crear timestamp con fecha y hora para crear un datetime correcto
      const fechaISO = new Date(values.fecha + 'T' + values.horaInicio).toISOString().split('T')[0];
      
      // Preparar los datos para enviar a la API
      const citaData = {
        psicologo: {
          id: usuarioLogueado.id,
          nombre: usuarioLogueado.nombre,
          correo: usuarioLogueado.correo,
        },
        cliente: {
          id: `cliente_${Date.now()}`, // Generamos un ID único para el cliente
          nombre: values.nombreCliente,
          correo: values.correoCliente,
        },
        fecha: fechaISO,
        hora_inicio: values.horaInicio,
        hora_fin: values.horaFin,
        habitacion: values.habitacion,
      };

      console.log("Enviando datos de cita:", citaData);

      // Llamar a la API para crear la cita
      const response = await crearCita(citaData);

      if (response.success) {
        toast.success("Cita creada con éxito");
        // Redirigir al listado de citas
        router.push("/admin/citas");
        router.refresh();
      } else {
        toast.error(response.message || "Error al crear la cita");
      }
    } catch (error) {
      console.error("Error al crear cita:", error);
      toast.error("Ha ocurrido un error al crear la cita");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nueva Cita Médica</h1>
          <p className="text-gray-600">Programa una consulta con tu psicólogo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del psicólogo */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Psicólogo Asignado</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {usuarioLogueado.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {usuarioLogueado.correo}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">✓ Disponible para consultas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de cita */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                  Detalles de la Cita
                </CardTitle>
                <CardDescription>
                  Complete la información necesaria para agendar su consulta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Información del cliente */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Información del Paciente</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nombreCliente"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Nombre Completo
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ingrese el nombre completo" 
                                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="correoCliente"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Correo Electrónico
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="ejemplo@correo.com"
                                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Detalles de la cita */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarIcon className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Programación</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="fecha"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Fecha de la Cita
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="horaInicio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Hora de Inicio
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="horaFin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Hora de Finalización
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Ubicación */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <BuildingIcon className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="habitacion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Número de Habitación
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ej: 101, 205, A-3" 
                                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-gray-600">
                              Ingrese el número de la habitación donde se realizará la consulta
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Programando Cita...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            Programar Cita Médica
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
