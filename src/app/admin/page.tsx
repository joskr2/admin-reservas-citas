import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientLayout from "@/components/client-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage() {
  const { userId } = auth();

  // Redireccionar si el usuario no está autenticado
  if (!userId) {
    redirect("/sign-in");
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
            <h3 className="text-xl font-semibold mb-3">Gestionar Reservas</h3>
            <p className="text-muted-foreground mb-4">
              Administra todas las reservas y citas pendientes.
            </p>
            <Button className="w-full">Ver Reservas</Button>
          </div>

          <div className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Calendario</h3>
            <p className="text-muted-foreground mb-4">
              Visualiza y organiza las citas programadas.
            </p>
            <Button className="w-full">Ver Calendario</Button>
          </div>

          <div className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Configuración</h3>
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
