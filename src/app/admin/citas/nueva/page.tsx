import type { Metadata } from "next";
import CrearCitaForm from "@/components/custom/CrearCitaForm";

export const metadata: Metadata = {
  title: "Crear Nueva Cita | Sistema de Reservas",
  description: "Crea una nueva cita con un paciente",
};

export default function NuevaCitaPage() {
  return <CrearCitaForm />;
}
