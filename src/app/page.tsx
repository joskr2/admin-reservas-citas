import ClientLayout from "@/components/client-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <ClientLayout>
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">
          Bienvenido a Admin Reservas Citas
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Sistema de gestión de reservas y citas para tu negocio
        </p>

        <div className="flex gap-4 mb-10">
          <Link href="/sign-in">
            <Button variant="default" size="lg">
              Acceder como Administrador
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Gestión de Reservas</h2>
            <p className="text-muted-foreground">
              Administra fácilmente todas las reservas de tus clientes.
            </p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Calendario de Citas</h2>
            <p className="text-muted-foreground">
              Visualiza y organiza las citas programadas en un calendario
              intuitivo.
            </p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Notificaciones</h2>
            <p className="text-muted-foreground">
              Envía recordatorios automáticos a tus clientes sobre sus citas.
            </p>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
