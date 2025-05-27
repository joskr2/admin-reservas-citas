"use client";

import { useEffect, useState } from "react";
import {
type  Cita,
  obtenerCitasUsuario,
  obtenerUsuarioAutenticado,
} from "@/lib/api";
import CitaCard from "./CitaCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

export default function CitasList() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const usuario = obtenerUsuarioAutenticado(userId);
  const router = useRouter();
  const esPsicologo = usuario.tipo === "psicologo";

  useEffect(() => {
    const cargarCitas = async () => {
      setIsLoading(true);
      try {
        const response = await obtenerCitasUsuario(usuario.id);
        if (response.success && response.data) {
          setCitas(response.data);
        } else {
          toast.error("Error al cargar las citas");
        }
      } catch (error) {
        console.error("Error al cargar citas:", error);
        toast.error("Ha ocurrido un error al cargar las citas");
      } finally {
        setIsLoading(false);
      }
    };

    cargarCitas();
  }, [usuario.id]);

  const handleNuevaCita = () => {
    router.push("/admin/citas/nueva");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mis Citas</h1>
        {esPsicologo && (
          <Button onClick={handleNuevaCita}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Cita
          </Button>
        )}
      </div>

      {citas.length === 0 ? (
        <div className="bg-muted p-8 text-center rounded-lg">
          <h3 className="font-medium text-lg mb-2">
            No tienes citas programadas
          </h3>
          <p className="text-muted-foreground mb-4">
            {esPsicologo
              ? "Programa una nueva cita con un cliente haciendo clic en el botón de arriba."
              : "No tienes citas programadas con ningún psicólogo."}
          </p>
          {esPsicologo && (
            <Button onClick={handleNuevaCita}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Programar Cita
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {citas.map((cita) => (
            <CitaCard key={cita.id} cita={cita} esPsicologo={esPsicologo} />
          ))}
        </div>
      )}
    </div>
  );
}
