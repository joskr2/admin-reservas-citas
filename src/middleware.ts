import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Rutas públicas que no requieren autenticación
	const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
	const isPublicRoute = publicRoutes.includes(pathname);

	// Rutas que requieren autenticación
	const protectedRoutes = [
		"/admin",
		"/admin/citas",
		"/admin/citas/nueva",
		"/admin/profiles",
	];
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (isProtectedRoute) {
		// Obtener token de las cookies o del header
		const token =
			request.cookies.get("auth-token")?.value ||
			request.headers.get("authorization")?.replace("Bearer ", "");

		if (!token) {
			// Si no hay token, redirigir a login
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("from", pathname);
			return NextResponse.redirect(loginUrl);
		}

		try {
			// Verificar token con el backend
			const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!verifyResponse.ok) {
				// Token inválido, redirigir a login
				const response = NextResponse.redirect(new URL("/login", request.url));
				// Eliminar cookie si existe
				response.cookies.delete("auth-token");
				return response;
			}

			const userData = await verifyResponse.json();

			// Verificar permisos según la ruta
			if (pathname.startsWith("/admin") && userData.user.role === "cliente") {
				// Los clientes no pueden acceder a rutas de admin
				return NextResponse.redirect(new URL("/", request.url));
			}

			// Agregar información del usuario a los headers para uso en las páginas
			const requestHeaders = new Headers(request.headers);
			requestHeaders.set("x-user-id", userData.user.id);
			requestHeaders.set("x-user-role", userData.user.role);
			requestHeaders.set("x-user-email", userData.user.email);

			return NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			});
		} catch (error) {
			console.error("Error verificando token:", error);
			// En caso de error, redirigir a login
			const response = NextResponse.redirect(new URL("/login", request.url));
			response.cookies.delete("auth-token");
			return response;
		}
	}

	// Si el usuario está autenticado y trata de acceder a login, redirigir a home
	if (pathname === "/login") {
		const token =
			request.cookies.get("auth-token")?.value ||
			request.headers.get("authorization")?.replace("Bearer ", "");

		if (token) {
			try {
				const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				if (verifyResponse.ok) {
					const userData = await verifyResponse.json();
					// Redirigir según el rol
					if (userData.user.role === "psicologo") {
						return NextResponse.redirect(new URL("/admin/citas", request.url));
					}
					if (userData.user.role === "admin") {
						return NextResponse.redirect(new URL("/admin", request.url));
					}
					return NextResponse.redirect(new URL("/", request.url));
				}
			} catch (error) {
				// Si hay error, permitir acceso a login
				console.error("Error verificando autenticación:", error);
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public assets
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp).*)",
	],
};
