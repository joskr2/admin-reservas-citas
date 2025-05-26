import type { Metadata } from "next";
import CrearCitaForm from "@/components/custom/CrearCitaForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Crear Nueva Cita | Sistema de Reservas",
  description: "Crea una nueva cita con un paciente",
};

export default function NuevaCitaPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/admin/citas">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Volver a citas</span>
          </Button>
        </Link>
      </div>

      <CrearCitaForm />
    </main>
  );
}
