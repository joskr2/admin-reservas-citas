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
            Horizonte
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Admin Reservas Citas. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
