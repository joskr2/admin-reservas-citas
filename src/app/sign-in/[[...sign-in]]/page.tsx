import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Iniciar Sesión | Admin Reservas Citas",
};

export default async function SignInPage() {
  const { userId } = auth();

  // Si el usuario ya está autenticado, redirigir a la página de admin
  if (userId) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Admin Reservas Citas</h1>
          <p className="text-sm text-muted-foreground text-center">
            Inicia sesión para acceder al panel de administración
          </p>
        </div>
        <div className="bg-card border rounded-lg shadow-sm p-6">
          <SignIn
            appearance={{
              baseTheme: dark,
              elements: {
                formButtonPrimary:
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                card: "bg-transparent shadow-none",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton:
                  "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
                formFieldLabel: "text-foreground",
                formFieldInput: "bg-background border border-input",
                footerActionLink: "text-primary hover:text-primary/90",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
