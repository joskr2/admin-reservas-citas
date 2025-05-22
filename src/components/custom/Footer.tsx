"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-primary/10 bg-background/60 backdrop-blur-lg">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center md:flex-row md:items-center">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-accent/20 transition-all"
              >
                <Image
                  src="/logo.svg"
                  width={48}
                  height={48}
                  alt="logo"
                  className="hover:scale-105 transition-transform filter grayscale opacity-75"
                />
              </Button>
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground backdrop-blur-sm py-1 px-3 rounded-full bg-background/30 inline-block">
              © {currentYear} Horizonte. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
