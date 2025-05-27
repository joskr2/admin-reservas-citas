"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import  {  type Cita,  iniciarCita, terminarCita } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Colores según el estado de la cita
const estadoColores = {
  pendiente: "bg-yellow-100 text-yellow-800",
  en_progreso: "bg-blue-100 text-blue-800",
  terminada: "bg-green-100 text-green-800",
};

interface CitaCardProps {
  cita: Cita;
  esPsicologo: boolean;
}

export default function CitaCard({ cita, esPsicologo }: CitaCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Formatear la fecha para mostrarla de forma amigable
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Manejar el inicio de una cita
  const handleIniciarCita = async () => {
    setIsLoading(true);
    try {
      const response = await iniciarCita(cita.id);
      if (response.success) {
        toast.success("Cita iniciada con éxito");
        router.refresh();
      } else {
        toast.error(response.message || "Error al iniciar la cita");
      }
    } catch (error) {
      console.error("Error al iniciar cita:", error);
      toast.error("Ocurrió un error al iniciar la cita");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar la finalización de una cita
  const handleTerminarCita = async () => {
    setIsLoading(true);
    try {
      const response = await terminarCita(cita.id);
      if (response.success) {
        toast.success("Cita terminada con éxito");
        router.refresh();
      } else {
        toast.error(response.message || "Error al terminar la cita");
      }
    } catch (error) {
      console.error("Error al terminar cita:", error);
      toast.error("Ocurrió un error al terminar la cita");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {esPsicologo ? cita.cliente.nombre : cita.psicologo.nombre}
            </CardTitle>
            <CardDescription>
              {esPsicologo ? "Cliente" : "Psicólogo"}
            </CardDescription>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              estadoColores[cita.estado as keyof typeof estadoColores]
            }`}
          >
            {cita.estado === "pendiente"
              ? "Pendiente"
              : cita.estado === "en_progreso"
              ? "En Progreso"
              : "Terminada"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatearFecha(cita.fecha)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {cita.hora_inicio} - {cita.hora_fin}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Habitación {cita.habitacion.numero}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>
            {esPsicologo ? cita.cliente.correo : cita.psicologo.correo}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {esPsicologo && cita.estado === "pendiente" && (
          <Button
            onClick={handleIniciarCita}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Iniciando..." : "Iniciar Cita"}
          </Button>
        )}

        {esPsicologo && cita.estado === "en_progreso" && (
          <Button
            onClick={handleTerminarCita}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Terminando..." : "Terminar Cita"}
          </Button>
        )}

        {cita.estado === "terminada" && (
          <Button disabled className="w-full bg-green-600 hover:bg-green-700">
            Cita Completada
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
