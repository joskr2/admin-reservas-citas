import type { Metadata } from "next";
import CalendarioCitas from "@/components/custom/CalendarioCitas";

export const metadata: Metadata = {
  title: "Calendario de Citas | Sistema de Reservas",
  description: "Visualiza y administra tus citas médicas en formato calendario",
};

export default function CitasPage() {
  return <CalendarioCitas />;
}
