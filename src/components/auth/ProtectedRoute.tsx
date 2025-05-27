// src/components/auth/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLoading } from "@/components/ui/loading";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRole?: "admin" | "psicologo" | "cliente";
	redirectTo?: string;
}

export function ProtectedRoute({
	children,
	requiredRole,
	redirectTo = "/login",
}: ProtectedRouteProps) {
	const { user, loading, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (!isAuthenticated) {
				// No está autenticado, redirigir a login
				const currentPath = window.location.pathname;
				router.push(`${redirectTo}?from=${encodeURIComponent(currentPath)}`);
			} else if (
				requiredRole &&
				user?.role !== requiredRole &&
				user?.role !== "admin"
			) {
				// No tiene el rol requerido (admin siempre tiene acceso)
				router.push("/unauthorized");
			}
		}
	}, [loading, isAuthenticated, user, requiredRole, router, redirectTo]);

	// Mostrar loading mientras se verifica la autenticación
	if (loading) {
		return <PageLoading text="Verificando acceso..." />;
	}

	// No mostrar contenido si no está autenticado o no tiene permisos
	if (!isAuthenticated) {
		return null;
	}

	if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") {
		return null;
	}

	// Usuario autenticado y con permisos
	return <>{children}</>;
}

// Hook personalizado para verificar permisos
export function useRequireAuth(
	requiredRole?: "admin" | "psicologo" | "cliente",
) {
	const { user, loading, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (!isAuthenticated) {
				const currentPath = window.location.pathname;
				router.push(`/login?from=${encodeURIComponent(currentPath)}`);
			} else if (
				requiredRole &&
				user?.role !== requiredRole &&
				user?.role !== "admin"
			) {
				router.push("/unauthorized");
			}
		}
	}, [loading, isAuthenticated, user, requiredRole, router]);

	return { user, loading, isAuthenticated };
}
