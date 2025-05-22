"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  SignInButton,
  UserButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

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
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || "Usuario"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary-foreground">
                    {user?.firstName?.charAt(0) ||
                      user?.emailAddresses[0]?.emailAddress
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  Hola,{" "}
                  {user?.firstName ||
                    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
                    "Usuario"}
                </span>
              </div>

              <SignOutButton>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full relative overflow-hidden group border border-destructive/20"
                >
                  <span className="absolute inset-0 bg-destructive/5 opacity-70"></span>
                  <span className="absolute inset-0 backdrop-blur-md"></span>
                  <span className="relative z-10">
                    <LogOut className="h-4 w-4 text-destructive" />
                  </span>
                </Button>
              </SignOutButton>
            </div>
          ) : (
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
          )}

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
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 py-1">
                <Avatar className="h-6 w-6 border border-primary/20">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || "Usuario"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary-foreground text-xs">
                    {user?.firstName?.charAt(0) ||
                      user?.emailAddresses[0]?.emailAddress
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">
                  {user?.firstName ||
                    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
                    "Usuario"}
                </span>
              </div>

              <SignOutButton>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-full relative overflow-hidden group border border-destructive/20 cursor-pointer"
                >
                  <span className="absolute inset-0 bg-destructive/5 opacity-70"></span>
                  <span className="absolute inset-0 backdrop-blur-md"></span>
                  <span className="relative z-10">
                    <LogOut className="h-3 w-3 text-destructive" />
                  </span>
                </Button>
              </SignOutButton>
            </div>
          ) : (
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
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="md:hidden rounded-full relative overflow-hidden group border-0 cursor-pointer"
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
