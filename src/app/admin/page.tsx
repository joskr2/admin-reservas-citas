"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientLayout from "@/components/client-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Settings, Users } from "lucide-react";

const MOCK_PROFILES = [
  { id: 1, nombre: "Dr. Ana María González", correo: "ana.gonzalez@psicologia.com", especialidad: "Psicología Clínica" },
  { id: 2, nombre: "Dr. Carlos Mendoza", correo: "carlos.mendoza@psicologia.com", especialidad: "Terapia Familiar" },
  { id: 3, nombre: "Dra. Laura Jiménez", correo: "laura.jimenez@psicologia.com", especialidad: "Psicología Infantil" },
  { id: 4, nombre: "Dr. Miguel Torres", correo: "miguel.torres@psicologia.com", especialidad: "Terapia Cognitiva" },
  { id: 5, nombre: "Dra. Elena Vásquez", correo: "elena.vasquez@psicologia.com", especialidad: "Psicología de Parejas" }
];

export default function AdminPage() {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const profileId = localStorage.getItem("selectedProfile");
    if (profileId) {
      const profile = MOCK_PROFILES.find(p => p.id === Number(profileId));
      setCurrentProfile(profile);
    } else {
      router.push("/admin/profiles");
    }
  }, [router]);

  if (!currentProfile) {
    return <div>Cargando...</div>;
  }

  return (
    <ClientLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/profiles">Cambiar Perfil</Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold">
                {currentProfile.nombre.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-medium">
                Bienvenido/a
              </h2>
              <p className="text-muted-foreground">
                {currentProfile.especialidad} • {currentProfile.correo}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Gestionar Citas</h3>
              <Users className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Administra las citas con pacientes, inicia o termina sesiones.
            </p>
            <Button className="w-full" asChild>
              <Link href="/admin/citas">Ver Citas</Link>
            </Button>
          </div>

          <div className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Calendario</h3>
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Visualiza y organiza las citas programadas.
            </p>
            <Button className="w-full" asChild>
              <Link href="/admin/citas">Ver Calendario</Link>
            </Button>
          </div>

          <div className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Nueva Cita</h3>
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Programa una nueva consulta con un paciente.
            </p>
            <Button className="w-full" asChild>
              <Link href="/admin/citas/nueva">Nueva Cita</Link>
            </Button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
