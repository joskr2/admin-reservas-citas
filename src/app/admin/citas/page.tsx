import type { Metadata } from "next";
import CalendarioMejorado from "@/components/custom/CalendarioMejorado";

export const metadata: Metadata = {
  title: "Calendario de Citas | Sistema de Reservas",
  description: "Visualiza y administra tus citas médicas en formato calendario",
};

export default function CitasPage() {
  return <CalendarioMejorado />;
}
