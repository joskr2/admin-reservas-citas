"use client";

import ClientLayout from "@/components/client-layout";
import { useState } from "react";

export default function HomePage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveCard(index);
    setTimeout(() => setActiveCard(null), 150);
  };

  return (
    <ClientLayout>
      <main className="container relative mx-auto py-8 px-4 min-w-[320px] max-w-7xl">
        {/* Gradient backgrounds para el efecto */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl opacity-50" />

        <h1 className="text-3xl font-bold mb-6 relative">
          Bienvenido a Horizonte
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative">
          <div
            className={`backdrop-blur-md bg-background/70 border-none rounded-xl p-6 
            shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] 
            transition-all duration-150 cursor-pointer 
            ${activeCard === 0 ? "scale-98 bg-primary/10 shadow-inner" : ""}`}
            onClick={() => handleCardClick(0)}
          >
            <h2 className="text-xl font-semibold mb-3">Gestión de Reservas</h2>
            <p className="text-muted-foreground">
              Administra fácilmente todas las reservas de tus clientes.
            </p>
          </div>
          <div
            className={`backdrop-blur-md bg-background/70 border-none rounded-xl p-6 
            shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] 
            transition-all duration-150 cursor-pointer 
            ${activeCard === 1 ? "scale-98 bg-primary/10 shadow-inner" : ""}`}
            onClick={() => handleCardClick(1)}
          >
            <h2 className="text-xl font-semibold mb-3">Calendario de Citas</h2>
            <p className="text-muted-foreground">
              Visualiza y organiza las citas programadas en un calendario
              intuitivo.
            </p>
          </div>
          <div
            className={`backdrop-blur-md bg-background/70 border-none rounded-xl p-6 
            shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] 
            transition-all duration-150 cursor-pointer 
            ${activeCard === 2 ? "scale-98 bg-primary/10 shadow-inner" : ""}`}
            onClick={() => handleCardClick(2)}
          >
            <h2 className="text-xl font-semibold mb-3">Notificaciones</h2>
            <p className="text-muted-foreground">
              Envía recordatorios automáticos a tus clientes sobre sus citas.
            </p>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
