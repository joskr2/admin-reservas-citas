"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur">
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="flex flex-col space-y-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-accent/90 transition-all"
              >
                <Image
                  src="/logo.svg"
                  width={32}
                  height={32}
                  alt="logo"
                  className="hover:scale-105 transition-transform"
                />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Sistema de gestión de reservas y citas para tu negocio
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-medium mb-3">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Acerca de
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-medium mb-3">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Email: info@reservascitas.com
              </li>
              <li className="text-sm text-muted-foreground">
                Teléfono: +34 123 456 789
              </li>
              <li className="text-sm text-muted-foreground">
                Dirección: Calle Principal 123, Ciudad
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Admin Reservas Citas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
