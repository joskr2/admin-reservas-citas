"use client";

import { useState } from "react";
import { type Cita, iniciarCita, terminarCita } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  User, 
  Clock, 
  MapPin, 
  Mail, 
  Calendar, 
  PlayCircle, 
  StopCircle, 
  CheckCircle2,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";

interface CitaModalProps {
  cita: Cita | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  esPsicologo: boolean;
}

export default function CitaModal({ 
  cita, 
  isOpen, 
  onClose, 
  onUpdate,
  esPsicologo 
}: CitaModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!cita) return null;

  const handleCambiarEstado = async (nuevoEstado: "en_progreso" | "terminada") => {
    setIsUpdating(true);
    try {
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let response;
      if (nuevoEstado === "en_progreso") {
        response = await iniciarCita(cita.id);
      } else {
        response = await terminarCita(cita.id);
      }

      if (response.success) {
        toast.success(
          nuevoEstado === "en_progreso" 
            ? "Cita iniciada correctamente" 
            : "Cita terminada correctamente"
        );
        onUpdate?.();
        onClose();
      } else {
        toast.error(response.message || "Error al actualizar la cita");
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Ha ocurrido un error al actualizar la cita");
    } finally {
      setIsUpdating(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
      case "en_progreso":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "terminada":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "en_progreso":
        return "En Progreso";
      case "terminada":
        return "Terminada";
      default:
        return estado;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              Detalles de la Cita
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getEstadoColor(cita.estado)}`}>
            {cita.estado === "pendiente" && <Clock className="w-4 h-4 mr-2" />}
            {cita.estado === "en_progreso" && <PlayCircle className="w-4 h-4 mr-2" />}
            {cita.estado === "terminada" && <CheckCircle2 className="w-4 h-4 mr-2" />}
            {getEstadoTexto(cita.estado)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del paciente */}\n          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                Información del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">{cita.cliente.nombre}</p>
                  <p className="text-sm text-gray-600">Paciente</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{cita.cliente.correo}</p>
                  <p className="text-sm text-gray-600">Correo electrónico</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la cita */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                Detalles de la Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{new Date(cita.fecha).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Fecha</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{cita.hora_inicio} - {cita.hora_fin}</p>
                    <p className="text-sm text-gray-600">Horario</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Habitación {cita.habitacion.numero}</p>
                  <p className="text-sm text-gray-600">Ubicación de la consulta</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del psicólogo */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                Psicólogo Asignado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">{cita.psicologo.nombre}</p>
                  <p className="text-sm text-gray-600">Psicólogo</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{cita.psicologo.correo}</p>
                  <p className="text-sm text-gray-600">Correo electrónico</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          {esPsicologo && cita.estado !== "terminada" && (
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Gestionar Cita</CardTitle>
                <CardDescription>
                  Cambia el estado de la cita según corresponda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isUpdating ? (
                  <div className="flex justify-center py-8">
                    <Loading size="md" text="Actualizando cita..." />
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {cita.estado === "pendiente" && (
                      <Button
                        onClick={() => handleCambiarEstado("en_progreso")}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Iniciar Consulta
                      </Button>
                    )}
                    {cita.estado === "en_progreso" && (
                      <Button
                        onClick={() => handleCambiarEstado("terminada")}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Finalizar Consulta
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
