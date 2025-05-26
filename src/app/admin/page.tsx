import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientLayout from "@/components/client-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Settings, Users } from "lucide-react";

export default async function AdminPage() {
  const { userId } = await auth();

  // Redireccionar si el usuario no está autenticado
  if (!userId) {
    redirect("/");
  }

  // Obtener datos del usuario completos
  const user = await currentUser();

  return (
    <ClientLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button variant="outline" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold">
                {user?.firstName?.charAt(0) ||
                  user?.emailAddresses[0]?.emailAddress.charAt(0) ||
                  "U"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-medium">
                Bienvenido,{" "}
                {user?.firstName ||
                  user?.emailAddresses[0]?.emailAddress.split("@")[0] ||
                  "Usuario"}
              </h2>
              <p className="text-muted-foreground">
                {user?.emailAddresses[0]?.emailAddress ||
                  "sin correo electrónico"}
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
              <h3 className="text-xl font-semibold">Configuración</h3>
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Ajusta las preferencias de tu sistema de reservas.
            </p>
            <Button className="w-full">Configurar</Button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
