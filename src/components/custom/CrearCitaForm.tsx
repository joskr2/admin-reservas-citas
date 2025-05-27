"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { crearCita } from "@/lib/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon as LucideCalendarIcon,
  UserIcon,
  BuildingIcon,
} from "lucide-react";
import { Loading } from "@/components/ui/loading";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import type { AppointmentUser } from "@/types/cita";

// Validation schema for the form
const appointmentFormSchema = z.object({
  clientName: z.string().min(2, {
    message: "El nombre del cliente debe tener al menos 2 caracteres.",
  }),
  clientEmail: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  appointmentDate: z.date({
    required_error: "Por favor selecciona una fecha.",
    invalid_type_error: "Eso no es una fecha válida.",
  }),
  startTime: z.string().min(1, {
    message: "Por favor selecciona la hora de inicio.",
  }),
  endTime: z.string().min(1, {
    message: "Por favor selecciona la hora de finalización.",
  }),
  room: z.string().min(1, {
    message: "Por favor selecciona una habitación.",
  }),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

// Tipo local para el payload que se envía a crearCita,
// asumiendo que espera campos específicos (posiblemente en español)
interface ApiCitaPayloadPsicologo {
  id: string;
  nombre: string;
  correo: string;
}
interface ApiCitaPayloadCliente {
  id: string;
  nombre: string;
  correo: string;
}
interface ApiCitaPayload {
  psicologo: ApiCitaPayloadPsicologo;
  cliente: ApiCitaPayloadCliente;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  habitacion: string; // Asumiendo que la API espera el nombre/label de la habitación como string
}

// Mocked psychologist profiles
const MOCK_PSYCHOLOGISTS: AppointmentUser[] = [
  {
    id: "psy_1",
    name: "Dr. Ana María González",
    email: "ana.gonzalez@psicologia.com",
  },
  {
    id: "psy_2",
    name: "Dr. Carlos Mendoza",
    email: "carlos.mendoza@psicologia.com",
  },
  {
    id: "psy_3",
    name: "Dra. Laura Jiménez",
    email: "laura.jimenez@psicologia.com",
  },
  {
    id: "psy_4",
    name: "Dr. Miguel Torres",
    email: "miguel.torres@psicologia.com",
  },
  {
    id: "psy_5",
    name: "Dra. Elena Vásquez",
    email: "elena.vasquez@psicologia.com",
  },
];

// Available rooms
const AVAILABLE_ROOMS = [
  { value: "room-a", label: "Sala A" },
  { value: "room-b", label: "Sala B" },
  { value: "room-c", label: "Sala C" },
  { value: "room-d", label: "Sala D" },
  { value: "room-e", label: "Sala E" },
];

export default function CreateAppointmentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPsychologist, setCurrentPsychologist] =
    useState<AppointmentUser | null>(null);

  // Get selected psychologist from localStorage
  const getSelectedPsychologist = (): AppointmentUser => {
    const psychologistId = localStorage.getItem("selectedProfile");
    return (
      MOCK_PSYCHOLOGISTS.find((p) => p.id === psychologistId) ||
      MOCK_PSYCHOLOGISTS[0]
    );
  };

  useEffect(() => {
    const psychologist = getSelectedPsychologist();
    setCurrentPsychologist(psychologist);
  }, []);

  // Initialize the form
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      startTime: "",
      endTime: "",
      room: "",
    },
  });

  // Form submission handler
  async function onSubmit(values: AppointmentFormValues) {
    setIsSubmitting(true);

    try {
      // Validate that end time is after start time
      if (values.endTime <= values.startTime) {
        toast.error("La hora de fin debe ser posterior a la hora de inicio.");
        setIsSubmitting(false);
        return;
      }

      // Prepare data to send to the API
      const selectedRoomObject = AVAILABLE_ROOMS.find(
        (r) => r.value === values.room
      );
      const appointmentDataPayload: ApiCitaPayload = {
        psicologo: {
          id: currentPsychologist?.id ?? "psy_0",
          nombre: currentPsychologist?.name ?? "Psicólogo Desconocido",
          correo: currentPsychologist?.email ?? "desconocido@ejemplo.com",
        },
        cliente: {
          id: `client_${Date.now()}`,
          nombre: values.clientName,
          correo: values.clientEmail,
        },
        fecha: format(values.appointmentDate, "yyyy-MM-dd"),
        hora_inicio: values.startTime,
        hora_fin: values.endTime,
        habitacion: selectedRoomObject?.label || values.room,
      };

      console.log("Enviando datos de cita:", appointmentDataPayload);

      // Call API to create appointment
      const response = await crearCita(appointmentDataPayload);

      if (response.success) {
        toast.success("Cita creada con éxito");
        router.push("/admin/citas");
        router.refresh();
      } else {
        toast.error(response.message || "Error al crear la cita.");
      }
    } catch (error) {
      console.error("Error al crear cita:", error);
      toast.error("Ha ocurrido un error al crear la cita.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show loading while psychologist profile is loading
  if (!currentPsychologist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <AppHeader
        showBackButton={true}
        title="Nueva cita"
        subtitle="Agendar una nueva cita"
      />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Nueva Cita
            </h1>
            <p className="text-gray-600">Agendar una nueva cita</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Psychologist Information */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">
                    Psicólogo/a Asignado
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {currentPsychologist?.name || "Cargando..."}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {currentPsychologist?.email || "Cargando..."}
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm font-medium">
                      ✓ Disponible
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointment Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <LucideCalendarIcon className="w-6 h-6 text-blue-600" />
                    Detalles de la Cita
                  </CardTitle>
                  <CardDescription>
                    Complete la información necesaria para agendar su consulta.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      {/* Patient Information */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                          <UserIcon className="w-5 h-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Información del Paciente
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="clientName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Nombres
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="ingresa los nombres del paciente"
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
                            name="clientEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Correo Electrónico
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="correo@email.com"
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

                      {/* Appointment Details */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                          <LucideCalendarIcon className="w-5 h-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Agendar cita
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="appointmentDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Fecha de la cita
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full h-12 pl-3 text-left font-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP", {
                                            locale: es,
                                          })
                                        ) : (
                                          <span>Selecciona una fecha</span>
                                        )}
                                        <LucideCalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date <
                                        new Date(
                                          new Date().setDate(
                                            new Date().getDate() - 1
                                          )
                                        )
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Start Time
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
                            name="endTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  End Time
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

                      {/* Location */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                          <BuildingIcon className="w-5 h-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Location
                          </h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="room"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Room
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Selecciona una habitación" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {AVAILABLE_ROOMS.map((roomItem) => (
                                    <SelectItem
                                      key={roomItem.value}
                                      value={roomItem.value}
                                      className="cursor-pointer hover:bg-blue-50"
                                    >
                                      {roomItem.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-gray-600">
                                Selecciona la habitación donde se realizará la
                                consulta
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
                            <Loading size="sm" text="Programando cita..." />
                          ) : (
                            <div className="flex items-center gap-2">
                              <LucideCalendarIcon className="w-5 h-5" />
                              Programar Cita
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
      </main>
      <AppFooter />
    </div>
  );
}
