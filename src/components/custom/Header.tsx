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
          Horizonte
          </span>
        </Link>

        {/* Controles de la derecha (escritorio) */}
        <div className="hidden md:flex items-center gap-4">
          <SignInButton
            mode="modal"
            appearance={{ baseTheme: isDarkTheme ? dark : undefined }}
          >
            <Button variant="ghost">Iniciar sesión</Button>
          </SignInButton>

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
          <SignInButton
            mode="modal"
            appearance={{ baseTheme: isDarkTheme ? dark : undefined }}
          >
            <Button variant="ghost" size="sm">
              Iniciar
            </Button>
          </SignInButton>

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
        </div>
      </div>
    </header>
  );
};

export default Header;
