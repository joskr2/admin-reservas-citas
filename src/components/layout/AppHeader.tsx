"use client";

import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
  Plus, 
  ArrowLeft, 
  Menu,
  HeartHandshakeIcon,
  User
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
}

export default function AppHeader({ 
  showBackButton = false, 
  title,
  subtitle 
}: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomePage = pathname === "/";
  const isCalendarPage = pathname === "/admin/citas";
  const isNewAppointmentPage = pathname === "/admin/citas/nueva";

  const navigationItems = [
    { 
      href: "/", 
      label: "Inicio", 
      icon: Home, 
      active: isHomePage 
    },
    { 
      href: "/admin/citas", 
      label: "Calendario", 
      icon: Calendar, 
      active: isCalendarPage 
    },
    { 
      href: "/admin/citas/nueva", 
      label: "Nueva Cita", 
      icon: Plus, 
      active: isNewAppointmentPage 
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo y navegación principal */}
          <div className="flex items-center gap-4 sm:gap-6">
            {showBackButton ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            ) : (
              <Link href="/" className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <HeartHandshakeIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Horizonte
                  </h1>
                  <p className="text-xs text-gray-600">Sistema de Citas</p>
                </div>
              </Link>
            )}

            {/* Título de página en mobile */}
            {(title || showBackButton) && (
              <div className="sm:hidden">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                {subtitle && (
                  <p className="text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                      item.active
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Usuario y menú mobile */}
          <div className="flex items-center gap-2">
            {/* Usuario */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900">Dr. Juan Pérez</p>
                <p className="text-xs text-gray-600">Psicólogo</p>
              </div>
            </div>

            {/* Menú hamburguesa para mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant={item.active ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full justify-start gap-3 px-4 py-3",
                        item.active
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
            
            {/* Usuario en mobile */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Dr. Juan Pérez</p>
                  <p className="text-xs text-gray-600">Psicólogo</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}