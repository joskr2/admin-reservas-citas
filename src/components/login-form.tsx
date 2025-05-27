"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/profiles");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl border-0 bg-white/90 backdrop-blur-sm max-w-5xl mx-auto">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-12" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold mb-2">Bienvenid@s</h1>
                <p className="text-muted-foreground text-balance text-lg">
                  Ingresa con tus credenciales
                </p>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="email" className="text-base">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@dominio.com"
                  required
                  className="h-12 text-base"
                />
              </div>
              <div className="grid gap-4">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-base">Contraseña</Label>
                </div>
                <Input id="password" type="password" required className="h-12 text-base" />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25"
              >
                Ingresar
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/loginimage.webp"
              alt="Image"
              width={600}
              height={600}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
