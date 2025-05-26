"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function Loading({ size = "md", className, text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        {/* Spinner principal */}
        <div className={cn(
          "animate-spin rounded-full border-4 border-transparent",
          "bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border",
          sizeClasses[size]
        )}>
          <div className={cn(
            "rounded-full bg-white/90 backdrop-blur-sm",
            size === "sm" ? "m-1 h-4 w-4" : size === "md" ? "m-2 h-8 w-8" : "m-2 h-12 w-12"
          )} />
        </div>
        
        {/* Puntos orbitando */}
        <div className={cn(
          "absolute inset-0 animate-pulse",
          sizeClasses[size]
        )}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
        </div>
      </div>
      
      {text && (
        <p className="text-sm text-gray-600 animate-pulse font-medium">
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoading({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <Loading size="lg" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">{text}</h2>
          <p className="text-gray-600">Por favor espera un momento...</p>
        </div>
      </div>
    </div>
  );
}