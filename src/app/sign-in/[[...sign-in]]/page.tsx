"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import ClientLayout from "@/components/client-layout";

export const metadata = {
  title: "Iniciar Sesión | Admin Reservas Citas",
};

export default function SignInPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Efecto para comprobar la autenticación del lado del cliente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        if (data.authenticated) {
          window.location.href = "/admin";
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setMounted(true);
      }
    };

    checkAuth();
  }, []);

  // Para SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isAuthenticated) {
    return null; // No renderizar mientras se redirige
  }

  const isDarkTheme = theme === "dark";

  return (
    <ClientLayout>
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                baseTheme: isDarkTheme ? dark : undefined,
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
    </ClientLayout>
  );
}
