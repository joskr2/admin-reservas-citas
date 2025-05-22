"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Menu, X, Sun, Moon } from "lucide-react";
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
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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
          <span className="font-medium hidden sm:block">
            Admin Reservas Citas
          </span>
        </Link>

        {/* Navegación de escritorio */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Acerca de
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Contacto
          </Link>
        </nav>

        {/* Controles de la derecha (escritorio) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">
                Hola, {user?.firstName ?? "Usuario"}
              </span>
              <SignOutButton>
                <Button variant="outline" size="sm">
                  Salir
                </Button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal">
              <Button variant="ghost">Iniciar sesión</Button>
            </SignInButton>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-md">
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Modo Claro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Modo Oscuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                Automático
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Controles móviles */}
        <div className="flex items-center gap-2 md:hidden">
          {!isMenuOpen && (
            <>
              {user ? (
                <span className="text-sm mr-2">
                  Hola, {user?.firstName ?? "Usuario"}
                </span>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Iniciar
                  </Button>
                </SignInButton>
              )}
            </>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="md:hidden"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background/95 backdrop-blur">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Acerca de
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>

            {user && (
              <>
                <Link
                  href="/settings"
                  className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Configuraciones
                </Link>
                <SignOutButton>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Salir
                  </Button>
                </SignOutButton>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
