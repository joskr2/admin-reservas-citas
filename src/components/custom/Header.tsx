"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SignInButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDarkTheme = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background/20 to-secondary/5 opacity-70"></div>
      <div className="absolute inset-0 backdrop-blur-md"></div>

      {/* Subtle top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/10 via-white/20 to-secondary/10"></div>

      {/* Bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/10 via-background/30 to-secondary/10"></div>

      <div className="container relative mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300"></div>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-accent/10 transition-all"
            >
              <Image
                src="/logo.svg"
                width={32}
                height={32}
                alt="logo"
                className="hover:scale-105 transition-transform"
              />
            </Button>
          </div>
          <span className="font-medium hidden sm:block relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Horizonte
            </span>
          </span>
        </Link>

        {/* Controles de la derecha (escritorio) */}
        <div className="hidden md:flex items-center gap-4">
          <SignInButton
            mode="modal"
            appearance={{ baseTheme: isDarkTheme ? dark : undefined }}
          >
            <Button
              variant="secondary"
              className="relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 backdrop-blur-md bg-secondary/50"></span>
              <span className="relative z-10">Iniciar sesión</span>
            </Button>
          </SignInButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full relative overflow-hidden group border-0"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-70"></span>
                <span className="absolute inset-0 backdrop-blur-md"></span>
                <span className="absolute inset-0 border border-primary/10 rounded-full"></span>
                <span className="relative z-10">
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background/70 backdrop-blur-lg border-0 shadow-lg relative overflow-hidden"
            >
              <span className="absolute inset-0 border border-primary/10 rounded-md"></span>
              <div className="relative z-10">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Modo Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Modo Oscuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  Automático
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Controles móviles */}
        <div className="flex items-center gap-2 md:hidden">
          <SignInButton
            mode="modal"
            appearance={{ baseTheme: isDarkTheme ? dark : undefined }}
          >
            <Button
              variant="secondary"
              size="sm"
              className="relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 backdrop-blur-md bg-secondary/50"></span>
              <span className="relative z-10">Iniciar</span>
            </Button>
          </SignInButton>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="md:hidden rounded-full relative overflow-hidden group border-0"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-70"></span>
            <span className="absolute inset-0 backdrop-blur-md"></span>
            <span className="absolute inset-0 border border-primary/10 rounded-full"></span>
            <span className="relative z-10">
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
